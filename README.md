# Boateng Emmanuel Duah — Portfolio Website

A high-performance, responsive portfolio website built with semantic HTML5, modern CSS3, and vanilla JavaScript. Designed under the **Aurora Monochrome & Neon Lemon** aesthetic (**100% gradient-free**), featuring layered depth, ambient light diffusion via CSS `blur()`, razor-sharp technical borders, and solid glowing box-shadows.

Updated to accurately reflect **Boateng Emmanuel Duah's** official professional resume, education, projects, certifications, and experience.

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
  - Technical Badges & Code Tags: `JetBrains Mono`

---

## 📂 Project Architecture

```
MY PORTFOLIO/
├── index.html                           # Semantic HTML5 markup, ARIA accessibility, all sections
├── style.css                            # Full CSS3 design system, responsive grids, zero-gradient aurora effects
├── script.js                            # Vanilla JS: mobile menu, filterable gallery, lightbox, form validation
├── vercel.json                          # Security headers & caching configuration for Vercel deployment
├── .htaccess                            # Security headers, compression, and caching for Apache/cPanel hosting
├── Boateng_Emmanuel_Duah_Resume.pdf     # Official resume file for direct download (215 KB)
├── assets/
│   └── Boateng_Emmanuel_Duah_Resume.pdf # Official resume file in assets path
├── img/
│   ├── profile.png                      # Profile portrait photograph
│   └── _MG_1567   DigiWorld.png         # High-resolution original portrait image
└── README.md                            # Documentation & hosting deployment guide
```

---

## 💼 Integrated Resume Highlights

1. **Identity & Location**:
   - **Name**: Boateng Emmanuel Duah
   - **Phone**: 0542649394 (+233 54 264 9394)
   - **Email**: emmanuelbduah@outlook.com
   - **Residence**: Broadcasting – Weija, Greater Accra, Ghana
   - **Nationality / Languages**: Ghanaian / English, Twi

2. **Professional Experience**:
   - **Loan Returns Officer and Cashier** — *Cyrus Micro Credit Limited* (2024 – Present)
   - **Networking Associate** — *K-Net Ghana Limited* (February 2023 – August 2023)
   - **Facilitator** — *Lead Royal Home School Complex* (October 2023 – February 2024)

3. **Software Engineering Projects**:
   - **Membership Registration & Immutable Audit Dashboard** (Oct 2026) — *FastAPI, SQLite, Alpine.js, Tailwind CSS*
   - **Multi-Branch Microcredit Management System** (Aug 2026) — *PHP (PDO), PostgreSQL*
   - **OTP SMS Real-Time Voting System** (Aug 2026) — *Triple G Tech Hub, PHP, MySQL, Server-Sent Events (SSE)*
   - **Offline Point-of-Sale (POS) & Inventory System** (Sep 2026) — *PHP, MySQL, ERD, Thermal Printing*
   - **Passwordless Magic-Link Voting Portal** (Aug 2026) — *PHP, MySQL, Token Auth, Bulk CSV Import*
   - **Audio Streaming Platform Architecture** (Sep 2026) — *PHP, PostgreSQL, JSON REST API, React Audio Controls*

4. **Education & Certifications**:
   - **HND in Computer Science and Information Technology** (Level 300 / Final Year) — *Accra Technical University*
   - **Cisco Certified Network Associate (CCNA)** (2022) — *Cisco Networking Academy*
   - **Computer Software Development Certificate** (2023) — *Ghana-India Kofi Annan Centre of Excellence in ICT (AITI-KACE)*
   - **Introduction to Cybersecurity** (Jan 2026) — *Cisco Networking Academy*

5. **Professional References**:
   - **Mr. Kingsley Ampaabeng**, Cyrus Microcredit Limited (0532681998)
   - **Mr. Eugene Narh**, Supervisor, K-Net Ghana Limited (0544730112)
   - **Mr. Prince Emmanuel Annan**, Headmaster, Lead Royal Home School Complex (0247864080)

---

## 🔒 Security Hardening & Vulnerability Mitigation

1. **XSS (Cross-Site Scripting) Prevention**:
   - Zero `innerHTML` injections for dynamic text. All modal details, error messages, and form feedback use `textContent` and native DOM node cloning.
2. **Input Sanitization & Client Validation**:
   - Contact form validates full name, email (RFC 5322 regex), category dropdown, and message. Strips non-printable ASCII control characters (`\u0000-\u001f\u007f`).
3. **Anti-Spam Bot Honeypot**:
   - Off-screen honeypot input field (`#website-field`) silently discards automated bot submissions without false alarms.
4. **Tab-Nabbing Protection**:
   - All external anchor tags enforce `rel="noopener noreferrer"`.
5. **Production HTTP Security Headers**:
   - Configured in both `vercel.json` and `.htaccess`: Content-Security-Policy, HSTS, X-Frame-Options, X-Content-Type-Options, Permissions-Policy.

---

## 🚀 Deployment Guide

### Option 1: Vercel (Recommended — Zero-Config)
```bash
git add .
git commit -m "feat: update portfolio with official resume, projects, and downloadable PDF"
git push origin main
```
Import the repository on [Vercel](https://vercel.com) and deploy statically. Vercel will automatically read `vercel.json` for security headers and caching.

### Option 2: Apache / cPanel / Shared Web Hosting
Upload all repository files to your `public_html` directory via cPanel File Manager or FTP. The included `.htaccess` automatically manages security headers, compression, and caching.
