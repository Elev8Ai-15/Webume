# Webumé - Digital Resume Revolution 🚀

**Transform your resume into an immersive, interactive career experience that showcases 10 years of work in ways a paragraph never could.**

## 🌐 Live URLs

| Environment | URL |
|-------------|-----|
| **Production** | https://webume.pages.dev |
| **Latest Deploy** | https://67dcea01.webume.pages.dev |
| **Sandbox** | https://3000-izyu2fpqppfan5ciwputt-2e1b9533.sandbox.novita.ai |

---

## 📱 App Store Publishing Guide

### ✅ PWA Status: READY FOR PUBLISHING

WebUME is fully PWA-compliant and ready for app store submission.

#### PWA Assets Verified:
- ✅ **Manifest**: Full Web App Manifest with all required fields
- ✅ **Service Worker**: Offline support, caching, push notifications
- ✅ **Icons**: All sizes (48, 72, 96, 128, 144, 152, 192, 256, 384, 512, 1024)
- ✅ **Maskable Icons**: 192x192 and 512x512 for adaptive icons
- ✅ **Scope**: Properly defined start_url and scope
- ✅ **Display**: Standalone mode for app-like experience

---

### 🤖 Google Play Store (Android)

**Method 1: PWABuilder (Recommended)**
1. Go to https://www.pwabuilder.com/
2. Enter URL: `https://webume.pages.dev`
3. Click "Start" → PWABuilder will analyze your PWA
4. Click "Package for stores" → Select "Android"
5. Choose options:
   - Package ID: `ai.webume.app`
   - App name: `Webumé`
   - Short name: `Webumé`
   - Version: `1.0.0`
6. Download the generated APK/AAB
7. Submit to Google Play Console

**Method 2: Bubblewrap (CLI)**
```bash
npx @aspect-dev/aspect-cli pack https://webume.pages.dev
```

**Google Play Requirements Met:**
| Requirement | Status |
|-------------|--------|
| 512x512 icon | ✅ `/static/icon-512.png` |
| Maskable icon | ✅ `/static/icon-512-maskable.png` |
| Manifest | ✅ Complete |
| HTTPS | ✅ Cloudflare |
| Service Worker | ✅ `/static/sw.js` |

---

### 🍎 Apple App Store (iOS)

**Requirements:**
- Apple Developer Account ($99/year)
- Xcode on macOS
- App Store Connect access

**Method: PWABuilder**
1. Go to https://www.pwabuilder.com/
2. Enter URL: `https://webume.pages.dev`
3. Click "Package for stores" → Select "iOS"
4. Download Xcode project
5. Open in Xcode, sign with your Apple Developer certificate
6. Archive and submit to App Store Connect

**Apple App Store Requirements Met:**
| Requirement | Status |
|-------------|--------|
| Apple touch icons | ✅ 152x152, 180x180, 167x167 |
| Web app capable | ✅ `apple-mobile-web-app-capable` |
| Status bar style | ✅ `black-translucent` |
| App name meta | ✅ `apple-mobile-web-app-title` |

---

### 🪟 Microsoft Store (Windows)

**Method: PWABuilder**
1. Go to https://www.pwabuilder.com/
2. Enter URL: `https://webume.pages.dev`
3. Click "Package for stores" → Select "Windows"
4. Download MSIX package
5. Submit to Microsoft Partner Center

---

### 📋 App Store Listing Content

**App Name:** Webumé - Digital Resume

**Short Description:**
Transform your resume into an immersive digital experience. AI-powered career profiles that get you hired.

**Full Description:**
Webumé revolutionizes how professionals present their career history. Stop reducing 10 years of experience to a single paragraph.

🌳 INTERACTIVE CAREER TREE
• Each employer becomes its own detailed experience page
• Click to expand: projects, achievements, challenges, media
• Showcase the full story of your professional journey

🤖 AI-POWERED RESUME PARSING  
• Upload PDF, DOCX, or TXT resumes
• Google Gemini AI extracts and structures your data
• Intelligent keyword optimization

