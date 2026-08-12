const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DB_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
const DB_PATH = path.join(DB_DIR, "kstore.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function init() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      icon TEXT,
      color TEXT,
      description TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      short_description TEXT,
      description TEXT,
      price REAL NOT NULL,
      compare_price REAL,
      category_id INTEGER,
      images TEXT,
      stock INTEGER DEFAULT 0,
      sku TEXT,
      brand TEXT,
      tags TEXT,
      rating REAL DEFAULT 0,
      reviews_count INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
    CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
    CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
    CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT NOT NULL UNIQUE,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      city TEXT,
      address TEXT,
      notes TEXT,
      items TEXT NOT NULL,
      subtotal REAL NOT NULL,
      shipping REAL NOT NULL,
      total REAL NOT NULL,
      payment_method TEXT DEFAULT 'card',
      payment_status TEXT DEFAULT 'paid',
      order_status TEXT DEFAULT 'pending',
      transaction_id TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
    CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
}

init();

// تشغيل الزرع التلقائي في الإنتاج
if (process.env.NODE_ENV === "production") {
  try {
    require("./autoseed").autoSeed();
  } catch (e) {
    console.error("[AutoSeed] خطأ:", e.message);
  }
}

/* ---------------- Categories ---------------- */
const Category = {
  all() {
    return db.prepare("SELECT * FROM categories ORDER BY sort_order, id").all();
  },
  bySlug(slug) {
    return db.prepare("SELECT * FROM categories WHERE slug = ?").get(slug);
  },
  byId(id) {
    return db.prepare("SELECT * FROM categories WHERE id = ?").get(id);
  },
  create(data) {
    const stmt = db.prepare(
      "INSERT INTO categories (name, slug, icon, color, description, sort_order) VALUES (@name,@slug,@icon,@color,@description,@sort_order)"
    );
    return stmt.run(data);
  },
  update(id, data) {
    db.prepare(
      "UPDATE categories SET name=@name, slug=@slug, icon=@icon, color=@color, description=@description, sort_order=@sort_order WHERE id=@id"
    ).run({ ...data, id });
  },
  remove(id) {
    db.prepare("DELETE FROM categories WHERE id=?").run(id);
  },
  count() {
    return db.prepare("SELECT COUNT(*) c FROM categories").get().c;
  },
};

