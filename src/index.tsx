import { Hono } from 'hono'

const app = new Hono()

// Gemini API Key
const GEMINI_API_KEY = 'AIzaSyB9jQaRGkfj4Tyq5y5j45RiYAeb_H2e-2g';

// ============================================
// AI RESUME PARSING ENDPOINT - FIXED MODEL
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
    
    // Clean and parse JSON
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
// WEBUME: THE FUTURE OF PROFESSIONAL PROFILES
// Ultra Premium Futuristic Design
// ============================================

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WEBUME | The Future of Professional Profiles</title>
  <meta name="description" content="Not a resume. An empire. Transform your career into undeniable proof of impact.">
  
  <!-- React 18 -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  
  <!-- PDF.js -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
  <script>pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';</script>
  
  <!-- Mammoth.js for DOCX -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  
  <!-- Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <style>
    /* ============================================
       WEBUME ULTRA - FUTURISTIC DESIGN SYSTEM
       The Future of Professional Profiles
       ============================================ */
    
    :root {
      /* Void Black Background */
      --void: #000000;
      --void-deep: #030308;
      --void-mid: #08081a;
      
      /* Electric Neon Colors */
      --neon-violet: #bf5fff;
      --neon-purple: #9333ea;
      --neon-magenta: #e11d9b;
      --neon-pink: #ff2d92;
      --neon-cyan: #00f0ff;
      --neon-blue: #0066ff;
      --neon-green: #00ff88;
      --neon-yellow: #ffe600;
      --neon-orange: #ff6600;
      --neon-red: #ff0055;
      
      /* Glass */
      --glass-light: rgba(255,255,255,0.03);
      --glass-medium: rgba(255,255,255,0.06);
      --glass-border: rgba(255,255,255,0.08);
      --glass-glow: rgba(255,255,255,0.12);
      
      /* Text */
      --text-white: #ffffff;
      --text-silver: #e8e8ff;
      --text-muted: #8888aa;
      --text-dim: #555577;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { height: 100%; }
    
    body {
      min-height: 100%;
      font-family: 'Rajdhani', sans-serif;
      background: var(--void);
      color: var(--text-white);
      overflow-x: hidden;
    }
    
    #root { min-height: 100vh; }
    
    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { 
      background: linear-gradient(180deg, var(--neon-violet), var(--neon-cyan));
      border-radius: 3px;
    }
    
    /* ============================================
       ANIMATED CYBER BACKGROUND
       ============================================ */
    .cyber-bg {
      position: fixed;
      inset: 0;
      z-index: 0;
      overflow: hidden;
      background: var(--void);
    }
    
    /* Massive gradient orbs */
    .cyber-bg::before {
      content: '';
      position: absolute;
      width: 150vw;
      height: 150vh;
      top: -50%;
      left: -25%;
      background: 
        radial-gradient(ellipse 60% 40% at 20% 30%, rgba(147,51,234,0.4) 0%, transparent 50%),
        radial-gradient(ellipse 50% 50% at 80% 20%, rgba(225,29,155,0.3) 0%, transparent 45%),
        radial-gradient(ellipse 40% 60% at 70% 80%, rgba(0,240,255,0.25) 0%, transparent 45%),
        radial-gradient(ellipse 50% 40% at 10% 90%, rgba(0,255,136,0.2) 0%, transparent 40%);
      animation: cosmicDrift 30s ease-in-out infinite;
    }
    
    @keyframes cosmicDrift {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(5%, -3%) rotate(2deg); }
      50% { transform: translate(-3%, 5%) rotate(-1deg); }
      75% { transform: translate(-5%, -2%) rotate(1deg); }
    }
    
    /* Cyber grid */
    .cyber-grid {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px);
      background-size: 80px 80px;
      transform: perspective(500px) rotateX(60deg);
      transform-origin: center top;
      animation: gridPulse 4s ease-in-out infinite;
    }
    
    @keyframes gridPulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 0.8; }
    }
    
    /* Floating particles */
    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: var(--neon-cyan);
      border-radius: 50%;
      box-shadow: 0 0 20px var(--neon-cyan), 0 0 40px var(--neon-cyan);
      animation: particleFloat 15s linear infinite;
    }
    
    @keyframes particleFloat {
      0% { transform: translateY(100vh) translateX(0); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-100vh) translateX(100px); opacity: 0; }
    }
    
    /* Scan lines */
    .scanlines {
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0,0,0,0.1) 2px,
        rgba(0,0,0,0.1) 4px
      );
      pointer-events: none;
      opacity: 0.3;
    }
    
    /* ============================================
       MAIN CONTAINER
       ============================================ */
    .main-container {
      position: relative;
      z-index: 1;
      min-height: 100vh;
      padding: 40px;
    }
    
    /* ============================================
       ULTRA HEADER
       ============================================ */
    .ultra-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 60px;
      padding: 30px 40px;
      background: linear-gradient(135deg, rgba(147,51,234,0.15) 0%, rgba(0,240,255,0.08) 100%);
      border: 1px solid var(--glass-border);
      border-radius: 24px;
      position: relative;
      overflow: hidden;
    }
    
    .ultra-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--neon-violet), var(--neon-cyan), var(--neon-pink));
    }
    
    .logo-section {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    
    .logo-icon {
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, var(--neon-violet), var(--neon-magenta));
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      position: relative;
      box-shadow: 
        0 0 40px rgba(147,51,234,0.5),
        inset 0 0 30px rgba(255,255,255,0.1);
      animation: logoPulse 3s ease-in-out infinite;
    }
    
    @keyframes logoPulse {
      0%, 100% { box-shadow: 0 0 40px rgba(147,51,234,0.5), inset 0 0 30px rgba(255,255,255,0.1); }
      50% { box-shadow: 0 0 60px rgba(147,51,234,0.7), inset 0 0 30px rgba(255,255,255,0.2); }
    }
    
    .logo-text {
      font-family: 'Orbitron', sans-serif;
      font-size: 36px;
      font-weight: 900;
      letter-spacing: 4px;
      background: linear-gradient(135deg, #fff 0%, var(--neon-cyan) 50%, var(--neon-violet) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 40px rgba(0,240,255,0.5);
    }
    
    .tagline {
      font-size: 14px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-top: 4px;
    }
    
    .header-stats {
      display: flex;
      gap: 40px;
    }
    
    .header-stat {
      text-align: center;
    }
    
    .header-stat-value {
      font-family: 'Orbitron', sans-serif;
      font-size: 32px;
      font-weight: 700;
      background: linear-gradient(135deg, var(--neon-cyan), var(--neon-green));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .header-stat-label {
      font-size: 12px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--text-muted);
    }
    
    /* ============================================
       NEON CARDS
       ============================================ */
    .neon-card {
      background: linear-gradient(135deg, rgba(20,20,40,0.8) 0%, rgba(10,10,25,0.9) 100%);
      border: 1px solid var(--glass-border);
      border-radius: 24px;
      padding: 40px;
      position: relative;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .neon-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--neon-violet), var(--neon-cyan), transparent);
      opacity: 0.7;
    }
    
    .neon-card::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(147,51,234,0.1) 0%, transparent 50%);
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }
    
    .neon-card:hover::after {
      opacity: 1;
    }
    
    .neon-card:hover {
      border-color: rgba(147,51,234,0.3);
      box-shadow: 
        0 0 60px rgba(147,51,234,0.2),
        0 20px 60px rgba(0,0,0,0.4);
      transform: translateY(-4px);
    }
    
    .card-glow {
      position: absolute;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
      pointer-events: none;
    }
    
    .card-glow.purple { background: var(--neon-violet); top: -100px; right: -100px; }
    .card-glow.cyan { background: var(--neon-cyan); bottom: -100px; left: -100px; }
    .card-glow.pink { background: var(--neon-pink); top: 50%; right: -100px; }
    
    /* ============================================
       UPLOAD ZONE - DRAMATIC
       ============================================ */
    .upload-zone {
      min-height: 500px;
      border: 3px dashed rgba(147,51,234,0.4);
      border-radius: 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, rgba(147,51,234,0.05) 0%, rgba(0,240,255,0.03) 100%);
    }
    
    .upload-zone::before {
      content: '';
      position: absolute;
      inset: 20px;
      border: 1px solid rgba(147,51,234,0.2);
      border-radius: 24px;
      pointer-events: none;
    }
    
    .upload-zone:hover, .upload-zone.drag-over {
      border-color: var(--neon-violet);
      background: linear-gradient(135deg, rgba(147,51,234,0.12) 0%, rgba(0,240,255,0.08) 100%);
      box-shadow: 
        0 0 100px rgba(147,51,234,0.3),
        inset 0 0 100px rgba(147,51,234,0.05);
    }
    
    .upload-zone.drag-over {
      transform: scale(1.02);
      border-style: solid;
    }
    
    .upload-icon-container {
      width: 160px;
      height: 160px;
      background: linear-gradient(135deg, var(--neon-violet), var(--neon-magenta), var(--neon-cyan));
      border-radius: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 40px;
      position: relative;
      box-shadow: 
        0 0 80px rgba(147,51,234,0.5),
        0 0 120px rgba(0,240,255,0.3);
      animation: uploadIconFloat 4s ease-in-out infinite;
    }
    
    @keyframes uploadIconFloat {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-15px) rotate(2deg); }
    }
    
    .upload-icon-container::before {
      content: '';
      position: absolute;
      inset: -3px;
      background: linear-gradient(135deg, var(--neon-cyan), var(--neon-violet), var(--neon-pink), var(--neon-cyan));
      border-radius: 43px;
      z-index: -1;
      animation: borderRotate 3s linear infinite;
    }
    
    @keyframes borderRotate {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
    
    .upload-icon-container i {
      font-size: 70px;
      color: white;
      filter: drop-shadow(0 0 20px rgba(255,255,255,0.5));
      animation: iconPulse 2s ease-in-out infinite;
    }
    
    @keyframes iconPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    
    .upload-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 2px;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #fff 0%, var(--neon-cyan) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .upload-subtitle {
      font-size: 18px;
      color: var(--text-muted);
      margin-bottom: 40px;
      letter-spacing: 1px;
    }
    
    .upload-formats {
      display: flex;
      gap: 20px;
    }
    
    .format-chip {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 28px;
      background: rgba(147,51,234,0.15);
      border: 1px solid rgba(147,51,234,0.3);
      border-radius: 50px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 600;
      color: var(--neon-violet);
      transition: all 0.3s ease;
    }
    
    .format-chip:hover {
      background: rgba(147,51,234,0.25);
      border-color: var(--neon-violet);
      box-shadow: 0 0 30px rgba(147,51,234,0.3);
    }
    
    .format-chip i {
      font-size: 18px;
    }
    
    /* ============================================
       AI PROCESSING ANIMATION
       ============================================ */
    .ai-processing {
      text-align: center;
      padding: 80px 40px;
    }
    
    .ai-brain {
      width: 200px;
      height: 200px;
      margin: 0 auto 50px;
      position: relative;
    }
    
    .ai-brain-core {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, var(--neon-violet), var(--neon-cyan));
      border-radius: 50%;
      box-shadow: 
        0 0 60px var(--neon-violet),
        0 0 100px var(--neon-cyan);
      animation: brainPulse 1.5s ease-in-out infinite;
    }
    
    @keyframes brainPulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 60px var(--neon-violet), 0 0 100px var(--neon-cyan); }
      50% { transform: translate(-50%, -50%) scale(1.1); box-shadow: 0 0 80px var(--neon-violet), 0 0 140px var(--neon-cyan); }
    }
    
    .ai-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 2px solid var(--neon-violet);
      border-radius: 50%;
      animation: ringExpand 2s ease-out infinite;
    }
    
    .ai-ring:nth-child(1) { animation-delay: 0s; }
    .ai-ring:nth-child(2) { animation-delay: 0.5s; }
    .ai-ring:nth-child(3) { animation-delay: 1s; }
    
    @keyframes ringExpand {
      0% { width: 100px; height: 100px; opacity: 1; }
      100% { width: 200px; height: 200px; opacity: 0; }
    }
    
    .ai-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 16px;
      background: linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-violet) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .ai-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 24px;
      background: linear-gradient(135deg, var(--neon-violet), var(--neon-magenta));
      border-radius: 50px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 2px;
      margin-bottom: 40px;
      box-shadow: 0 0 40px rgba(147,51,234,0.5);
    }
    
    .ai-dot {
      width: 10px;
      height: 10px;
      background: white;
      border-radius: 50%;
      animation: aiDotPulse 0.8s ease-in-out infinite;
    }
    
    @keyframes aiDotPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.7); }
    }
    
    .progress-bar-container {
      max-width: 600px;
      margin: 0 auto 40px;
    }
    
    .progress-bar-bg {
      height: 16px;
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
      overflow: hidden;
      position: relative;
    }
    
    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--neon-violet), var(--neon-cyan), var(--neon-green));
      border-radius: 8px;
      transition: width 0.3s ease;
      position: relative;
      box-shadow: 0 0 30px var(--neon-cyan);
    }
    
    .progress-bar-fill::after {
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
    
    .progress-percent {
      font-family: 'Orbitron', sans-serif;
      font-size: 48px;
      font-weight: 700;
      color: var(--neon-cyan);
      text-shadow: 0 0 40px var(--neon-cyan);
      margin-bottom: 30px;
    }
    
    .progress-steps {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 500px;
      margin: 0 auto;
    }
    
    .progress-step {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 24px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 16px;
      font-size: 16px;
      color: var(--text-dim);
      transition: all 0.3s ease;
    }
    
    .progress-step.active {
      background: rgba(147,51,234,0.1);
      border-color: rgba(147,51,234,0.3);
      color: var(--neon-violet);
      box-shadow: 0 0 30px rgba(147,51,234,0.2);
    }
    
    .progress-step.complete {
      background: rgba(0,255,136,0.08);
      border-color: rgba(0,255,136,0.3);
      color: var(--neon-green);
    }
    
    .progress-step i {
      width: 24px;
      font-size: 18px;
    }
    
    /* ============================================
       STAT CARDS - CYBERPUNK STYLE
       ============================================ */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      margin-bottom: 40px;
    }
    
    .stat-card {
      background: linear-gradient(135deg, rgba(20,20,40,0.9) 0%, rgba(10,10,25,0.95) 100%);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      padding: 30px;
      position: relative;
      overflow: hidden;
      transition: all 0.4s ease;
    }
    
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
    }
    
    .stat-card.violet::before { background: linear-gradient(90deg, transparent, var(--neon-violet), transparent); }
    .stat-card.cyan::before { background: linear-gradient(90deg, transparent, var(--neon-cyan), transparent); }
    .stat-card.pink::before { background: linear-gradient(90deg, transparent, var(--neon-pink), transparent); }
    .stat-card.green::before { background: linear-gradient(90deg, transparent, var(--neon-green), transparent); }
    
    .stat-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    
    .stat-card.violet:hover { border-color: var(--neon-violet); box-shadow: 0 0 60px rgba(147,51,234,0.3); }
    .stat-card.cyan:hover { border-color: var(--neon-cyan); box-shadow: 0 0 60px rgba(0,240,255,0.3); }
    .stat-card.pink:hover { border-color: var(--neon-pink); box-shadow: 0 0 60px rgba(255,45,146,0.3); }
    .stat-card.green:hover { border-color: var(--neon-green); box-shadow: 0 0 60px rgba(0,255,136,0.3); }
    
    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-bottom: 20px;
    }
    
    .stat-card.violet .stat-icon { background: rgba(147,51,234,0.2); color: var(--neon-violet); }
    .stat-card.cyan .stat-icon { background: rgba(0,240,255,0.2); color: var(--neon-cyan); }
    .stat-card.pink .stat-icon { background: rgba(255,45,146,0.2); color: var(--neon-pink); }
    .stat-card.green .stat-icon { background: rgba(0,255,136,0.2); color: var(--neon-green); }
    
    .stat-value {
      font-family: 'Orbitron', sans-serif;
      font-size: 42px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .stat-card.violet .stat-value { color: var(--neon-violet); text-shadow: 0 0 30px var(--neon-violet); }
    .stat-card.cyan .stat-value { color: var(--neon-cyan); text-shadow: 0 0 30px var(--neon-cyan); }
    .stat-card.pink .stat-value { color: var(--neon-pink); text-shadow: 0 0 30px var(--neon-pink); }
    .stat-card.green .stat-value { color: var(--neon-green); text-shadow: 0 0 30px var(--neon-green); }
    
    .stat-label {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--text-muted);
    }
    
    /* ============================================
       NAV TABS
       ============================================ */
    .nav-tabs {
      display: flex;
      gap: 8px;
      padding: 8px;
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      margin-bottom: 40px;
      overflow-x: auto;
    }
    
    .nav-tab {
      padding: 16px 28px;
      background: transparent;
      border: none;
      border-radius: 14px;
      color: var(--text-muted);
      font-family: 'Rajdhani', sans-serif;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 10px;
      white-space: nowrap;
    }
    
    .nav-tab:hover {
      color: var(--text-white);
      background: rgba(255,255,255,0.05);
    }
    
    .nav-tab.active {
      background: linear-gradient(135deg, var(--neon-violet), var(--neon-magenta));
      color: white;
      box-shadow: 0 0 40px rgba(147,51,234,0.4);
    }
    
    .nav-tab i {
      font-size: 16px;
    }
    
    /* ============================================
       FORM ELEMENTS - CYBER STYLE
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
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .form-label i {
      color: var(--neon-violet);
    }
    
    .form-input, .form-textarea {
      padding: 18px 22px;
      background: rgba(10,10,25,0.8);
      border: 2px solid rgba(255,255,255,0.08);
      border-radius: 14px;
      color: var(--text-white);
      font-family: 'Rajdhani', sans-serif;
      font-size: 16px;
      transition: all 0.3s ease;
    }
    
    .form-input:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--neon-violet);
      box-shadow: 0 0 30px rgba(147,51,234,0.2);
    }
    
    .form-input::placeholder, .form-textarea::placeholder {
      color: var(--text-dim);
    }
    
    .form-textarea {
      min-height: 140px;
      resize: vertical;
      line-height: 1.7;
    }
    
    /* ============================================
       BUTTONS - NEON STYLE
       ============================================ */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 18px 36px;
      border-radius: 14px;
      font-family: 'Rajdhani', sans-serif;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      position: relative;
      overflow: hidden;
    }
    
    .btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .btn:hover::before { opacity: 1; }
    
    .btn-primary {
      background: linear-gradient(135deg, var(--neon-violet), var(--neon-magenta));
      color: white;
      box-shadow: 0 0 40px rgba(147,51,234,0.4);
    }
    
    .btn-primary:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 60px rgba(147,51,234,0.5);
    }
    
    .btn-secondary {
      background: rgba(255,255,255,0.05);
      border: 2px solid rgba(255,255,255,0.1);
      color: var(--text-white);
    }
    
    .btn-secondary:hover {
      border-color: var(--neon-violet);
      box-shadow: 0 0 40px rgba(147,51,234,0.2);
    }
    
    .btn-cyan {
      background: linear-gradient(135deg, var(--neon-cyan), var(--neon-blue));
      color: white;
      box-shadow: 0 0 40px rgba(0,240,255,0.4);
    }
    
    .btn-add {
      width: 100%;
      padding: 24px;
      background: transparent;
      border: 2px dashed rgba(147,51,234,0.3);
      border-radius: 16px;
      color: var(--text-muted);
      font-family: 'Rajdhani', sans-serif;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .btn-add:hover {
      border-color: var(--neon-violet);
      color: var(--neon-violet);
      background: rgba(147,51,234,0.05);
    }
    
    /* ============================================
       EXPERIENCE ENTRIES
       ============================================ */
    .experience-entry {
      background: rgba(20,20,40,0.6);
      border: 1px solid var(--glass-border);
      border-left: 4px solid var(--neon-violet);
      border-radius: 20px;
      padding: 32px;
      margin-bottom: 24px;
      position: relative;
      transition: all 0.3s ease;
    }
    
    .experience-entry:hover {
      border-color: rgba(147,51,234,0.3);
      box-shadow: 0 0 40px rgba(147,51,234,0.1);
    }
    
    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 28px;
    }
    
    .experience-number {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, var(--neon-violet), var(--neon-magenta));
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Orbitron', sans-serif;
      font-size: 18px;
      font-weight: 700;
      box-shadow: 0 0 30px rgba(147,51,234,0.4);
    }
    
    .btn-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    
    .btn-icon:hover {
      background: rgba(255,255,255,0.1);
      color: var(--text-white);
    }
    
    .btn-icon.danger:hover {
      background: rgba(255,0,85,0.15);
      border-color: var(--neon-red);
      color: var(--neon-red);
    }
    
    /* ============================================
       METRICS
       ============================================ */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-top: 28px;
    }
    
    .metric-box {
      background: rgba(10,10,25,0.8);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 20px;
      text-align: center;
      transition: all 0.3s ease;
    }
    
    .metric-box:hover {
      border-color: var(--neon-violet);
      box-shadow: 0 0 30px rgba(147,51,234,0.15);
    }
    
    .metric-box input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      text-align: center;
      font-family: 'Orbitron', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: var(--neon-cyan);
      margin-bottom: 8px;
    }
    
    .metric-box input::placeholder {
      color: var(--text-dim);
      font-size: 20px;
    }
    
    .metric-label-input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      text-align: center;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
    }
    
    /* ============================================
       DAY IN LIFE
       ============================================ */
    .day-in-life-section {
      margin-top: 28px;
      padding: 24px;
      background: rgba(0,240,255,0.03);
      border: 1px solid rgba(0,240,255,0.1);
      border-radius: 16px;
    }
    
    .day-in-life-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--neon-cyan);
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .day-item {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
    }
    
    .day-time {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      color: var(--neon-violet);
      width: 100px;
      flex-shrink: 0;
    }
    
    .day-input {
      flex: 1;
      padding: 12px 16px;
      background: rgba(10,10,25,0.8);
      border: 1px solid var(--glass-border);
      border-radius: 10px;
      color: var(--text-white);
      font-size: 14px;
      transition: all 0.3s ease;
    }
    
    .day-input:focus {
      outline: none;
      border-color: var(--neon-cyan);
      box-shadow: 0 0 20px rgba(0,240,255,0.1);
    }
    
    /* ============================================
       SKILL TAGS
       ============================================ */
    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 24px;
    }
    
    .skill-tag {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      background: linear-gradient(135deg, rgba(147,51,234,0.15), rgba(0,240,255,0.1));
      border: 1px solid rgba(147,51,234,0.3);
      border-radius: 50px;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-silver);
      transition: all 0.3s ease;
    }
    
    .skill-tag:hover {
      border-color: var(--neon-violet);
      box-shadow: 0 0 20px rgba(147,51,234,0.2);
    }
    
    .skill-remove {
      background: none;
      border: none;
      color: var(--text-dim);
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      transition: color 0.3s ease;
    }
    
    .skill-remove:hover {
      color: var(--neon-red);
    }
    
    /* ============================================
       TIMELINE PREVIEW
       ============================================ */
    .timeline-preview {
      position: relative;
      padding-left: 60px;
    }
    
    .timeline-preview::before {
      content: '';
      position: absolute;
      left: 20px;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(180deg, var(--neon-violet), var(--neon-cyan), var(--neon-pink));
      border-radius: 2px;
      box-shadow: 0 0 20px rgba(147,51,234,0.5);
    }
    
    .timeline-item {
      position: relative;
      margin-bottom: 40px;
      padding: 28px;
      background: rgba(20,20,40,0.7);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      transition: all 0.3s ease;
    }
    
    .timeline-item:hover {
      border-color: rgba(147,51,234,0.3);
      transform: translateX(8px);
    }
    
    .timeline-item::before {
      content: '';
      position: absolute;
      left: -52px;
      top: 32px;
      width: 24px;
      height: 24px;
      background: var(--neon-violet);
      border-radius: 50%;
      border: 4px solid var(--void);
      box-shadow: 0 0 30px var(--neon-violet);
    }
    
    .timeline-company {
      font-family: 'Orbitron', sans-serif;
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .timeline-role {
      font-size: 18px;
      font-weight: 600;
      color: var(--neon-cyan);
      margin-bottom: 12px;
    }
    
    .timeline-dates {
      display: inline-block;
      padding: 8px 18px;
      background: rgba(147,51,234,0.15);
      border: 1px solid rgba(147,51,234,0.3);
      border-radius: 50px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      color: var(--neon-violet);
      margin-bottom: 16px;
    }
    
    .timeline-desc {
      color: var(--text-muted);
      line-height: 1.8;
    }
    
    /* ============================================
       PREVIEW METRICS
       ============================================ */
    .preview-metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-top: 24px;
    }
    
    .preview-metric {
      background: rgba(0,240,255,0.05);
      border: 1px solid rgba(0,240,255,0.2);
      border-radius: 14px;
      padding: 20px;
      text-align: center;
      transition: all 0.3s ease;
    }
    
    .preview-metric:hover {
      border-color: var(--neon-cyan);
      box-shadow: 0 0 30px rgba(0,240,255,0.15);
    }
    
    .preview-metric-value {
      font-family: 'Orbitron', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: var(--neon-cyan);
      text-shadow: 0 0 20px var(--neon-cyan);
    }
    
    .preview-metric-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      margin-top: 8px;
    }
    
    /* ============================================
       EMPTY STATE
       ============================================ */
    .empty-state {
      text-align: center;
      padding: 100px 40px;
    }
    
    .empty-icon {
      width: 140px;
      height: 140px;
      margin: 0 auto 40px;
      background: linear-gradient(135deg, var(--neon-violet), var(--neon-magenta), var(--neon-cyan));
      border-radius: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 60px;
      box-shadow: 0 0 80px rgba(147,51,234,0.4);
      animation: emptyFloat 4s ease-in-out infinite;
    }
    
    @keyframes emptyFloat {
      0%, 100% { transform: translateY(0) rotate(-2deg); }
      50% { transform: translateY(-20px) rotate(2deg); }
    }
    
    .empty-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #fff 0%, var(--neon-cyan) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .empty-subtitle {
      color: var(--text-muted);
      font-size: 18px;
      margin-bottom: 40px;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }
    
    /* ============================================
       RESPONSIVE
       ============================================ */
    @media (max-width: 1200px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .metrics-grid, .preview-metrics { grid-template-columns: repeat(2, 1fr); }
    }
    
    @media (max-width: 768px) {
      .main-container { padding: 20px; }
      .ultra-header { flex-direction: column; gap: 24px; padding: 24px; }
      .header-stats { gap: 24px; }
      .stats-grid { grid-template-columns: 1fr; }
      .form-grid { grid-template-columns: 1fr; }
      .nav-tabs { flex-wrap: wrap; }
    }
    
    /* ============================================
       ANIMATIONS
       ============================================ */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .fade-in-up {
      animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes glowPulse {
      0%, 100% { filter: drop-shadow(0 0 20px currentColor); }
      50% { filter: drop-shadow(0 0 40px currentColor); }
    }
    
    .glow-pulse {
      animation: glowPulse 2s ease-in-out infinite;
    }
  </style>
</head>
<body>
  <!-- Cyber Background -->
  <div class="cyber-bg">
    <div class="cyber-grid"></div>
    <div class="scanlines"></div>
    ${[...Array(15)].map((_, i) => `<div class="particle" style="left: ${Math.random() * 100}%; animation-delay: ${Math.random() * 15}s;"></div>`).join('')}
  </div>
  
  <div id="root"></div>
  
  <script type="text/babel">
    const { useState, useEffect, useRef } = React;
    
    // Resume Parser
    const ResumeParser = {
      async parsePDF(file) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(' ') + '\\n';
        }
        return text;
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
    
    // Views
    const VIEWS = { UPLOAD: 'upload', BUILDER: 'builder', PREVIEW: 'preview' };
    
    // Main App
    const App = () => {
      const [view, setView] = useState(VIEWS.UPLOAD);
      const [profile, setProfile] = useState(null);
      const [processing, setProcessing] = useState(false);
      const [progress, setProgress] = useState(0);
      const [activeTab, setActiveTab] = useState('basics');
      const [rawText, setRawText] = useState('');
      const [steps, setSteps] = useState([
        { label: 'Reading document', status: 'pending' },
        { label: 'Extracting text content', status: 'pending' },
        { label: 'AI analyzing structure', status: 'pending' },
        { label: 'Identifying experiences', status: 'pending' },
        { label: 'Generating insights', status: 'pending' },
        { label: 'Building profile', status: 'pending' }
      ]);
      
      const handleUpload = async (file) => {
        setProcessing(true);
        setProgress(0);
        const s = [...steps];
        
        try {
          // Step 1: Read file
          s[0].status = 'active';
          setSteps([...s]);
          await new Promise(r => setTimeout(r, 400));
          
          const ext = file.name.split('.').pop().toLowerCase();
          let text = '';
          
          // Step 2: Extract text
          s[0].status = 'complete';
          s[1].status = 'active';
          setSteps([...s]);
          setProgress(15);
          
          if (ext === 'pdf') text = await ResumeParser.parsePDF(file);
          else if (ext === 'docx' || ext === 'doc') text = await ResumeParser.parseDOCX(file);
          else text = await ResumeParser.parseTXT(file);
          
          setRawText(text);
          console.log('Extracted text:', text);
          
          // Step 3: AI Analysis
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
            
            if (res.ok) {
              aiData = await res.json();
              console.log('AI parsed:', aiData);
            } else {
              const err = await res.json();
              console.error('AI error:', err);
            }
          } catch (e) {
            console.error('AI request failed:', e);
          }
          
          // Step 4-6: Process
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
          
          // Build profile
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
            basics: {
              name: ai.basics?.name || '',
              title: ai.basics?.title || '',
              tagline: ai.basics?.tagline || '',
              email: ai.basics?.email || '',
              phone: ai.basics?.phone || '',
              location: ai.basics?.location || '',
              linkedin: ai.basics?.linkedin || '',
              website: ai.basics?.website || ''
            },
            experience: (ai.experience || []).map((e, i) => ({
              id: Date.now() + i,
              company: e.company || '',
              role: e.role || '',
              startDate: e.startDate || '',
              endDate: e.endDate || '',
              description: e.description || '',
              tasks: e.tasks || '',
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
              ],
              toxicity: 5
            })),
            skills: ai.skills || [],
            education: ai.education || [],
            achievements: (ai.achievements || []).map((a, i) => ({
              id: Date.now() + i + 1000,
              title: a.title || '',
              description: a.description || ''
            })),
            awards: [],
            reviews: [],
            payHistory: [],
            projects: [],
            photos: [],
            videos: []
          };
        }
        
        // Fallback parsing
        const emailMatch = text.match(/[\\w.-]+@[\\w.-]+\\.\\w+/);
        const phoneMatch = text.match(/[\\+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4}/);
        const lines = text.split('\\n').filter(l => l.trim());
        const name = lines[0]?.trim() || '';
        
        return {
          basics: { name, title: '', tagline: '', email: emailMatch?.[0] || '', phone: phoneMatch?.[0] || '', location: '', linkedin: '', website: '' },
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
        <div className="main-container">
          <Header profile={profile} view={view} />
          
          {view === VIEWS.UPLOAD && (
            <UploadView 
              onUpload={handleUpload}
              processing={processing}
              progress={progress}
              steps={steps}
            />
          )}
          
          {view === VIEWS.BUILDER && profile && (
            <BuilderView
              profile={profile}
              setProfile={setProfile}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              rawText={rawText}
              setView={setView}
            />
          )}
          
          {view === VIEWS.PREVIEW && profile && (
            <PreviewView profile={profile} setView={setView} />
          )}
        </div>
      );
    };
    
    // Header
    const Header = ({ profile, view }) => (
      <header className="ultra-header fade-in-up">
        <div className="logo-section">
          <div className="logo-icon">⚡</div>
          <div>
            <div className="logo-text">WEBUME</div>
            <div className="tagline">The Future of Professional Profiles</div>
          </div>
        </div>
        
        <div className="header-stats">
          <div className="header-stat">
            <div className="header-stat-value">{profile?.experience?.length || 0}</div>
            <div className="header-stat-label">Experiences</div>
          </div>
          <div className="header-stat">
            <div className="header-stat-value">{profile?.skills?.length || 0}</div>
            <div className="header-stat-label">Skills</div>
          </div>
          <div className="header-stat">
            <div className="header-stat-value">{profile?.achievements?.length || 0}</div>
            <div className="header-stat-label">Achievements</div>
          </div>
        </div>
      </header>
    );
    
    // Upload View
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
          <div className="neon-card fade-in-up">
            <div className="card-glow purple"></div>
            <div className="card-glow cyan"></div>
            
            <div className="ai-processing">
              <div className="ai-brain">
                <div className="ai-brain-core"></div>
                <div className="ai-ring"></div>
                <div className="ai-ring"></div>
                <div className="ai-ring"></div>
              </div>
              
              <div className="ai-badge">
                <div className="ai-dot"></div>
                GEMINI AI PROCESSING
              </div>
              
              <div className="ai-title">Analyzing Your Resume</div>
              
              <div className="progress-percent">{Math.round(progress)}%</div>
              
              <div className="progress-bar-container">
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: progress + '%' }}></div>
                </div>
              </div>
              
              <div className="progress-steps">
                {steps.map((step, i) => (
                  <div key={i} className={'progress-step ' + step.status}>
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
        <div className="neon-card fade-in-up">
          <div className="card-glow purple"></div>
          <div className="card-glow cyan"></div>
          
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
            
            <div className="upload-icon-container">
              <i className="fas fa-cloud-upload-alt"></i>
            </div>
            
            <h2 className="upload-title">DROP YOUR RESUME</h2>
            <p className="upload-subtitle">Powered by Gemini AI • Instant extraction</p>
            
            <div className="upload-formats">
              <span className="format-chip"><i className="fas fa-file-pdf"></i> PDF</span>
              <span className="format-chip"><i className="fas fa-file-word"></i> DOCX</span>
              <span className="format-chip"><i className="fas fa-file-alt"></i> TXT</span>
            </div>
          </div>
        </div>
      );
    };
    
    // Builder View
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
        <div className="fade-in-up">
          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card violet">
              <div className="stat-icon"><i className="fas fa-briefcase"></i></div>
              <div className="stat-value">{profile.experience.length}</div>
              <div className="stat-label">Experiences</div>
            </div>
            <div className="stat-card cyan">
              <div className="stat-icon"><i className="fas fa-code"></i></div>
              <div className="stat-value">{profile.skills.length}</div>
              <div className="stat-label">Skills</div>
            </div>
            <div className="stat-card pink">
              <div className="stat-icon"><i className="fas fa-trophy"></i></div>
              <div className="stat-value">{profile.achievements.length}</div>
              <div className="stat-label">Achievements</div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon"><i className="fas fa-check-double"></i></div>
              <div className="stat-value">94%</div>
              <div className="stat-label">Complete</div>
            </div>
          </div>
          
          {/* Nav Tabs */}
          <div className="nav-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={'nav-tab' + (activeTab === tab.id ? ' active' : '')}
                onClick={() => setActiveTab(tab.id)}
              >
                <i className={'fas ' + tab.icon}></i>
                {tab.label}
              </button>
            ))}
            <button className="nav-tab" onClick={() => setView(VIEWS.PREVIEW)}>
              <i className="fas fa-eye"></i>
              Preview
            </button>
          </div>
          
          {/* Content */}
          <div className="neon-card">
            <div className="card-glow purple"></div>
            
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
    
    // Basics Editor
    const BasicsEditor = ({ profile, updateBasics, rawText }) => (
      <div>
        <h2 style={{ fontFamily: 'Orbitron', fontSize: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className="fas fa-user" style={{ color: 'var(--neon-violet)' }}></i>
          Basic Information
        </h2>
        
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
            <summary style={{ cursor: 'pointer', color: 'var(--text-muted)', fontWeight: '600' }}>
              View extracted raw text
            </summary>
            <pre style={{ marginTop: '16px', padding: '20px', background: 'rgba(10,10,25,0.8)', borderRadius: '12px', fontSize: '12px', color: 'var(--text-muted)', maxHeight: '200px', overflow: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'JetBrains Mono' }}>
              {rawText}
            </pre>
          </details>
        )}
      </div>
    );
    
    // Experience Editor
    const ExperienceEditor = ({ experience, setExperience }) => {
      const add = () => setExperience([...experience, {
        id: Date.now(), company: '', role: '', startDate: '', endDate: '', description: '', tasks: '',
        dayInLife: [{time:'9:00 AM',activity:''},{time:'11:00 AM',activity:''},{time:'1:00 PM',activity:''},{time:'3:00 PM',activity:''},{time:'5:00 PM',activity:''}],
        metrics: [{value:'',label:''},{value:'',label:''},{value:'',label:''},{value:'',label:''}],
        toxicity: 5
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
          <h2 style={{ fontFamily: 'Orbitron', fontSize: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fas fa-briefcase" style={{ color: 'var(--neon-violet)' }}></i>
            Work Experience
            <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'Rajdhani' }}>{experience.length} entries</span>
          </h2>
          
          {experience.map((exp, i) => (
            <div key={exp.id} className="experience-entry">
              <div className="experience-header">
                <div className="experience-number">{i + 1}</div>
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
                  <textarea className="form-textarea" value={exp.description} onChange={(e) => update(i, 'description', e.target.value)} placeholder="Describe your role and accomplishments..." />
                </div>
              </div>
              
              {/* Day in Life */}
              <div className="day-in-life-section">
                <div className="day-in-life-title">
                  <i className="fas fa-sun"></i>
                  A Day in the Life
                </div>
                {exp.dayInLife.map((d, di) => (
                  <div key={di} className="day-item">
                    <span className="day-time">{d.time}</span>
                    <input type="text" className="day-input" value={d.activity} onChange={(e) => updateDay(i, di, e.target.value)} placeholder="What did you typically do?" />
                  </div>
                ))}
              </div>
              
              {/* Metrics */}
              <div style={{ marginTop: '28px' }}>
                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--neon-cyan)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fas fa-chart-line"></i>
                  Impact Metrics
                </div>
                <div className="metrics-grid">
                  {exp.metrics.map((m, mi) => (
                    <div key={mi} className="metric-box">
                      <input type="text" value={m.value} onChange={(e) => updateMetric(i, mi, 'value', e.target.value)} placeholder="+40%" />
                      <input type="text" className="metric-label-input" value={m.label} onChange={(e) => updateMetric(i, mi, 'label', e.target.value)} placeholder="METRIC" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          <button className="btn-add" onClick={add}>
            <i className="fas fa-plus"></i> Add Experience
          </button>
        </div>
      );
    };
    
    // Skills Editor
    const SkillsEditor = ({ skills, setSkills }) => {
      const [input, setInput] = useState('');
      const add = () => { if (input.trim()) { setSkills([...skills, input.trim()]); setInput(''); } };
      const remove = (i) => setSkills(skills.filter((_, idx) => idx !== i));
      
      return (
        <div>
          <h2 style={{ fontFamily: 'Orbitron', fontSize: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fas fa-code" style={{ color: 'var(--neon-violet)' }}></i>
            Skills
            <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'Rajdhani' }}>{skills.length} skills</span>
          </h2>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
            <input type="text" className="form-input" style={{ flex: 1 }} value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && add()} placeholder="Add a skill..." />
            <button className="btn btn-primary" onClick={add}><i className="fas fa-plus"></i> Add</button>
          </div>
          
          <div className="skills-container">
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
    
    // List Editor (Generic)
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
          <h2 style={{ fontFamily: 'Orbitron', fontSize: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className={'fas ' + icon} style={{ color: 'var(--neon-violet)' }}></i>
            {title}
            <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'Rajdhani' }}>{items.length} entries</span>
          </h2>
          
          {items.map((item, i) => (
            <div key={item.id} className="experience-entry">
              <div className="experience-header">
                <div className="experience-number">{i + 1}</div>
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
          
          <button className="btn-add" onClick={add}>
            <i className="fas fa-plus"></i> Add {title.replace(/s$/, '')}
          </button>
        </div>
      );
    };
    
    // Media Editor
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
          <h2 style={{ fontFamily: 'Orbitron', fontSize: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fas fa-image" style={{ color: 'var(--neon-violet)' }}></i>
            Media
          </h2>
          
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '18px', color: 'var(--neon-cyan)', marginBottom: '20px' }}><i className="fas fa-camera"></i> Photos</h3>
            <input type="file" ref={photoRef} onChange={addPhotos} accept="image/*" multiple style={{ display: 'none' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
              {photos.map(p => (
                <div key={p.id} style={{ aspectRatio: '1', borderRadius: '16px', overflow: 'hidden', position: 'relative', border: '1px solid var(--glass-border)' }}>
                  <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => setPhotos(photos.filter(x => x.id !== p.id))} style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', cursor: 'pointer' }}><i className="fas fa-times"></i></button>
                </div>
              ))}
              <button onClick={() => photoRef.current?.click()} style={{ aspectRatio: '1', borderRadius: '16px', border: '2px dashed var(--glass-border)', background: 'var(--glass-light)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <i className="fas fa-plus" style={{ fontSize: '24px' }}></i>
                <span style={{ fontSize: '12px' }}>Add Photo</span>
              </button>
            </div>
          </div>
          
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--neon-pink)', marginBottom: '20px' }}><i className="fas fa-video"></i> Videos</h3>
            <input type="file" ref={videoRef} onChange={addVideos} accept="video/*" multiple style={{ display: 'none' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {videos.map(v => (
                <div key={v.id} style={{ aspectRatio: '16/9', borderRadius: '16px', overflow: 'hidden', position: 'relative', border: '1px solid var(--glass-border)', background: 'var(--void-mid)' }}>
                  <video src={v.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => setVideos(videos.filter(x => x.id !== v.id))} style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', cursor: 'pointer' }}><i className="fas fa-times"></i></button>
                </div>
              ))}
              <button onClick={() => videoRef.current?.click()} style={{ aspectRatio: '16/9', borderRadius: '16px', border: '2px dashed var(--glass-border)', background: 'var(--glass-light)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                <i className="fas fa-plus" style={{ fontSize: '24px' }}></i>
                <span style={{ fontSize: '12px' }}>Add Video</span>
              </button>
            </div>
          </div>
        </div>
      );
    };
    
    // Preview View
    const PreviewView = ({ profile, setView }) => (
      <div className="fade-in-up">
        <div className="neon-card" style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: 'Orbitron', fontSize: '28px', marginBottom: '8px' }}>Live Preview</h2>
              <p style={{ color: 'var(--text-muted)' }}>How recruiters will see your profile</p>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn btn-secondary" onClick={() => setView(VIEWS.BUILDER)}><i className="fas fa-edit"></i> Edit</button>
              <button className="btn btn-primary"><i className="fas fa-share"></i> Publish</button>
            </div>
          </div>
        </div>
        
        {/* Profile Card */}
        <div className="neon-card" style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="card-glow purple"></div>
          <div style={{ width: '140px', height: '140px', margin: '0 auto 32px', background: 'linear-gradient(135deg, var(--neon-violet), var(--neon-magenta), var(--neon-cyan))', borderRadius: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: '700', fontFamily: 'Orbitron', boxShadow: '0 0 60px rgba(147,51,234,0.5)' }}>
            {profile.basics.name ? profile.basics.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?'}
          </div>
          <h1 style={{ fontFamily: 'Orbitron', fontSize: '36px', fontWeight: '700', marginBottom: '12px' }}>{profile.basics.name || 'Your Name'}</h1>
          <p style={{ fontSize: '22px', color: 'var(--neon-cyan)', fontWeight: '600', marginBottom: '16px' }}>{profile.basics.title || 'Your Title'}</p>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '18px' }}>{profile.basics.tagline || 'Your professional tagline'}</p>
          
          {profile.skills.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '32px' }}>
              {profile.skills.slice(0, 8).map((s, i) => (
                <span key={i} className="skill-tag">{s}</span>
              ))}
            </div>
          )}
        </div>
        
        {/* Timeline */}
        {profile.experience.length > 0 && (
          <div className="neon-card">
            <div className="card-glow cyan"></div>
            <h2 style={{ fontFamily: 'Orbitron', fontSize: '24px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <i className="fas fa-briefcase" style={{ color: 'var(--neon-violet)' }}></i>
              Career Timeline
            </h2>
            
            <div className="timeline-preview">
              {profile.experience.map((exp, i) => (
                <div key={exp.id} className="timeline-item">
                  <h3 className="timeline-company">{exp.company || 'Company'}</h3>
                  <p className="timeline-role">{exp.role || 'Role'}</p>
                  <span className="timeline-dates">{exp.startDate || 'Start'} — {exp.endDate || 'End'}</span>
                  <p className="timeline-desc">{exp.description || 'Description...'}</p>
                  
                  {exp.metrics.some(m => m.value) && (
                    <div className="preview-metrics">
                      {exp.metrics.filter(m => m.value).map((m, mi) => (
                        <div key={mi} className="preview-metric">
                          <div className="preview-metric-value">{m.value}</div>
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
    
    // Render
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`)
})

export default app
