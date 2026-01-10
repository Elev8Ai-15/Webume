# Webumé - Digital Resume Revolution 🚀

**Transform your resume into an immersive digital experience that gets you hired.**

## 🌐 Live URLs

| Environment | URL |
|-------------|-----|
| **Production** | https://webume.pages.dev |
| **Sandbox** | https://3000-izyu2fpqppfan5ciwputt-2e1b9533.sandbox.novita.ai |

---

## 🎯 What Is Webumé?

Webumé is an **industry-disrupting** AI-powered resume platform that transforms static PDFs into interactive, shareable digital profiles. Built for the modern job market with features aligned to recruiter expectations and ATS optimization.

### Key Value Propositions

- **AI-Powered Parsing**: Upload any resume (PDF/DOCX/TXT) and our Gemini AI extracts rich career data
- **Public Shareable Profiles**: Get your own URL (`/p/your-name`) to share with recruiters
- **ATS Optimization**: Real-time compatibility scoring with keyword analysis
- **PWA Ready**: Install as an app on any device (Google Play Store ready)
- **Cross-Device Sync**: Sign in from anywhere, your profile follows you

---

## ✅ MVP Features (All Complete)

### 🔐 User Authentication
- Email/password signup & login
- Secure sessions (30-day cookies)
- Server-side profile storage via Cloudflare KV
- Cross-device profile sync

### 📄 10 Industry-Specific Templates
| Category | Templates |
|----------|-----------|
| **Professional** | Executive, Corporate, Nonprofit |
| **Service Industry** | Healthcare, Restaurant & Hospitality, Trades & Services, Beauty & Wellness |
| **Creative** | Creative |
| **Technical** | Tech Pioneer, Minimal |

Each template includes unique colors, gradients, icons, and industry tags.

### 🌐 Public Profile Sharing
- **Custom URLs**: `/p/your-slug`
- **QR Code Generation**: Scan-to-view for business cards
- **Social Sharing**: LinkedIn, Twitter, Email
- **Profile Analytics**: Track view counts
- **SEO Optimized**: Open Graph meta tags for link previews

### 📊 ATS Compatibility Scoring
- Real-time score (0-100) with grade
- Keyword matching analysis
- Actionable improvement suggestions
- Top industry keywords detection

### 📱 PWA (Progressive Web App)
- Installable on any device
- App manifest with icons
- Standalone display mode
- Google Play Store ready via PWABuilder

### 🖼️ Media Handling
- **Photos**: 1600px PNG, high-quality compression
- **Videos**: Full playback with click-to-play controls
- **Profile Photo**: Circular crop with template-themed borders

### 🤖 AI Resume Parsing
- PDF, DOCX, TXT support
- Gemini 2.0 Flash integration
- Extracts: basics, experience, skills, achievements, education
- Generates: Day-in-Life activities, impact metrics, company info

---

## 🔌 API Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Main application |
| `/p/:slug` | GET | Public profile page |
| `/manifest.json` | GET | PWA manifest |
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/auth/logout` | POST | User logout |
| `/api/auth/me` | GET | Get current user |
| `/api/profile/load` | GET | Load user profile |
| `/api/profile/save` | POST | Save user profile |
| `/api/profile/publish` | POST | Toggle public visibility |
| `/api/profile/slug` | POST | Update custom URL slug |
| `/api/profile/public/:slug` | GET | Get public profile data |
| `/api/parse-resume` | POST | AI resume parsing |
| `/api/ats-score` | POST | ATS compatibility check |

---

## 🏗️ Technical Architecture

### Stack
| Layer | Technology |
|-------|------------|
| **Runtime** | Cloudflare Workers (Edge) |
| **Framework** | Hono 4.x |
| **Frontend** | React 18 (CDN + Babel) |
| **Database** | Cloudflare KV Storage |
| **AI** | Google Gemini 2.0 Flash |
| **PDF Parser** | PDF.js 3.11.174 |
| **DOCX Parser** | Mammoth.js 1.6.0 |
| **QR Codes** | qrcode.js 1.5.3 |
| **Build Tool** | Vite |
| **Deployment** | Cloudflare Pages |

### Data Models

```typescript
// User Schema (stored in KV as user:email)
interface User {
  email: string
  name: string
  passwordHash: string
  createdAt: string
  slug: string              // Custom URL slug
  isPublic: boolean         // Profile visibility
  profileViews: number      // Analytics counter
  profile: ProfileData | null
  profilePhoto: string | null
  selectedTemplate: string
  rawText: string
}

