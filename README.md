# Emmanuel Boateng — Portfolio Website

A high-performance, responsive portfolio website built with semantic HTML5, modern CSS3, and vanilla JavaScript. Designed under the **Aurora Monochrome & Neon Lemon** aesthetic (**100% gradient-free**), featuring layered depth, ambient light diffusion via CSS `blur()`, razor-sharp technical borders, and solid glowing box-shadows.

---

## 🎨 Design System & Aesthetic Principles

- **Strict Color Palette**:
  - **Deep Black**: `#0a0f0d` (surfaces: `#111815`, `#16201b`, `#1c2a23`)
  - **Crisp White**: `#ffffff` (muted text: `#95a39a`, `#606d64`)
  - **Vibrant Lemon Green**: `#8fff00` / `#39ff14` (solid neon glow accents)
- **Zero Gradients Rule**:
  - No `linear-gradient`, `radial-gradient`, or `conic-gradient` used anywhere.
  - The "Aurora" ambient light field is achieved using solid circular color blocks diffused via `filter: blur(180px)` with gentle CSS keyframe drift, paired with multi-layer solid `box-shadow` glows.
- **Typography**:
  - Display / Headings: `Space Grotesk`
  - Body Copy: `Plus Jakarta Sans`
  - Technical Badges & Data: `JetBrains Mono`

---

## 📂 Project Architecture

```
MY PORTFOLIO/
├── index.html          # Semantic HTML5 markup, ARIA accessibility, all sections
├── style.css           # Full CSS3 design system, responsive grids, zero-gradient aurora effects
├── script.js           # Vanilla JS: mobile menu, filterable gallery, lightbox, form validation
├── vercel.json         # Security headers & caching configuration for Vercel deployment
├── .htaccess           # Security headers, compression, and caching for Apache/cPanel hosting
├── img/
│   └── your-photo.jpg  # Profile portrait slot (640x760)
└── README.md           # Documentation & hosting deployment guide
```

---

## 🔒 Security Hardening & Vulnerability Mitigation

1. **XSS (Cross-Site Scripting) Prevention**:
   - Zero `innerHTML` injections for dynamic text. All modal details, error messages, and form feedback use `textContent` and native DOM node cloning.
2. **Input Sanitization & Client Validation**:
   - Contact form validates full name (length & tag rejection), email (RFC 5322 regex), category dropdown, and message (character limits & script tag detection).
   - Strips non-printable ASCII control characters (`\u0000-\u001f\u007f`).
3. **Anti-Spam Bot Honeypot**:
   - Off-screen honeypot input field (`#website-field`) silently discards automated bot submissions without false alarms.
4. **Tab-Nabbing Protection**:
   - All external anchor tags enforce `rel="noopener noreferrer"`.
5. **Production HTTP Security Headers**:
   - Configured in both `vercel.json` and `.htaccess`:
     - `Content-Security-Policy`: Restricts scripts, objects, and framing.
     - `X-Frame-Options: DENY`: Blocks clickjacking attacks.
     - `X-Content-Type-Options: nosniff`: Prevents MIME-sniffing exploits.
     - `Strict-Transport-Security`: Enforces HTTPS (HSTS 2-year preload).
     - `Referrer-Policy: strict-origin-when-cross-origin`.
     - `Permissions-Policy`: Disables unused device sensors (camera, mic, geolocation).

---

## 🚀 Deployment Guide

### Option 1: Vercel (Recommended — Zero-Config)
1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of portfolio"
   git remote add origin https://github.com/yourusername/portfolio.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Leave build settings as default (Static Site). Vercel will automatically read `vercel.json` for all HTTP security headers and caching rules.
5. Click **Deploy**. Your portfolio will be live on a global CDN with sub-50ms TTFB.

### Option 2: GitHub Pages
1. Push the code to a GitHub repository.
2. In your GitHub repository, go to **Settings** &rarr; **Pages**.
3. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
4. Your site will be published at `https://yourusername.github.io/portfolio/`.

### Option 3: Apache / cPanel / Shared Hosting
1. Upload all files (`index.html`, `style.css`, `script.js`, `.htaccess`, `img/`) into your `public_html` directory via cPanel File Manager or FTP.
2. The included `.htaccess` file will automatically enforce all security headers, enable Gzip compression, and protect against directory indexing.

---

## 📸 Personalizing Your Assets

- **Profile Picture**: Drop your photograph into `img/your-photo.jpg` (ideal dimensions: 640&times;760px).
- **Curriculum Vitae**: Place your updated PDF in `img/your-photo.jpg` (or update the download link in `index.html` to point to `assets/Emmanuel-Boateng-CV.pdf`).
- **Contact Form Backend**: The client-side form currently validates and prepares a JSON payload. To receive real emails without a custom server, connect it to [Formspree](https://formspree.io) or [EmailJS](https://www.emailjs.com) by setting the `<form action="...">` endpoint.
