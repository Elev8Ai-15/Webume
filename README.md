# Webumé - Digital Resume Revolution 🚀

**Transform your resume into an immersive, interactive career experience that showcases 10 years of work in ways a paragraph never could.**

## 🌐 Live URLs

| Environment | URL |
|-------------|-----|
| **Production** | https://webume.pages.dev |
| **Sandbox** | https://3000-izyu2fpqppfan5ciwputt-2e1b9533.sandbox.novita.ai |

---

## 🎯 The Vision: Career Tree Architecture

**The Problem**: Traditional resumes force 10 years of experience into tiny paragraphs. How do you explain your value, tasks, projects, challenges, victories, reviews, and impact from a decade at one company in a single paragraph? **It's ludicrous.**

**The Solution**: Webumé introduces the **Organic Chronological Career Tree** - each employer on your resume becomes its own **interactive experience page** that expands to reveal the full story:

### How It Works

1. **Career Timeline View**: Your resume displays as an elegant timeline with employer cards
2. **Hover to Preview**: Mouse over any employer card to see content indicators (projects, media, reviews)
3. **Click to Expand**: Click any employer to open a **full-screen Employer Detail Page**
4. **Employer Page Sections**:
   - **Overview**: Company info, role description, tenure, key metrics
   - **Responsibilities**: Detailed list of duties and scope
   - **Projects**: Individual projects with tech stacks and outcomes
   - **Achievements & Victories**: Key wins, awards received at this employer
   - **Challenges Overcome**: Situation-Approach-Outcome stories
   - **Media Gallery**: Photos and videos from your time there
   - **Reviews & Testimonials**: Manager/colleague feedback
   - **Day in Life**: What a typical day looked like

---

## ✅ Complete Feature Set

### 🌳 Interactive Career Tree
- Clickable employer cards in Career Timeline
- Hover effects showing content depth
- Content indicators (projects count, media count, reviews count)
- Full-screen Employer Detail Page per experience
- 8 dedicated sections per employer

### 🔐 User Authentication
- Email/password signup & login
- Secure sessions (30-day cookies via Cloudflare KV)
- Cross-device profile sync

### 📄 10 Industry-Specific Templates
| Category | Templates |
|----------|-----------|
| **Professional** | Executive, Corporate, Nonprofit |
| **Service Industry** | Healthcare, Restaurant, Trades, Beauty |
| **Creative** | Creative |
| **Technical** | Tech Pioneer, Minimal |

### 🌐 Public Profile Sharing
- Custom URLs: `/p/your-slug`
- QR Code generation
- Social sharing (LinkedIn, Twitter, Email)
- Profile view analytics
- SEO meta tags

### 📊 ATS Compatibility Scoring
- Real-time score (0-100)
- Keyword analysis
- Improvement suggestions

### 📱 PWA Ready
- Installable on any device
- Google Play Store ready via PWABuilder

---

## 📊 Data Architecture

### Experience Schema (Per Employer)
```typescript
interface Experience {
  id: number
  company: string
  companyInfo: {
    website: string
    domain: string
    industry: string
    location: string
    size: string
    description: string
  }
  logoUrl: string | null
  customLogo: string | null
  role: string
  startDate: string
  endDate: string
  description: string
  
  // Core Content
  responsibilities: string[]
  dayInLife: { time: string, activity: string }[]
  metrics: { value: string, label: string }[]
  skills: string[]
  
  // NEW: Employer-Specific Rich Content
  projects: Project[]         // Projects at this employer
  victories: Victory[]        // Key wins and successes
  challenges: Challenge[]     // Challenges overcome (SAO format)
  awards: Award[]            // Awards received here
  reviews: Review[]          // Performance reviews/testimonials
  photos: Photo[]            // Photos from this employer
  videos: Video[]            // Videos from this employer
}

interface Project {
  id: number
  name: string
  description: string
  url: string
  techStack: string[]
  outcome: string
}

interface Challenge {
  id: number
  title: string
  situation: string    // What was the challenge?
  approach: string     // How did you tackle it?
  outcome: string      // What was the result?
}

interface Victory {
  id: number
  title: string
  description: string
  impact: string
}
```

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

## 🏗️ Technical Stack

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

---

## 🚀 Quick Start

### For Users
1. Visit https://webume.pages.dev
2. Create an account
3. Upload your resume (PDF, DOCX, TXT)
4. AI extracts your career data
5. **Click on any experience in Career Timeline** to open the Employer Detail Page
6. Add rich content: projects, challenges, photos, videos, reviews
7. Preview with your chosen template
8. Publish and share your public URL

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

## 📁 Project Structure

```
webapp/
├── src/
│   └── index.tsx           # Main app (7000+ lines)
│       ├── API Routes      # Auth, Profile, Resume parsing
│       ├── Components
│       │   ├── App         # Main state management
│       │   ├── AuthView    # Login/Signup
│       │   ├── UploadView  # Resume upload
│       │   ├── BuilderView # Profile editing
│       │   ├── PreviewView # Live preview + Career Timeline
│       │   ├── EmployerDetailPage  # NEW: Full employer experience
│       │   └── Editors     # Basics, Experience, Skills, etc.
├── public/static/
│   ├── logo.png
│   └── background.png
├── dist/                   # Build output (~281 KB)
├── wrangler.jsonc         # Cloudflare config
└── package.json
```

---

## 🎨 UI Components

### Career Timeline (PreviewView)
- Interactive employer cards
- Hover: Shows "View Details" button + content indicators
- Click: Opens EmployerDetailPage modal
- Content badges: Projects, Victories, Photos, Videos, Reviews

### EmployerDetailPage
Full-screen modal with 8 sections:
1. **Overview** - Company info, metrics, skills used
2. **Responsibilities** - Numbered list with edit capability
3. **Projects** - Project cards with tech stacks
4. **Achievements** - Trophy-styled victory cards
5. **Challenges** - SAO (Situation-Approach-Outcome) format
6. **Media** - Photo/video gallery with lightbox
7. **Reviews** - Testimonial cards with avatars
8. **Day in Life** - Timeline visualization

---

## 📈 Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | 2026-01-10 | **Career Tree Architecture**: Interactive employer pages, rich content per experience |
| 1.0.0 | 2026-01-10 | MVP: Auth, templates, public profiles, ATS scoring, PWA |

---

## 🔮 Future Roadmap

- [ ] PDF Export with full rich content
- [ ] Video Introduction Recording
- [ ] AI-suggested content for each employer
- [ ] Recruiter/Employer view mode
- [ ] Analytics dashboard
- [ ] Premium templates

---

**Built to revolutionize the job market. Every experience deserves its full story.** ✨

*Status: ✅ Career Tree Architecture Complete & Live*
