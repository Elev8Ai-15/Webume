import { Hono } from 'hono'

const app = new Hono()

// Gemini API Key
const GEMINI_API_KEY = 'AIzaSyB9jQaRGkfj4Tyq5y5j45RiYAeb_H2e-2g';

// ============================================
// AI RESUME PARSING ENDPOINT
// ============================================
app.post('/api/parse-resume', async (c) => {
  try {
    const { text } = await c.req.json();
    
    const prompt = `You are an expert resume parser. Analyze this resume text and extract ALL information into structured JSON.

RESUME TEXT:
${text}

Return this EXACT JSON structure with extracted data:
{
  "basics": {
    "name": "extracted full name",
    "title": "most recent job title",
    "tagline": "create a compelling 1-line professional summary based on their experience",
    "email": "email address",
    "phone": "phone number",
    "location": "city, state",
    "linkedin": "linkedin url if found",
    "website": "personal website if found"
  },
  "experience": [
    {
      "company": "company name",
      "role": "job title",
      "startDate": "start date",
      "endDate": "end date or Present",
      "description": "full job description and accomplishments",
      "tasks": "key responsibilities",
      "dayInLife": [
        {"time": "9:00 AM", "activity": "realistic morning activity for this role"},
        {"time": "11:00 AM", "activity": "mid-morning activity"},
        {"time": "1:00 PM", "activity": "afternoon activity"},
        {"time": "3:00 PM", "activity": "late afternoon activity"},
        {"time": "5:00 PM", "activity": "end of day activity"}
      ],
      "metrics": [
        {"value": "extract percentage or number if mentioned", "label": "metric type"},
        {"value": "", "label": ""},
        {"value": "", "label": ""},
        {"value": "", "label": ""}
      ]
    }
  ],
  "skills": ["array", "of", "all", "skills", "found"],
  "education": [
    {"degree": "degree name", "school": "school name", "year": "year"}
  ],
  "achievements": [
    {"title": "achievement", "description": "details"}
  ]
}

IMPORTANT RULES:
1. Extract EVERY job experience found, most recent first
2. Find and extract ALL metrics (percentages, dollar amounts, team sizes, etc.)
3. Generate realistic day-in-life activities based on the actual job role
4. Create a compelling tagline from their career highlights
5. Use empty string "" for missing data, never null
6. Return ONLY valid JSON, no markdown, no explanation`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
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
    
    if (data.error) {
      console.error('Gemini API error:', data.error);
      return c.json({ error: data.error.message }, 500);
    }
    
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!aiText) {
      return c.json({ error: 'No response from AI', raw: data }, 500);
    }
    
    let parsed;
    try {
      const jsonStr = aiText.replace(/```json\n?|\n?```/g, '').trim();
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      console.error('JSON parse error:', e, 'Raw:', aiText);
      return c.json({ error: 'Failed to parse AI response', raw: aiText }, 500);
    }

    return c.json(parsed);
  } catch (error: any) {
    console.error('API error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// ============================================
// WEBUME - TRULY PREMIUM GLASSMORPHISM UI
// Based on Dribbble/Behance Top Designs
// ============================================

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WEBUME | AI Resume Builder</title>
  
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
  <script>pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';</script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <style>
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --font: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    html, body, #root {
      min-height: 100vh;
      font-family: var(--font);
      overflow-x: hidden;
    }
    
    body {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
      color: #fff;
    }
    
    /* =============================================
       STUNNING ANIMATED BACKGROUND
       Vibrant gradient orbs that make it feel alive
       ============================================= */
    .bg-wrapper {
      position: fixed;
      inset: 0;
      z-index: 0;
      overflow: hidden;
    }
    
    /* Large vibrant gradient orbs */
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.7;
      animation: float 20s ease-in-out infinite;
    }
    
    .orb-1 {
      width: 600px;
      height: 600px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      top: -10%;
      left: -5%;
      animation-delay: 0s;
    }
    
    .orb-2 {
      width: 500px;
      height: 500px;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      top: 60%;
      right: -10%;
      animation-delay: -5s;
    }
    
    .orb-3 {
      width: 450px;
      height: 450px;
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      bottom: -15%;
      left: 30%;
      animation-delay: -10s;
    }
    
    .orb-4 {
      width: 350px;
      height: 350px;
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      top: 40%;
      left: 10%;
      opacity: 0.5;
      animation-delay: -15s;
    }
    
    .orb-5 {
      width: 300px;
      height: 300px;
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      top: 20%;
      right: 20%;
      opacity: 0.4;
      animation-delay: -7s;
    }
    
    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25% { transform: translate(50px, -50px) scale(1.1); }
      50% { transform: translate(-30px, 50px) scale(0.95); }
      75% { transform: translate(40px, 30px) scale(1.05); }
    }
    
    /* Mesh gradient overlay */
    .mesh-overlay {
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(at 40% 20%, rgba(102, 126, 234, 0.15) 0px, transparent 50%),
        radial-gradient(at 80% 0%, rgba(240, 147, 251, 0.1) 0px, transparent 50%),
        radial-gradient(at 0% 50%, rgba(79, 172, 254, 0.1) 0px, transparent 50%),
        radial-gradient(at 80% 50%, rgba(67, 233, 123, 0.08) 0px, transparent 50%),
        radial-gradient(at 0% 100%, rgba(250, 112, 154, 0.1) 0px, transparent 50%),
        radial-gradient(at 80% 100%, rgba(118, 75, 162, 0.12) 0px, transparent 50%);
    }
    
    /* Subtle noise texture */
    .noise {
      position: absolute;
      inset: 0;
      opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }
    
    /* =============================================
       GLASS CARD SYSTEM
       Real frosted glass effect
       ============================================= */
    .glass {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 24px;
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.2),
        inset 0 1px 1px rgba(255, 255, 255, 0.1);
    }
    
    .glass-strong {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 24px;
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.25),
        inset 0 1px 2px rgba(255, 255, 255, 0.15);
    }
    
    .glass-subtle {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
    }
    
    /* =============================================
       MAIN CONTAINER
       ============================================= */
    .container {
      position: relative;
      z-index: 1;
      max-width: 1300px;
      margin: 0 auto;
      padding: 32px;
      min-height: 100vh;
    }
    
    /* =============================================
       HEADER
       ============================================= */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 32px;
      margin-bottom: 32px;
    }
    
    .logo-group {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .logo-icon {
      width: 52px;
      height: 52px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    }
    
    .logo-text {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #fff 0%, #e0e0ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .logo-sub {
      font-size: 11px;
      font-weight: 500;
      color: rgba(255,255,255,0.5);
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    
    .header-stats {
      display: flex;
      gap: 32px;
    }
    
    .stat-item {
      text-align: center;
    }
    
    .stat-value {
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(135deg, #4facfe, #00f2fe);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .stat-label {
      font-size: 11px;
      font-weight: 600;
      color: rgba(255,255,255,0.5);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    /* =============================================
       UPLOAD ZONE - The Hero Section
       ============================================= */
    .upload-card {
      padding: 48px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    /* Glow effect behind card */
    .upload-card::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at center, rgba(102, 126, 234, 0.15) 0%, transparent 50%);
      animation: pulse-glow 4s ease-in-out infinite;
    }
    
    @keyframes pulse-glow {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }
    
    .upload-zone {
      position: relative;
      padding: 60px 40px;
      border: 2px dashed rgba(255, 255, 255, 0.25);
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(240, 147, 251, 0.05) 100%);
    }
    
    .upload-zone:hover {
      border-color: rgba(102, 126, 234, 0.6);
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(240, 147, 251, 0.1) 100%);
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(102, 126, 234, 0.2);
    }
    
    .upload-zone.drag-over {
      border-color: #4facfe;
      border-style: solid;
      background: linear-gradient(135deg, rgba(79, 172, 254, 0.2) 0%, rgba(0, 242, 254, 0.1) 100%);
      transform: scale(1.02);
    }
    
    .upload-icon-wrap {
      width: 100px;
      height: 100px;
      margin: 0 auto 28px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      border-radius: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      box-shadow: 
        0 16px 40px rgba(102, 126, 234, 0.4),
        0 0 0 8px rgba(102, 126, 234, 0.1);
      animation: icon-float 3s ease-in-out infinite;
    }
    
    @keyframes icon-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    .upload-icon-wrap i {
      font-size: 40px;
      color: white;
    }
    
    .upload-title {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .upload-subtitle {
      font-size: 16px;
      color: rgba(255,255,255,0.6);
      margin-bottom: 32px;
    }
    
    .upload-formats {
      display: flex;
      justify-content: center;
      gap: 16px;
    }
    
    .format-tag {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 100px;
      font-size: 13px;
      font-weight: 600;
      color: rgba(255,255,255,0.8);
      transition: all 0.3s ease;
    }
    
    .format-tag:hover {
      background: rgba(255,255,255,0.15);
      border-color: rgba(102, 126, 234, 0.5);
      color: #fff;
    }
    
    .format-tag i {
      color: #667eea;
    }
    
    /* =============================================
       PROCESSING STATE
       ============================================= */
    .processing-wrap {
      padding: 60px 40px;
      text-align: center;
    }
    
    .brain-container {
      width: 140px;
      height: 140px;
      margin: 0 auto 40px;
      position: relative;
    }
    
    .brain-core {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      box-shadow: 
        0 0 40px rgba(102, 126, 234, 0.6),
        0 0 80px rgba(118, 75, 162, 0.4);
      animation: brain-pulse 2s ease-in-out infinite;
    }
    
    @keyframes brain-pulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.15); }
    }
    
    .brain-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 2px solid #667eea;
      border-radius: 50%;
      opacity: 0;
      animation: ring-expand 2s ease-out infinite;
    }
    
    .brain-ring:nth-child(1) { animation-delay: 0s; }
    .brain-ring:nth-child(2) { animation-delay: 0.5s; }
    .brain-ring:nth-child(3) { animation-delay: 1s; }
    
    @keyframes ring-expand {
      0% { width: 70px; height: 70px; opacity: 0.8; }
      100% { width: 140px; height: 140px; opacity: 0; }
    }
    
    .ai-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 100px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 20px;
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
    }
    
    .ai-dot {
      width: 8px;
      height: 8px;
      background: #fff;
      border-radius: 50%;
      animation: dot-pulse 1s ease-in-out infinite;
    }
    
    @keyframes dot-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.7); }
    }
    
    .process-title {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #fff;
    }
    
    .process-subtitle {
      font-size: 15px;
      color: rgba(255,255,255,0.6);
      margin-bottom: 40px;
    }
    
    .progress-percent {
      font-size: 56px;
      font-weight: 800;
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 20px;
    }
    
    .progress-track {
      max-width: 500px;
      height: 8px;
      margin: 0 auto 32px;
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
      overflow: hidden;
    }
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #4facfe 50%, #43e97b 100%);
      border-radius: 4px;
      transition: width 0.3s ease;
      box-shadow: 0 0 20px rgba(79, 172, 254, 0.5);
      position: relative;
    }
    
    .progress-fill::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      animation: shimmer 1.5s infinite;
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    .steps-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
      margin: 0 auto;
    }
    
    .step-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(255,255,255,0.4);
      transition: all 0.3s ease;
    }
    
    .step-item.active {
      background: rgba(102, 126, 234, 0.15);
      border-color: rgba(102, 126, 234, 0.3);
      color: #a5b4fc;
    }
    
    .step-item.complete {
      background: rgba(67, 233, 123, 0.1);
      border-color: rgba(67, 233, 123, 0.3);
      color: #43e97b;
    }
    
    .step-item i {
      width: 18px;
    }
    
    /* =============================================
       STATS GRID
       ============================================= */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
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
    }
    
    .stat-card.purple::before { background: linear-gradient(90deg, #667eea, #764ba2); }
    .stat-card.blue::before { background: linear-gradient(90deg, #4facfe, #00f2fe); }
    .stat-card.pink::before { background: linear-gradient(90deg, #f093fb, #f5576c); }
    .stat-card.green::before { background: linear-gradient(90deg, #43e97b, #38f9d7); }
    
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-bottom: 16px;
    }
    
    .stat-card.purple .stat-icon { background: rgba(102, 126, 234, 0.2); color: #667eea; }
    .stat-card.blue .stat-icon { background: rgba(79, 172, 254, 0.2); color: #4facfe; }
    .stat-card.pink .stat-icon { background: rgba(240, 147, 251, 0.2); color: #f093fb; }
    .stat-card.green .stat-icon { background: rgba(67, 233, 123, 0.2); color: #43e97b; }
    
    .stat-card .stat-value {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    
    .stat-card.purple .stat-value { color: #a5b4fc; }
    .stat-card.blue .stat-value { color: #4facfe; }
    .stat-card.pink .stat-value { color: #f5a5c7; }
    .stat-card.green .stat-value { color: #43e97b; }
    
    .stat-card .stat-label {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255,255,255,0.5);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    /* =============================================
       NAVIGATION TABS
       ============================================= */
    .tabs-wrap {
      display: flex;
      gap: 6px;
      padding: 6px;
      margin-bottom: 24px;
      overflow-x: auto;
    }
    
    .tab-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: transparent;
      border: none;
      border-radius: 12px;
      font-family: var(--font);
      font-size: 14px;
      font-weight: 600;
      color: rgba(255,255,255,0.5);
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.3s ease;
    }
    
    .tab-btn:hover {
      color: rgba(255,255,255,0.8);
      background: rgba(255,255,255,0.05);
    }
    
    .tab-btn.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
    }
    
    /* =============================================
       CONTENT CARD
       ============================================= */
    .content-card {
      padding: 32px;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 28px;
    }
    
    .section-header h2 {
      font-size: 22px;
      font-weight: 700;
    }
    
    .section-header i {
      color: #667eea;
      font-size: 20px;
    }
    
    .section-header .count {
      font-size: 13px;
      color: rgba(255,255,255,0.5);
    }
    
    /* =============================================
       FORM ELEMENTS
       ============================================= */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .form-group.full { grid-column: 1 / -1; }
    
    .form-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 600;
      color: rgba(255,255,255,0.6);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .form-label i {
      color: #667eea;
      font-size: 12px;
    }
    
    .form-input,
    .form-textarea {
      padding: 14px 18px;
      background: rgba(0,0,0,0.2);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      color: #fff;
      font-family: var(--font);
      font-size: 15px;
      transition: all 0.3s ease;
    }
    
    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }
    
    .form-input::placeholder,
    .form-textarea::placeholder {
      color: rgba(255,255,255,0.3);
    }
    
    .form-textarea {
      min-height: 120px;
      resize: vertical;
      line-height: 1.6;
    }
    
    /* =============================================
       BUTTONS
       ============================================= */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 28px;
      border-radius: 12px;
      font-family: var(--font);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
    }
    
    .btn-secondary {
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.15);
      color: #fff;
    }
    
    .btn-secondary:hover {
      background: rgba(255,255,255,0.15);
    }
    
    .btn-ghost {
      width: 100%;
      padding: 20px;
      background: transparent;
      border: 2px dashed rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.5);
      border-radius: 16px;
    }
    
    .btn-ghost:hover {
      border-color: #667eea;
      color: #a5b4fc;
      background: rgba(102, 126, 234, 0.05);
    }
    
    /* =============================================
       EXPERIENCE ENTRIES
       ============================================= */
    .exp-entry {
      padding: 28px;
      margin-bottom: 20px;
      border-left: 3px solid #667eea;
    }
    
    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }
    
    .exp-num {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }
    
    .btn-icon {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      color: rgba(255,255,255,0.5);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    
    .btn-icon.danger:hover {
      background: rgba(245, 87, 108, 0.15);
      border-color: rgba(245, 87, 108, 0.3);
      color: #f5576c;
    }
    
    /* Day in Life */
    .day-section {
      margin-top: 24px;
      padding: 20px;
      background: rgba(79, 172, 254, 0.05);
      border: 1px solid rgba(79, 172, 254, 0.15);
      border-radius: 16px;
    }
    
    .day-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 600;
      color: #4facfe;
      margin-bottom: 16px;
    }
    
    .day-item {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
    }
    
    .day-time {
      width: 90px;
      font-size: 13px;
      font-weight: 600;
      color: #667eea;
      flex-shrink: 0;
      font-family: 'JetBrains Mono', monospace;
    }
    
    .day-input {
      flex: 1;
      padding: 10px 14px;
      background: rgba(0,0,0,0.2);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      color: #fff;
      font-size: 14px;
      transition: all 0.3s ease;
    }
    
    .day-input:focus {
      outline: none;
      border-color: #4facfe;
    }
    
    /* Metrics */
    .metrics-section {
      margin-top: 24px;
    }
    
    .metrics-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 600;
      color: #43e97b;
      margin-bottom: 16px;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    
    .metric-box {
      background: rgba(0,0,0,0.2);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 16px;
      text-align: center;
      transition: all 0.3s ease;
    }
    
    .metric-box:hover {
      border-color: #43e97b;
    }
    
    .metric-box input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      text-align: center;
      color: #fff;
      font-family: var(--font);
    }
    
    .metric-box input:first-child {
      font-size: 24px;
      font-weight: 700;
      color: #43e97b;
      margin-bottom: 4px;
    }
    
    .metric-box input:last-child {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: rgba(255,255,255,0.5);
    }
    
    /* =============================================
       SKILLS
       ============================================= */
    .skills-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .skill-tag {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.1));
      border: 1px solid rgba(102, 126, 234, 0.25);
      border-radius: 100px;
      font-size: 13px;
      font-weight: 600;
      color: #e0e0ff;
      transition: all 0.3s ease;
    }
    
    .skill-tag:hover {
      border-color: #667eea;
    }
    
    .skill-remove {
      background: none;
      border: none;
      color: rgba(255,255,255,0.4);
      cursor: pointer;
      padding: 0;
      font-size: 12px;
      transition: color 0.3s ease;
    }
    
    .skill-remove:hover {
      color: #f5576c;
    }
    
    /* =============================================
       TIMELINE PREVIEW
       ============================================= */
    .timeline {
      position: relative;
      padding-left: 48px;
    }
    
    .timeline::before {
      content: '';
      position: absolute;
      left: 16px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(180deg, #667eea 0%, #4facfe 50%, #f093fb 100%);
    }
    
    .timeline-item {
      position: relative;
      margin-bottom: 28px;
      padding: 24px;
    }
    
    .timeline-item::before {
      content: '';
      position: absolute;
      left: -40px;
      top: 28px;
      width: 14px;
      height: 14px;
      background: #667eea;
      border-radius: 50%;
      border: 3px solid #1a1a2e;
      box-shadow: 0 0 20px #667eea;
    }
    
    .timeline-company {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    
    .timeline-role {
      font-size: 16px;
      font-weight: 600;
      color: #4facfe;
      margin-bottom: 12px;
    }
    
    .timeline-dates {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(102, 126, 234, 0.15);
      border: 1px solid rgba(102, 126, 234, 0.25);
      border-radius: 100px;
      font-size: 12px;
      font-weight: 600;
      color: #a5b4fc;
      margin-bottom: 16px;
    }
    
    .timeline-desc {
      color: rgba(255,255,255,0.6);
      line-height: 1.7;
    }
    
    .preview-metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 20px;
    }
    
    .preview-metric {
      background: rgba(67, 233, 123, 0.08);
      border: 1px solid rgba(67, 233, 123, 0.2);
      border-radius: 12px;
      padding: 16px;
      text-align: center;
    }
    
    .preview-metric-val {
      font-size: 24px;
      font-weight: 700;
      color: #43e97b;
    }
    
    .preview-metric-label {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: rgba(255,255,255,0.5);
      margin-top: 4px;
    }
    
    /* =============================================
       RESPONSIVE
       ============================================= */
    @media (max-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .metrics-grid, .preview-metrics { grid-template-columns: repeat(2, 1fr); }
    }
    
    @media (max-width: 768px) {
      .container { padding: 16px; }
      .header { flex-direction: column; gap: 20px; padding: 16px; }
      .stats-grid, .form-grid { grid-template-columns: 1fr; }
      .upload-card, .content-card { padding: 24px; }
    }
    
    /* =============================================
       ANIMATIONS
       ============================================= */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .fade-in {
      animation: fadeIn 0.5s ease forwards;
    }
  </style>
</head>
<body>
  <!-- STUNNING ANIMATED BACKGROUND -->
  <div class="bg-wrapper">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
    <div class="orb orb-4"></div>
    <div class="orb orb-5"></div>
    <div class="mesh-overlay"></div>
    <div class="noise"></div>
  </div>
  
  <div id="root"></div>
  
  <script type="text/babel">
    const { useState, useRef } = React;
    
    const ResumeParser = {
      async parsePDF(file) {
        const ab = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(' ') + '\\n';
        }
        return text;
      },
      async parseDOCX(file) {
        const ab = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: ab });
        return result.value;
      },
      async parseTXT(file) {
        return await file.text();
      }
    };
    
    const VIEWS = { UPLOAD: 'upload', BUILDER: 'builder', PREVIEW: 'preview' };
    
    const App = () => {
      const [view, setView] = useState(VIEWS.UPLOAD);
      const [profile, setProfile] = useState(null);
      const [processing, setProcessing] = useState(false);
      const [progress, setProgress] = useState(0);
      const [activeTab, setActiveTab] = useState('basics');
      const [rawText, setRawText] = useState('');
      const [steps, setSteps] = useState([
        { label: 'Reading document', status: 'pending' },
        { label: 'Extracting text', status: 'pending' },
        { label: 'AI analyzing', status: 'pending' },
        { label: 'Identifying experiences', status: 'pending' },
        { label: 'Generating insights', status: 'pending' },
        { label: 'Building profile', status: 'pending' }
      ]);
      
      const handleUpload = async (file) => {
        setProcessing(true);
        setProgress(0);
        const s = [...steps];
        
        try {
          s[0].status = 'active';
          setSteps([...s]);
          await new Promise(r => setTimeout(r, 400));
          
          const ext = file.name.split('.').pop().toLowerCase();
          let text = '';
          
          s[0].status = 'complete';
          s[1].status = 'active';
          setSteps([...s]);
          setProgress(15);
          
          if (ext === 'pdf') text = await ResumeParser.parsePDF(file);
          else if (ext === 'docx' || ext === 'doc') text = await ResumeParser.parseDOCX(file);
          else text = await ResumeParser.parseTXT(file);
          
          setRawText(text);
          
          s[1].status = 'complete';
          s[2].status = 'active';
          setSteps([...s]);
          setProgress(30);
          
          let aiData = null;
          try {
            const res = await fetch('/api/parse-resume', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text })
            });
            if (res.ok) aiData = await res.json();
          } catch (e) {
            console.error('AI error:', e);
          }
          
          s[2].status = 'complete';
          s[3].status = 'active';
          setSteps([...s]);
          setProgress(50);
          await new Promise(r => setTimeout(r, 400));
          
          s[3].status = 'complete';
          s[4].status = 'active';
          setSteps([...s]);
          setProgress(70);
          await new Promise(r => setTimeout(r, 400));
          
          s[4].status = 'complete';
          s[5].status = 'active';
          setSteps([...s]);
          setProgress(90);
          
          const finalProfile = buildProfile(aiData, text);
          
          s[5].status = 'complete';
          setSteps([...s]);
          setProgress(100);
          
          await new Promise(r => setTimeout(r, 500));
          
          setProfile(finalProfile);
          setProcessing(false);
          setView(VIEWS.BUILDER);
          
        } catch (err) {
          console.error('Error:', err);
          alert('Error: ' + err.message);
          setProcessing(false);
        }
      };
      
      const buildProfile = (ai, text) => {
        if (ai && !ai.error && ai.basics) {
          return {
            basics: { ...ai.basics },
            experience: (ai.experience || []).map((e, i) => ({
              id: Date.now() + i,
              ...e,
              dayInLife: e.dayInLife || [
                { time: '9:00 AM', activity: '' },
                { time: '11:00 AM', activity: '' },
                { time: '1:00 PM', activity: '' },
                { time: '3:00 PM', activity: '' },
                { time: '5:00 PM', activity: '' }
              ],
              metrics: e.metrics || [
                { value: '', label: '' },
                { value: '', label: '' },
                { value: '', label: '' },
                { value: '', label: '' }
              ]
            })),
            skills: ai.skills || [],
            education: ai.education || [],
            achievements: (ai.achievements || []).map((a, i) => ({ id: Date.now() + i + 1000, ...a })),
            awards: [],
            reviews: [],
            payHistory: [],
            projects: [],
            photos: [],
            videos: []
          };
        }
        
        const emailMatch = text.match(/[\\w.-]+@[\\w.-]+\\.\\w+/);
        const phoneMatch = text.match(/[\\+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4}/);
        const lines = text.split('\\n').filter(l => l.trim());
        
        return {
          basics: { name: lines[0]?.trim() || '', title: '', tagline: '', email: emailMatch?.[0] || '', phone: phoneMatch?.[0] || '', location: '', linkedin: '', website: '' },
          experience: [],
          skills: [],
          education: [],
          achievements: [],
          awards: [],
          reviews: [],
          payHistory: [],
          projects: [],
          photos: [],
          videos: []
        };
      };
      
      return (
        <div className="container">
          <Header profile={profile} />
          
          {view === VIEWS.UPLOAD && (
            <UploadView onUpload={handleUpload} processing={processing} progress={progress} steps={steps} />
          )}
          
          {view === VIEWS.BUILDER && profile && (
            <BuilderView profile={profile} setProfile={setProfile} activeTab={activeTab} setActiveTab={setActiveTab} rawText={rawText} setView={setView} />
          )}
          
          {view === VIEWS.PREVIEW && profile && (
            <PreviewView profile={profile} setView={setView} />
          )}
        </div>
      );
    };
    
    const Header = ({ profile }) => (
      <header className="header glass fade-in">
        <div className="logo-group">
          <div className="logo-icon">⚡</div>
          <div>
            <div className="logo-text">WEBUME</div>
            <div className="logo-sub">AI Resume Builder</div>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <div className="stat-value">{profile?.experience?.length || 0}</div>
            <div className="stat-label">Experiences</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{profile?.skills?.length || 0}</div>
            <div className="stat-label">Skills</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{profile?.achievements?.length || 0}</div>
            <div className="stat-label">Achievements</div>
          </div>
        </div>
      </header>
    );
    
    const UploadView = ({ onUpload, processing, progress, steps }) => {
      const [dragOver, setDragOver] = useState(false);
      const inputRef = useRef(null);
      
      const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files[0]) onUpload(e.dataTransfer.files[0]);
      };
      
      if (processing) {
        return (
          <div className="glass-strong upload-card fade-in">
            <div className="processing-wrap">
              <div className="brain-container">
                <div className="brain-core"></div>
                <div className="brain-ring"></div>
                <div className="brain-ring"></div>
                <div className="brain-ring"></div>
              </div>
              
              <div className="ai-badge">
                <div className="ai-dot"></div>
                GEMINI AI PROCESSING
              </div>
              
              <div className="process-title">Analyzing Your Resume</div>
              <div className="process-subtitle">Extracting every detail from your career history</div>
              
              <div className="progress-percent">{Math.round(progress)}%</div>
              
              <div className="progress-track">
                <div className="progress-fill" style={{ width: progress + '%' }}></div>
              </div>
              
              <div className="steps-list">
                {steps.map((step, i) => (
                  <div key={i} className={'step-item ' + step.status}>
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
        <div className="glass-strong upload-card fade-in">
          <div
            className={'upload-zone' + (dragOver ? ' drag-over' : '')}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              type="file"
              ref={inputRef}
              onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])}
              accept=".pdf,.docx,.doc,.txt"
              style={{ display: 'none' }}
            />
            
            <div className="upload-icon-wrap">
              <i className="fas fa-cloud-upload-alt"></i>
            </div>
            
            <h2 className="upload-title">Drop Your Resume</h2>
            <p className="upload-subtitle">Powered by Gemini AI • Instant Extraction</p>
            
            <div className="upload-formats">
              <span className="format-tag"><i className="fas fa-file-pdf"></i> PDF</span>
              <span className="format-tag"><i className="fas fa-file-word"></i> DOCX</span>
              <span className="format-tag"><i className="fas fa-file-alt"></i> TXT</span>
            </div>
          </div>
        </div>
      );
    };
    
    const BuilderView = ({ profile, setProfile, activeTab, setActiveTab, rawText, setView }) => {
      const tabs = [
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
      
      const update = (key, value) => setProfile(p => ({ ...p, [key]: value }));
      const updateBasics = (field, value) => setProfile(p => ({ ...p, basics: { ...p.basics, [field]: value } }));
      
      return (
        <div className="fade-in">
          <div className="stats-grid">
            <div className="glass stat-card purple">
              <div className="stat-icon"><i className="fas fa-briefcase"></i></div>
              <div className="stat-value">{profile.experience.length}</div>
              <div className="stat-label">Experiences</div>
            </div>
            <div className="glass stat-card blue">
              <div className="stat-icon"><i className="fas fa-code"></i></div>
              <div className="stat-value">{profile.skills.length}</div>
              <div className="stat-label">Skills</div>
            </div>
            <div className="glass stat-card pink">
              <div className="stat-icon"><i className="fas fa-trophy"></i></div>
              <div className="stat-value">{profile.achievements.length}</div>
              <div className="stat-label">Achievements</div>
            </div>
            <div className="glass stat-card green">
              <div className="stat-icon"><i className="fas fa-check-double"></i></div>
              <div className="stat-value">94%</div>
              <div className="stat-label">Complete</div>
            </div>
          </div>
          
          <div className="glass tabs-wrap">
            {tabs.map(tab => (
              <button key={tab.id} className={'tab-btn' + (activeTab === tab.id ? ' active' : '')} onClick={() => setActiveTab(tab.id)}>
                <i className={'fas ' + tab.icon}></i>
                {tab.label}
              </button>
            ))}
            <button className="tab-btn" onClick={() => setView(VIEWS.PREVIEW)}>
              <i className="fas fa-eye"></i>
              Preview
            </button>
          </div>
          
          <div className="glass-strong content-card">
            {activeTab === 'basics' && <BasicsEditor profile={profile} updateBasics={updateBasics} rawText={rawText} />}
            {activeTab === 'experience' && <ExperienceEditor experience={profile.experience} setExperience={(e) => update('experience', e)} />}
            {activeTab === 'skills' && <SkillsEditor skills={profile.skills} setSkills={(s) => update('skills', s)} />}
            {activeTab === 'achievements' && <ListEditor title="Achievements" icon="fa-trophy" items={profile.achievements} setItems={(i) => update('achievements', i)} fields={[{key:'title',label:'Title',placeholder:'Achievement title'},{key:'description',label:'Description',placeholder:'Details',type:'textarea'}]} />}
            {activeTab === 'awards' && <ListEditor title="Awards" icon="fa-award" items={profile.awards} setItems={(i) => update('awards', i)} fields={[{key:'title',label:'Award',placeholder:'Award name'},{key:'org',label:'Organization',placeholder:'Issuing org'},{key:'year',label:'Year',placeholder:'2024'}]} />}
            {activeTab === 'reviews' && <ListEditor title="Reviews" icon="fa-star" items={profile.reviews} setItems={(i) => update('reviews', i)} fields={[{key:'quote',label:'Quote',placeholder:'What they said',type:'textarea'},{key:'author',label:'Author',placeholder:'Name'},{key:'role',label:'Role',placeholder:'Title at Company'}]} />}
            {activeTab === 'pay' && <ListEditor title="Pay History" icon="fa-dollar-sign" items={profile.payHistory} setItems={(i) => update('payHistory', i)} fields={[{key:'year',label:'Year',placeholder:'2024'},{key:'base',label:'Base',placeholder:'$150,000'},{key:'bonus',label:'Bonus',placeholder:'$30,000'},{key:'equity',label:'Equity',placeholder:'$50,000'}]} />}
            {activeTab === 'projects' && <ListEditor title="Projects" icon="fa-project-diagram" items={profile.projects} setItems={(i) => update('projects', i)} fields={[{key:'name',label:'Name',placeholder:'Project name'},{key:'description',label:'Description',placeholder:'What you built',type:'textarea'},{key:'url',label:'URL',placeholder:'https://...'},{key:'tech',label:'Tech',placeholder:'React, Node, etc'}]} />}
            {activeTab === 'media' && <MediaEditor photos={profile.photos} videos={profile.videos} setPhotos={(p) => update('photos', p)} setVideos={(v) => update('videos', v)} />}
          </div>
        </div>
      );
    };
    
    const BasicsEditor = ({ profile, updateBasics, rawText }) => (
      <div>
        <div className="section-header">
          <i className="fas fa-user"></i>
          <h2>Basic Information</h2>
        </div>
        
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label"><i className="fas fa-id-card"></i> Full Name</label>
            <input type="text" className="form-input" value={profile.basics.name} onChange={(e) => updateBasics('name', e.target.value)} placeholder="John Smith" />
          </div>
          <div className="form-group">
            <label className="form-label"><i className="fas fa-briefcase"></i> Job Title</label>
            <input type="text" className="form-input" value={profile.basics.title} onChange={(e) => updateBasics('title', e.target.value)} placeholder="Senior Engineer" />
          </div>
          <div className="form-group full">
            <label className="form-label"><i className="fas fa-quote-left"></i> Professional Tagline</label>
            <input type="text" className="form-input" value={profile.basics.tagline} onChange={(e) => updateBasics('tagline', e.target.value)} placeholder="10+ years driving innovation..." />
          </div>
          <div className="form-group">
            <label className="form-label"><i className="fas fa-envelope"></i> Email</label>
            <input type="email" className="form-input" value={profile.basics.email} onChange={(e) => updateBasics('email', e.target.value)} placeholder="john@email.com" />
          </div>
          <div className="form-group">
            <label className="form-label"><i className="fas fa-phone"></i> Phone</label>
            <input type="tel" className="form-input" value={profile.basics.phone} onChange={(e) => updateBasics('phone', e.target.value)} placeholder="+1 555 123 4567" />
          </div>
          <div className="form-group">
            <label className="form-label"><i className="fas fa-map-marker-alt"></i> Location</label>
            <input type="text" className="form-input" value={profile.basics.location} onChange={(e) => updateBasics('location', e.target.value)} placeholder="San Francisco, CA" />
          </div>
          <div className="form-group">
            <label className="form-label"><i className="fab fa-linkedin"></i> LinkedIn</label>
            <input type="text" className="form-input" value={profile.basics.linkedin} onChange={(e) => updateBasics('linkedin', e.target.value)} placeholder="linkedin.com/in/..." />
          </div>
        </div>
        
        {rawText && (
          <details style={{ marginTop: '32px' }}>
            <summary style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontWeight: '600', padding: '12px 0' }}>
              <i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i>
              View Extracted Text
            </summary>
            <pre style={{ marginTop: '12px', padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', maxHeight: '200px', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
              {rawText}
            </pre>
          </details>
        )}
      </div>
    );
    
    const ExperienceEditor = ({ experience, setExperience }) => {
      const add = () => setExperience([...experience, {
        id: Date.now(), company: '', role: '', startDate: '', endDate: '', description: '', tasks: '',
        dayInLife: [{time:'9:00 AM',activity:''},{time:'11:00 AM',activity:''},{time:'1:00 PM',activity:''},{time:'3:00 PM',activity:''},{time:'5:00 PM',activity:''}],
        metrics: [{value:'',label:''},{value:'',label:''},{value:'',label:''},{value:'',label:''}]
      }]);
      
      const update = (i, field, val) => {
        const u = [...experience];
        u[i] = { ...u[i], [field]: val };
        setExperience(u);
      };
      
      const remove = (i) => setExperience(experience.filter((_, idx) => idx !== i));
      
      const updateMetric = (ei, mi, field, val) => {
        const u = [...experience];
        u[ei].metrics[mi][field] = val;
        setExperience(u);
      };
      
      const updateDay = (ei, di, val) => {
        const u = [...experience];
        u[ei].dayInLife[di].activity = val;
        setExperience(u);
      };
      
      return (
        <div>
          <div className="section-header">
            <i className="fas fa-briefcase"></i>
            <h2>Work Experience</h2>
            <span className="count">{experience.length} entries</span>
          </div>
          
          {experience.map((exp, i) => (
            <div key={exp.id} className="glass-subtle exp-entry">
              <div className="exp-header">
                <div className="exp-num">{i + 1}</div>
                <button className="btn-icon danger" onClick={() => remove(i)}><i className="fas fa-trash"></i></button>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input type="text" className="form-input" value={exp.company} onChange={(e) => update(i, 'company', e.target.value)} placeholder="Company Name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <input type="text" className="form-input" value={exp.role} onChange={(e) => update(i, 'role', e.target.value)} placeholder="Job Title" />
                </div>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input type="text" className="form-input" value={exp.startDate} onChange={(e) => update(i, 'startDate', e.target.value)} placeholder="Jan 2020" />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input type="text" className="form-input" value={exp.endDate} onChange={(e) => update(i, 'endDate', e.target.value)} placeholder="Present" />
                </div>
                <div className="form-group full">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" value={exp.description} onChange={(e) => update(i, 'description', e.target.value)} placeholder="Describe your role..." />
                </div>
              </div>
              
              <div className="day-section">
                <div className="day-title"><i className="fas fa-sun"></i> A Day in the Life</div>
                {exp.dayInLife.map((d, di) => (
                  <div key={di} className="day-item">
                    <span className="day-time">{d.time}</span>
                    <input type="text" className="day-input" value={d.activity} onChange={(e) => updateDay(i, di, e.target.value)} placeholder="What did you do?" />
                  </div>
                ))}
              </div>
              
              <div className="metrics-section">
                <div className="metrics-title"><i className="fas fa-chart-line"></i> Impact Metrics</div>
                <div className="metrics-grid">
                  {exp.metrics.map((m, mi) => (
                    <div key={mi} className="metric-box">
                      <input type="text" value={m.value} onChange={(e) => updateMetric(i, mi, 'value', e.target.value)} placeholder="+40%" />
                      <input type="text" value={m.label} onChange={(e) => updateMetric(i, mi, 'label', e.target.value)} placeholder="METRIC" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          <button className="btn-ghost" onClick={add}>
            <i className="fas fa-plus"></i> Add Experience
          </button>
        </div>
      );
    };
    
    const SkillsEditor = ({ skills, setSkills }) => {
      const [input, setInput] = useState('');
      const add = () => { if (input.trim()) { setSkills([...skills, input.trim()]); setInput(''); } };
      const remove = (i) => setSkills(skills.filter((_, idx) => idx !== i));
      
      return (
        <div>
          <div className="section-header">
            <i className="fas fa-code"></i>
            <h2>Skills</h2>
            <span className="count">{skills.length} skills</span>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input type="text" className="form-input" style={{ flex: 1 }} value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && add()} placeholder="Add a skill..." />
            <button className="btn btn-primary" onClick={add}><i className="fas fa-plus"></i> Add</button>
          </div>
          
          <div className="skills-wrap">
            {skills.map((skill, i) => (
              <div key={i} className="skill-tag">
                {skill}
                <button className="skill-remove" onClick={() => remove(i)}><i className="fas fa-times"></i></button>
              </div>
            ))}
          </div>
        </div>
      );
    };
    
    const ListEditor = ({ title, icon, items, setItems, fields }) => {
      const add = () => {
        const item = { id: Date.now() };
        fields.forEach(f => item[f.key] = '');
        setItems([...items, item]);
      };
      const update = (i, key, val) => {
        const u = [...items];
        u[i] = { ...u[i], [key]: val };
        setItems(u);
      };
      const remove = (i) => setItems(items.filter((_, idx) => idx !== i));
      
      return (
        <div>
          <div className="section-header">
            <i className={'fas ' + icon}></i>
            <h2>{title}</h2>
            <span className="count">{items.length} entries</span>
          </div>
          
          {items.map((item, i) => (
            <div key={item.id} className="glass-subtle exp-entry">
              <div className="exp-header">
                <div className="exp-num">{i + 1}</div>
                <button className="btn-icon danger" onClick={() => remove(i)}><i className="fas fa-trash"></i></button>
              </div>
              <div className="form-grid">
                {fields.map(f => (
                  <div key={f.key} className={'form-group' + (f.type === 'textarea' ? ' full' : '')}>
                    <label className="form-label">{f.label}</label>
                    {f.type === 'textarea' ? (
                      <textarea className="form-textarea" value={item[f.key] || ''} onChange={(e) => update(i, f.key, e.target.value)} placeholder={f.placeholder} />
                    ) : (
                      <input type="text" className="form-input" value={item[f.key] || ''} onChange={(e) => update(i, f.key, e.target.value)} placeholder={f.placeholder} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <button className="btn-ghost" onClick={add}><i className="fas fa-plus"></i> Add {title.replace(/s$/, '')}</button>
        </div>
      );
    };
    
    const MediaEditor = ({ photos, videos, setPhotos, setVideos }) => {
      const photoRef = useRef(null);
      const videoRef = useRef(null);
      
      const addPhotos = (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = files.map(f => ({ id: Date.now() + Math.random(), name: f.name, url: URL.createObjectURL(f) }));
        setPhotos([...photos, ...newPhotos]);
      };
      
      const addVideos = (e) => {
        const files = Array.from(e.target.files);
        const newVideos = files.map(f => ({ id: Date.now() + Math.random(), name: f.name, url: URL.createObjectURL(f) }));
        setVideos([...videos, ...newVideos]);
      };
      
      return (
        <div>
          <div className="section-header">
            <i className="fas fa-image"></i>
            <h2>Media</h2>
          </div>
          
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '16px', color: '#4facfe', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-camera"></i> Photos
            </h3>
            <input type="file" ref={photoRef} onChange={addPhotos} accept="image/*" multiple style={{ display: 'none' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
              {photos.map(p => (
                <div key={p.id} style={{ aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => setPhotos(photos.filter(x => x.id !== p.id))} style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
              <button onClick={() => photoRef.current?.click()} style={{ aspectRatio: '1', borderRadius: '12px', border: '2px dashed rgba(255,255,255,0.15)', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'rgba(255,255,255,0.5)' }}>
                <i className="fas fa-plus" style={{ fontSize: '24px' }}></i>
                <span style={{ fontSize: '12px' }}>Add Photo</span>
              </button>
            </div>
          </div>
          
          <div>
            <h3 style={{ fontSize: '16px', color: '#f093fb', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-video"></i> Videos
            </h3>
            <input type="file" ref={videoRef} onChange={addVideos} accept="video/*" multiple style={{ display: 'none' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {videos.map(v => (
                <div key={v.id} style={{ aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.1)', background: '#0f0f23' }}>
                  <video src={v.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => setVideos(videos.filter(x => x.id !== v.id))} style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
              <button onClick={() => videoRef.current?.click()} style={{ aspectRatio: '16/9', borderRadius: '12px', border: '2px dashed rgba(255,255,255,0.15)', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'rgba(255,255,255,0.5)' }}>
                <i className="fas fa-plus" style={{ fontSize: '24px' }}></i>
                <span style={{ fontSize: '12px' }}>Add Video</span>
              </button>
            </div>
          </div>
        </div>
      );
    };
    
    const PreviewView = ({ profile, setView }) => (
      <div className="fade-in">
        <div className="glass" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Live Preview</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>How recruiters will see your profile</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={() => setView(VIEWS.BUILDER)}><i className="fas fa-edit"></i> Edit</button>
              <button className="btn btn-primary"><i className="fas fa-share"></i> Publish</button>
            </div>
          </div>
        </div>
        
        <div className="glass-strong" style={{ padding: '48px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '120px', height: '120px', margin: '0 auto 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: '700', boxShadow: '0 16px 40px rgba(102, 126, 234, 0.4)' }}>
            {profile.basics.name ? profile.basics.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?'}
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>{profile.basics.name || 'Your Name'}</h1>
          <p style={{ fontSize: '20px', color: '#4facfe', fontWeight: '600', marginBottom: '12px' }}>{profile.basics.title || 'Your Title'}</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto', fontSize: '16px', lineHeight: '1.6' }}>{profile.basics.tagline || 'Your professional tagline'}</p>
          
          {profile.skills.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '28px' }}>
              {profile.skills.slice(0, 8).map((s, i) => (
                <span key={i} className="skill-tag">{s}</span>
              ))}
            </div>
          )}
        </div>
        
        {profile.experience.length > 0 && (
          <div className="glass-strong" style={{ padding: '32px' }}>
            <div className="section-header">
              <i className="fas fa-briefcase"></i>
              <h2>Career Timeline</h2>
            </div>
            
            <div className="timeline">
              {profile.experience.map((exp, i) => (
                <div key={exp.id} className="glass-subtle timeline-item">
                  <h3 className="timeline-company">{exp.company || 'Company'}</h3>
                  <p className="timeline-role">{exp.role || 'Role'}</p>
                  <span className="timeline-dates">{exp.startDate || 'Start'} — {exp.endDate || 'End'}</span>
                  <p className="timeline-desc">{exp.description || 'Description...'}</p>
                  
                  {exp.metrics.some(m => m.value) && (
                    <div className="preview-metrics">
                      {exp.metrics.filter(m => m.value).map((m, mi) => (
                        <div key={mi} className="preview-metric">
                          <div className="preview-metric-val">{m.value}</div>
                          <div className="preview-metric-label">{m.label}</div>
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
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`)
})

export default app
