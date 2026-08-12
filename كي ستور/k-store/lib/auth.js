const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Admin } = require("./db");

const SECRET = process.env.JWT_SECRET || "k-store-secret-change-in-production-771717913";

// بيانات المالك الافتراضية (يمكن تغييرها من لوحة التحكم لاحقاً)
const DEFAULT_ADMIN = {
  username: "owner",
  password: "kstore2024",
  name: "مالك المتجر",
};

function ensureDefaultAdmin() {
  if (Admin.count() === 0) {
    const hash = bcrypt.hashSync(DEFAULT_ADMIN.password, 10);
    Admin.create(DEFAULT_ADMIN.username, hash, DEFAULT_ADMIN.name);
  }
}

function login(username, password) {
  const admin = Admin.byUsername(username);
  if (!admin) return null;
  if (!bcrypt.compareSync(password, admin.password_hash)) return null;
  const token = jwt.sign({ id: admin.id, username: admin.username, name: admin.name }, SECRET, {
    expiresIn: "7d",
  });
  return { token, admin: { id: admin.id, username: admin.username, name: admin.name } };
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

function getTokenFromRequest(req) {
  const auth = req.headers.get("authorization") || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7);
  // دعم الكوكي
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(/kstore_token=([^;]+)/);
  if (m) return m[1];
  return null;
}

function isAuthed(req) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}

module.exports = { ensureDefaultAdmin, login, verifyToken, getTokenFromRequest, isAuthed, DEFAULT_ADMIN };
