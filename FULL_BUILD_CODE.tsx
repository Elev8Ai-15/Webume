/**
 * ===============================================================
 * WEBUMÉ - AI-Powered Resume to Digital Profile Builder
 * ===============================================================
 * 
 * Full Build Code for Planning and Polishing
 * Generated: 2026-01-09
 * 
 * FEATURES IMPLEMENTED:
 * ✅ AI Resume Parsing (Gemini API) with rich profile extraction
 * ✅ Profile Photo Upload and Management
 * ✅ 4 Premium Template Options (Executive, Creative, Tech, Minimal)
 * ✅ Company Logo Auto-Search (Clearbit API)
 * ✅ Manual Logo Upload with Confirmation
 * ✅ Company Contact Info (auto-generated, editable)
 * ✅ LocalStorage Persistence (auto-save, manual save/clear)
 * ✅ Welcome Back Screen for Returning Users
 * ✅ Glassmorphism UI with Clear Background
 * ✅ 10+ Profile Sections (Basics, Experience, Skills, etc.)
 * ✅ Day-in-the-Life Schedule per Experience
 * ✅ Impact Metrics per Experience
 * ✅ Responsibilities List per Experience
 * 
 * TECH STACK:
 * - Hono (Backend Framework)
 * - React 18 (via CDN + Babel)
 * - Gemini AI API (Resume Parsing)
 * - Clearbit Logo API (Company Logos)
 * - PDF.js (PDF Parsing)
 * - Mammoth.js (DOCX Parsing)
 * - LocalStorage (Data Persistence)
 * 
 * AREAS FOR IMPROVEMENT:
 * - Move Gemini API key to environment variables
 * - Add server-side session storage (Cloudflare KV/D1)
 * - Implement user authentication
 * - Add PDF export functionality
 * - Add shareable public profile URLs
 * - Implement responsibilities editing in Experience section
 * - Add more template customization options
 * - Implement profile versioning/history
 * 
 * ===============================================================
 */

import { Hono } from 'hono'

const app = new Hono()

// ===============================================================
// CONFIGURATION
// ===============================================================

// TODO: Move to environment variable (wrangler secret put GEMINI_API_KEY)
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';

// ===============================================================
// API ENDPOINTS
// ===============================================================

/**
 * POST /api/parse-resume
 * Parses resume text using Gemini AI to extract structured profile data
 * 
 * Request Body: { text: string }
 * Response: ProfileData | { error: string }
 */
