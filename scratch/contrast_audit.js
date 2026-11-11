// WCAG 2.1 Contrast Ratio Calculator
// Relative luminance of sRGB color
function luminance(hex) {
  const r = parseInt(hex.slice(1,3), 16) / 255;
  const g = parseInt(hex.slice(3,5), 16) / 255;
  const b = parseInt(hex.slice(5,7), 16) / 255;
  const lin = c => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(hex1, hex2) {
  const L1 = luminance(hex1);
  const L2 = luminance(hex2);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
}

const bg = '#0a0f0d';
const surface1 = '#111815';

const pairs = [
  ['--text-white (#ffffff)', '#ffffff', bg],
  ['--text-high-contrast (#f4f6f4)', '#f4f6f4', bg],
  ['--text-muted (#95a39a)', '#95a39a', bg],
  ['--text-dim (#606d64)', '#606d64', bg],
  ['--lemon (#8fff00)', '#8fff00', bg],
  ['--lemon on surface-1', '#8fff00', surface1],
  ['--text-muted on surface-1', '#95a39a', surface1],
  ['--text-dim on surface-1', '#606d64', surface1],
  // small text check: lemon text under dark bg (never used as body)
  ['--lemon-dim (#5c9900) on bg', '#5c9900', bg],
  // Fix candidate: lighter muted
  ['#aab8b2 on bg (proposed)', '#aab8b2', bg],
  ['#b2c4bd on bg (proposed AA+)', '#b2c4bd', bg],
];

const WCAG_AA_NORMAL = 4.5;
const WCAG_AA_LARGE  = 3.0;
const WCAG_AAA       = 7.0;

pairs.forEach(([label, fg, bg_]) => {
  const r = contrast(fg, bg_);
  let grade = 'FAIL';
  if (r >= WCAG_AAA) grade = 'AAA ✅';
  else if (r >= WCAG_AA_NORMAL) grade = 'AA ✅';
  else if (r >= WCAG_AA_LARGE) grade = 'AA-Large only ⚠️';
  else grade = 'FAIL ❌';
  console.log(`${label}: ${r}:1  → ${grade}`);
});