// Profile Schema
interface ProfileData {
  basics: {
    name: string
    title: string
    tagline: string
    email: string
    phone: string
    location: string
    linkedin: string
    website: string
    summary: string
  }
  experience: Experience[]
  skills: string[]
  achievements: Achievement[]
  education: Education[]
  awards: Award[]
  reviews: Review[]
  payHistory: PayRecord[]
  projects: Project[]
}
```

---

## 📱 App Store Publishing

### Google Play Store (via PWABuilder)
1. Go to https://www.pwabuilder.com/
2. Enter: `https://webume.pages.dev`
3. Download Android package
4. Submit to Google Play Console

### Requirements Met
- ✅ PWA manifest with all icons
- ✅ Service worker capable
- ✅ Standalone display mode
- ✅ Portrait orientation
- ✅ App categories: business, productivity
- ✅ Shortcuts for quick actions

---

## 🚀 Quick Start

### For Users
1. Visit https://webume.pages.dev
2. Create an account (email + password)
3. Upload your resume (PDF, DOCX, or TXT)
4. AI extracts your career data automatically
5. Edit and customize all sections
6. Preview with your chosen template
7. Publish and share your public URL
8. Track who views your profile

### For Developers
```bash
# Clone and setup
cd /home/user/webapp
npm install

# Build and run locally
npm run build
pm2 start ecosystem.config.cjs

# Deploy to production
npm run build
npx wrangler pages deploy dist --project-name webume
```

---

## 📊 Viral Growth Features

Based on research into successful professional networking apps:

- **Shareable URLs**: Every profile has a unique, memorable link
- **QR Codes**: Perfect for business cards and networking events
- **Social Sharing**: One-click share to LinkedIn, Twitter, Email
- **ATS Score Gamification**: Users are motivated to improve their score
- **Template Variety**: Choose based on industry to stand out
- **Cross-Device**: Access from any device, anytime

---

## 🎨 Design System

### Glassmorphism Theme
```css
:root {
  --purple-main: #8B5CF6;
  --purple-light: #A78BFA;
  --pink-main: #EC4899;
  --cyan-main: #06B6D4;
  --green-main: #10B981;
}
```

### UI Components
- Blurred glass cards with subtle borders
- Premium gradients for CTAs
- Font Awesome icons throughout
- Inter & Space Grotesk typography
- Mobile-responsive design

---

## 📈 Analytics & Insights

- Profile view counter (visible to profile owner)
- ATS score tracking
- Keyword match analytics
- Last saved timestamp

---

## 🔮 Future Roadmap

- [ ] PDF Export / Download
- [ ] Video Introduction Recording
- [ ] Employer/Recruiter View Mode
- [ ] Premium Templates (paid tier)
- [ ] AI-Powered Job Matching
- [ ] Interview Preparation Tools
- [ ] Salary Insights Integration
- [ ] Multi-language Support

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-10 | MVP Complete: Auth, 10 templates, public profiles, ATS scoring, QR codes, PWA |
| 0.9.0 | 2026-01-09 | Photo quality fix, video playback, auto-save |
| 0.8.0 | 2026-01-09 | Template system, company logos, glassmorphism UI |
| 0.5.0 | 2026-01-08 | Initial build with AI parsing |

---

*Built to revolutionize the job market. One profile at a time.* ✨

**Status**: ✅ MVP Complete & Live on Production