app.post('/api/parse-resume', async (c) => {
  try {
    const { text } = await c.req.json();
    
    const prompt = `You are an elite career analyst, executive resume writer, and talent acquisition expert with 20+ years experience. Analyze this resume DEEPLY and extract MAXIMUM value to create a comprehensive, impressive professional profile.

RESUME TEXT TO ANALYZE:
${text}

YOUR MISSION - Create the most detailed, impactful profile possible:

## BASICS EXTRACTION
- Extract the person's full name, most recent/impressive job title
- Create a POWERFUL tagline (like "Visionary Tech Leader Who Scaled Teams 10x and Drove $50M Revenue")
- Write a compelling 3-4 sentence executive summary highlighting their unique value proposition
- Extract all contact info (email, phone, location, LinkedIn, website)

## EXPERIENCE ANALYSIS (This is CRITICAL - be extremely thorough)
For EACH position, provide:

1. **DESCRIPTION** (5-8 sentences minimum):
   - Opening sentence: Core role and scope of responsibility
   - Key projects led or contributed to (name specific initiatives if mentioned)
   - Technologies, methodologies, tools used daily
   - Cross-functional collaboration and stakeholder management
   - Leadership scope (direct reports, team size, budget if applicable)
   - Major wins and accomplishments in this role
   - How they advanced the company's mission or bottom line
   - Closing sentence: Career growth or recognition received

2. **RESPONSIBILITIES** (8-12 bullet points):
   - Be SPECIFIC to this role and industry
   - Start each with strong action verbs (Led, Architected, Spearheaded, Optimized, etc.)
   - Include scope/scale where possible (e.g., "Managed portfolio of 15+ enterprise clients")
   - Mix strategic and tactical duties
   
3. **DAY IN THE LIFE** (Create a realistic, detailed schedule):
   - 8:30 AM: Morning routine specific to this role
   - 9:30 AM: Core morning work activity
   - 11:00 AM: Meetings or collaboration time
   - 12:30 PM: Midday activity
   - 2:00 PM: Afternoon deep work
   - 4:00 PM: Late afternoon tasks
   - 5:30 PM: End of day wrap-up

4. **METRICS** (Generate 4 impressive metrics, estimate if not explicit):
   - Revenue/cost impact (e.g., "+$2.5M revenue", "-40% costs")
   - Scale/efficiency (e.g., "10x throughput", "200% growth")
   - Team/scope (e.g., "25 direct reports", "50+ stakeholders")
   - Quality/speed (e.g., "99.9% uptime", "3x faster delivery")

## SKILLS EXTRACTION
- Extract EVERY skill mentioned in the resume
- Add 10-15 related/inferred skills based on the roles
- Group logically: Technical, Leadership, Domain, Soft skills

## ACHIEVEMENTS
- Extract explicit achievements AND infer major wins from job descriptions
- Write each as a compelling mini-story with context and impact

## EDUCATION & CERTIFICATIONS
- Extract all degrees, schools, graduation years, honors
- List all professional certifications

RETURN THIS EXACT JSON STRUCTURE:
{
  "basics": {
    "name": "Full Name",
    "title": "Most Impressive Job Title",
    "tagline": "Powerful 1-line value proposition with specific achievements",
    "email": "email@domain.com",
    "phone": "phone number",
    "location": "City, State/Country",
    "linkedin": "linkedin URL",
    "website": "website URL",
    "summary": "3-4 sentence executive summary showcasing unique expertise and career trajectory"
  },
  "experience": [
    {
      "company": "Company Name",
      "companyInfo": {
        "website": "company website URL (e.g., https://google.com)",
        "domain": "company domain for logo lookup (e.g., google.com)",
        "industry": "Industry sector",
        "location": "Company HQ city, state/country",
        "size": "Company size (e.g., 10,000+ employees, Fortune 500)",
        "description": "1-2 sentence company description"
      },
      "role": "Job Title",
      "startDate": "Mon YYYY",
      "endDate": "Mon YYYY or Present",
      "description": "COMPREHENSIVE 5-8 sentence description covering responsibilities, projects, technologies, leadership, and achievements. Make it read like a polished executive resume.",
      "responsibilities": ["Action-verb duty 1 with scope", "Action-verb duty 2", "...", "8-12 total"],
      "dayInLife": [
        {"time": "8:30 AM", "activity": "Role-specific morning activity"},
        {"time": "9:30 AM", "activity": "Core work activity"},
        {"time": "11:00 AM", "activity": "Collaborative work"},
        {"time": "12:30 PM", "activity": "Midday task"},
        {"time": "2:00 PM", "activity": "Afternoon focus work"},
        {"time": "4:00 PM", "activity": "Late afternoon activity"},
        {"time": "5:30 PM", "activity": "Wrap-up activity"}
      ],
      "metrics": [
        {"value": "+XX%", "label": "Specific metric"},
        {"value": "$X.XM", "label": "Financial impact"},
        {"value": "XX", "label": "Scale metric"},
        {"value": "XX%", "label": "Improvement metric"}
      ]
    }
  ],
  "skills": ["Skill 1", "Skill 2", "... 15-25 total skills"],
  "achievements": [
    {"title": "Achievement Title", "description": "Compelling 2-3 sentence description with context and impact"}
  ],
  "education": [
    {"degree": "Degree", "school": "Institution", "year": "Year", "details": "Honors, GPA, relevant details"}
  ],
  "certifications": ["Cert 1", "Cert 2"]
}

## COMPANY INFO REQUIREMENTS
For each company, you MUST provide:
- Website URL (research or infer based on company name)
- Domain (clean domain for logo lookup, e.g., "google.com", "microsoft.com")
- Industry sector
- Location (headquarters)
- Company size estimate
- Brief company description

ABSOLUTE REQUIREMENTS:
- NEVER use generic descriptions - be SPECIFIC to this person's actual experience
- ALWAYS include concrete numbers, percentages, dollar amounts in metrics
- Write descriptions that would impress a Fortune 500 recruiter
- Generate realistic estimates for any metrics not explicitly stated
- Return ONLY valid JSON with no markdown formatting or code blocks
- Use empty string "" for missing fields, NEVER null`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 8192 }
        })
      }
    );

    const data = await response.json();
    if (data.error) return c.json({ error: data.error.message }, 500);
    
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!aiText) return c.json({ error: 'No response from AI' }, 500);
    
    try {
      const jsonStr = aiText.replace(/```json\n?|\n?```/g, '').trim();
      return c.json(JSON.parse(jsonStr));
    } catch (e) {
      return c.json({ error: 'Parse failed', raw: aiText }, 500);
    }
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ===============================================================
// MAIN HTML/REACT APPLICATION
// ===============================================================

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Webumé | Your WebApp Resume</title>
  <link rel="icon" type="image/png" href="/static/logo.png">
  <meta name="description" content="Transform your resume into an immersive digital experience">
  
  <!-- External Dependencies -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
  <script>pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';</script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script>
  
  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <style>
    /* ===============================================================
       CSS VARIABLES - Design System
       =============================================================== */
    :root {
      --purple-main: #8B5CF6;
      --purple-light: #A78BFA;
      --pink-main: #EC4899;
      --cyan-main: #06B6D4;
      --green-main: #10B981;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    html, body, #root {
      height: 100%;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow: hidden;
    }
    
    /* ===============================================================
       PREMIUM BACKGROUND - Glass Cards Image - CRYSTAL CLEAR
       The beautiful glass cards image as background - MINIMAL BLUR
       =============================================================== */
    .premium-bg {
      position: fixed;
      inset: 0;
      background: #0a0a12;
      overflow: hidden;
    }
    
    /* Background image - MINIMAL BLUR - show the glass cards clearly */
    .bg-image {
      position: absolute;
      inset: 0;
      background-image: url('/static/background.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      filter: brightness(1) saturate(1.05);
      opacity: 1;
    }
    
    /* Minimal overlay - just a hint of darkness for text readability */
    .bg-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.25) 100%);
    }
    
    /* No noise overlay - keep it clean */
    .noise-overlay {
      display: none;
    }
    
    /* ===============================================================
       GLASSMORPHISM COMPONENTS - REDUCED BLUR
       Semi-transparent cards with minimal blur effect
       =============================================================== */
    .glass {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 20px;
    }
    
    .glass-card {
      background: rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      box-shadow: 
        0 4px 16px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.06);
    }
    
    .glass-sidebar {
      background: rgba(15, 8, 24, 0.5);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      border-right: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .glass-input {
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 14px 18px;
      color: #fff;
      font-family: inherit;
      font-size: 14px;
      transition: all 0.25s ease;
      width: 100%;
    }
    
    .glass-input:focus {
      outline: none;
      border-color: var(--purple-main);
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
    }
    
    .glass-input::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
    
    /* ===============================================================
       LAYOUT - Dashboard Style with Sidebar
       =============================================================== */
    .app-container {
      position: relative;
      z-index: 1;
      display: flex;
      height: 100vh;
    }
    
    /* Sidebar */
    .sidebar {
      width: 280px;
      padding: 28px 20px;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }
    
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 12px;
      margin-bottom: 40px;
    }
    
    .logo-img {
      width: 180px;
      height: auto;
      filter: drop-shadow(0 8px 24px rgba(139, 92, 246, 0.4));
      transition: transform 0.3s ease, filter 0.3s ease;
    }
    
    .logo-img:hover {
      transform: scale(1.05);
      filter: drop-shadow(0 12px 32px rgba(139, 92, 246, 0.5));
    }
    
    .nav-group {
      margin-bottom: 28px;
    }
    
    .nav-label {
      font-size: 11px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.35);
      text-transform: uppercase;
      letter-spacing: 1.2px;
      padding: 0 16px;
      margin-bottom: 12px;
    }
    
    .nav-btn {
      display: flex;
      align-items: center;
      gap: 14px;
      width: 100%;
      padding: 13px 16px;
      border-radius: 14px;
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.55);
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }
    
    .nav-btn:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
    }
    
    .nav-btn.active {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(236, 72, 153, 0.15));
      color: #fff;
      border: 1px solid rgba(139, 92, 246, 0.3);
    }
    
    .nav-btn i {
      width: 20px;
      font-size: 15px;
    }
    
    .sidebar-footer {
      margin-top: auto;
      padding: 20px;
      background: rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 16px;
    }
    
    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
    }
    
    .stat-row:not(:last-child) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    .stat-name {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
    }
    
    .stat-num {
      font-size: 20px;
      font-weight: 700;
      color: var(--purple-light);
    }
    
    /* Main Content Area */
    .main {
      flex: 1;
      padding: 28px 32px;
      overflow-y: auto;
    }
    
    .main::-webkit-scrollbar { width: 6px; }
    .main::-webkit-scrollbar-track { background: transparent; }
    .main::-webkit-scrollbar-thumb { 
      background: rgba(139, 92, 246, 0.3); 
      border-radius: 3px;
    }
    .main::-webkit-scrollbar-thumb:hover {
      background: rgba(139, 92, 246, 0.5);
    }
    
    /* Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
    }
    
    .page-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 32px;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.5px;
    }
    
    .page-desc {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.45);
      margin-top: 6px;
    }
    
    /* ===============================================================
       STAT CARDS GRID
       =============================================================== */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 28px;
    }
    
    .stat-card {
      padding: 24px;
      position: relative;
      overflow: hidden;
    }
    
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--purple-main), var(--pink-main));
    }
    
    .stat-card.cyan::before {
      background: linear-gradient(90deg, var(--cyan-main), #22D3EE);
    }
    
    .stat-card.green::before {
      background: linear-gradient(90deg, var(--green-main), #34D399);
    }
    
    .stat-icon-wrap {
      width: 52px;
      height: 52px;
      background: rgba(139, 92, 246, 0.15);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 18px;
    }
    
    .stat-icon-wrap i {
      font-size: 22px;
      color: var(--purple-main);
    }
    
    .stat-card.cyan .stat-icon-wrap {
      background: rgba(6, 182, 212, 0.15);
    }
    
    .stat-card.cyan .stat-icon-wrap i {
      color: var(--cyan-main);
    }
    
    .stat-card.green .stat-icon-wrap {
      background: rgba(16, 185, 129, 0.15);
    }
    
    .stat-card.green .stat-icon-wrap i {
      color: var(--green-main);
    }
    
    .stat-card .value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 40px;
      font-weight: 700;
      color: #fff;
      line-height: 1;
      margin-bottom: 6px;
    }
    
    .stat-card .label {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.45);
      font-weight: 500;
    }
    
    /* ===============================================================
       UPLOAD ZONE
       =============================================================== */
    .upload-zone {
      padding: 60px 48px;
      text-align: center;
    }
    
    .dropzone {
      padding: 70px 50px;
      border: 2px dashed rgba(139, 92, 246, 0.4);
      border-radius: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(236, 72, 153, 0.03));
    }
    
    .dropzone:hover {
      border-color: var(--purple-main);
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.06));
      transform: translateY(-2px);
    }
    
    .dropzone.drag-active {
      border-color: var(--cyan-main);
      border-style: solid;
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.05));
    }
    
    .upload-logo {
      width: 280px;
      height: auto;
      margin: 0 auto 32px;
      filter: drop-shadow(0 20px 50px rgba(139, 92, 246, 0.5));
      animation: floatLogo 4s ease-in-out infinite;
    }
    
    @keyframes floatLogo {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-15px) scale(1.02); }
    }
    
    .upload-icon-wrap {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, var(--purple-main), var(--pink-main));
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 16px 40px rgba(139, 92, 246, 0.4);
    }
    
    .upload-icon-wrap i {
      font-size: 32px;
      color: #fff;
    }
    
    .upload-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 30px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 10px;
    }
    
    .upload-subtitle {
      font-size: 15px;
      color: rgba(255, 255, 255, 0.45);
      margin-bottom: 32px;
    }
    
    .format-pills {
      display: flex;
      justify-content: center;
      gap: 14px;
    }
    
    .format-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 22px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 100px;
      font-size: 13px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.7);
    }
    
    .format-pill i {
      color: var(--purple-main);
    }
    
    /* ===============================================================
       PROCESSING STATE
       =============================================================== */
    .processing-state {
      padding: 70px;
      text-align: center;
    }
    
    .ai-visual {
      width: 140px;
      height: 140px;
      margin: 0 auto 36px;
      position: relative;
    }
    
    .ai-core {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, var(--purple-main), var(--pink-main));
      border-radius: 50%;
      box-shadow: 0 0 60px rgba(139, 92, 246, 0.5);
      animation: pulsate 2s ease-in-out infinite;
    }
    
    @keyframes pulsate {
      0%, 100% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.1); }
    }
    
    .ai-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 2px solid var(--purple-main);
      border-radius: 50%;
      opacity: 0;
      animation: ringExpand 2s ease-out infinite;
    }
    
    .ai-ring:nth-child(2) { animation-delay: 0.6s; }
    .ai-ring:nth-child(3) { animation-delay: 1.2s; }
    
    @keyframes ringExpand {
      0% { width: 70px; height: 70px; opacity: 0.7; }
      100% { width: 140px; height: 140px; opacity: 0; }
    }
    
    .ai-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 24px;
      background: linear-gradient(135deg, var(--purple-main), var(--pink-main));
      border-radius: 100px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #fff;
      margin-bottom: 20px;
    }
    
    .ai-badge-dot {
      width: 7px;
      height: 7px;
      background: #fff;
      border-radius: 50%;
      animation: blinkDot 1s infinite;
    }
    
    @keyframes blinkDot {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    
    .processing-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 26px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 10px;
    }
    
    .processing-subtitle {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.45);
      margin-bottom: 36px;
    }
    
    .progress-percent {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 52px;
      font-weight: 700;
      color: var(--cyan-main);
      margin-bottom: 20px;
    }
    
    .progress-track {
      max-width: 420px;
      height: 6px;
      margin: 0 auto 32px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;
    }
    
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--purple-main), var(--cyan-main));
      border-radius: 3px;
      transition: width 0.3s ease;
    }
    
    .step-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 340px;
      margin: 0 auto;
    }
    
    .step-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.35);
    }
    
    .step-item.active {
      background: rgba(139, 92, 246, 0.12);
      border-color: rgba(139, 92, 246, 0.25);
      color: var(--purple-light);
    }
    
    .step-item.done {
      background: rgba(16, 185, 129, 0.1);
      border-color: rgba(16, 185, 129, 0.25);
      color: var(--green-main);
    }
    
    .step-item i {
      width: 18px;
    }
    
    /* ===============================================================
       FORM ELEMENTS
       =============================================================== */
    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }
    
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .form-field.full-width {
      grid-column: 1 / -1;
    }
    
    .form-label {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }
    
    .form-textarea {
      min-height: 110px;
      resize: vertical;
    }
    
    /* ===============================================================
       BUTTONS
       =============================================================== */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 28px;
      border-radius: 12px;
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.25s ease;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, var(--purple-main), var(--pink-main));
      color: #fff;
      box-shadow: 0 10px 30px rgba(139, 92, 246, 0.35);
    }
    
    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(139, 92, 246, 0.45);
    }
    
    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.12);
    }
    
    .btn-ghost {
      width: 100%;
      padding: 18px;
      background: transparent;
      border: 2px dashed rgba(255, 255, 255, 0.15);
      color: rgba(255, 255, 255, 0.45);
      border-radius: 14px;
    }
    
    .btn-ghost:hover {
      border-color: var(--purple-main);
      color: var(--purple-light);
    }
    
    .btn-icon {
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      font-size: 14px;
    }
    
    .btn-icon:hover {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.3);
      color: #EF4444;
    }
    
    /* ===============================================================
       EXPERIENCE CARDS
       =============================================================== */
    .exp-entry {
      padding: 26px;
      margin-bottom: 18px;
      border-left: 4px solid var(--purple-main);
    }
    
    .exp-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .exp-badge {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--purple-main), var(--pink-main));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 700;
      color: #fff;
    }
    
    /* Day in Life Section */
    .day-section {
      margin-top: 24px;
      padding: 20px;
      background: rgba(6, 182, 212, 0.06);
      border: 1px solid rgba(6, 182, 212, 0.15);
      border-radius: 14px;
    }
    
    .day-header {
      font-size: 13px;
      font-weight: 600;
      color: var(--cyan-main);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .day-entry {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 10px;
    }
    
    .day-time {
      width: 90px;
      font-size: 12px;
      font-weight: 600;
      color: var(--purple-light);
    }
    
    .day-input {
      flex: 1;
      padding: 10px 14px;
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #fff;
      font-size: 13px;
    }
    
    .day-input:focus {
      outline: none;
      border-color: var(--cyan-main);
    }
    
    /* Metrics Section */
    .metrics-section {
      margin-top: 24px;
    }
    
    .metrics-header {
      font-size: 13px;
      font-weight: 600;
      color: var(--green-main);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .metrics-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    
    .metric-box {
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 14px;
      text-align: center;
      transition: border-color 0.2s ease;
    }
    
    .metric-box:hover {
      border-color: var(--green-main);
    }
    
    .metric-box input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      text-align: center;
      color: #fff;
      font-family: inherit;
    }
    
    .metric-box input:first-child {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: var(--green-main);
      margin-bottom: 6px;
    }
    
    .metric-box input:last-child {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.45);
      letter-spacing: 0.5px;
    }
    
    /* ===============================================================
       SKILLS CHIPS
       =============================================================== */
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .skill-chip {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 18px;
      background: rgba(139, 92, 246, 0.15);
      border: 1px solid rgba(139, 92, 246, 0.25);
      border-radius: 100px;
      font-size: 13px;
      font-weight: 500;
      color: #E9D5FF;
    }
    
    .skill-chip button {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      padding: 0;
      font-size: 12px;
    }
    
    .skill-chip button:hover {
      color: #EF4444;
    }
    
    /* ===============================================================
       PREVIEW PAGE
       =============================================================== */
    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 28px;
      margin-bottom: 24px;
    }
    
    .profile-hero {
      padding: 50px;
      text-align: center;
      margin-bottom: 24px;
    }
    
    .profile-avatar {
      width: 110px;
      height: 110px;
      margin: 0 auto 24px;
      background: linear-gradient(135deg, var(--purple-main), var(--pink-main), var(--cyan-main));
      border-radius: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 40px;
      font-weight: 700;
      color: #fff;
      box-shadow: 0 20px 50px rgba(139, 92, 246, 0.35);
    }
    
    .profile-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 32px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 10px;
    }
    
    .profile-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--cyan-main);
      margin-bottom: 14px;
    }
    
    .profile-tagline {
      color: rgba(255, 255, 255, 0.55);
      max-width: 520px;
      margin: 0 auto;
      line-height: 1.7;
    }
    
    /* Timeline */
    .timeline-wrap {
      padding-left: 45px;
      position: relative;
    }
    
    .timeline-wrap::before {
      content: '';
      position: absolute;
      left: 16px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(180deg, var(--purple-main), var(--cyan-main), var(--pink-main));
    }
    
    .timeline-item {
      position: relative;
      margin-bottom: 26px;
      padding: 24px;
    }
    
    .timeline-item::before {
      content: '';
      position: absolute;
      left: -37px;
      top: 28px;
      width: 14px;
      height: 14px;
      background: var(--purple-main);
      border-radius: 50%;
      border: 4px solid #150b24;
      box-shadow: 0 0 20px var(--purple-main);
    }
    
    .timeline-company {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 6px;
    }
    
    .timeline-role {
      font-size: 15px;
      font-weight: 600;
      color: var(--cyan-main);
      margin-bottom: 14px;
    }
    
    .timeline-dates {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(139, 92, 246, 0.15);
      border: 1px solid rgba(139, 92, 246, 0.25);
      border-radius: 100px;
      font-size: 12px;
      font-weight: 600;
      color: var(--purple-light);
      margin-bottom: 14px;
    }
    
    .timeline-desc {
      color: rgba(255, 255, 255, 0.55);
      font-size: 14px;
      line-height: 1.7;
    }
    
    .timeline-metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 18px;
    }
    
    .timeline-metric {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 12px;
      padding: 14px;
      text-align: center;
    }
    
    .timeline-metric-val {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: var(--green-main);
    }
    
    .timeline-metric-label {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.45);
      margin-top: 4px;
    }
    
    /* ===============================================================
       RESPONSIVE
       =============================================================== */
    @media (max-width: 1100px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .metrics-row, .timeline-metrics { grid-template-columns: repeat(2, 1fr); }
    }
    
    @media (max-width: 800px) {
      .sidebar { display: none; }
      .stats-grid, .form-row { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <!-- Premium Background with Glass Cards Image -->
  <div class="premium-bg">
    <div class="bg-image"></div>
    <div class="bg-gradient"></div>
    <div class="noise-overlay"></div>
  </div>
  
  <div id="root"></div>
  
  <script type="text/babel">
    // ===============================================================
    // REACT APPLICATION CODE
    // ===============================================================
    
    const { useState, useRef } = React;
    
    // ===============================================================
    // FILE PARSERS - Extract text from various resume formats
    // ===============================================================
    const FileParser = {
      async pdf(file) {
        const ab = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(x => x.str).join(' ') + '\\n';
        }
        return text;
      },
      async docx(file) {
        const ab = await file.arrayBuffer();
        return (await mammoth.extractRawText({ arrayBuffer: ab })).value;
      },
      async txt(file) {
        return await file.text();
      }
    };
    
    // ===============================================================
    // CONSTANTS
    // ===============================================================
    const VIEW = { UPLOAD: 1, BUILDER: 2, PREVIEW: 3 };
    
    const TEMPLATES = [
      { id: 'executive', name: 'Executive', desc: 'Bold & authoritative for senior leaders', color: '#8B5CF6', icon: 'fa-crown' },
      { id: 'creative', name: 'Creative', desc: 'Vibrant gradients for designers & artists', color: '#EC4899', icon: 'fa-palette' },
      { id: 'tech', name: 'Tech Pioneer', desc: 'Data-driven design for engineers', color: '#06B6D4', icon: 'fa-microchip' },
      { id: 'minimal', name: 'Minimal', desc: 'Clean & elegant simplicity', color: '#10B981', icon: 'fa-feather' }
    ];
    
    // LocalStorage Keys for Data Persistence
    const STORAGE_KEYS = {
      PROFILE: 'webume_profile',
      PHOTO: 'webume_photo',
      TEMPLATE: 'webume_template',
      RAW_TEXT: 'webume_rawtext',
      LAST_SAVED: 'webume_last_saved'
    };
    
    // ===============================================================
    // MAIN APP COMPONENT
    // ===============================================================
    const App = () => {
      // State
      const [view, setView] = useState(VIEW.UPLOAD);
      const [profile, setProfile] = useState(null);
      const [loading, setLoading] = useState(false);
      const [progress, setProgress] = useState(0);
      const [activeTab, setTab] = useState('basics');
      const [rawText, setRawText] = useState('');
      const [selectedTemplate, setTemplate] = useState('executive');
      const [profilePhoto, setProfilePhoto] = useState(null);
      const [lastSaved, setLastSaved] = useState(null);
      const [saveStatus, setSaveStatus] = useState('');
      const [steps, setSteps] = useState([
        { text: 'Reading file', state: 'pending' },
        { text: 'Extracting text', state: 'pending' },
        { text: 'AI deep analysis', state: 'pending' },
        { text: 'Extracting experiences', state: 'pending' },
        { text: 'Generating descriptions', state: 'pending' },
        { text: 'Building rich profile', state: 'pending' }
      ]);
      
      // Load saved data on mount
      React.useEffect(() => {
        try {
          const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
          const savedPhoto = localStorage.getItem(STORAGE_KEYS.PHOTO);
          const savedTemplate = localStorage.getItem(STORAGE_KEYS.TEMPLATE);
          const savedRawText = localStorage.getItem(STORAGE_KEYS.RAW_TEXT);
          const savedTimestamp = localStorage.getItem(STORAGE_KEYS.LAST_SAVED);
          
          if (savedProfile) {
            setProfile(JSON.parse(savedProfile));
            setView(VIEW.BUILDER);
          }
          if (savedPhoto) setProfilePhoto(savedPhoto);
          if (savedTemplate) setTemplate(savedTemplate);
          if (savedRawText) setRawText(savedRawText);
          if (savedTimestamp) setLastSaved(new Date(savedTimestamp));
        } catch (e) {
          console.error('Error loading saved data:', e);
        }
      }, []);
      
      // Auto-save profile
      React.useEffect(() => {
        if (profile) {
          const saveTimeout = setTimeout(() => {
            try {
              setSaveStatus('saving');
              localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
              const now = new Date();
              localStorage.setItem(STORAGE_KEYS.LAST_SAVED, now.toISOString());
              setLastSaved(now);
              setSaveStatus('saved');
              setTimeout(() => setSaveStatus(''), 2000);
            } catch (e) {
              setSaveStatus('error');
            }
          }, 1000);
          return () => clearTimeout(saveTimeout);
        }
      }, [profile]);
      
      // Save photo
      React.useEffect(() => {
        if (profilePhoto) {
          localStorage.setItem(STORAGE_KEYS.PHOTO, profilePhoto);
        }
      }, [profilePhoto]);
      
      // Save template
      React.useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.TEMPLATE, selectedTemplate);
      }, [selectedTemplate]);
      
      // Save raw text
      React.useEffect(() => {
        if (rawText) {
          localStorage.setItem(STORAGE_KEYS.RAW_TEXT, rawText);
        }
      }, [rawText]);
      
      // Manual save
      const saveProgress = () => {
        if (!profile) {
          alert('No profile to save yet.');
          return;
        }
        try {
          setSaveStatus('saving');
          localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
          if (profilePhoto) localStorage.setItem(STORAGE_KEYS.PHOTO, profilePhoto);
          localStorage.setItem(STORAGE_KEYS.TEMPLATE, selectedTemplate);
          if (rawText) localStorage.setItem(STORAGE_KEYS.RAW_TEXT, rawText);
          const now = new Date();
          localStorage.setItem(STORAGE_KEYS.LAST_SAVED, now.toISOString());
          setLastSaved(now);
          setSaveStatus('saved');
          alert('✅ Progress saved!');
        } catch (e) {
          setSaveStatus('error');
          alert('❌ Error saving: ' + e.message);
        }
      };
      
      // Clear saved data
      const clearSavedData = () => {
        if (confirm('Clear ALL saved data?')) {
          Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
          setProfile(null);
          setProfilePhoto(null);
          setRawText('');
          setTemplate('executive');
          setLastSaved(null);
          setView(VIEW.UPLOAD);
          alert('Data cleared.');
        }
      };
      
      const formatLastSaved = (date) => {
        if (!date) return null;
        const diff = Math.floor((new Date() - date) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
        if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
        return date.toLocaleDateString();
      };
      
      // Process uploaded file
      const processFile = async (file) => {
        setLoading(true);
        setProgress(0);
        const st = [...steps];
        
        try {
          st[0].state = 'active';
          setSteps([...st]);
          await new Promise(r => setTimeout(r, 300));
          
          st[0].state = 'done';
          st[1].state = 'active';
          setSteps([...st]);
          setProgress(15);
          
          const ext = file.name.split('.').pop().toLowerCase();
          let text = '';
          if (ext === 'pdf') text = await FileParser.pdf(file);
          else if (ext === 'docx' || ext === 'doc') text = await FileParser.docx(file);
          else text = await FileParser.txt(file);
          
          setRawText(text);
          
          st[1].state = 'done';
          st[2].state = 'active';
          setSteps([...st]);
          setProgress(30);
          
          let aiResult = null;
          try {
            const res = await fetch('/api/parse-resume', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text })
            });
            if (res.ok) aiResult = await res.json();
          } catch (e) {
            console.error('AI parsing error:', e);
          }
          
          st[2].state = 'done';
          st[3].state = 'active';
          setSteps([...st]);
          setProgress(55);
          await new Promise(r => setTimeout(r, 300));
          
          st[3].state = 'done';
          st[4].state = 'active';
          setSteps([...st]);
          setProgress(75);
          await new Promise(r => setTimeout(r, 300));
          
          st[4].state = 'done';
          st[5].state = 'active';
          setSteps([...st]);
          setProgress(92);
          
          const finalProfile = buildProfile(aiResult, text);
          
          st[5].state = 'done';
          setSteps([...st]);
          setProgress(100);
          await new Promise(r => setTimeout(r, 400));
          
          setProfile(finalProfile);
          setLoading(false);
          setView(VIEW.BUILDER);
        } catch (err) {
          alert('Error: ' + err.message);
          setLoading(false);
        }
      };
      
      // Get company logo URL from Clearbit
      const getCompanyLogoUrl = (domain) => {
        if (!domain) return null;
        const cleanDomain = domain.replace(/^(https?:\\/\\/)?(www\\.)?/, '').split('/')[0];
        return \`https://logo.clearbit.com/\${cleanDomain}\`;
      };
      
      // Build profile from AI data
      const buildProfile = (aiData, text) => {
        if (aiData && !aiData.error && aiData.basics) {
          return {
            basics: { ...aiData.basics, summary: aiData.basics.summary || '' },
            experience: (aiData.experience || []).map((e, i) => {
              const companyInfo = e.companyInfo || {};
              const domain = companyInfo.domain || '';
              return {
                id: Date.now() + i,
                ...e,
                companyInfo: {
                  website: companyInfo.website || '',
                  domain: domain,
                  industry: companyInfo.industry || '',
                  location: companyInfo.location || '',
                  size: companyInfo.size || '',
                  description: companyInfo.description || ''
                },
                logoUrl: getCompanyLogoUrl(domain),
                customLogo: null,
                responsibilities: e.responsibilities || [],
                dayInLife: e.dayInLife || [
                  { time: '9:00 AM', activity: '' },
                  { time: '10:30 AM', activity: '' },
                  { time: '12:00 PM', activity: '' },
                  { time: '2:00 PM', activity: '' },
                  { time: '4:00 PM', activity: '' },
                  { time: '5:30 PM', activity: '' }
                ],
                metrics: e.metrics || Array(4).fill({ value: '', label: '' })
              };
            }),
            skills: aiData.skills || [],
            achievements: (aiData.achievements || []).map((a, i) => ({ id: Date.now() + i + 1000, ...a })),
            education: (aiData.education || []).map((e, i) => ({ id: Date.now() + i + 2000, ...e })),
            certifications: aiData.certifications || [],
            awards: [],
            reviews: [],
            payHistory: [],
            projects: [],
            photos: [],
            videos: []
          };
        }
        
        // Fallback extraction
        const email = text.match(/[\\w.-]+@[\\w.-]+\\.\\w+/)?.[0] || '';
        const phone = text.match(/[\\+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4}/)?.[0] || '';
        const name = text.split('\\n').filter(l => l.trim())[0]?.trim() || '';
        
        return {
          basics: { name, title: '', tagline: '', email, phone, location: '', linkedin: '', website: '', summary: '' },
          experience: [], skills: [], achievements: [], education: [], certifications: [],
          awards: [], reviews: [], payHistory: [], projects: [], photos: [], videos: []
        };
      };
      
      const navItems = [
        { id: 'basics', icon: 'fa-user', label: 'Basic Info' },
        { id: 'experience', icon: 'fa-briefcase', label: 'Experience' },
        { id: 'skills', icon: 'fa-code', label: 'Skills' },
        { id: 'achievements', icon: 'fa-trophy', label: 'Achievements' },
        { id: 'education', icon: 'fa-graduation-cap', label: 'Education' },
        { id: 'awards', icon: 'fa-award', label: 'Awards' },
        { id: 'reviews', icon: 'fa-star', label: 'Reviews' },
        { id: 'pay', icon: 'fa-dollar-sign', label: 'Pay History' },
        { id: 'projects', icon: 'fa-folder', label: 'Projects' },
        { id: 'media', icon: 'fa-image', label: 'Media' },
        { id: 'templates', icon: 'fa-palette', label: 'Templates' }
      ];
      
      // ===============================================================
      // RENDER
      // ===============================================================
      return (
        <div className="app-container">
          {/* Sidebar */}
          <aside className="sidebar glass-sidebar">
            <div className="logo">
              <img src="/static/logo.png" alt="Webumé" className="logo-img" />
            </div>
            
            <div className="nav-group">
              <div className="nav-label">Profile Sections</div>
              {navItems.map(item => (
                <button
                  key={item.id}
                  className={'nav-btn' + (activeTab === item.id && view === VIEW.BUILDER ? ' active' : '')}
                  onClick={() => {
                    setTab(item.id);
                    if (view !== VIEW.BUILDER && profile) setView(VIEW.BUILDER);
                  }}
                >
                  <i className={'fas ' + item.icon}></i>
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="nav-group">
              <div className="nav-label">Actions</div>
              <button className="nav-btn" onClick={() => profile && setView(VIEW.PREVIEW)}>
                <i className="fas fa-eye"></i>
                Live Preview
              </button>
              <button className="nav-btn" onClick={() => setView(VIEW.UPLOAD)}>
                <i className="fas fa-upload"></i>
                Upload New
              </button>
            </div>
            
            <div className="nav-group">
              <div className="nav-label">Save Progress</div>
              <button 
                className="nav-btn" 
                onClick={saveProgress}
                style={{ background: 'rgba(16,185,129,0.15)' }}
              >
                <i className="fas fa-save" style={{ color: 'var(--green-main)' }}></i>
                <span style={{ color: 'var(--green-main)' }}>Save Now</span>
              </button>
              <button className="nav-btn" onClick={clearSavedData} style={{ opacity: 0.7 }}>
                <i className="fas fa-trash-alt"></i>
                Clear Saved Data
              </button>
              
              {(lastSaved || saveStatus) && (
                <div style={{ padding: '10px 16px', fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {saveStatus === 'saving' && <><i className="fas fa-spinner fa-spin"></i>Saving...</>}
                  {saveStatus === 'saved' && <><i className="fas fa-check-circle" style={{ color: 'var(--green-main)' }}></i>Saved!</>}
                  {!saveStatus && lastSaved && <><i className="fas fa-clock"></i>Last saved: {formatLastSaved(lastSaved)}</>}
                </div>
              )}
            </div>
            
            <div className="sidebar-footer">
              <div className="stat-row">
                <span className="stat-name">Experiences</span>
                <span className="stat-num">{profile?.experience?.length || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-name">Skills</span>
                <span className="stat-num">{profile?.skills?.length || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-name">Completeness</span>
                <span className="stat-num">{profile ? Math.min(100, Math.round((
                  (profile.basics?.name ? 10 : 0) +
                  (profile.basics?.title ? 10 : 0) +
                  (profile.basics?.tagline ? 10 : 0) +
                  (profile.basics?.email ? 5 : 0) +
                  (profile.experience?.length > 0 ? 25 : 0) +
                  (profile.skills?.length > 0 ? 20 : 0) +
                  (profile.achievements?.length > 0 ? 10 : 0) +
                  (profile.education?.length > 0 ? 10 : 0)
                ))) : 0}%</span>
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="main">
            {view === VIEW.UPLOAD && (
              <UploadView
                onUpload={processFile}
                loading={loading}
                progress={progress}
                steps={steps}
                hasSavedData={!!profile}
                savedName={profile?.basics?.name}
                onContinue={() => setView(VIEW.BUILDER)}
              />
            )}
            {view === VIEW.BUILDER && profile && (
              <BuilderView
                profile={profile}
                setProfile={setProfile}
                activeTab={activeTab}
                rawText={rawText}
                profilePhoto={profilePhoto}
                setProfilePhoto={setProfilePhoto}
                selectedTemplate={selectedTemplate}
                setTemplate={setTemplate}
              />
            )}
            {view === VIEW.PREVIEW && profile && (
              <PreviewView
                profile={profile}
                setView={setView}
                profilePhoto={profilePhoto}
                selectedTemplate={selectedTemplate}
              />
            )}
          </main>
        </div>
      );
    };
    
    // ===============================================================
    // SUB-COMPONENTS (UploadView, BuilderView, PreviewView, etc.)
    // Note: Full implementations are in the main file
    // These are placeholder comments for the full build code
    // ===============================================================
    
    // See main file for full implementations of:
    // - UploadView
    // - BuilderView
    // - BasicsEditor
    // - ExperienceEditor
    // - SkillsEditor
    // - ListEditor
    // - TemplateSelector
    // - MediaEditor
    // - PreviewView
    
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>`)
})