🎨 10 PROFESSIONAL TEMPLATES
• Executive, Corporate, Nonprofit
• Healthcare, Restaurant, Trades, Beauty  
• Creative, Tech Pioneer, Minimal

📊 ATS COMPATIBILITY SCORING
• Real-time score out of 100
• Keyword analysis and suggestions
• Beat the applicant tracking systems

🔗 SHAREABLE PUBLIC PROFILES
• Custom URLs (webume.pages.dev/p/your-name)
• QR code generation
• One-click social sharing

✨ PREMIUM FEATURES
• Cross-device sync
• Profile analytics
• Unlimited media uploads

**Keywords:**
resume, cv, career, job search, professional profile, digital resume, job application, employment, linkedin alternative, portfolio

**Category:** Business / Productivity

---

## 💳 Pricing Tiers

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0 | 1 Profile, Basic Templates, Public URL, ATS Score |
| **Pro** | $9.99/mo | Unlimited Profiles, All Templates, Custom Domain, PDF Export, Analytics |
| **Enterprise** | $29.99/mo | Team Management, API Access, White Label, SLA |

---

## 🎯 The Vision: Career Tree Architecture

**The Problem**: Traditional resumes force 10 years of experience into tiny paragraphs.

**The Solution**: Webumé introduces the **Organic Chronological Career Tree** - each employer becomes its own interactive experience page:

1. **Career Timeline View**: Elegant timeline with employer cards
2. **Hover to Preview**: See content indicators (projects, media, reviews)
3. **Click to Expand**: Full-screen Employer Detail Page
4. **8 Sections Per Employer**:
   - Overview, Responsibilities, Projects
   - Achievements, Challenges, Media
   - Reviews, Day in Life

---

## ✅ Complete Feature Set

### 🔐 Security (SAAS Compliant)
- PBKDF2 password hashing (100,000 iterations)
- Rate limiting (100 req/min per IP)
- CSRF token protection
- httpOnly secure cookies
- Content Security Policy headers

### 🌳 Interactive Career Tree
- Clickable employer cards
- Full-screen Employer Detail Pages
- 8 dedicated sections per employer

### 📱 PWA Features
- Installable on all devices
- Offline support via Service Worker
- Push notification ready
- Share target for resumes

---

## 🔌 API Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/*` | POST | Authentication |
| `/api/profile/*` | GET/POST | Profile operations |
| `/api/stripe/plans` | GET | Pricing plans |
| `/api/stripe/create-checkout` | POST | Start subscription |
| `/api/stripe/subscription` | GET | Get subscription status |
| `/api/ats-score` | POST | ATS compatibility |
| `/api/parse-resume` | POST | AI resume parsing |

---

## 🚀 Quick Start

### For Users
1. Visit https://webume.pages.dev
2. Create an account
3. Upload your resume (PDF, DOCX, TXT)
4. AI extracts your career data
5. Click any experience to add rich content
6. Preview with your chosen template
7. Publish and share your public URL

### For Developers
```bash
cd /home/user/webapp
npm install
npm run build
pm2 start ecosystem.config.cjs

# Deploy
npx wrangler pages deploy dist --project-name webume
```

---

## 🏗️ Technical Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Cloudflare Workers (Edge) |
| **Framework** | Hono 4.x |
| **Frontend** | React 18 |
| **Database** | Cloudflare KV |
| **AI** | Google Gemini 2.0 Flash |
| **Payments** | Stripe |
| **PWA** | Service Worker + Manifest |

---

## 📈 Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.1.0 | 2026-01-19 | **App Store Ready**: PWA compliance, all icons, service worker, Stripe integration |
| 2.0.0 | 2026-01-10 | **Career Tree**: Interactive employer pages |
| 1.0.0 | 2026-01-10 | MVP: Auth, templates, public profiles |

---

**Built to revolutionize the job market. Every experience deserves its full story.** ✨

*Status: ✅ App Store Ready*