/* ---------------- Products ---------------- */
const Product = {
  _row(r) {
    if (!r) return null;
    return {
      ...r,
      images: r.images ? JSON.parse(r.images) : [],
      tags: r.tags ? JSON.parse(r.tags) : [],
      featured: !!r.featured,
    };
  },

  paginate({ page = 1, limit = 24, categorySlug, search, sort = "newest", minPrice, maxPrice } = {}) {
    page = Math.max(1, parseInt(page) || 1);
    limit = Math.min(96, Math.max(1, parseInt(limit) || 24));
    const offset = (page - 1) * limit;

    const where = ["p.status = 'active'"];
    const params = {};
    if (categorySlug) {
      where.push("c.slug = @categorySlug");
      params.categorySlug = categorySlug;
    }
    if (search) {
      where.push("(p.name LIKE @search OR p.short_description LIKE @search OR p.tags LIKE @search OR p.brand LIKE @search)");
      params.search = `%${search}%`;
    }
    if (minPrice != null && minPrice !== "") {
      where.push("p.price >= @minPrice");
      params.minPrice = parseFloat(minPrice);
    }
    if (maxPrice != null && maxPrice !== "") {
      where.push("p.price <= @maxPrice");
      params.maxPrice = parseFloat(maxPrice);
    }

    let orderBy = "p.created_at DESC";
    if (sort === "price_low") orderBy = "p.price ASC";
    else if (sort === "price_high") orderBy = "p.price DESC";
    else if (sort === "rating") orderBy = "p.rating DESC";
    else if (sort === "popular") orderBy = "p.reviews_count DESC";

    const whereSql = where.length ? "WHERE " + where.join(" AND ") : "";

    const totalRow = db
      .prepare(`SELECT COUNT(*) c FROM products p LEFT JOIN categories c ON c.id=p.category_id ${whereSql}`)
      .get(params);
    const total = totalRow.c;

    const rows = db
      .prepare(
        `SELECT p.*, c.name AS category_name, c.slug AS category_slug
         FROM products p LEFT JOIN categories c ON c.id=p.category_id
         ${whereSql}
         ORDER BY ${orderBy}
         LIMIT @limit OFFSET @offset`
      )
      .all({ ...params, limit, offset });

    return {
      items: rows.map(Product._row),
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit)),
    };
  },

  byId(id) {
    const row = db
      .prepare(
        `SELECT p.*, c.name AS category_name, c.slug AS category_slug
         FROM products p LEFT JOIN categories c ON c.id=p.category_id
         WHERE p.id = ?`
      )
      .get(id);
    return Product._row(row);
  },

  bySlug(slug) {
    const row = db
      .prepare(
        `SELECT p.*, c.name AS category_name, c.slug AS category_slug
         FROM products p LEFT JOIN categories c ON c.id=p.category_id
         WHERE p.slug = ?`
      )
      .get(slug);
    return Product._row(row);
  },

  featured(limit = 8) {
    const rows = db
      .prepare(
        `SELECT p.*, c.name AS category_name, c.slug AS category_slug
         FROM products p LEFT JOIN categories c ON c.id=p.category_id
         WHERE p.status='active' AND p.featured=1
         ORDER BY p.rating DESC LIMIT ?`
      )
      .all(limit);
    return rows.map(Product._row);
  },

  newest(limit = 12) {
    const rows = db
      .prepare(
        `SELECT p.*, c.name AS category_name, c.slug AS category_slug
         FROM products p LEFT JOIN categories c ON c.id=p.category_id
         WHERE p.status='active' ORDER BY p.created_at DESC LIMIT ?`
      )
      .all(limit);
    return rows.map(Product._row);
  },

  related(categoryId, excludeId, limit = 4) {
    const rows = db
      .prepare(
        `SELECT p.*, c.name AS category_name, c.slug AS category_slug
         FROM products p LEFT JOIN categories c ON c.id=p.category_id
         WHERE p.status='active' AND p.category_id=? AND p.id<>?
         ORDER BY p.rating DESC LIMIT ?`
      )
      .all(categoryId, excludeId, limit);
    return rows.map(Product._row);
  },

  allAdmin({ page = 1, limit = 20, search } = {}) {
    page = Math.max(1, parseInt(page) || 1);
    const offset = (page - 1) * limit;
    const where = [];
    const params = {};
    if (search) {
      where.push("(p.name LIKE @search OR p.sku LIKE @search)");
      params.search = `%${search}%`;
    }
    const whereSql = where.length ? "WHERE " + where.join(" AND ") : "";
    const total = db.prepare(`SELECT COUNT(*) c FROM products p ${whereSql}`).get(params).c;
    const rows = db
      .prepare(
        `SELECT p.*, c.name AS category_name
         FROM products p LEFT JOIN categories c ON c.id=p.category_id
         ${whereSql} ORDER BY p.created_at DESC LIMIT @limit OFFSET @offset`
      )
      .all({ ...params, limit, offset });
    return {
      items: rows.map(Product._row),
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit)),
    };
  },

  create(data) {
    const slug = data.slug || slugify(data.name) + "-" + Math.random().toString(36).slice(2, 6);
    const stmt = db.prepare(
      `INSERT INTO products
       (name, slug, short_description, description, price, compare_price, category_id, images, stock, sku, brand, tags, rating, reviews_count, featured, status)
       VALUES (@name,@slug,@short_description,@description,@price,@compare_price,@category_id,@images,@stock,@sku,@brand,@tags,@rating,@reviews_count,@featured,@status)`
    );
    const res = stmt.run({
      name: data.name,
      slug,
      short_description: data.short_description || "",
      description: data.description || "",
      price: data.price,
      compare_price: data.compare_price || null,
      category_id: data.category_id || null,
      images: JSON.stringify(data.images || []),
      stock: data.stock ?? 0,
      sku: data.sku || "",
      brand: data.brand || "",
      tags: JSON.stringify(data.tags || []),
      rating: data.rating || 0,
      reviews_count: data.reviews_count || 0,
      featured: data.featured ? 1 : 0,
      status: data.status || "active",
    });
    return res.lastInsertRowid;
  },

  update(id, data) {
    db.prepare(
      `UPDATE products SET
        name=@name, short_description=@short_description, description=@description,
        price=@price, compare_price=@compare_price, category_id=@category_id,
        images=@images, stock=@stock, sku=@sku, brand=@brand, tags=@tags,
        featured=@featured, status=@status, updated_at=datetime('now')
       WHERE id=@id`
    ).run({
      id,
      name: data.name,
      short_description: data.short_description || "",
      description: data.description || "",
      price: data.price,
      compare_price: data.compare_price || null,
      category_id: data.category_id || null,
      images: JSON.stringify(data.images || []),
      stock: data.stock ?? 0,
      sku: data.sku || "",
      brand: data.brand || "",
      tags: JSON.stringify(data.tags || []),
      featured: data.featured ? 1 : 0,
      status: data.status || "active",
    });
  },

  remove(id) {
    db.prepare("DELETE FROM products WHERE id=?").run(id);
  },

  count() {
    return db.prepare("SELECT COUNT(*) c FROM products").get().c;
  },
};

