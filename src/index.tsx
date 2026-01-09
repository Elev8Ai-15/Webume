import { Hono } from 'hono'

const app = new Hono()

const GEMINI_API_KEY = 'AIzaSyB9jQaRGkfj4Tyq5y5j45RiYAeb_H2e-2g';

app.post('/api/parse-resume', async (c) => {
  try {
    const { text } = await c.req.json();
    
    const prompt = `You are an expert resume parser. Analyze this resume and extract ALL information into JSON.

RESUME:
${text}

Return EXACT JSON:
{
  "basics": {
    "name": "full name",
    "title": "job title",
    "tagline": "1-line summary",
    "email": "email",
    "phone": "phone",
    "location": "city, state",
    "linkedin": "url",
    "website": "url"
  },
  "experience": [
    {
      "company": "company",
      "role": "title",
      "startDate": "date",
      "endDate": "date",
      "description": "description",
      "dayInLife": [
        {"time": "9:00 AM", "activity": "activity"},
        {"time": "11:00 AM", "activity": "activity"},
        {"time": "1:00 PM", "activity": "activity"},
        {"time": "3:00 PM", "activity": "activity"},
        {"time": "5:00 PM", "activity": "activity"}
      ],
      "metrics": [
        {"value": "value", "label": "label"}
      ]
    }
  ],
  "skills": ["skill1", "skill2"],
  "achievements": [{"title": "title", "description": "desc"}]
}

Rules: Extract ALL experiences. Find ALL metrics. Generate realistic day-in-life. Return ONLY JSON.`;

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

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Webumé | Your WebApp Resume</title>
  <link rel="icon" type="image/png" href="/static/logo.png">
  <meta name="description" content="Transform your resume into an immersive digital experience">
  
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
  <script>pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';</script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script>
  
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <style>
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
    
    /* ===========================================================
       PREMIUM BACKGROUND - Glass Cards Image with Blur
       Using the beautiful glass cards image as background
       =========================================================== */
    .premium-bg {
      position: fixed;
      inset: 0;
      background: #0a0a12;
      overflow: hidden;
    }
    
    /* Background image with blur effect */
    .bg-image {
      position: absolute;
      inset: -50px;
      background-image: url('/static/background.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      filter: blur(30px) brightness(0.6) saturate(1.3);
      transform: scale(1.1);
      opacity: 0.85;
    }
    
    /* Gradient overlay for depth */
    .bg-gradient {
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(ellipse at 20% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 100%, rgba(6, 182, 212, 0.1) 0%, transparent 40%),
        linear-gradient(180deg, rgba(10, 10, 18, 0.3) 0%, rgba(10, 10, 18, 0.7) 100%);
    }
    
    /* Subtle noise texture overlay */
    .noise-overlay {
      position: absolute;
      inset: 0;
      opacity: 0.04;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      pointer-events: none;
    }
    
    /* ===========================================================
       GLASSMORPHISM COMPONENTS
       Semi-transparent cards with blur effect
       =========================================================== */
    .glass {
      background: rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
    }
    
    .glass-card {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(30px);
      -webkit-backdrop-filter: blur(30px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 24px;
      box-shadow: 
        0 4px 30px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
    
    .glass-sidebar {
      background: rgba(15, 8, 24, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-right: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    .glass-input {
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
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
    
    /* ===========================================================
       LAYOUT - Dashboard Style with Sidebar
       =========================================================== */
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
    
    /* ===========================================================
       STAT CARDS GRID
       =========================================================== */
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
    
    /* ===========================================================
       UPLOAD ZONE
       =========================================================== */
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
    
    /* ===========================================================
       PROCESSING STATE
       =========================================================== */
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
    
    /* ===========================================================
       FORM ELEMENTS
       =========================================================== */
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
    
    /* ===========================================================
       BUTTONS
       =========================================================== */
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
    
    /* ===========================================================
       EXPERIENCE CARDS
       =========================================================== */
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
    
    /* ===========================================================
       SKILLS CHIPS
       =========================================================== */
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
    
    /* ===========================================================
       PREVIEW PAGE
       =========================================================== */
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
    
    /* ===========================================================
       RESPONSIVE
       =========================================================== */
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
    const { useState, useRef } = React;
    
    // File Parsers
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
    
    const VIEW = { UPLOAD: 1, BUILDER: 2, PREVIEW: 3 };
    
    const App = () => {
      const [view, setView] = useState(VIEW.UPLOAD);
      const [profile, setProfile] = useState(null);
      const [loading, setLoading] = useState(false);
      const [progress, setProgress] = useState(0);
      const [activeTab, setTab] = useState('basics');
      const [rawText, setRawText] = useState('');
      const [steps, setSteps] = useState([
        { text: 'Reading file', state: 'pending' },
        { text: 'Extracting text', state: 'pending' },
        { text: 'AI analyzing', state: 'pending' },
        { text: 'Finding experiences', state: 'pending' },
        { text: 'Generating insights', state: 'pending' },
        { text: 'Building profile', state: 'pending' }
      ]);
      
      const processFile = async (file) => {
        setLoading(true);
        setProgress(0);
        const st = [...steps];
        
        try {
          // Step 1: Reading file
          st[0].state = 'active';
          setSteps([...st]);
          await new Promise(r => setTimeout(r, 300));
          
          // Step 2: Extracting text
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
          
          // Step 3: AI analyzing
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
          
          // Step 4: Finding experiences
          st[2].state = 'done';
          st[3].state = 'active';
          setSteps([...st]);
          setProgress(55);
          await new Promise(r => setTimeout(r, 300));
          
          // Step 5: Generating insights
          st[3].state = 'done';
          st[4].state = 'active';
          setSteps([...st]);
          setProgress(75);
          await new Promise(r => setTimeout(r, 300));
          
          // Step 6: Building profile
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
          alert('Error processing file: ' + err.message);
          setLoading(false);
        }
      };
      
      const buildProfile = (aiData, text) => {
        if (aiData && !aiData.error && aiData.basics) {
          return {
            basics: { ...aiData.basics },
            experience: (aiData.experience || []).map((e, i) => ({
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
            skills: aiData.skills || [],
            achievements: (aiData.achievements || []).map((a, i) => ({
              id: Date.now() + i + 1000,
              ...a
            })),
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
          basics: {
            name, title: '', tagline: '', email, phone,
            location: '', linkedin: '', website: ''
          },
          experience: [],
          skills: [],
          achievements: [],
          awards: [],
          reviews: [],
          payHistory: [],
          projects: [],
          photos: [],
          videos: []
        };
      };
      
      const navItems = [
        { id: 'basics', icon: 'fa-user', label: 'Basic Info' },
        { id: 'experience', icon: 'fa-briefcase', label: 'Experience' },
        { id: 'skills', icon: 'fa-code', label: 'Skills' },
        { id: 'achievements', icon: 'fa-trophy', label: 'Achievements' },
        { id: 'awards', icon: 'fa-award', label: 'Awards' },
        { id: 'reviews', icon: 'fa-star', label: 'Reviews' },
        { id: 'pay', icon: 'fa-dollar-sign', label: 'Pay History' },
        { id: 'projects', icon: 'fa-folder', label: 'Projects' },
        { id: 'media', icon: 'fa-image', label: 'Media' }
      ];
      
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
                <span className="stat-num">94%</span>
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
              />
            )}
            {view === VIEW.BUILDER && profile && (
              <BuilderView
                profile={profile}
                setProfile={setProfile}
                activeTab={activeTab}
                rawText={rawText}
              />
            )}
            {view === VIEW.PREVIEW && profile && (
              <PreviewView
                profile={profile}
                setView={setView}
              />
            )}
          </main>
        </div>
      );
    };
    
    // Upload View Component
    const UploadView = ({ onUpload, loading, progress, steps }) => {
      const [isDragging, setDragging] = useState(false);
      const fileInputRef = useRef(null);
      
      const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files[0]) {
          onUpload(e.dataTransfer.files[0]);
        }
      };
      
      if (loading) {
        return (
          <div className="glass-card upload-zone">
            <div className="processing-state">
              <div className="ai-visual">
                <div className="ai-core"></div>
                <div className="ai-ring"></div>
                <div className="ai-ring"></div>
                <div className="ai-ring"></div>
              </div>
              
              <div className="ai-badge">
                <div className="ai-badge-dot"></div>
                GEMINI AI
              </div>
              
              <h2 className="processing-title">Analyzing Your Resume</h2>
              <p className="processing-subtitle">Extracting career details and generating insights</p>
              
              <div className="progress-percent">{Math.round(progress)}%</div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: progress + '%' }}></div>
              </div>
              
              <div className="step-list">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className={'step-item' + (step.state === 'active' ? ' active' : step.state === 'done' ? ' done' : '')}
                  >
                    <i className={'fas ' + (step.state === 'done' ? 'fa-check' : step.state === 'active' ? 'fa-spinner fa-spin' : 'fa-circle')}></i>
                    {step.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      
      return (
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Upload Resume</h1>
              <p className="page-desc">Drop your resume to begin the AI-powered analysis</p>
            </div>
          </div>
          
          <div className="glass-card upload-zone">
            <div
              className={'dropzone' + (isDragging ? ' drag-active' : '')}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])}
                accept=".pdf,.docx,.doc,.txt"
                style={{ display: 'none' }}
              />
              
              <img src="/static/logo.png" alt="Webumé" className="upload-logo" />
              
              <div className="upload-icon-wrap">
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              
              <h2 className="upload-title">Drop Your Resume Here</h2>
              <p className="upload-subtitle">Powered by Gemini AI • Instant Career Analysis</p>
              
              <div className="format-pills">
                <span className="format-pill"><i className="fas fa-file-pdf"></i> PDF</span>
                <span className="format-pill"><i className="fas fa-file-word"></i> DOCX</span>
                <span className="format-pill"><i className="fas fa-file-alt"></i> TXT</span>
              </div>
            </div>
          </div>
        </div>
      );
    };
    
    // Builder View Component
    const BuilderView = ({ profile, setProfile, activeTab, rawText }) => {
      const updateField = (key, value) => setProfile(p => ({ ...p, [key]: value }));
      const updateBasics = (key, value) => setProfile(p => ({ ...p, basics: { ...p.basics, [key]: value } }));
      
      return (
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
              <p className="page-desc">Edit and customize your profile information</p>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="glass stat-card">
              <div className="stat-icon-wrap"><i className="fas fa-briefcase"></i></div>
              <div className="value">{profile.experience.length}</div>
              <div className="label">Experiences</div>
            </div>
            <div className="glass stat-card cyan">
              <div className="stat-icon-wrap"><i className="fas fa-code"></i></div>
              <div className="value">{profile.skills.length}</div>
              <div className="label">Skills</div>
            </div>
            <div className="glass stat-card green">
              <div className="stat-icon-wrap"><i className="fas fa-trophy"></i></div>
              <div className="value">{profile.achievements.length}</div>
              <div className="label">Achievements</div>
            </div>
          </div>
          
          {/* Content Card */}
          <div className="glass-card" style={{ padding: '28px' }}>
            {activeTab === 'basics' && (
              <BasicsEditor profile={profile} updateBasics={updateBasics} rawText={rawText} />
            )}
            {activeTab === 'experience' && (
              <ExperienceEditor
                experiences={profile.experience}
                setExperiences={(e) => updateField('experience', e)}
              />
            )}
            {activeTab === 'skills' && (
              <SkillsEditor
                skills={profile.skills}
                setSkills={(s) => updateField('skills', s)}
              />
            )}
            {activeTab === 'achievements' && (
              <ListEditor
                title="Achievements"
                items={profile.achievements}
                setItems={(i) => updateField('achievements', i)}
                fields={[
                  { key: 'title', label: 'Title', placeholder: 'Achievement title' },
                  { key: 'description', label: 'Description', placeholder: 'Details', textarea: true }
                ]}
              />
            )}
            {activeTab === 'awards' && (
              <ListEditor
                title="Awards"
                items={profile.awards}
                setItems={(i) => updateField('awards', i)}
                fields={[
                  { key: 'title', label: 'Award Name', placeholder: 'Award title' },
                  { key: 'org', label: 'Organization', placeholder: 'Issuing organization' },
                  { key: 'year', label: 'Year', placeholder: '2024' }
                ]}
              />
            )}
            {activeTab === 'reviews' && (
              <ListEditor
                title="Reviews"
                items={profile.reviews}
                setItems={(i) => updateField('reviews', i)}
                fields={[
                  { key: 'quote', label: 'Quote', placeholder: 'What they said', textarea: true },
                  { key: 'author', label: 'Author', placeholder: 'Name' },
                  { key: 'role', label: 'Role', placeholder: 'Title' }
                ]}
              />
            )}
            {activeTab === 'pay' && (
              <ListEditor
                title="Pay History"
                items={profile.payHistory}
                setItems={(i) => updateField('payHistory', i)}
                fields={[
                  { key: 'year', label: 'Year', placeholder: '2024' },
                  { key: 'base', label: 'Base Salary', placeholder: '$150,000' },
                  { key: 'bonus', label: 'Bonus', placeholder: '$30,000' },
                  { key: 'equity', label: 'Equity', placeholder: '$50,000' }
                ]}
              />
            )}
            {activeTab === 'projects' && (
              <ListEditor
                title="Projects"
                items={profile.projects}
                setItems={(i) => updateField('projects', i)}
                fields={[
                  { key: 'name', label: 'Project Name', placeholder: 'Project title' },
                  { key: 'description', label: 'Description', placeholder: 'What you built', textarea: true },
                  { key: 'url', label: 'URL', placeholder: 'https://...' },
                  { key: 'tech', label: 'Technologies', placeholder: 'React, Node, AWS' }
                ]}
              />
            )}
            {activeTab === 'media' && (
              <MediaEditor
                photos={profile.photos}
                videos={profile.videos}
                setPhotos={(p) => updateField('photos', p)}
                setVideos={(v) => updateField('videos', v)}
              />
            )}
          </div>
        </div>
      );
    };
    
    // Basics Editor
    const BasicsEditor = ({ profile, updateBasics, rawText }) => (
      <div>
        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Full Name</label>
            <input
              className="glass-input"
              value={profile.basics.name}
              onChange={(e) => updateBasics('name', e.target.value)}
              placeholder="John Smith"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Job Title</label>
            <input
              className="glass-input"
              value={profile.basics.title}
              onChange={(e) => updateBasics('title', e.target.value)}
              placeholder="Senior Software Engineer"
            />
          </div>
          <div className="form-field full-width">
            <label className="form-label">Professional Tagline</label>
            <input
              className="glass-input"
              value={profile.basics.tagline}
              onChange={(e) => updateBasics('tagline', e.target.value)}
              placeholder="Building scalable systems that drive business growth"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              className="glass-input"
              value={profile.basics.email}
              onChange={(e) => updateBasics('email', e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Phone</label>
            <input
              className="glass-input"
              value={profile.basics.phone}
              onChange={(e) => updateBasics('phone', e.target.value)}
              placeholder="+1 555 123 4567"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Location</label>
            <input
              className="glass-input"
              value={profile.basics.location}
              onChange={(e) => updateBasics('location', e.target.value)}
              placeholder="San Francisco, CA"
            />
          </div>
          <div className="form-field">
            <label className="form-label">LinkedIn</label>
            <input
              className="glass-input"
              value={profile.basics.linkedin}
              onChange={(e) => updateBasics('linkedin', e.target.value)}
              placeholder="linkedin.com/in/johnsmith"
            />
          </div>
        </div>
        
        {rawText && (
          <details style={{ marginTop: '28px' }}>
            <summary style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontWeight: '500' }}>
              <i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i>
              View Extracted Text
            </summary>
            <pre style={{
              marginTop: '14px',
              padding: '18px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '12px',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.4)',
              maxHeight: '180px',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>{rawText}</pre>
          </details>
        )}
      </div>
    );
    
    // Experience Editor
    const ExperienceEditor = ({ experiences, setExperiences }) => {
      const addExperience = () => {
        setExperiences([...experiences, {
          id: Date.now(),
          company: '',
          role: '',
          startDate: '',
          endDate: '',
          description: '',
          dayInLife: [
            { time: '9:00 AM', activity: '' },
            { time: '11:00 AM', activity: '' },
            { time: '1:00 PM', activity: '' },
            { time: '3:00 PM', activity: '' },
            { time: '5:00 PM', activity: '' }
          ],
          metrics: [
            { value: '', label: '' },
            { value: '', label: '' },
            { value: '', label: '' },
            { value: '', label: '' }
          ]
        }]);
      };
      
      const updateExperience = (idx, key, value) => {
        const updated = [...experiences];
        updated[idx] = { ...updated[idx], [key]: value };
        setExperiences(updated);
      };
      
      const removeExperience = (idx) => {
        setExperiences(experiences.filter((_, i) => i !== idx));
      };
      
      const updateMetric = (expIdx, metricIdx, key, value) => {
        const updated = [...experiences];
        updated[expIdx].metrics[metricIdx][key] = value;
        setExperiences(updated);
      };
      
      const updateDayActivity = (expIdx, dayIdx, value) => {
        const updated = [...experiences];
        updated[expIdx].dayInLife[dayIdx].activity = value;
        setExperiences(updated);
      };
      
      return (
        <div>
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="glass exp-entry">
              <div className="exp-head">
                <div className="exp-badge">{idx + 1}</div>
                <button className="btn-icon" onClick={() => removeExperience(idx)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Company</label>
                  <input
                    className="glass-input"
                    value={exp.company}
                    onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                    placeholder="Company name"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Role</label>
                  <input
                    className="glass-input"
                    value={exp.role}
                    onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                    placeholder="Job title"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Start Date</label>
                  <input
                    className="glass-input"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                    placeholder="Jan 2020"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">End Date</label>
                  <input
                    className="glass-input"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                    placeholder="Present"
                  />
                </div>
                <div className="form-field full-width">
                  <label className="form-label">Description</label>
                  <textarea
                    className="glass-input form-textarea"
                    value={exp.description}
                    onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                    placeholder="Describe your role and responsibilities..."
                  />
                </div>
              </div>
              
              {/* Day in Life */}
              <div className="day-section">
                <div className="day-header">
                  <i className="fas fa-sun"></i>
                  Day in the Life
                </div>
                {exp.dayInLife.map((day, dayIdx) => (
                  <div key={dayIdx} className="day-entry">
                    <span className="day-time">{day.time}</span>
                    <input
                      className="day-input"
                      value={day.activity}
                      onChange={(e) => updateDayActivity(idx, dayIdx, e.target.value)}
                      placeholder="What you do at this time..."
                    />
                  </div>
                ))}
              </div>
              
              {/* Metrics */}
              <div className="metrics-section">
                <div className="metrics-header">
                  <i className="fas fa-chart-line"></i>
                  Impact Metrics
                </div>
                <div className="metrics-row">
                  {exp.metrics.map((metric, metricIdx) => (
                    <div key={metricIdx} className="metric-box">
                      <input
                        value={metric.value}
                        onChange={(e) => updateMetric(idx, metricIdx, 'value', e.target.value)}
                        placeholder="+40%"
                      />
                      <input
                        value={metric.label}
                        onChange={(e) => updateMetric(idx, metricIdx, 'label', e.target.value)}
                        placeholder="METRIC"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          <button className="btn-ghost" onClick={addExperience}>
            <i className="fas fa-plus"></i> Add Experience
          </button>
        </div>
      );
    };
    
    // Skills Editor
    const SkillsEditor = ({ skills, setSkills }) => {
      const [inputValue, setInputValue] = useState('');
      
      const addSkill = () => {
        if (inputValue.trim()) {
          setSkills([...skills, inputValue.trim()]);
          setInputValue('');
        }
      };
      
      return (
        <div>
          <div style={{ display: 'flex', gap: '14px', marginBottom: '24px' }}>
            <input
              className="glass-input"
              style={{ flex: 1 }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              placeholder="Type a skill and press Enter..."
            />
            <button className="btn btn-primary" onClick={addSkill}>
              <i className="fas fa-plus"></i>
            </button>
          </div>
          
          <div className="skills-list">
            {skills.map((skill, idx) => (
              <div key={idx} className="skill-chip">
                {skill}
                <button onClick={() => setSkills(skills.filter((_, i) => i !== idx))}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    };
    
    // Generic List Editor
    const ListEditor = ({ title, items, setItems, fields }) => {
      const addItem = () => {
        const newItem = { id: Date.now() };
        fields.forEach(f => newItem[f.key] = '');
        setItems([...items, newItem]);
      };
      
      const updateItem = (idx, key, value) => {
        const updated = [...items];
        updated[idx] = { ...updated[idx], [key]: value };
        setItems(updated);
      };
      
      const removeItem = (idx) => {
        setItems(items.filter((_, i) => i !== idx));
      };
      
      return (
        <div>
          {items.map((item, idx) => (
            <div key={item.id} className="glass exp-entry">
              <div className="exp-head">
                <div className="exp-badge">{idx + 1}</div>
                <button className="btn-icon" onClick={() => removeItem(idx)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              
              <div className="form-row">
                {fields.map(field => (
                  <div key={field.key} className={'form-field' + (field.textarea ? ' full-width' : '')}>
                    <label className="form-label">{field.label}</label>
                    {field.textarea ? (
                      <textarea
                        className="glass-input form-textarea"
                        value={item[field.key] || ''}
                        onChange={(e) => updateItem(idx, field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <input
                        className="glass-input"
                        value={item[field.key] || ''}
                        onChange={(e) => updateItem(idx, field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <button className="btn-ghost" onClick={addItem}>
            <i className="fas fa-plus"></i> Add {title.replace(/s$/, '')}
          </button>
        </div>
      );
    };
    
    // Media Editor
    const MediaEditor = ({ photos, videos, setPhotos, setVideos }) => {
      const photoInputRef = useRef(null);
      const videoInputRef = useRef(null);
      
      const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = files.map(f => ({
          id: Math.random(),
          url: URL.createObjectURL(f)
        }));
        setPhotos([...photos, ...newPhotos]);
      };
      
      const handleVideoUpload = (e) => {
        const files = Array.from(e.target.files);
        const newVideos = files.map(f => ({
          id: Math.random(),
          url: URL.createObjectURL(f)
        }));
        setVideos([...videos, ...newVideos]);
      };
      
      return (
        <div>
          <h3 style={{ fontSize: '14px', color: 'var(--cyan-main)', marginBottom: '18px', fontWeight: '600' }}>
            <i className="fas fa-camera" style={{ marginRight: '10px' }}></i>
            Photos
          </h3>
          
          <input
            type="file"
            ref={photoInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            multiple
            hidden
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '14px', marginBottom: '36px' }}>
            {photos.map(photo => (
              <div key={photo.id} style={{
                aspectRatio: '1',
                borderRadius: '14px',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <img src={photo.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  onClick={() => setPhotos(photos.filter(p => p.id !== photo.id))}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
            
            <button
              onClick={() => photoInputRef.current?.click()}
              style={{
                aspectRatio: '1',
                borderRadius: '14px',
                border: '2px dashed rgba(255,255,255,0.15)',
                background: 'transparent',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '22px'
              }}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
          
          <h3 style={{ fontSize: '14px', color: 'var(--pink-main)', marginBottom: '18px', fontWeight: '600' }}>
            <i className="fas fa-video" style={{ marginRight: '10px' }}></i>
            Videos
          </h3>
          
          <input
            type="file"
            ref={videoInputRef}
            onChange={handleVideoUpload}
            accept="video/*"
            multiple
            hidden
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
            {videos.map(video => (
              <div key={video.id} style={{
                aspectRatio: '16/9',
                borderRadius: '14px',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.1)',
                background: '#0f0818'
              }}>
                <video src={video.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  onClick={() => setVideos(videos.filter(v => v.id !== video.id))}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
            
            <button
              onClick={() => videoInputRef.current?.click()}
              style={{
                aspectRatio: '16/9',
                borderRadius: '14px',
                border: '2px dashed rgba(255,255,255,0.15)',
                background: 'transparent',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '22px'
              }}
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
        </div>
      );
    };
    
    // Preview View
    const PreviewView = ({ profile, setView }) => (
      <div>
        <div className="glass preview-header">
          <div>
            <h1 className="page-title">Live Preview</h1>
            <p className="page-desc">How recruiters will see your profile</p>
          </div>
          <div style={{ display: 'flex', gap: '14px' }}>
            <button className="btn btn-secondary" onClick={() => setView(VIEW.BUILDER)}>
              <i className="fas fa-edit"></i> Edit
            </button>
            <button className="btn btn-primary">
              <i className="fas fa-share"></i> Publish
            </button>
          </div>
        </div>
        
        {/* Profile Hero */}
        <div className="glass-card profile-hero">
          <div className="profile-avatar">
            {profile.basics.name
              ? profile.basics.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
              : '?'}
          </div>
          <h1 className="profile-name">{profile.basics.name || 'Your Name'}</h1>
          <p className="profile-title">{profile.basics.title || 'Your Title'}</p>
          <p className="profile-tagline">{profile.basics.tagline || 'Your professional tagline'}</p>
          
          {profile.skills.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '28px' }}>
              {profile.skills.slice(0, 8).map((skill, idx) => (
                <span key={idx} className="skill-chip">{skill}</span>
              ))}
            </div>
          )}
        </div>
        
        {/* Career Timeline */}
        {profile.experience.length > 0 && (
          <div className="glass-card" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '28px', color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
              <i className="fas fa-briefcase" style={{ marginRight: '14px', color: 'var(--purple-main)' }}></i>
              Career Timeline
            </h2>
            
            <div className="timeline-wrap">
              {profile.experience.map((exp, idx) => (
                <div key={exp.id} className="glass timeline-item">
                  <h3 className="timeline-company">{exp.company || 'Company'}</h3>
                  <p className="timeline-role">{exp.role || 'Role'}</p>
                  <span className="timeline-dates">{exp.startDate || 'Start'} — {exp.endDate || 'End'}</span>
                  <p className="timeline-desc">{exp.description || 'Description of your role and achievements'}</p>
                  
                  {exp.metrics?.some(m => m.value) && (
                    <div className="timeline-metrics">
                      {exp.metrics.filter(m => m.value).map((metric, midx) => (
                        <div key={midx} className="timeline-metric">
                          <div className="timeline-metric-val">{metric.value}</div>
                          <div className="timeline-metric-label">{metric.label}</div>
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
    
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>`)
})

export default app