export default app

/**
 * ===============================================================
 * DATA TYPES (TypeScript Interface Reference)
 * ===============================================================
 * 
 * interface Profile {
 *   basics: {
 *     name: string;
 *     title: string;
 *     tagline: string;
 *     email: string;
 *     phone: string;
 *     location: string;
 *     linkedin: string;
 *     website: string;
 *     summary: string;
 *   };
 *   experience: Experience[];
 *   skills: string[];
 *   achievements: Achievement[];
 *   education: Education[];
 *   certifications: string[];
 *   awards: Award[];
 *   reviews: Review[];
 *   payHistory: PayEntry[];
 *   projects: Project[];
 *   photos: Media[];
 *   videos: Media[];
 * }
 * 
 * interface Experience {
 *   id: number;
 *   company: string;
 *   companyInfo: {
 *     website: string;
 *     domain: string;
 *     industry: string;
 *     location: string;
 *     size: string;
 *     description: string;
 *   };
 *   logoUrl: string | null;
 *   customLogo: string | null;
 *   role: string;
 *   startDate: string;
 *   endDate: string;
 *   description: string;
 *   responsibilities: string[];
 *   dayInLife: { time: string; activity: string; }[];
 *   metrics: { value: string; label: string; }[];
 * }
 * 
 * interface Achievement {
 *   id: number;
 *   title: string;
 *   description: string;
 * }
 * 
 * interface Education {
 *   id: number;
 *   degree: string;
 *   school: string;
 *   year: string;
 *   details: string;
 * }
 * 
 * ===============================================================
 * RECOMMENDED IMPROVEMENTS
 * ===============================================================
 * 
 * 1. SECURITY
 *    - Move GEMINI_API_KEY to environment variables
 *    - Implement rate limiting on /api/parse-resume
 *    - Add input validation and sanitization
 * 
 * 2. DATA PERSISTENCE
 *    - Implement Cloudflare D1 for server-side storage
 *    - Add user authentication (Cloudflare Access or custom)
 *    - Implement profile versioning/history
 * 
 * 3. FEATURES
 *    - Add PDF export functionality
 *    - Implement shareable public profile URLs
 *    - Add responsibilities editing in Experience section
 *    - Add more template customization options
 *    - Implement profile sharing/collaboration
 * 
 * 4. UX IMPROVEMENTS
 *    - Add loading skeletons
 *    - Implement optimistic updates
 *    - Add undo/redo functionality
 *    - Improve mobile responsiveness
 * 
 * 5. PERFORMANCE
 *    - Implement lazy loading for components
 *    - Add service worker for offline support
 *    - Optimize bundle size
 * 
 * ===============================================================
 */
