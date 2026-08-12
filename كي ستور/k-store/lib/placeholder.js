/**
 * مولّد صور منتجات أنيق (SVG) — بديل موثوق لا يعتمد على الإنترنت.
 * ينتج صوراً متجهية فاخرة لكل فئة مع شعار K-Store.
 */

const CAT_STYLE = {
  phones: { c1: "#1e3a8a", c2: "#0b1120", icon: "📱" },
  electronics: { c1: "#115e59", c2: "#042f2e", icon: "🎧" },
  "home-appliances": { c1: "#9a3412", c2: "#431407", icon: "🏠" },
  "men-fashion": { c1: "#475569", c2: "#0f172a", icon: "👔" },
  "women-fashion": { c1: "#9d174d", c2: "#500724", icon: "👗" },
  shoes: { c1: "#b45309", c2: "#451a03", icon: "👟" },
  bags: { c1: "#6d28d9", c2: "#2e1065", icon: "👜" },
  "watches-jewelry": { c1: "#a16207", c2: "#422006", icon: "⌚" },
  "beauty-care": { c1: "#be185d", c2: "#500724", icon: "🧴" },
  sports: { c1: "#15803d", c2: "#052e16", icon: "🏋️" },
  kids: { c1: "#ea580c", c2: "#7c2d12", icon: "🧸" },
  furniture: { c1: "#854d0e", c2: "#422006", icon: "🛋️" },
  groceries: { c1: "#16a34a", c2: "#14532d", icon: "🛒" },
  other: { c1: "#64748b", c2: "#1e293b", icon: "🛍️" },
};

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function makePlaceholder(category, label, idx = 0) {
  const st = CAT_STYLE[category] || CAT_STYLE.other;
  const id = "g" + (idx % 12);
  const name = esc((label || "K-Store").slice(0, 26));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${st.c1}"/>
      <stop offset="1" stop-color="${st.c2}"/>
    </linearGradient>
    <radialGradient id="${id}r" cx="0.3" cy="0.25" r="0.9">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="0.6" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <pattern id="${id}p" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="40" stroke="#d9a73c" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="800" height="800" fill="url(#${id})"/>
  <rect width="800" height="800" fill="url(#${id}p)"/>
  <rect width="800" height="800" fill="url(#${id}r)"/>
  <text x="400" y="430" font-size="300" text-anchor="middle" dominant-baseline="central" opacity="0.92">${st.icon}</text>
  <text x="60" y="80" font-family="Georgia, serif" font-size="30" letter-spacing="6" fill="#e3bd5f" opacity="0.95">K&#8209;STORE</text>
  <line x1="60" y1="100" x2="220" y2="100" stroke="#d9a73c" stroke-opacity="0.5" stroke-width="2"/>
  <rect x="0" y="700" width="800" height="100" fill="#000000" opacity="0.28"/>
  <text x="400" y="760" font-family="Arial, sans-serif" font-size="40" font-weight="bold" text-anchor="middle" fill="#ffffff" opacity="0.96">${name}</text>
</svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

module.exports = { makePlaceholder, CAT_STYLE };