/* ---------------- Orders ---------------- */
const Order = {
  create(data) {
    const order_number = "KS" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 90 + 10);
    const stmt = db.prepare(
      `INSERT INTO orders
       (order_number, customer_name, customer_phone, customer_email, city, address, notes, items, subtotal, shipping, total, payment_method, payment_status, order_status, transaction_id)
       VALUES (@order_number,@customer_name,@customer_phone,@customer_email,@city,@address,@notes,@items,@subtotal,@shipping,@total,@payment_method,@payment_status,@order_status,@transaction_id)`
    );
    const res = stmt.run({
      order_number,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      customer_email: data.customer_email || "",
      city: data.city || "",
      address: data.address || "",
      notes: data.notes || "",
      items: JSON.stringify(data.items || []),
      subtotal: data.subtotal,
      shipping: data.shipping || 0,
      total: data.total,
      payment_method: data.payment_method || "card",
      payment_status: data.payment_status || "paid",
      order_status: data.order_status || "pending",
      transaction_id: data.transaction_id || "",
    });
    return { id: res.lastInsertRowid, order_number };
  },

  byNumber(order_number) {
    const r = db.prepare("SELECT * FROM orders WHERE order_number=?").get(order_number);
    if (r) r.items = JSON.parse(r.items);
    return r;
  },

  all({ page = 1, limit = 20, status } = {}) {
    page = Math.max(1, parseInt(page) || 1);
    const offset = (page - 1) * limit;
    const where = [];
    const params = {};
    if (status && status !== "all") {
      where.push("order_status = @status");
      params.status = status;
    }
    const whereSql = where.length ? "WHERE " + where.join(" AND ") : "";
    const total = db.prepare(`SELECT COUNT(*) c FROM orders ${whereSql}`).get(params).c;
    const rows = db
      .prepare(`SELECT * FROM orders ${whereSql} ORDER BY created_at DESC LIMIT @limit OFFSET @offset`)
      .all({ ...params, limit, offset });
    return {
      items: rows.map((r) => ({ ...r, items: JSON.parse(r.items) })),
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit)),
    };
  },

  setStatus(id, status) {
    db.prepare("UPDATE orders SET order_status=?, updated_at=datetime('now') WHERE id=?").run(status, id);
  },

  count() {
    return db.prepare("SELECT COUNT(*) c FROM orders").get().c;
  },

  stats() {
    const total = db.prepare("SELECT COUNT(*) c, COALESCE(SUM(total),0) s FROM orders").get();
    const pending = db.prepare("SELECT COUNT(*) c FROM orders WHERE order_status='pending'").get().c;
    const today = db
      .prepare("SELECT COUNT(*) c, COALESCE(SUM(total),0) s FROM orders WHERE date(created_at)=date('now')")
      .get();
    return {
      orders: total.c,
      revenue: total.s,
      pending,
      todayOrders: today.c,
      todayRevenue: today.s,
    };
  },
};

/* ---------------- Settings ---------------- */
const Settings = {
  all() {
    const rows = db.prepare("SELECT key, value FROM settings").all();
    const obj = {};
    rows.forEach((r) => (obj[r.key] = r.value));
    return obj;
  },
  get(key, def = null) {
    const r = db.prepare("SELECT value FROM settings WHERE key=?").get(key);
    return r ? r.value : def;
  },
  set(key, value) {
    db.prepare("INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(
      key,
      String(value)
    );
  },
  setMany(obj) {
    Object.entries(obj).forEach(([k, v]) => Settings.set(k, v));
  },
};

/* ---------------- Admin ---------------- */
const Admin = {
  byUsername(username) {
    return db.prepare("SELECT * FROM admin WHERE username=?").get(username);
  },
  create(username, password_hash, name) {
    return db
      .prepare("INSERT INTO admin (username, password_hash, name) VALUES (?,?,?)")
      .run(username, password_hash, name);
  },
  count() {
    return db.prepare("SELECT COUNT(*) c FROM admin").get().c;
  },
};

function slugify(str) {
  return String(str)
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 60) || "item";
}

module.exports = { db, Category, Product, Order, Settings, Admin, slugify };
