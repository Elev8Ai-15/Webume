import { Hono } from 'hono'

const app = new Hono()

// Gemini API Key for AI-powered resume parsing
const GEMINI_API_KEY = 'AIzaSyB9jQaRGkfj4Tyq5y5j45RiYAeb_H2e-2g';

// ============================================
// AI RESUME PARSING ENDPOINT
// ============================================
app.post('/api/parse-resume', async (c) => {
  try {
    const { text } = await c.req.json();
    
    const prompt = `You are an expert resume parser. Analyze this resume text and extract ALL information into a structured JSON format.

RESUME TEXT:
${text}

EXTRACT THE FOLLOWING INTO JSON:
{
  "basics": {
    "name": "Full name",
    "title": "Current/most recent job title",
    "tagline": "A compelling 1-line professional summary",
    "email": "Email address",
    "phone": "Phone number",
    "location": "City, State",
    "linkedin": "LinkedIn URL if present",
    "website": "Personal website if present"
  },
  "experience": [
    {
      "company": "Company name",
      "role": "Job title",
      "startDate": "Start date (Month Year format)",
      "endDate": "End date or Present",
      "description": "Full job description",
      "tasks": "Key responsibilities and tasks as bullet points",
      "dayInLife": [
        {"time": "9:00 AM", "activity": "Realistic morning activity based on role"},
        {"time": "11:00 AM", "activity": "Mid-morning activity"},
        {"time": "1:00 PM", "activity": "Afternoon activity"},
        {"time": "3:00 PM", "activity": "Late afternoon activity"},
        {"time": "5:00 PM", "activity": "End of day activity"}
      ],
      "metrics": [
        {"value": "+X%", "label": "Key metric 1 - extract from description if mentioned"},
        {"value": "$XM", "label": "Key metric 2"},
        {"value": "X+", "label": "Key metric 3"},
        {"value": "XK", "label": "Key metric 4"}
      ]
    }
  ],
  "skills": ["Array of all skills mentioned"],
  "education": [
    {"degree": "Degree name", "school": "School name", "year": "Graduation year"}
  ],
  "achievements": [
    {"title": "Achievement title", "description": "Description"}
  ],
  "certifications": [
    {"name": "Certification name", "org": "Issuing organization", "year": "Year"}
  ]
}

IMPORTANT:
1. Extract ALL experiences found, in chronological order (most recent first)
2. Parse metrics/numbers from job descriptions (revenue, %, headcount, etc.)
3. Generate realistic "day in the life" activities based on the job role
4. Create a compelling tagline summarizing career highlights
5. If information is not available, use empty string "" not null

Return ONLY valid JSON, no markdown or explanation.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 8192
          }
        })
      }
    );

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean and parse JSON from response
    let parsed;
    try {
      // Remove markdown code blocks if present
      const jsonStr = aiText.replace(/```json\n?|\n?```/g, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      return c.json({ error: 'Failed to parse AI response', raw: aiText }, 500);
    }

    return c.json(parsed);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// WEBUME: THE RESUME KILLER
// Premium Dashboard UI + AI Resume Parsing
// ============================================

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Webume | Employee-for-Hire Empire</title>
  <meta name="description" content="The resume killer we've needed. Transform your career history into a living, verifiable proof-of-work portfolio.">
  
  <!-- React 18 -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  
  <!-- PDF.js for REAL PDF parsing -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
  <script>pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';</script>
  
  <!-- Mammoth.js for DOCX parsing -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script>
  
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  
  <!-- Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <style>
    /* ============================================
       WEBUME PREMIUM ULTRA DASHBOARD UI
       Futuristic Glassmorphism Design System
       ============================================ */
    
    :root {
      /* Deep Space Background */
      --bg-void: #050510;
      --bg-deep: #0a0a1f;
      --bg-primary: #0d0d24;
      --bg-secondary: #12122e;
      --bg-tertiary: #1a1a3e;
      --bg-elevated: #222255;
      
      /* Glass Effects */
      --glass-bg: rgba(255, 255, 255, 0.02);
      --glass-bg-hover: rgba(255, 255, 255, 0.05);
      --glass-border: rgba(255, 255, 255, 0.06);
      --glass-border-hover: rgba(255, 255, 255, 0.12);
      --glass-highlight: rgba(255, 255, 255, 0.08);
      --glass-glow: rgba(138, 43, 226, 0.15);
      
      /* Neon Accent Palette */
      --neon-purple: #a855f7;
      --neon-violet: #8b5cf6;
      --neon-pink: #ec4899;
      --neon-magenta: #d946ef;
      --neon-cyan: #06b6d4;
      --neon-teal: #14b8a6;
      --neon-blue: #3b82f6;
      --neon-green: #22c55e;
      --neon-orange: #f97316;
      --neon-red: #ef4444;
      --neon-gold: #fbbf24;
      
      /* Gradients */
      --gradient-purple: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
      --gradient-pink: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
      --gradient-cyan: linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%);
      --gradient-gold: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      --gradient-aurora: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #06b6d4 100%);
      --gradient-cosmic: linear-gradient(180deg, rgba(138, 43, 226, 0.3) 0%, rgba(236, 72, 153, 0.15) 50%, transparent 100%);
      
      /* Text */
      --text-primary: #ffffff;
      --text-secondary: #c4b5fd;
      --text-muted: #7c7c9a;
      --text-dim: #4a4a6a;
      
      /* Shadows & Glows */
      --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.4);
      --shadow-md: 0 8px 32px rgba(0, 0, 0, 0.5);
      --shadow-lg: 0 16px 64px rgba(0, 0, 0, 0.6);
      --shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.7);
      --glow-purple: 0 0 60px rgba(168, 85, 247, 0.4);
      --glow-pink: 0 0 60px rgba(236, 72, 153, 0.4);
      --glow-cyan: 0 0 60px rgba(6, 182, 212, 0.4);
      --glow-subtle: 0 0 40px rgba(168, 85, 247, 0.2);
      
      /* Sizing */
      --sidebar-width: 280px;
      --header-height: 80px;
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --radius-xl: 20px;
      --radius-2xl: 28px;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #root { height: 100%; }
    
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: var(--bg-void);
      color: var(--text-primary);
      line-height: 1.6;
      overflow: hidden;
    }
    
    /* Premium Scrollbar */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { 
      background: linear-gradient(180deg, var(--neon-purple), var(--neon-pink));
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover { opacity: 0.8; }
    
    /* ============================================
       ANIMATED BACKGROUND
       ============================================ */
    .cosmic-bg {
      position: fixed;
      inset: 0;
      z-index: 0;
      overflow: hidden;
      background: 
        radial-gradient(ellipse 150% 100% at 0% 0%, rgba(88, 28, 135, 0.4) 0%, transparent 50%),
        radial-gradient(ellipse 100% 150% at 100% 100%, rgba(157, 23, 77, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse 80% 80% at 50% 50%, rgba(30, 64, 175, 0.2) 0%, transparent 60%),
        var(--bg-void);
    }
    
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.6;
      animation: float 20s ease-in-out infinite;
    }
    
    .orb-1 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%);
      top: -200px;
      left: -200px;
      animation-delay: 0s;
    }
    
    .orb-2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, transparent 70%);
      top: 50%;
      right: -150px;
      animation-delay: -7s;
      animation-duration: 25s;
    }
    
    .orb-3 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%);
      bottom: -100px;
      left: 30%;
      animation-delay: -14s;
      animation-duration: 22s;
    }
    
    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(30px, -30px) scale(1.05); }
      50% { transform: translate(-20px, 20px) scale(0.95); }
      75% { transform: translate(40px, 10px) scale(1.02); }
    }
    
    /* Grid overlay */
    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 60px 60px;
      opacity: 0.5;
    }
    
    /* ============================================
       APP LAYOUT
       ============================================ */
    .app {
      display: flex;
      height: 100vh;
      position: relative;
      z-index: 1;
    }
    
    /* ============================================
       PREMIUM SIDEBAR
       ============================================ */
    .sidebar {
      width: var(--sidebar-width);
      background: rgba(10, 10, 31, 0.8);
      backdrop-filter: blur(40px);
      border-right: 1px solid var(--glass-border);
      display: flex;
      flex-direction: column;
      padding: 28px 20px;
      position: relative;
      z-index: 100;
    }
    
    .sidebar::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 300px;
      background: var(--gradient-cosmic);
      pointer-events: none;
      opacity: 0.5;
    }
    
    .sidebar::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 1px;
      height: 100%;
      background: linear-gradient(180deg, var(--neon-purple) 0%, transparent 50%, var(--neon-cyan) 100%);
      opacity: 0.3;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 0 8px;
      margin-bottom: 48px;
      position: relative;
    }
    
    .logo-icon {
      width: 52px;
      height: 52px;
      background: var(--gradient-aurora);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      box-shadow: var(--glow-purple), var(--shadow-md);
      position: relative;
      overflow: hidden;
    }
    
    .logo-icon::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%);
    }
    
    .logo-text {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 26px;
      font-weight: 700;
      background: linear-gradient(135deg, #fff 0%, var(--text-secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
    }
    
    .nav-section {
      margin-bottom: 36px;
    }
    
    .nav-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--text-dim);
      padding: 0 12px;
      margin-bottom: 14px;
    }
    
    .nav-items {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    
    .nav-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      border-radius: var(--radius-lg);
      color: var(--text-muted);
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      border: 1px solid transparent;
      background: transparent;
      width: 100%;
      text-align: left;
      position: relative;
      overflow: hidden;
    }
    
    .nav-item::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--gradient-purple);
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    
    .nav-item:hover {
      color: var(--text-primary);
      border-color: var(--glass-border-hover);
      background: var(--glass-bg-hover);
    }
    
    .nav-item.active {
      color: var(--text-primary);
      border-color: rgba(168, 85, 247, 0.3);
      background: rgba(168, 85, 247, 0.1);
      box-shadow: var(--glow-subtle);
    }
    
    .nav-item.active::before {
      opacity: 0.1;
    }
    
    .nav-item.active::after {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 28px;
      background: var(--gradient-purple);
      border-radius: 0 3px 3px 0;
      box-shadow: var(--glow-purple);
    }
    
    .nav-item i {
      width: 20px;
      text-align: center;
      font-size: 16px;
      position: relative;
      z-index: 1;
    }
    
    .nav-item span {
      position: relative;
      z-index: 1;
    }
    
    .nav-item.active i {
      color: var(--neon-purple);
      filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.6));
    }
    
    .nav-badge {
      margin-left: auto;
      background: var(--gradient-pink);
      color: white;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 20px;
      position: relative;
      z-index: 1;
      box-shadow: var(--glow-pink);
    }
    
    /* Sidebar User Card */
    .sidebar-profile {
      margin-top: auto;
      padding: 18px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      gap: 14px;
      position: relative;
      overflow: hidden;
    }
    
    .sidebar-profile::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%);
    }
    
    .sidebar-avatar {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: var(--gradient-cyan);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
      border: 2px solid rgba(6, 182, 212, 0.3);
      box-shadow: var(--glow-cyan);
      position: relative;
      z-index: 1;
    }
    
    .sidebar-info {
      flex: 1;
      min-width: 0;
      position: relative;
      z-index: 1;
    }
    
    .sidebar-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .sidebar-role {
      font-size: 12px;
      color: var(--text-muted);
    }
    
    /* ============================================
       MAIN CONTENT
       ============================================ */
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    /* Header */
    .header {
      height: var(--header-height);
      padding: 0 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--glass-border);
      background: rgba(10, 10, 31, 0.6);
      backdrop-filter: blur(20px);
      position: relative;
    }
    
    .header::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--neon-purple), var(--neon-pink), transparent);
      opacity: 0.3;
    }
    
    .header-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(135deg, #fff 0%, var(--text-secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .header-search {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 22px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      min-width: 300px;
      transition: all 0.25s ease;
    }
    
    .header-search:focus-within {
      border-color: var(--neon-purple);
      box-shadow: var(--glow-subtle);
    }
    
    .header-search i { color: var(--text-dim); }
    
    .header-search input {
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-size: 14px;
      width: 100%;
    }
    
    .header-search input::placeholder { color: var(--text-dim); }
    
    .header-btn {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.25s ease;
      position: relative;
    }
    
    .header-btn:hover {
      background: var(--glass-bg-hover);
      color: var(--text-primary);
      border-color: var(--glass-border-hover);
      transform: translateY(-2px);
    }
    
    .header-btn .badge {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 20px;
      height: 20px;
      background: var(--gradient-pink);
      border-radius: 50%;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--glow-pink);
    }
    
    /* Content */
    .content {
      flex: 1;
      overflow-y: auto;
      padding: 40px;
    }
    
    /* ============================================
       PREMIUM CARDS
       ============================================ */
    .card {
      background: rgba(18, 18, 46, 0.7);
      backdrop-filter: blur(40px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-2xl);
      padding: 32px;
      position: relative;
      overflow: hidden;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    }
    
    .card:hover {
      border-color: rgba(168, 85, 247, 0.25);
      box-shadow: var(--glow-subtle), var(--shadow-lg);
      transform: translateY(-2px);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
    }
    
    .card-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 20px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .card-title i {
      color: var(--neon-purple);
      filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.5));
    }
    
    /* ============================================
       STAT CARDS - Glassmorphism Style
       ============================================ */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      margin-bottom: 32px;
    }
    
    .stat-card {
      background: rgba(18, 18, 46, 0.6);
      backdrop-filter: blur(40px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-2xl);
      padding: 28px;
      position: relative;
      overflow: hidden;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .stat-card::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      filter: blur(60px);
      opacity: 0.4;
      transition: opacity 0.35s ease;
    }
    
    .stat-card:hover::before { opacity: 0.6; }
    
    .stat-card.purple::before { background: var(--neon-purple); }
    .stat-card.pink::before { background: var(--neon-pink); }
    .stat-card.cyan::before { background: var(--neon-cyan); }
    .stat-card.gold::before { background: var(--neon-gold); }
    
    .stat-card:hover {
      transform: translateY(-6px);
      border-color: rgba(168, 85, 247, 0.3);
      box-shadow: var(--glow-purple), var(--shadow-lg);
    }
    
    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      margin-bottom: 20px;
      position: relative;
    }
    
    .stat-card.purple .stat-icon { 
      background: rgba(168, 85, 247, 0.15); 
      color: var(--neon-purple);
      box-shadow: inset 0 0 20px rgba(168, 85, 247, 0.1);
    }
    .stat-card.pink .stat-icon { 
      background: rgba(236, 72, 153, 0.15); 
      color: var(--neon-pink);
      box-shadow: inset 0 0 20px rgba(236, 72, 153, 0.1);
    }
    .stat-card.cyan .stat-icon { 
      background: rgba(6, 182, 212, 0.15); 
      color: var(--neon-cyan);
      box-shadow: inset 0 0 20px rgba(6, 182, 212, 0.1);
    }
    .stat-card.gold .stat-icon { 
      background: rgba(251, 191, 36, 0.15); 
      color: var(--neon-gold);
      box-shadow: inset 0 0 20px rgba(251, 191, 36, 0.1);
    }
    
    .stat-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 6px;
      letter-spacing: -1px;
    }
    
    .stat-label {
      color: var(--text-muted);
      font-size: 14px;
      font-weight: 500;
    }
    
    .stat-change {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 600;
      margin-top: 12px;
      padding: 6px 14px;
      border-radius: 30px;
    }
    
    .stat-change.up {
      background: rgba(34, 197, 94, 0.12);
      color: var(--neon-green);
    }
    
    .stat-change.down {
      background: rgba(239, 68, 68, 0.12);
      color: var(--neon-red);
    }
    
    /* ============================================
       UPLOAD ZONE - Premium Design
       ============================================ */
    .upload-zone {
      border: 2px dashed var(--glass-border);
      border-radius: var(--radius-2xl);
      padding: 80px 50px;
      text-align: center;
      cursor: pointer;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      background: var(--glass-bg);
      position: relative;
      overflow: hidden;
    }
    
    .upload-zone::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.08) 0%, transparent 60%);
      opacity: 0;
      transition: opacity 0.35s ease;
    }
    
    .upload-zone:hover, .upload-zone.drag-over {
      border-color: var(--neon-purple);
      background: rgba(168, 85, 247, 0.05);
    }
    
    .upload-zone:hover::before, .upload-zone.drag-over::before {
      opacity: 1;
    }
    
    .upload-zone.drag-over {
      border-style: solid;
      transform: scale(1.01);
      box-shadow: var(--glow-purple);
    }
    
    .upload-icon {
      width: 100px;
      height: 100px;
      margin: 0 auto 32px;
      background: var(--gradient-aurora);
      border-radius: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      color: white;
      box-shadow: var(--glow-purple), var(--shadow-lg);
      position: relative;
      overflow: hidden;
    }
    
    .upload-icon::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%);
    }
    
    .upload-icon i {
      position: relative;
      z-index: 1;
      animation: uploadBounce 2s ease-in-out infinite;
    }
    
    @keyframes uploadBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    
    .upload-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #fff 0%, var(--text-secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .upload-desc {
      color: var(--text-muted);
      font-size: 16px;
      margin-bottom: 32px;
    }
    
    .upload-formats {
      display: flex;
      gap: 16px;
      justify-content: center;
    }
    
    .format-tag {
      padding: 12px 22px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      font-size: 14px;
      font-weight: 600;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.25s ease;
    }
    
    .format-tag:hover {
      border-color: var(--neon-purple);
      color: var(--text-primary);
    }
    
    .format-tag i { color: var(--neon-purple); }
    
    /* ============================================
       PROGRESS - AI Processing Animation
       ============================================ */
    .progress-container {
      padding: 48px;
    }
    
    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .progress-title {
      display: flex;
      align-items: center;
      gap: 16px;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 20px;
      font-weight: 600;
    }
    
    .ai-indicator {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      background: var(--gradient-aurora);
      border-radius: var(--radius-xl);
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: var(--glow-purple);
    }
    
    .ai-dot {
      width: 8px;
      height: 8px;
      background: white;
      border-radius: 50%;
      animation: aiPulse 1s ease-in-out infinite;
    }
    
    @keyframes aiPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.8); }
    }
    
    .progress-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--glass-border);
      border-top-color: var(--neon-purple);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin { to { transform: rotate(360deg); } }
    
    .progress-percent {
      font-family: 'JetBrains Mono', monospace;
      font-size: 18px;
      font-weight: 600;
      color: var(--neon-purple);
      text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
    }
    
    .progress-bar {
      height: 12px;
      background: var(--glass-bg);
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 36px;
      border: 1px solid var(--glass-border);
    }
    
    .progress-fill {
      height: 100%;
      background: var(--gradient-aurora);
      border-radius: 6px;
      transition: width 0.3s ease;
      box-shadow: var(--glow-purple);
      position: relative;
      overflow: hidden;
    }
    
    .progress-fill::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: shimmer 1.5s ease-in-out infinite;
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    .progress-steps {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .progress-step {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 15px;
      color: var(--text-dim);
      padding: 14px 18px;
      border-radius: var(--radius-lg);
      background: var(--glass-bg);
      border: 1px solid transparent;
      transition: all 0.25s ease;
    }
    
    .progress-step.complete { 
      color: var(--neon-green);
      border-color: rgba(34, 197, 94, 0.2);
      background: rgba(34, 197, 94, 0.05);
    }
    
    .progress-step.active { 
      color: var(--neon-purple);
      border-color: rgba(168, 85, 247, 0.3);
      background: rgba(168, 85, 247, 0.08);
      box-shadow: var(--glow-subtle);
    }
    
    .progress-step i { width: 24px; text-align: center; font-size: 18px; }
    
    /* ============================================
       FORM ELEMENTS
       ============================================ */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .form-group.full { grid-column: 1 / -1; }
    
    .form-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .form-label i {
      color: var(--neon-purple);
      font-size: 12px;
    }
    
    .form-input, .form-textarea, .form-select {
      padding: 16px 20px;
      background: var(--bg-tertiary);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      color: var(--text-primary);
      font-size: 15px;
      font-family: inherit;
      transition: all 0.25s ease;
    }
    
    .form-input:focus, .form-textarea:focus, .form-select:focus {
      outline: none;
      border-color: var(--neon-purple);
      box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.1), var(--glow-subtle);
    }
    
    .form-input::placeholder, .form-textarea::placeholder {
      color: var(--text-dim);
    }
    
    .form-textarea {
      min-height: 120px;
      resize: vertical;
      line-height: 1.7;
    }
    
    /* ============================================
       EXPERIENCE ENTRY
       ============================================ */
    .experience-entry {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      padding: 28px;
      margin-bottom: 24px;
      position: relative;
      transition: all 0.25s ease;
    }
    
    .experience-entry:hover {
      border-color: var(--glass-border-hover);
    }
    
    .experience-entry::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: var(--gradient-aurora);
      border-radius: 4px 0 0 4px;
    }
    
    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }
    
    .experience-number {
      width: 44px;
      height: 44px;
      background: var(--gradient-purple);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
      box-shadow: var(--glow-purple);
    }
    
    .experience-actions { display: flex; gap: 10px; }
    
    .btn-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s ease;
    }
    
    .btn-icon:hover {
      background: var(--glass-bg-hover);
      color: var(--text-primary);
    }
    
    .btn-icon.danger:hover {
      background: rgba(239, 68, 68, 0.12);
      color: var(--neon-red);
      border-color: rgba(239, 68, 68, 0.3);
    }
    
    /* ============================================
       METRICS GRID
       ============================================ */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-top: 24px;
    }
    
    .metric-input {
      background: var(--bg-tertiary);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: 20px;
      text-align: center;
      transition: all 0.25s ease;
    }
    
    .metric-input:hover, .metric-input:focus-within {
      border-color: var(--neon-purple);
      box-shadow: var(--glow-subtle);
    }
    
    .metric-input input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      text-align: center;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: var(--neon-purple);
      margin-bottom: 6px;
    }
    
    .metric-input input::placeholder {
      color: var(--text-dim);
      font-size: 20px;
    }
    
    .metric-input-label {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    /* ============================================
       BUTTONS
       ============================================ */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 16px 32px;
      border-radius: var(--radius-lg);
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      text-decoration: none;
      position: relative;
      overflow: hidden;
    }
    
    .btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%);
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    
    .btn:hover::before { opacity: 1; }
    
    .btn-primary {
      background: var(--gradient-purple);
      color: white;
      box-shadow: var(--glow-purple), var(--shadow-md);
    }
    
    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 50px rgba(168, 85, 247, 0.5), var(--shadow-lg);
    }
    
    .btn-secondary {
      background: var(--glass-bg);
      color: var(--text-primary);
      border: 1px solid var(--glass-border);
    }
    
    .btn-secondary:hover {
      background: var(--glass-bg-hover);
      border-color: var(--neon-purple);
    }
    
    .btn-pink {
      background: var(--gradient-pink);
      color: white;
      box-shadow: var(--glow-pink);
    }
    
    .btn-cyan {
      background: var(--gradient-cyan);
      color: white;
      box-shadow: var(--glow-cyan);
    }
    
    .btn-add {
      width: 100%;
      padding: 20px;
      background: var(--glass-bg);
      border: 2px dashed var(--glass-border);
      border-radius: var(--radius-xl);
      color: var(--text-muted);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;
    }
    
    .btn-add:hover {
      border-color: var(--neon-purple);
      color: var(--text-primary);
      background: rgba(168, 85, 247, 0.05);
    }
    
    /* ============================================
       TIMELINE - Premium Design
       ============================================ */
    .timeline {
      position: relative;
      padding-left: 48px;
    }
    
    .timeline::before {
      content: '';
      position: absolute;
      left: 14px;
      top: 0;
      bottom: 0;
      width: 3px;
      background: linear-gradient(180deg, var(--neon-purple), var(--neon-pink), var(--neon-cyan));
      border-radius: 2px;
      box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
    }
    
    .timeline-entry {
      position: relative;
      margin-bottom: 32px;
      padding: 28px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      transition: all 0.25s ease;
    }
    
    .timeline-entry:hover {
      border-color: var(--glass-border-hover);
      box-shadow: var(--glow-subtle);
    }
    
    .timeline-entry::before {
      content: '';
      position: absolute;
      left: -42px;
      top: 32px;
      width: 20px;
      height: 20px;
      background: var(--gradient-purple);
      border-radius: 50%;
      border: 4px solid var(--bg-primary);
      box-shadow: var(--glow-purple);
    }
    
    .timeline-company {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    
    .timeline-role {
      color: var(--neon-purple);
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 10px;
    }
    
    .timeline-dates {
      display: inline-block;
      padding: 6px 16px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 30px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 18px;
    }
    
    .timeline-desc {
      color: var(--text-secondary);
      line-height: 1.8;
    }
    
    /* Preview Metrics */
    .preview-metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-top: 24px;
    }
    
    .preview-metric {
      background: var(--bg-tertiary);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: 20px;
      text-align: center;
      transition: all 0.25s ease;
    }
    
    .preview-metric:hover {
      border-color: var(--neon-purple);
      transform: translateY(-2px);
    }
    
    .preview-metric-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 700;
      background: var(--gradient-aurora);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .preview-metric-label {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-top: 6px;
      letter-spacing: 0.5px;
    }
    
    /* ============================================
       DAY IN LIFE
       ============================================ */
    .day-in-life {
      margin-top: 28px;
      padding: 24px;
      background: var(--bg-tertiary);
      border-radius: var(--radius-xl);
      border: 1px solid var(--glass-border);
    }
    
    .day-in-life h4 {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 20px;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .day-in-life h4 i {
      color: var(--neon-gold);
    }
    
    .day-item {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .day-time {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: var(--neon-purple);
      width: 90px;
      flex-shrink: 0;
      font-weight: 500;
    }
    
    .day-input {
      flex: 1;
      padding: 12px 16px;
      background: var(--bg-secondary);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      font-size: 14px;
      transition: all 0.25s ease;
    }
    
    .day-input:focus {
      outline: none;
      border-color: var(--neon-purple);
      box-shadow: var(--glow-subtle);
    }
    
    /* ============================================
       RESPONSIVE
       ============================================ */
    @media (max-width: 1400px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
    
    @media (max-width: 1200px) {
      .metrics-grid, .preview-metrics { grid-template-columns: repeat(2, 1fr); }
    }
    
    @media (max-width: 768px) {
      .sidebar { display: none; }
      .stats-grid { grid-template-columns: 1fr; }
      .form-grid { grid-template-columns: 1fr; }
      .content { padding: 20px; }
    }
    
    /* ============================================
       ANIMATIONS
       ============================================ */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .fade-in { animation: fadeIn 0.5s ease forwards; }
    
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    .slide-in { animation: slideIn 0.4s ease forwards; }
    
    /* Success state */
    .success-flash {
      animation: successPulse 0.5s ease;
    }
    
    @keyframes successPulse {
      0%, 100% { box-shadow: var(--shadow-md); }
      50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.5); }
    }
  </style>
</head>
<body>
  <!-- Animated Background -->
  <div class="cosmic-bg">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
    <div class="grid-overlay"></div>
  </div>
  
  <div id="root"></div>
  
  <script type="text/babel">
    const { useState, useEffect, useRef } = React;
    
    // ============================================
    // REAL RESUME PARSER (Client-side extraction)
    // ============================================
    const ResumeParser = {
      async parsePDF(file) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\\n';
        }
        return fullText;
      },
      
      async parseDOCX(file) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      },
      
      async parseTXT(file) {
        return await file.text();
      }
    };
    
    // ============================================
    // VIEWS
    // ============================================
    const VIEWS = {
      DASHBOARD: 'dashboard',
      UPLOAD: 'upload',
      BUILDER: 'builder',
      PREVIEW: 'preview'
    };
    
    // ============================================
    // MAIN APP
    // ============================================
    const App = () => {
      const [view, setView] = useState(VIEWS.DASHBOARD);
      const [profile, setProfile] = useState(null);
      const [isProcessing, setIsProcessing] = useState(false);
      const [progress, setProgress] = useState(0);
      const [progressSteps, setProgressSteps] = useState([
        { label: 'Reading document...', status: 'pending' },
        { label: 'Extracting text content...', status: 'pending' },
        { label: 'AI analyzing resume structure...', status: 'pending' },
        { label: 'Identifying work experiences...', status: 'pending' },
        { label: 'Generating day-in-life insights...', status: 'pending' },
        { label: 'Building your profile...', status: 'pending' }
      ]);
      const [activeSection, setActiveSection] = useState('basics');
      const [rawText, setRawText] = useState('');
      
      // REAL file upload handler with AI parsing
      const handleFileUpload = async (file) => {
        setIsProcessing(true);
        setProgress(0);
        setView(VIEWS.UPLOAD);
        
        const steps = [...progressSteps];
        
        try {
          // Step 1: Reading file
          steps[0].status = 'active';
          setProgressSteps([...steps]);
          await new Promise(r => setTimeout(r, 400));
          
          let text = '';
          const fileType = file.name.split('.').pop().toLowerCase();
          
          // Step 2: Extract text based on file type
          steps[0].status = 'complete';
          steps[1].status = 'active';
          setProgressSteps([...steps]);
          setProgress(15);
          
          if (fileType === 'pdf') {
            text = await ResumeParser.parsePDF(file);
          } else if (fileType === 'docx' || fileType === 'doc') {
            text = await ResumeParser.parseDOCX(file);
          } else {
            text = await ResumeParser.parseTXT(file);
          }
          
          setRawText(text);
          console.log('Extracted text:', text.substring(0, 1000));
          
          // Step 3: AI Analysis
          steps[1].status = 'complete';
          steps[2].status = 'active';
          setProgressSteps([...steps]);
          setProgress(30);
          
          // Call Gemini AI for intelligent parsing
          let aiParsed = null;
          try {
            const response = await fetch('/api/parse-resume', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text })
            });
            
            if (response.ok) {
              aiParsed = await response.json();
              console.log('AI Parsed data:', aiParsed);
            }
          } catch (aiError) {
            console.warn('AI parsing failed, using fallback:', aiError);
          }
          
          // Step 4: Identifying experiences
          steps[2].status = 'complete';
          steps[3].status = 'active';
          setProgressSteps([...steps]);
          setProgress(55);
          await new Promise(r => setTimeout(r, 400));
          
          // Step 5: Generating insights
          steps[3].status = 'complete';
          steps[4].status = 'active';
          setProgressSteps([...steps]);
          setProgress(75);
          await new Promise(r => setTimeout(r, 400));
          
          // Step 6: Building profile
          steps[4].status = 'complete';
          steps[5].status = 'active';
          setProgressSteps([...steps]);
          setProgress(90);
          
          // Build final profile from AI response or fallback
          let finalProfile;
          
          if (aiParsed && !aiParsed.error) {
            // Transform AI response to our format
            finalProfile = {
              basics: {
                name: aiParsed.basics?.name || '',
                title: aiParsed.basics?.title || '',
                tagline: aiParsed.basics?.tagline || '',
                email: aiParsed.basics?.email || '',
                phone: aiParsed.basics?.phone || '',
                location: aiParsed.basics?.location || '',
                linkedin: aiParsed.basics?.linkedin || '',
                website: aiParsed.basics?.website || ''
              },
              experience: (aiParsed.experience || []).map((exp, i) => ({
                id: Date.now() + i,
                company: exp.company || '',
                role: exp.role || '',
                startDate: exp.startDate || '',
                endDate: exp.endDate || '',
                description: exp.description || '',
                tasks: exp.tasks || '',
                dayInLife: exp.dayInLife || [
                  { time: '9:00 AM', activity: '' },
                  { time: '11:00 AM', activity: '' },
                  { time: '1:00 PM', activity: '' },
                  { time: '3:00 PM', activity: '' },
                  { time: '5:00 PM', activity: '' }
                ],
                metrics: exp.metrics || [
                  { value: '', label: 'Impact' },
                  { value: '', label: 'Growth' },
                  { value: '', label: 'Efficiency' },
                  { value: '', label: 'Team' }
                ],
                toxicity: 5
              })),
              skills: aiParsed.skills || [],
              education: aiParsed.education || [],
              achievements: (aiParsed.achievements || []).map((a, i) => ({
                id: Date.now() + i + 1000,
                title: a.title || '',
                description: a.description || ''
              })),
              certifications: aiParsed.certifications || [],
              awards: [],
              reviews: [],
              payHistory: [],
              projects: [],
              photos: [],
              videos: []
            };
          } else {
            // Fallback to basic parsing
            finalProfile = fallbackParse(text);
          }
          
          steps[5].status = 'complete';
          setProgressSteps([...steps]);
          setProgress(100);
          
          await new Promise(r => setTimeout(r, 500));
          
          setProfile(finalProfile);
          setIsProcessing(false);
          setView(VIEWS.BUILDER);
          
        } catch (error) {
          console.error('Error parsing resume:', error);
          alert('Error parsing resume: ' + error.message);
          setIsProcessing(false);
          setView(VIEWS.DASHBOARD);
        }
      };
      
      // Fallback parser when AI fails
      const fallbackParse = (text) => {
        const lines = text.split('\\n').map(l => l.trim()).filter(l => l);
        
        // Extract email
        const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/);
        const email = emailMatch ? emailMatch[0] : '';
        
        // Extract phone
        const phoneMatch = text.match(/(?:\\+?1[-.]?)?\\(?\\d{3}\\)?[-.]?\\d{3}[-.]?\\d{4}/);
        const phone = phoneMatch ? phoneMatch[0] : '';
        
        // Extract name (first substantial line)
        let name = '';
        for (const line of lines.slice(0, 5)) {
          if (line.length > 2 && line.length < 50 && !line.includes('@')) {
            name = line;
            break;
          }
        }
        
        return {
          basics: { name, title: '', tagline: '', email, phone, location: '', linkedin: '', website: '' },
          experience: [{
            id: Date.now(),
            company: 'Your Company',
            role: 'Your Role',
            startDate: '',
            endDate: 'Present',
            description: 'Add your job description...',
            tasks: '',
            dayInLife: [
              { time: '9:00 AM', activity: '' },
              { time: '11:00 AM', activity: '' },
              { time: '1:00 PM', activity: '' },
              { time: '3:00 PM', activity: '' },
              { time: '5:00 PM', activity: '' }
            ],
            metrics: [
              { value: '', label: 'Impact' },
              { value: '', label: 'Growth' },
              { value: '', label: 'Efficiency' },
              { value: '', label: 'Team' }
            ],
            toxicity: 5
          }],
          skills: [],
          education: [],
          achievements: [],
          certifications: [],
          awards: [],
          reviews: [],
          payHistory: [],
          projects: [],
          photos: [],
          videos: []
        };
      };
      
      return (
        <div className="app">
          <Sidebar 
            view={view} 
            setView={setView} 
            profile={profile}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
          
          <div className="main">
            <Header view={view} profile={profile} />
            
            <div className="content">
              {view === VIEWS.DASHBOARD && (
                <Dashboard setView={setView} profile={profile} />
              )}
              
              {view === VIEWS.UPLOAD && (
                <UploadView 
                  onUpload={handleFileUpload}
                  isProcessing={isProcessing}
                  progress={progress}
                  progressSteps={progressSteps}
                />
              )}
              
              {view === VIEWS.BUILDER && profile && (
                <BuilderView 
                  profile={profile}
                  setProfile={setProfile}
                  activeSection={activeSection}
                  rawText={rawText}
                />
              )}
              
              {view === VIEWS.PREVIEW && profile && (
                <PreviewView profile={profile} setView={setView} />
              )}
            </div>
          </div>
        </div>
      );
    };
    
    // ============================================
    // SIDEBAR
    // ============================================
    const Sidebar = ({ view, setView, profile, activeSection, setActiveSection }) => {
      const mainNav = [
        { id: VIEWS.DASHBOARD, icon: 'fa-th-large', label: 'Dashboard' },
        { id: VIEWS.UPLOAD, icon: 'fa-cloud-upload-alt', label: 'Upload Resume' }
      ];
      
      const builderNav = [
        { id: 'basics', icon: 'fa-user', label: 'Basic Info' },
        { id: 'experience', icon: 'fa-briefcase', label: 'Experience' },
        { id: 'skills', icon: 'fa-code', label: 'Skills' },
        { id: 'achievements', icon: 'fa-trophy', label: 'Achievements' },
        { id: 'awards', icon: 'fa-award', label: 'Awards' },
        { id: 'reviews', icon: 'fa-star', label: 'Reviews' },
        { id: 'pay', icon: 'fa-dollar-sign', label: 'Pay History' },
        { id: 'projects', icon: 'fa-project-diagram', label: 'Projects' },
        { id: 'media', icon: 'fa-image', label: 'Media' }
      ];
      
      return (
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-icon">⚡</div>
            <span className="logo-text">Webume</span>
          </div>
          
          <nav className="nav-section">
            <div className="nav-label">Main Menu</div>
            <div className="nav-items">
              {mainNav.map(item => (
                <button
                  key={item.id}
                  className={"nav-item" + (view === item.id ? " active" : "")}
                  onClick={() => setView(item.id)}
                >
                  <i className={"fas " + item.icon}></i>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
          
          {profile && (
            <nav className="nav-section">
              <div className="nav-label">Profile Builder</div>
              <div className="nav-items">
                {builderNav.map(item => (
                  <button
                    key={item.id}
                    className={"nav-item" + (view === VIEWS.BUILDER && activeSection === item.id ? " active" : "")}
                    onClick={() => { setView(VIEWS.BUILDER); setActiveSection(item.id); }}
                  >
                    <i className={"fas " + item.icon}></i>
                    <span>{item.label}</span>
                  </button>
                ))}
                <button
                  className={"nav-item" + (view === VIEWS.PREVIEW ? " active" : "")}
                  onClick={() => setView(VIEWS.PREVIEW)}
                >
                  <i className="fas fa-eye"></i>
                  <span>Preview</span>
                  <span className="nav-badge">Live</span>
                </button>
              </div>
            </nav>
          )}
          
          {profile && (
            <div className="sidebar-profile">
              <div className="sidebar-avatar">
                {profile.basics.name ? profile.basics.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?'}
              </div>
              <div className="sidebar-info">
                <div className="sidebar-name">{profile.basics.name || 'Your Name'}</div>
                <div className="sidebar-role">{profile.basics.title || 'Your Title'}</div>
              </div>
            </div>
          )}
        </aside>
      );
    };
    
    // ============================================
    // HEADER
    // ============================================
    const Header = ({ view, profile }) => {
      const titles = {
        [VIEWS.DASHBOARD]: 'Dashboard',
        [VIEWS.UPLOAD]: 'Upload Resume',
        [VIEWS.BUILDER]: 'Profile Builder',
        [VIEWS.PREVIEW]: 'Live Preview'
      };
      
      return (
        <header className="header">
          <h1 className="header-title">{titles[view]}</h1>
          
          <div className="header-actions">
            <div className="header-search">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search..." />
            </div>
            <button className="header-btn">
              <i className="fas fa-bell"></i>
              <span className="badge">3</span>
            </button>
            <button className="header-btn">
              <i className="fas fa-cog"></i>
            </button>
          </div>
        </header>
      );
    };
    
    // ============================================
    // DASHBOARD
    // ============================================
    const Dashboard = ({ setView, profile }) => {
      const stats = [
        { icon: 'fa-briefcase', value: profile?.experience?.length || 0, label: 'Experiences', change: '+2', up: true, color: 'purple' },
        { icon: 'fa-trophy', value: profile?.achievements?.length || 0, label: 'Achievements', change: '+5', up: true, color: 'pink' },
        { icon: 'fa-code', value: profile?.skills?.length || 0, label: 'Skills', change: '+8', up: true, color: 'cyan' },
        { icon: 'fa-chart-line', value: '94%', label: 'Profile Score', change: '+12%', up: true, color: 'gold' }
      ];
      
      return (
        <div className="fade-in">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className={"stat-card " + stat.color}>
                <div className="stat-icon">
                  <i className={"fas " + stat.icon}></i>
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className={"stat-change " + (stat.up ? "up" : "down")}>
                  <i className={"fas fa-arrow-" + (stat.up ? "up" : "down")}></i>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>
          
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fas fa-rocket"></i>
                Quick Actions
              </h2>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => setView(VIEWS.UPLOAD)}>
                <i className="fas fa-upload"></i>
                Upload Resume
              </button>
              {profile && (
                <>
                  <button className="btn btn-secondary" onClick={() => setView(VIEWS.BUILDER)}>
                    <i className="fas fa-edit"></i>
                    Edit Profile
                  </button>
                  <button className="btn btn-cyan" onClick={() => setView(VIEWS.PREVIEW)}>
                    <i className="fas fa-eye"></i>
                    Preview
                  </button>
                </>
              )}
            </div>
          </div>
          
          {!profile && (
            <div className="card" style={{ marginTop: '32px', textAlign: 'center', padding: '80px' }}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                margin: '0 auto 28px',
                background: 'var(--gradient-aurora)',
                borderRadius: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                boxShadow: 'var(--glow-purple)'
              }}>📄</div>
              <h3 style={{ fontFamily: 'Space Grotesk', fontSize: '28px', marginBottom: '12px' }}>No Resume Uploaded</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '16px', maxWidth: '400px', margin: '0 auto 32px' }}>
                Upload your resume to get started. Our AI will extract all your information and build your profile automatically.
              </p>
              <button className="btn btn-primary" onClick={() => setView(VIEWS.UPLOAD)}>
                <i className="fas fa-upload"></i>
                Upload Your Resume
              </button>
            </div>
          )}
        </div>
      );
    };
    
    // ============================================
    // UPLOAD VIEW
    // ============================================
    const UploadView = ({ onUpload, isProcessing, progress, progressSteps }) => {
      const [isDragOver, setIsDragOver] = useState(false);
      const fileInputRef = useRef(null);
      
      const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) onUpload(file);
      };
      
      const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) onUpload(file);
      };
      
      if (isProcessing) {
        return (
          <div className="card fade-in">
            <div className="progress-container">
              <div className="progress-header">
                <div className="progress-title">
                  <div className="progress-spinner"></div>
                  <span>Analyzing Your Resume</span>
                  <div className="ai-indicator">
                    <div className="ai-dot"></div>
                    Gemini AI
                  </div>
                </div>
                <span className="progress-percent">{Math.round(progress)}%</span>
              </div>
              
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: progress + '%' }}></div>
              </div>
              
              <div className="progress-steps">
                {progressSteps.map((step, i) => (
                  <div key={i} className={"progress-step " + step.status}>
                    <i className={
                      step.status === 'complete' ? 'fas fa-check-circle' :
                      step.status === 'active' ? 'fas fa-circle-notch fa-spin' :
                      'far fa-circle'
                    }></i>
                    {step.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      
      return (
        <div className="card fade-in">
          <div className="card-header">
            <h2 className="card-title">
              <i className="fas fa-file-upload"></i>
              Upload Your Resume
            </h2>
            <div className="ai-indicator">
              <div className="ai-dot"></div>
              AI-Powered
            </div>
          </div>
          
          <div 
            className={"upload-zone" + (isDragOver ? " drag-over" : "")}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleChange}
              accept=".pdf,.docx,.doc,.txt"
              style={{ display: 'none' }}
            />
            
            <div className="upload-icon">
              <i className="fas fa-cloud-upload-alt"></i>
            </div>
            
            <h3 className="upload-title">Drop your resume here</h3>
            <p className="upload-desc">or click to browse files</p>
            
            <div className="upload-formats">
              <span className="format-tag"><i className="fas fa-file-pdf"></i> PDF</span>
              <span className="format-tag"><i className="fas fa-file-word"></i> DOCX</span>
              <span className="format-tag"><i className="fas fa-file-alt"></i> TXT</span>
            </div>
          </div>
          
          <div style={{ marginTop: '28px', padding: '20px', background: 'var(--glass-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-shield-alt" style={{ color: 'var(--neon-cyan)' }}></i>
              <span><strong>AI-Powered Extraction:</strong> Gemini AI analyzes your resume and extracts all information including experiences, skills, and achievements automatically.</span>
            </p>
          </div>
        </div>
      );
    };
    
    // ============================================
    // BUILDER VIEW
    // ============================================
    const BuilderView = ({ profile, setProfile, activeSection, rawText }) => {
      const updateBasics = (field, value) => {
        setProfile(prev => ({
          ...prev,
          basics: { ...prev.basics, [field]: value }
        }));
      };
      
      const updateExperience = (experiences) => {
        setProfile(prev => ({ ...prev, experience: experiences }));
      };
      
      const updateList = (key, items) => {
        setProfile(prev => ({ ...prev, [key]: items }));
      };
      
      return (
        <div className="fade-in">
          {activeSection === 'basics' && (
            <BasicsEditor profile={profile} updateBasics={updateBasics} rawText={rawText} />
          )}
          
          {activeSection === 'experience' && (
            <ExperienceEditor 
              experience={profile.experience}
              setExperience={updateExperience}
            />
          )}
          
          {activeSection === 'skills' && (
            <SkillsEditor
              skills={profile.skills}
              setSkills={(skills) => updateList('skills', skills)}
            />
          )}
          
          {activeSection === 'achievements' && (
            <ListEditor
              title="Achievements"
              icon="fa-trophy"
              items={profile.achievements}
              setItems={(items) => updateList('achievements', items)}
              fields={[
                { key: 'title', label: 'Title', placeholder: 'Achievement title' },
                { key: 'description', label: 'Description', placeholder: 'Describe the achievement', type: 'textarea' }
              ]}
            />
          )}
          
          {activeSection === 'awards' && (
            <ListEditor
              title="Awards"
              icon="fa-award"
              items={profile.awards}
              setItems={(items) => updateList('awards', items)}
              fields={[
                { key: 'title', label: 'Award Name', placeholder: 'Award title' },
                { key: 'org', label: 'Organization', placeholder: 'Awarding organization' },
                { key: 'year', label: 'Year', placeholder: '2024' }
              ]}
            />
          )}
          
          {activeSection === 'reviews' && (
            <ListEditor
              title="Reviews & Testimonials"
              icon="fa-star"
              items={profile.reviews}
              setItems={(items) => updateList('reviews', items)}
              fields={[
                { key: 'quote', label: 'Quote', placeholder: 'What they said about you', type: 'textarea' },
                { key: 'author', label: 'Author', placeholder: 'Person name' },
                { key: 'role', label: 'Role/Company', placeholder: 'CEO at Company' }
              ]}
            />
          )}
          
          {activeSection === 'pay' && (
            <ListEditor
              title="Pay History"
              icon="fa-dollar-sign"
              items={profile.payHistory}
              setItems={(items) => updateList('payHistory', items)}
              fields={[
                { key: 'year', label: 'Year', placeholder: '2024' },
                { key: 'base', label: 'Base Salary', placeholder: '$150,000' },
                { key: 'bonus', label: 'Bonus', placeholder: '$30,000' },
                { key: 'equity', label: 'Equity', placeholder: '$50,000' }
              ]}
            />
          )}
          
          {activeSection === 'projects' && (
            <ListEditor
              title="Projects"
              icon="fa-project-diagram"
              items={profile.projects}
              setItems={(items) => updateList('projects', items)}
              fields={[
                { key: 'name', label: 'Project Name', placeholder: 'Project title' },
                { key: 'description', label: 'Description', placeholder: 'What you built', type: 'textarea' },
                { key: 'url', label: 'URL', placeholder: 'https://...' },
                { key: 'tech', label: 'Technologies', placeholder: 'React, Node.js, etc.' }
              ]}
            />
          )}
          
          {activeSection === 'media' && (
            <MediaEditor 
              photos={profile.photos}
              videos={profile.videos}
              setPhotos={(p) => updateList('photos', p)}
              setVideos={(v) => updateList('videos', v)}
            />
          )}
        </div>
      );
    };
    
    // ============================================
    // BASICS EDITOR
    // ============================================
    const BasicsEditor = ({ profile, updateBasics, rawText }) => (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <i className="fas fa-user"></i>
            Basic Information
          </h2>
        </div>
        
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label"><i className="fas fa-id-card"></i> Full Name</label>
            <input 
              type="text"
              className="form-input"
              value={profile.basics.name}
              onChange={(e) => updateBasics('name', e.target.value)}
              placeholder="John Smith"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label"><i className="fas fa-briefcase"></i> Job Title</label>
            <input 
              type="text"
              className="form-input"
              value={profile.basics.title}
              onChange={(e) => updateBasics('title', e.target.value)}
              placeholder="Senior Product Manager"
            />
          </div>
          
          <div className="form-group full">
            <label className="form-label"><i className="fas fa-quote-left"></i> Professional Tagline</label>
            <input 
              type="text"
              className="form-input"
              value={profile.basics.tagline}
              onChange={(e) => updateBasics('tagline', e.target.value)}
              placeholder="10+ years driving product innovation and growth"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label"><i className="fas fa-envelope"></i> Email</label>
            <input 
              type="email"
              className="form-input"
              value={profile.basics.email}
              onChange={(e) => updateBasics('email', e.target.value)}
              placeholder="john@email.com"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label"><i className="fas fa-phone"></i> Phone</label>
            <input 
              type="tel"
              className="form-input"
              value={profile.basics.phone}
              onChange={(e) => updateBasics('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label"><i className="fas fa-map-marker-alt"></i> Location</label>
            <input 
              type="text"
              className="form-input"
              value={profile.basics.location}
              onChange={(e) => updateBasics('location', e.target.value)}
              placeholder="San Francisco, CA"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label"><i className="fab fa-linkedin"></i> LinkedIn</label>
            <input 
              type="text"
              className="form-input"
              value={profile.basics.linkedin}
              onChange={(e) => updateBasics('linkedin', e.target.value)}
              placeholder="linkedin.com/in/yourprofile"
            />
          </div>
        </div>
        
        {rawText && (
          <div style={{ marginTop: '28px' }}>
            <details>
              <summary style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>
                <i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i>
                View Extracted Raw Text
              </summary>
              <pre style={{ 
                marginTop: '16px', 
                padding: '20px', 
                background: 'var(--bg-tertiary)', 
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                maxHeight: '250px',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                {rawText}
              </pre>
            </details>
          </div>
        )}
      </div>
    );
    
    // ============================================
    // SKILLS EDITOR
    // ============================================
    const SkillsEditor = ({ skills, setSkills }) => {
      const [newSkill, setNewSkill] = useState('');
      
      const addSkill = () => {
        if (newSkill.trim()) {
          setSkills([...skills, newSkill.trim()]);
          setNewSkill('');
        }
      };
      
      const removeSkill = (index) => {
        setSkills(skills.filter((_, i) => i !== index));
      };
      
      return (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <i className="fas fa-code"></i>
              Skills
            </h2>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {skills.length} skills
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input
              type="text"
              className="form-input"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              placeholder="Add a skill..."
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={addSkill}>
              <i className="fas fa-plus"></i>
              Add
            </button>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {skills.map((skill, index) => (
              <div key={index} style={{
                padding: '12px 20px',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.25s ease'
              }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{skill}</span>
                <button
                  onClick={() => removeSkill(index)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    };
    
    // ============================================
    // EXPERIENCE EDITOR
    // ============================================
    const ExperienceEditor = ({ experience, setExperience }) => {
      const addExp = () => {
        setExperience([...experience, {
          id: Date.now(),
          company: '',
          role: '',
          startDate: '',
          endDate: '',
          description: '',
          tasks: '',
          dayInLife: [
            { time: '9:00 AM', activity: '' },
            { time: '11:00 AM', activity: '' },
            { time: '1:00 PM', activity: '' },
            { time: '3:00 PM', activity: '' },
            { time: '5:00 PM', activity: '' }
          ],
          metrics: [
            { value: '', label: 'Impact' },
            { value: '', label: 'Growth' },
            { value: '', label: 'Efficiency' },
            { value: '', label: 'Team' }
          ],
          toxicity: 5
        }]);
      };
      
      const updateExp = (index, field, value) => {
        const updated = [...experience];
        updated[index] = { ...updated[index], [field]: value };
        setExperience(updated);
      };
      
      const removeExp = (index) => {
        setExperience(experience.filter((_, i) => i !== index));
      };
      
      const updateMetric = (expIndex, metricIndex, field, value) => {
        const updated = [...experience];
        updated[expIndex].metrics[metricIndex][field] = value;
        setExperience(updated);
      };
      
      const updateDayInLife = (expIndex, dayIndex, value) => {
        const updated = [...experience];
        updated[expIndex].dayInLife[dayIndex].activity = value;
        setExperience(updated);
      };
      
      return (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <i className="fas fa-briefcase"></i>
              Work Experience
            </h2>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {experience.length} entries
            </span>
          </div>
          
          {experience.map((exp, index) => (
            <div key={exp.id} className="experience-entry slide-in">
              <div className="experience-header">
                <div className="experience-number">{index + 1}</div>
                <div className="experience-actions">
                  <button className="btn-icon danger" onClick={() => removeExp(index)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={exp.company}
                    onChange={(e) => updateExp(index, 'company', e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={exp.role}
                    onChange={(e) => updateExp(index, 'role', e.target.value)}
                    placeholder="Job Title"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={exp.startDate}
                    onChange={(e) => updateExp(index, 'startDate', e.target.value)}
                    placeholder="Jan 2020"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={exp.endDate}
                    onChange={(e) => updateExp(index, 'endDate', e.target.value)}
                    placeholder="Present"
                  />
                </div>
                
                <div className="form-group full">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-textarea"
                    value={exp.description}
                    onChange={(e) => updateExp(index, 'description', e.target.value)}
                    placeholder="Describe your role and key accomplishments..."
                  />
                </div>
                
                <div className="form-group full">
                  <label className="form-label">
                    <i className="fas fa-shield-alt"></i> Truth Vault - Toxicity: {exp.toxicity}/10
                  </label>
                  <input 
                    type="range"
                    min="1"
                    max="10"
                    value={exp.toxicity}
                    onChange={(e) => updateExp(index, 'toxicity', parseInt(e.target.value))}
                    style={{ 
                      width: '100%', 
                      accentColor: exp.toxicity <= 3 ? 'var(--neon-green)' : exp.toxicity <= 6 ? 'var(--neon-gold)' : 'var(--neon-red)'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '8px' }}>
                    <span style={{ color: 'var(--neon-green)' }}>Great Culture</span>
                    <span style={{ color: 'var(--neon-red)' }}>Toxic</span>
                  </div>
                </div>
              </div>
              
              {/* Day in Life */}
              <div className="day-in-life">
                <h4>
                  <i className="fas fa-sun"></i>
                  A Day in the Life
                </h4>
                {exp.dayInLife.map((item, dayIndex) => (
                  <div key={dayIndex} className="day-item">
                    <span className="day-time">{item.time}</span>
                    <input 
                      type="text"
                      className="day-input"
                      value={item.activity}
                      onChange={(e) => updateDayInLife(index, dayIndex, e.target.value)}
                      placeholder="What did you typically do?"
                    />
                  </div>
                ))}
              </div>
              
              {/* Metrics */}
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fas fa-chart-line" style={{ color: 'var(--neon-cyan)' }}></i>
                  Impact Metrics
                </h4>
                <div className="metrics-grid">
                  {exp.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex} className="metric-input">
                      <input 
                        type="text"
                        value={metric.value}
                        onChange={(e) => updateMetric(index, metricIndex, 'value', e.target.value)}
                        placeholder="+40%"
                      />
                      <input 
                        type="text"
                        value={metric.label}
                        onChange={(e) => updateMetric(index, metricIndex, 'label', e.target.value)}
                        className="metric-input-label"
                        style={{ 
                          background: 'transparent', 
                          border: 'none', 
                          textAlign: 'center',
                          width: '100%',
                          color: 'var(--text-muted)',
                          outline: 'none'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          <button className="btn-add" onClick={addExp}>
            <i className="fas fa-plus"></i> Add Experience
          </button>
        </div>
      );
    };
    
    // ============================================
    // LIST EDITOR (Generic)
    // ============================================
    const ListEditor = ({ title, icon, items, setItems, fields }) => {
      const addItem = () => {
        const newItem = { id: Date.now() };
        fields.forEach(f => newItem[f.key] = '');
        setItems([...items, newItem]);
      };
      
      const updateItem = (index, field, value) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        setItems(updated);
      };
      
      const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
      };
      
      return (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <i className={"fas " + icon}></i>
              {title}
            </h2>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {items.length} entries
            </span>
          </div>
          
          {items.map((item, index) => (
            <div key={item.id} className="experience-entry slide-in">
              <div className="experience-header">
                <div className="experience-number">{index + 1}</div>
                <button className="btn-icon danger" onClick={() => removeItem(index)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              
              <div className="form-grid">
                {fields.map(field => (
                  <div key={field.key} className={"form-group" + (field.type === 'textarea' ? " full" : "")}>
                    <label className="form-label">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea 
                        className="form-textarea"
                        value={item[field.key] || ''}
                        onChange={(e) => updateItem(index, field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <input 
                        type="text"
                        className="form-input"
                        value={item[field.key] || ''}
                        onChange={(e) => updateItem(index, field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <button className="btn-add" onClick={addItem}>
            <i className="fas fa-plus"></i> Add {title.replace(/s$/, '')}
          </button>
        </div>
      );
    };
    
    // ============================================
    // MEDIA EDITOR
    // ============================================
    const MediaEditor = ({ photos, videos, setPhotos, setVideos }) => {
      const photoRef = useRef(null);
      const videoRef = useRef(null);
      
      const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = files.map(file => ({
          id: Date.now() + Math.random(),
          name: file.name,
          url: URL.createObjectURL(file)
        }));
        setPhotos([...photos, ...newPhotos]);
      };
      
      const handleVideoUpload = (e) => {
        const files = Array.from(e.target.files);
        const newVideos = files.map(file => ({
          id: Date.now() + Math.random(),
          name: file.name,
          url: URL.createObjectURL(file)
        }));
        setVideos([...videos, ...newVideos]);
      };
      
      return (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <i className="fas fa-image"></i>
              Photos & Videos
            </h2>
          </div>
          
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '20px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-camera" style={{ color: 'var(--neon-purple)' }}></i>
              Photos
            </h3>
            <input type="file" ref={photoRef} onChange={handlePhotoUpload} accept="image/*" multiple style={{ display: 'none' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
              {photos.map(photo => (
                <div key={photo.id} style={{ 
                  aspectRatio: '1', 
                  borderRadius: 'var(--radius-xl)', 
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid var(--glass-border)'
                }}>
                  <img src={photo.url} alt={photo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button 
                    onClick={() => setPhotos(photos.filter(p => p.id !== photo.id))}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.7)',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
              <button 
                onClick={() => photoRef.current?.click()}
                style={{
                  aspectRatio: '1',
                  borderRadius: 'var(--radius-xl)',
                  border: '2px dashed var(--glass-border)',
                  background: 'var(--glass-bg)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  color: 'var(--text-muted)',
                  transition: 'all 0.25s ease'
                }}
              >
                <i className="fas fa-plus" style={{ fontSize: '28px' }}></i>
                <span style={{ fontSize: '13px' }}>Add Photo</span>
              </button>
            </div>
          </div>
          
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '20px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-video" style={{ color: 'var(--neon-pink)' }}></i>
              Videos
            </h3>
            <input type="file" ref={videoRef} onChange={handleVideoUpload} accept="video/*" multiple style={{ display: 'none' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {videos.map(video => (
                <div key={video.id} style={{ 
                  aspectRatio: '16/9', 
                  borderRadius: 'var(--radius-xl)', 
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--bg-tertiary)'
                }}>
                  <video src={video.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button 
                    onClick={() => setVideos(videos.filter(v => v.id !== video.id))}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.7)',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
              <button 
                onClick={() => videoRef.current?.click()}
                style={{
                  aspectRatio: '16/9',
                  borderRadius: 'var(--radius-xl)',
                  border: '2px dashed var(--glass-border)',
                  background: 'var(--glass-bg)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  color: 'var(--text-muted)',
                  transition: 'all 0.25s ease'
                }}
              >
                <i className="fas fa-plus" style={{ fontSize: '28px' }}></i>
                <span style={{ fontSize: '13px' }}>Add Video</span>
              </button>
            </div>
          </div>
        </div>
      );
    };
    
    // ============================================
    // PREVIEW VIEW
    // ============================================
    const PreviewView = ({ profile, setView }) => (
      <div className="fade-in">
        <div className="card" style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: 'Space Grotesk', marginBottom: '6px', fontSize: '24px' }}>Live Preview</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>This is how your profile will appear to recruiters</p>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn btn-secondary" onClick={() => setView(VIEWS.BUILDER)}>
                <i className="fas fa-edit"></i> Edit
              </button>
              <button className="btn btn-primary">
                <i className="fas fa-share"></i> Publish
              </button>
            </div>
          </div>
        </div>
        
        {/* Profile Header */}
        <div className="card" style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 28px',
            borderRadius: '28px',
            background: 'var(--gradient-aurora)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '42px',
            fontWeight: '700',
            boxShadow: 'var(--glow-purple)'
          }}>
            {profile.basics.name ? profile.basics.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?'}
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '32px', marginBottom: '8px' }}>
            {profile.basics.name || 'Your Name'}
          </h2>
          <p style={{ color: 'var(--neon-purple)', fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
            {profile.basics.title || 'Your Title'}
          </p>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '16px' }}>
            {profile.basics.tagline || 'Your professional tagline'}
          </p>
          
          {profile.skills?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '24px' }}>
              {profile.skills.slice(0, 8).map((skill, i) => (
                <span key={i} style={{
                  padding: '8px 18px',
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-xl)',
                  fontSize: '13px',
                  color: 'var(--text-secondary)'
                }}>{skill}</span>
              ))}
            </div>
          )}
        </div>
        
        {/* Timeline */}
        {profile.experience.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fas fa-briefcase"></i>
                Career Timeline
              </h2>
            </div>
            
            <div className="timeline">
              {profile.experience.map((exp, index) => (
                <div key={exp.id} className="timeline-entry">
                  <h3 className="timeline-company">{exp.company || 'Company'}</h3>
                  <p className="timeline-role">{exp.role || 'Role'}</p>
                  <span className="timeline-dates">{exp.startDate || 'Start'} - {exp.endDate || 'End'}</span>
                  <p className="timeline-desc">{exp.description || 'Description...'}</p>
                  
                  {exp.metrics.some(m => m.value) && (
                    <div className="preview-metrics">
                      {exp.metrics.filter(m => m.value).map((metric, i) => (
                        <div key={i} className="preview-metric">
                          <div className="preview-metric-value">{metric.value}</div>
                          <div className="preview-metric-label">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {exp.dayInLife.some(d => d.activity) && (
                    <div className="day-in-life" style={{ marginTop: '24px' }}>
                      <h4><i className="fas fa-sun"></i> A Day in the Life</h4>
                      {exp.dayInLife.filter(d => d.activity).map((item, i) => (
                        <div key={i} className="day-item">
                          <span className="day-time">{item.time}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{item.activity}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
    
    // ============================================
    // RENDER
    // ============================================
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`)
})

export default app
