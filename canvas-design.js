const palette = {
  ink: "#f5f5f5",
  dark: "#0a0a0a",
  panel: "#111111",
  red: "#dc2626",
  crimson: "#b91c1c",
  orange: "#ea580c",
  amber: "#d97706",
  yellow: "#eab308",
  olive: "#65a30d",
  green: "#22c55e",
  teal: "#14b8a6",
  cyan: "#22d3ee",
  blue: "#3b82f6",
  indigo: "#4f46e5",
  violet: "#8b5cf6",
  gray: "#6b7280",
  muted: "#888888",
};

function scaleCanvas(canvas, logicalWidth, logicalHeight) {
  const ratio = window.devicePixelRatio || 1;
  const w = Math.round(logicalWidth * ratio);
  const h = Math.round(logicalHeight * ratio);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return ctx;
}

function drawBombsightLogo(ctx, x, y, size) {
  const unit = size / 72;
  ctx.save();
  ctx.translate(x, y);

  // Circular background with military feel
  const cx = 36 * unit;
  const cy = 36 * unit;
  const radius = 34 * unit;

  // Outer ring - dark circle
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = palette.dark;
  ctx.fill();

  // Concentric ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = palette.amber;
  ctx.lineWidth = 3 * unit;
  ctx.stroke();

  // Inner ring
  ctx.beginPath();
  ctx.arc(cx, cy, 24 * unit, 0, Math.PI * 2);
  ctx.strokeStyle = palette.orange;
  ctx.lineWidth = 2 * unit;
  ctx.stroke();

  // Crosshair - horizontal line
  ctx.beginPath();
  ctx.moveTo(4 * unit, cy);
  ctx.lineTo(68 * unit, cy);
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 1.5 * unit;
  ctx.stroke();

  // Crosshair - vertical line
  ctx.beginPath();
  ctx.moveTo(cx, 4 * unit);
  ctx.lineTo(cx, 68 * unit);
  ctx.strokeStyle = palette.ink;
  ctx.lineWidth = 1.5 * unit;
  ctx.stroke();

  // Center target dot
  ctx.beginPath();
  ctx.arc(cx, cy, 4 * unit, 0, Math.PI * 2);
  ctx.fillStyle = palette.red;
  ctx.fill();

  // Inner glow on center dot
  ctx.beginPath();
  ctx.arc(cx, cy, 2 * unit, 0, Math.PI * 2);
  ctx.fillStyle = palette.yellow;
  ctx.fill();

  // Tick marks on crosshair (small lines at intervals)
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const dist = 13 * unit;
    const tx = cx + Math.cos(angle) * dist;
    const ty = cy + Math.sin(angle) * dist;
    ctx.beginPath();
    ctx.arc(tx, ty, 2 * unit, 0, Math.PI * 2);
    ctx.fillStyle = palette.cyan;
    ctx.fill();
  }

  // Outer tick marks (directional indicators)
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const innerR = 28 * unit;
    const outerR = 33 * unit;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
    ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
    ctx.strokeStyle = i % 2 === 0 ? palette.amber : palette.gray;
    ctx.lineWidth = 1.5 * unit;
    ctx.stroke();
  }

  // Small wing silhouette at bottom
  ctx.beginPath();
  ctx.moveTo(18 * unit, 56 * unit);
  ctx.lineTo(36 * unit, 50 * unit);
  ctx.lineTo(54 * unit, 56 * unit);
  ctx.lineTo(50 * unit, 58 * unit);
  ctx.lineTo(36 * unit, 54 * unit);
  ctx.lineTo(22 * unit, 58 * unit);
  ctx.closePath();
  ctx.fillStyle = palette.orange;
  ctx.globalAlpha = 0.3;
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.restore();
}

function drawBrandLogo() {
  const canvas = document.getElementById("brand-canvas");
  if (!canvas) return;
  const ctx = scaleCanvas(canvas, 22, 22);
  ctx.clearRect(0, 0, 22, 22);
  drawBombsightLogo(ctx, 0, 0, 22);
}

function drawBrandLogoFooter() {
  const canvas = document.getElementById("brand-canvas-footer");
  if (!canvas) return;
  const ctx = scaleCanvas(canvas, 20, 20);
  ctx.clearRect(0, 0, 20, 20);
  drawBombsightLogo(ctx, 0, 0, 20);
}

function drawHeroLogo() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  const ctx = scaleCanvas(canvas, 96, 96);
  ctx.clearRect(0, 0, 96, 96);
  drawBombsightLogo(ctx, 0, 0, 96);
}

function installCanvasFavicon() {
  const canvas = document.createElement("canvas");
  canvas.width = 72;
  canvas.height = 72;
  const ctx = canvas.getContext("2d");
  drawBombsightLogo(ctx, 0, 0, 72);

  const link = document.querySelector("link[rel='icon']") || document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";
  link.href = canvas.toDataURL("image/png");
  document.head.appendChild(link);
}

function drawAll() {
  drawBrandLogo();
  drawBrandLogoFooter();
  drawHeroLogo();
}

function initCanvas() {
  drawAll();
  installCanvasFavicon();
}

function safeInit() {
  const brandCanvas = document.getElementById("brand-canvas");
  if (brandCanvas && brandCanvas.getContext) {
    initCanvas();
  } else {
    requestAnimationFrame(safeInit);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", safeInit);
} else {
  safeInit();
}
