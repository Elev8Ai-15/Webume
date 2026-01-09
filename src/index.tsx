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
// WEBUME - PREMIUM GLASSMORPHISM UI
// Inspired by Modern Glass Design Trends 2025
// ============================================

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WEBUME | Premium AI Resume Builder</title>
  <meta name="description" content="Transform your career into an immersive digital experience. AI-powered resume parsing meets stunning glassmorphism design.">
  
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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  
  <!-- Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <style>
    /* ============================================
       WEBUME - PREMIUM GLASSMORPHISM DESIGN SYSTEM
       Research-backed implementation:
       - backdrop-filter: blur(10-20px)
       - Semi-transparent backgrounds rgba() with low alpha
       - Subtle borders rgba(255,255,255,0.1-0.2)
       - Box shadows for depth
       ============================================ */
    
    :root {
      /* Base Colors - Deep, rich background */
      --bg-primary: #0a0a1a;
      --bg-secondary: #0d0d24;
      --bg-tertiary: #12122d;
      
      /* Accent Colors - Vivid but not harsh */
      --accent-primary: #7c3aed;
      --accent-secondary: #a855f7;
      --accent-tertiary: #c084fc;
      --accent-cyan: #06b6d4;
      --accent-pink: #ec4899;
      --accent-emerald: #10b981;
      --accent-amber: #f59e0b;
      
      /* Glass Effects - The core of glassmorphism */
      --glass-bg: rgba(255, 255, 255, 0.03);
      --glass-bg-hover: rgba(255, 255, 255, 0.06);
      --glass-bg-card: rgba(255, 255, 255, 0.05);
      --glass-border: rgba(255, 255, 255, 0.08);
      --glass-border-hover: rgba(255, 255, 255, 0.15);
      --glass-highlight: rgba(255, 255, 255, 0.1);
      
      /* Text Colors */
      --text-primary: #ffffff;
      --text-secondary: rgba(255, 255, 255, 0.85);
      --text-muted: rgba(255, 255, 255, 0.5);
      --text-dim: rgba(255, 255, 255, 0.35);
      
      /* Shadows */
      --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.2);
      --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.25);
      --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.3);
      --shadow-glow-purple: 0 0 60px rgba(124, 58, 237, 0.3);
      --shadow-glow-cyan: 0 0 60px rgba(6, 182, 212, 0.3);
      
      /* Blur values */
      --blur-sm: blur(8px);
      --blur-md: blur(16px);
      --blur-lg: blur(24px);
      
      /* Border radius */
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --radius-xl: 24px;
      --radius-2xl: 32px;
      
      /* Transitions */
      --transition-fast: 0.15s ease;
      --transition-base: 0.25s ease;
      --transition-slow: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html {
      height: 100%;
      font-size: 16px;
    }
    
    body {
      min-height: 100%;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      overflow-x: hidden;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    #root {
      min-height: 100vh;
      position: relative;
    }
    
    /* Premium Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: var(--bg-secondary);
    }
    
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, var(--accent-primary), var(--accent-cyan));
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, var(--accent-secondary), var(--accent-cyan));
    }
    
    /* ============================================
       ANIMATED BACKGROUND - Subtle & Elegant
       Multiple gradient layers with smooth animation
       ============================================ */
    .animated-bg {
      position: fixed;
      inset: 0;
      z-index: 0;
      overflow: hidden;
      background: var(--bg-primary);
    }
    
    /* Primary gradient orbs */
    .gradient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      opacity: 0.5;
      animation: orbFloat 20s ease-in-out infinite;
    }
    
    .gradient-orb.orb-1 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, var(--accent-primary) 0%, transparent 70%);
      top: -200px;
      left: -100px;
      animation-delay: 0s;
    }
    
    .gradient-orb.orb-2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, var(--accent-cyan) 0%, transparent 70%);
      top: 50%;
      right: -150px;
      animation-delay: -5s;
    }
    
    .gradient-orb.orb-3 {
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, var(--accent-pink) 0%, transparent 70%);
      bottom: -100px;
      left: 30%;
      animation-delay: -10s;
    }
    
    .gradient-orb.orb-4 {
      width: 350px;
      height: 350px;
      background: radial-gradient(circle, var(--accent-emerald) 0%, transparent 70%);
      top: 30%;
      left: 20%;
      opacity: 0.3;
      animation-delay: -15s;
    }
    
    @keyframes orbFloat {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      25% {
        transform: translate(30px, -50px) scale(1.05);
      }
      50% {
        transform: translate(-20px, 30px) scale(0.95);
      }
      75% {
        transform: translate(50px, 20px) scale(1.02);
      }
    }
    
    /* Subtle grid pattern */
    .grid-pattern {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 60px 60px;
      opacity: 0.5;
    }
    
    /* Subtle noise texture */
    .noise-overlay {
      position: absolute;
      inset: 0;
      opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    }
    
    /* ============================================
       MAIN LAYOUT
       ============================================ */
    .main-container {
      position: relative;
      z-index: 1;
      min-height: 100vh;
      padding: 32px;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    @media (max-width: 768px) {
      .main-container {
        padding: 16px;
      }
    }
    
    /* ============================================
       GLASSMORPHIC HEADER
       ============================================ */
    .glass-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 32px;
      margin-bottom: 32px;
      background: var(--glass-bg-card);
      backdrop-filter: var(--blur-md);
      -webkit-backdrop-filter: var(--blur-md);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-2xl);
      position: relative;
      overflow: hidden;
      transition: var(--transition-base);
    }
    
    .glass-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, 
        transparent, 
        rgba(255, 255, 255, 0.2), 
        transparent
      );
    }
    
    .glass-header:hover {
      border-color: var(--glass-border-hover);
    }
    
    .logo-wrapper {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .logo-icon {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      position: relative;
      box-shadow: var(--shadow-glow-purple);
    }
    
    .logo-icon::after {
      content: '';
      position: absolute;
      inset: -2px;
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-cyan));
      border-radius: var(--radius-lg);
      z-index: -1;
      opacity: 0.5;
      filter: blur(8px);
    }
    
    .logo-text {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-tertiary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .logo-tagline {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-muted);
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    
    .header-stats {
      display: flex;
      gap: 32px;
    }
    
    .header-stat {
      text-align: center;
    }
    
    .header-stat-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(135deg, var(--accent-cyan), var(--accent-emerald));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .header-stat-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    @media (max-width: 768px) {
      .glass-header {
        flex-direction: column;
        gap: 20px;
        padding: 20px;
      }
      
      .header-stats {
        gap: 24px;
      }
    }
    
    /* ============================================
       GLASS CARDS - Core Component
       ============================================ */
    .glass-card {
      background: var(--glass-bg-card);
      backdrop-filter: var(--blur-md);
      -webkit-backdrop-filter: var(--blur-md);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      padding: 32px;
      position: relative;
      overflow: hidden;
      transition: var(--transition-slow);
    }
    
    /* Top highlight line */
    .glass-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 24px;
      right: 24px;
      height: 1px;
      background: linear-gradient(90deg, 
        transparent, 
        var(--glass-highlight), 
        transparent
      );
    }
    
    /* Hover effect */
    .glass-card:hover {
      background: var(--glass-bg-hover);
      border-color: var(--glass-border-hover);
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
    
    /* Accent variants */
    .glass-card.accent-purple {
      border-left: 3px solid var(--accent-primary);
    }
    
    .glass-card.accent-cyan {
      border-left: 3px solid var(--accent-cyan);
    }
    
    .glass-card.accent-pink {
      border-left: 3px solid var(--accent-pink);
    }
    
    .glass-card.accent-emerald {
      border-left: 3px solid var(--accent-emerald);
    }
    
    /* ============================================
       UPLOAD ZONE - Premium Drag & Drop
       ============================================ */
    .upload-zone {
      min-height: 450px;
      border: 2px dashed var(--glass-border);
      border-radius: var(--radius-2xl);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition-slow);
      position: relative;
      background: linear-gradient(135deg, 
        rgba(124, 58, 237, 0.03) 0%, 
        rgba(6, 182, 212, 0.02) 100%
      );
    }
    
    .upload-zone:hover {
      border-color: var(--accent-primary);
      background: linear-gradient(135deg, 
        rgba(124, 58, 237, 0.08) 0%, 
        rgba(6, 182, 212, 0.05) 100%
      );
    }
    
    .upload-zone.drag-over {
      border-color: var(--accent-cyan);
      border-style: solid;
      background: linear-gradient(135deg, 
        rgba(6, 182, 212, 0.12) 0%, 
        rgba(124, 58, 237, 0.08) 100%
      );
      transform: scale(1.01);
    }
    
    .upload-icon-wrapper {
      width: 120px;
      height: 120px;
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      border-radius: var(--radius-2xl);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 32px;
      position: relative;
      box-shadow: var(--shadow-glow-purple);
      animation: floatIcon 4s ease-in-out infinite;
    }
    
    @keyframes floatIcon {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }
    
    .upload-icon-wrapper i {
      font-size: 48px;
      color: white;
    }
    
    .upload-icon-wrapper::before {
      content: '';
      position: absolute;
      inset: -4px;
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-cyan));
      border-radius: calc(var(--radius-2xl) + 4px);
      z-index: -1;
      opacity: 0.5;
      filter: blur(16px);
      animation: pulseGlow 3s ease-in-out infinite;
    }
    
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.05); }
    }
    
    .upload-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 12px;
      background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-tertiary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .upload-subtitle {
      font-size: 16px;
      color: var(--text-muted);
      margin-bottom: 32px;
    }
    
    .upload-formats {
      display: flex;
      gap: 16px;
    }
    
    .format-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: var(--glass-bg);
      backdrop-filter: var(--blur-sm);
      -webkit-backdrop-filter: var(--blur-sm);
      border: 1px solid var(--glass-border);
      border-radius: 50px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
      transition: var(--transition-base);
    }
    
    .format-badge:hover {
      background: var(--glass-bg-hover);
      border-color: var(--accent-primary);
      color: var(--accent-tertiary);
    }
    
    .format-badge i {
      font-size: 16px;
      color: var(--accent-primary);
    }
    
    /* ============================================
       AI PROCESSING ANIMATION
       ============================================ */
    .processing-container {
      text-align: center;
      padding: 60px 40px;
    }
    
    .ai-brain-container {
      width: 180px;
      height: 180px;
      margin: 0 auto 40px;
      position: relative;
    }
    
    .ai-brain-core {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-cyan));
      border-radius: 50%;
      box-shadow: var(--shadow-glow-purple), var(--shadow-glow-cyan);
      animation: brainPulse 2s ease-in-out infinite;
    }
    
    @keyframes brainPulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.1); }
    }
    
    .ai-brain-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 2px solid var(--accent-primary);
      border-radius: 50%;
      opacity: 0;
      animation: ringExpand 2.5s ease-out infinite;
    }
    
    .ai-brain-ring:nth-child(1) { animation-delay: 0s; }
    .ai-brain-ring:nth-child(2) { animation-delay: 0.5s; }
    .ai-brain-ring:nth-child(3) { animation-delay: 1s; }
    
    @keyframes ringExpand {
      0% { width: 80px; height: 80px; opacity: 0.8; }
      100% { width: 180px; height: 180px; opacity: 0; }
    }
    
    .ai-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      border-radius: 50px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 1px;
      margin-bottom: 24px;
      box-shadow: var(--shadow-glow-purple);
    }
    
    .ai-badge-dot {
      width: 8px;
      height: 8px;
      background: white;
      border-radius: 50%;
      animation: dotPulse 1s ease-in-out infinite;
    }
    
    @keyframes dotPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.8); }
    }
    
    .processing-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
      background: linear-gradient(135deg, var(--accent-cyan), var(--text-primary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .processing-subtitle {
      color: var(--text-muted);
      margin-bottom: 32px;
    }
    
    .progress-percentage {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 56px;
      font-weight: 700;
      color: var(--accent-cyan);
      margin-bottom: 24px;
      text-shadow: 0 0 40px var(--accent-cyan);
    }
    
    .progress-bar-wrapper {
      max-width: 500px;
      margin: 0 auto 32px;
    }
    
    .progress-bar-track {
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
    }
    
    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-primary), var(--accent-cyan), var(--accent-emerald));
      border-radius: 4px;
      transition: width 0.3s ease;
      position: relative;
      box-shadow: 0 0 20px var(--accent-cyan);
    }
    
    .progress-bar-fill::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: shimmer 2s infinite;
    }
    
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    .progress-steps {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 400px;
      margin: 0 auto;
    }
    
    .progress-step {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      background: var(--glass-bg);
      backdrop-filter: var(--blur-sm);
      -webkit-backdrop-filter: var(--blur-sm);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      font-size: 14px;
      color: var(--text-dim);
      transition: var(--transition-base);
    }
    
    .progress-step.active {
      background: rgba(124, 58, 237, 0.1);
      border-color: rgba(124, 58, 237, 0.3);
      color: var(--accent-tertiary);
    }
    
    .progress-step.complete {
      background: rgba(16, 185, 129, 0.1);
      border-color: rgba(16, 185, 129, 0.3);
      color: var(--accent-emerald);
    }
    
    .progress-step i {
      width: 20px;
      font-size: 14px;
    }
    
    /* ============================================
       STATS GRID
       ============================================ */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 32px;
    }
    
    .stat-card {
      background: var(--glass-bg-card);
      backdrop-filter: var(--blur-md);
      -webkit-backdrop-filter: var(--blur-md);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      padding: 24px;
      position: relative;
      overflow: hidden;
      transition: var(--transition-slow);
    }
    
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
    }
    
    .stat-card.purple::before { background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)); }
    .stat-card.cyan::before { background: linear-gradient(90deg, var(--accent-cyan), #22d3ee); }
    .stat-card.pink::before { background: linear-gradient(90deg, var(--accent-pink), #f472b6); }
    .stat-card.emerald::before { background: linear-gradient(90deg, var(--accent-emerald), #34d399); }
    
    .stat-card:hover {
      transform: translateY(-4px);
      border-color: var(--glass-border-hover);
      box-shadow: var(--shadow-lg);
    }
    
    .stat-card.purple:hover { box-shadow: var(--shadow-glow-purple); }
    .stat-card.cyan:hover { box-shadow: var(--shadow-glow-cyan); }
    
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-bottom: 16px;
    }
    
    .stat-card.purple .stat-icon { background: rgba(124, 58, 237, 0.15); color: var(--accent-primary); }
    .stat-card.cyan .stat-icon { background: rgba(6, 182, 212, 0.15); color: var(--accent-cyan); }
    .stat-card.pink .stat-icon { background: rgba(236, 72, 153, 0.15); color: var(--accent-pink); }
    .stat-card.emerald .stat-icon { background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald); }
    
    .stat-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    
    .stat-card.purple .stat-value { color: var(--accent-tertiary); }
    .stat-card.cyan .stat-value { color: var(--accent-cyan); }
    .stat-card.pink .stat-value { color: var(--accent-pink); }
    .stat-card.emerald .stat-value { color: var(--accent-emerald); }
    
    .stat-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
    }
    
    @media (max-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
    
    @media (max-width: 640px) {
      .stats-grid { grid-template-columns: 1fr; }
    }
    
    /* ============================================
       NAVIGATION TABS
       ============================================ */
    .nav-tabs-wrapper {
      display: flex;
      gap: 8px;
      padding: 8px;
      background: var(--glass-bg);
      backdrop-filter: var(--blur-md);
      -webkit-backdrop-filter: var(--blur-md);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      margin-bottom: 24px;
      overflow-x: auto;
    }
    
    .nav-tab {
      padding: 14px 24px;
      background: transparent;
      border: none;
      border-radius: var(--radius-md);
      color: var(--text-muted);
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-base);
      display: flex;
      align-items: center;
      gap: 10px;
      white-space: nowrap;
    }
    
    .nav-tab:hover {
      color: var(--text-primary);
      background: var(--glass-bg-hover);
    }
    
    .nav-tab.active {
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      color: white;
      box-shadow: var(--shadow-glow-purple);
    }
    
    .nav-tab i {
      font-size: 14px;
    }
    
    /* ============================================
       FORM ELEMENTS
       ============================================ */
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
    
    .form-group.full {
      grid-column: 1 / -1;
    }
    
    .form-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .form-label i {
      color: var(--accent-primary);
      font-size: 12px;
    }
    
    .form-input,
    .form-textarea {
      padding: 16px 18px;
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: var(--blur-sm);
      -webkit-backdrop-filter: var(--blur-sm);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      font-family: inherit;
      font-size: 15px;
      transition: var(--transition-base);
    }
    
    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
    }
    
    .form-input::placeholder,
    .form-textarea::placeholder {
      color: var(--text-dim);
    }
    
    .form-textarea {
      min-height: 120px;
      resize: vertical;
      line-height: 1.6;
    }
    
    @media (max-width: 640px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
    
    /* ============================================
       BUTTONS
       ============================================ */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 28px;
      border-radius: var(--radius-md);
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-base);
      border: none;
      position: relative;
      overflow: hidden;
    }
    
    .btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .btn:hover::before {
      opacity: 1;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      color: white;
      box-shadow: var(--shadow-glow-purple);
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(124, 58, 237, 0.4);
    }
    
    .btn-secondary {
      background: var(--glass-bg);
      backdrop-filter: var(--blur-sm);
      -webkit-backdrop-filter: var(--blur-sm);
      border: 1px solid var(--glass-border);
      color: var(--text-primary);
    }
    
    .btn-secondary:hover {
      background: var(--glass-bg-hover);
      border-color: var(--glass-border-hover);
    }
    
    .btn-ghost {
      background: transparent;
      border: 2px dashed var(--glass-border);
      color: var(--text-muted);
      width: 100%;
      padding: 20px;
    }
    
    .btn-ghost:hover {
      border-color: var(--accent-primary);
      color: var(--accent-tertiary);
      background: rgba(124, 58, 237, 0.05);
    }
    
    .btn-icon {
      width: 40px;
      height: 40px;
      padding: 0;
      border-radius: var(--radius-md);
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      color: var(--text-muted);
      cursor: pointer;
      transition: var(--transition-base);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .btn-icon:hover {
      background: var(--glass-bg-hover);
      color: var(--text-primary);
    }
    
    .btn-icon.danger:hover {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.3);
      color: #ef4444;
    }
    
    /* ============================================
       EXPERIENCE ENTRIES
       ============================================ */
    .experience-entry {
      background: var(--glass-bg);
      backdrop-filter: var(--blur-sm);
      -webkit-backdrop-filter: var(--blur-sm);
      border: 1px solid var(--glass-border);
      border-left: 3px solid var(--accent-primary);
      border-radius: var(--radius-xl);
      padding: 28px;
      margin-bottom: 20px;
      transition: var(--transition-base);
    }
    
    .experience-entry:hover {
      border-color: var(--glass-border-hover);
      box-shadow: var(--shadow-md);
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
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 16px;
      font-weight: 700;
      box-shadow: var(--shadow-glow-purple);
    }
    
    /* Day in Life Section */
    .day-in-life-wrapper {
      margin-top: 24px;
      padding: 20px;
      background: rgba(6, 182, 212, 0.05);
      border: 1px solid rgba(6, 182, 212, 0.15);
      border-radius: var(--radius-lg);
    }
    
    .day-in-life-header {
      font-size: 14px;
      font-weight: 600;
      color: var(--accent-cyan);
      margin-bottom: 16px;
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
      font-size: 13px;
      color: var(--accent-primary);
      width: 90px;
      flex-shrink: 0;
    }
    
    .day-input {
      flex: 1;
      padding: 12px 16px;
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-sm);
      color: var(--text-primary);
      font-size: 14px;
      transition: var(--transition-base);
    }
    
    .day-input:focus {
      outline: none;
      border-color: var(--accent-cyan);
      box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.15);
    }
    
    /* Metrics Grid */
    .metrics-wrapper {
      margin-top: 24px;
    }
    
    .metrics-header {
      font-size: 14px;
      font-weight: 600;
      color: var(--accent-cyan);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    
    .metric-box {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      padding: 16px;
      text-align: center;
      transition: var(--transition-base);
    }
    
    .metric-box:hover {
      border-color: var(--accent-cyan);
    }
    
    .metric-box input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      text-align: center;
      color: var(--text-primary);
      font-family: 'Space Grotesk', sans-serif;
    }
    
    .metric-box input:first-child {
      font-size: 24px;
      font-weight: 700;
      color: var(--accent-cyan);
      margin-bottom: 4px;
    }
    
    .metric-box input:last-child {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
    }
    
    @media (max-width: 768px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    /* ============================================
       SKILLS TAGS
       ============================================ */
    .skills-container {
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
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(6, 182, 212, 0.1));
      border: 1px solid rgba(124, 58, 237, 0.25);
      border-radius: 50px;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
      transition: var(--transition-base);
    }
    
    .skill-tag:hover {
      border-color: var(--accent-primary);
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(6, 182, 212, 0.15));
    }
    
    .skill-remove {
      background: none;
      border: none;
      color: var(--text-dim);
      cursor: pointer;
      padding: 0;
      display: flex;
      transition: color 0.2s ease;
    }
    
    .skill-remove:hover {
      color: #ef4444;
    }
    
    /* ============================================
       PREVIEW / TIMELINE
       ============================================ */
    .timeline-wrapper {
      position: relative;
      padding-left: 48px;
    }
    
    .timeline-wrapper::before {
      content: '';
      position: absolute;
      left: 16px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(180deg, var(--accent-primary), var(--accent-cyan), var(--accent-pink));
      border-radius: 1px;
    }
    
    .timeline-item {
      position: relative;
      margin-bottom: 32px;
      padding: 24px;
      background: var(--glass-bg-card);
      backdrop-filter: var(--blur-sm);
      -webkit-backdrop-filter: var(--blur-sm);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      transition: var(--transition-base);
    }
    
    .timeline-item:hover {
      border-color: var(--glass-border-hover);
      transform: translateX(4px);
    }
    
    .timeline-item::before {
      content: '';
      position: absolute;
      left: -40px;
      top: 28px;
      width: 16px;
      height: 16px;
      background: var(--accent-primary);
      border-radius: 50%;
      border: 3px solid var(--bg-primary);
      box-shadow: 0 0 20px var(--accent-primary);
    }
    
    .timeline-company {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    
    .timeline-role {
      font-size: 16px;
      font-weight: 600;
      color: var(--accent-cyan);
      margin-bottom: 12px;
    }
    
    .timeline-dates {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(124, 58, 237, 0.15);
      border: 1px solid rgba(124, 58, 237, 0.25);
      border-radius: 50px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: var(--accent-tertiary);
      margin-bottom: 16px;
    }
    
    .timeline-description {
      color: var(--text-muted);
      line-height: 1.7;
    }
    
    .preview-metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 20px;
    }
    
    .preview-metric {
      background: rgba(6, 182, 212, 0.08);
      border: 1px solid rgba(6, 182, 212, 0.2);
      border-radius: var(--radius-md);
      padding: 16px;
      text-align: center;
      transition: var(--transition-base);
    }
    
    .preview-metric:hover {
      border-color: var(--accent-cyan);
    }
    
    .preview-metric-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: var(--accent-cyan);
    }
    
    .preview-metric-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      margin-top: 4px;
    }
    
    @media (max-width: 768px) {
      .preview-metrics {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    /* ============================================
       SECTION HEADERS
       ============================================ */
    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 28px;
    }
    
    .section-header h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 700;
    }
    
    .section-header i {
      color: var(--accent-primary);
      font-size: 20px;
    }
    
    .section-header .count {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 500;
    }
    
    /* ============================================
       ANIMATIONS
       ============================================ */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .fade-in-up {
      animation: fadeInUp 0.5s ease forwards;
    }
    
    /* Staggered animation for cards */
    .stagger-1 { animation-delay: 0.05s; }
    .stagger-2 { animation-delay: 0.1s; }
    .stagger-3 { animation-delay: 0.15s; }
    .stagger-4 { animation-delay: 0.2s; }
    
    /* ============================================
       EMPTY STATE
       ============================================ */
    .empty-state {
      text-align: center;
      padding: 80px 40px;
    }
    
    .empty-icon {
      width: 120px;
      height: 120px;
      margin: 0 auto 32px;
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary), var(--accent-cyan));
      border-radius: var(--radius-2xl);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      box-shadow: var(--shadow-glow-purple);
      animation: floatIcon 4s ease-in-out infinite;
    }
    
    .empty-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    
    .empty-subtitle {
      color: var(--text-muted);
      font-size: 16px;
      max-width: 400px;
      margin: 0 auto 32px;
    }
  </style>
</head>
<body>
  <!-- Animated Background -->
  <div class="animated-bg">
    <div class="gradient-orb orb-1"></div>
    <div class="gradient-orb orb-2"></div>
    <div class="gradient-orb orb-3"></div>
    <div class="gradient-orb orb-4"></div>
    <div class="grid-pattern"></div>
    <div class="noise-overlay"></div>
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
    
    // Header Component
    const Header = ({ profile, view }) => (
      <header className="glass-header fade-in-up">
        <div className="logo-wrapper">
          <div className="logo-icon">⚡</div>
          <div>
            <div className="logo-text">WEBUME</div>
            <div className="logo-tagline">Premium AI Resume Builder</div>
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
    
    // Upload View Component
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
          <div className="glass-card fade-in-up">
            <div className="processing-container">
              <div className="ai-brain-container">
                <div className="ai-brain-core"></div>
                <div className="ai-brain-ring"></div>
                <div className="ai-brain-ring"></div>
                <div className="ai-brain-ring"></div>
              </div>
              
              <div className="ai-badge">
                <div className="ai-badge-dot"></div>
                GEMINI AI PROCESSING
              </div>
              
              <div className="processing-title">Analyzing Your Resume</div>
              <div className="processing-subtitle">Our AI is extracting every detail from your career history</div>
              
              <div className="progress-percentage">{Math.round(progress)}%</div>
              
              <div className="progress-bar-wrapper">
                <div className="progress-bar-track">
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
        <div className="glass-card fade-in-up">
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
            
            <div className="upload-icon-wrapper">
              <i className="fas fa-cloud-upload-alt"></i>
            </div>
            
            <h2 className="upload-title">Drop Your Resume</h2>
            <p className="upload-subtitle">Powered by Gemini AI • Instant Extraction</p>
            
            <div className="upload-formats">
              <span className="format-badge"><i className="fas fa-file-pdf"></i> PDF</span>
              <span className="format-badge"><i className="fas fa-file-word"></i> DOCX</span>
              <span className="format-badge"><i className="fas fa-file-alt"></i> TXT</span>
            </div>
          </div>
        </div>
      );
    };
    
    // Builder View Component
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
            <div className="stat-card purple stagger-1 fade-in-up">
              <div className="stat-icon"><i className="fas fa-briefcase"></i></div>
              <div className="stat-value">{profile.experience.length}</div>
              <div className="stat-label">Experiences</div>
            </div>
            <div className="stat-card cyan stagger-2 fade-in-up">
              <div className="stat-icon"><i className="fas fa-code"></i></div>
              <div className="stat-value">{profile.skills.length}</div>
              <div className="stat-label">Skills</div>
            </div>
            <div className="stat-card pink stagger-3 fade-in-up">
              <div className="stat-icon"><i className="fas fa-trophy"></i></div>
              <div className="stat-value">{profile.achievements.length}</div>
              <div className="stat-label">Achievements</div>
            </div>
            <div className="stat-card emerald stagger-4 fade-in-up">
              <div className="stat-icon"><i className="fas fa-check-double"></i></div>
              <div className="stat-value">94%</div>
              <div className="stat-label">Complete</div>
            </div>
          </div>
          
          {/* Nav Tabs */}
          <div className="nav-tabs-wrapper">
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
          <div className="glass-card">
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
            <input type="text" className="form-input" value={profile.basics.tagline} onChange={(e) => updateBasics('tagline', e.target.value)} placeholder="10+ years driving innovation at top tech companies..." />
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
            <summary style={{ cursor: 'pointer', color: 'var(--text-muted)', fontWeight: '600', padding: '12px 0' }}>
              <i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i>
              View Extracted Raw Text
            </summary>
            <pre style={{ marginTop: '12px', padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)', fontSize: '12px', color: 'var(--text-muted)', maxHeight: '200px', overflow: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'JetBrains Mono, monospace', border: '1px solid var(--glass-border)' }}>
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
          <div className="section-header">
            <i className="fas fa-briefcase"></i>
            <h2>Work Experience</h2>
            <span className="count">{experience.length} entries</span>
          </div>
          
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
                  <textarea className="form-textarea" value={exp.description} onChange={(e) => update(i, 'description', e.target.value)} placeholder="Describe your role, responsibilities, and key accomplishments..." />
                </div>
              </div>
              
              {/* Day in Life */}
              <div className="day-in-life-wrapper">
                <div className="day-in-life-header">
                  <i className="fas fa-sun"></i>
                  A Day in the Life
                </div>
                {exp.dayInLife.map((d, di) => (
                  <div key={di} className="day-item">
                    <span className="day-time">{d.time}</span>
                    <input type="text" className="day-input" value={d.activity} onChange={(e) => updateDay(i, di, e.target.value)} placeholder="What did you typically do at this time?" />
                  </div>
                ))}
              </div>
              
              {/* Metrics */}
              <div className="metrics-wrapper">
                <div className="metrics-header">
                  <i className="fas fa-chart-line"></i>
                  Impact Metrics
                </div>
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
    
    // Skills Editor
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
            <input 
              type="text" 
              className="form-input" 
              style={{ flex: 1 }} 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && add()} 
              placeholder="Add a skill..." 
            />
            <button className="btn btn-primary" onClick={add}>
              <i className="fas fa-plus"></i> Add
            </button>
          </div>
          
          <div className="skills-container">
            {skills.map((skill, i) => (
              <div key={i} className="skill-tag">
                {skill}
                <button className="skill-remove" onClick={() => remove(i)}>
                  <i className="fas fa-times"></i>
                </button>
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
          <div className="section-header">
            <i className={'fas ' + icon}></i>
            <h2>{title}</h2>
            <span className="count">{items.length} entries</span>
          </div>
          
          {items.map((item, i) => (
            <div key={item.id} className="experience-entry">
              <div className="experience-header">
                <div className="experience-number">{i + 1}</div>
                <button className="btn-icon danger" onClick={() => remove(i)}>
                  <i className="fas fa-trash"></i>
                </button>
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
          
          <button className="btn-ghost" onClick={add}>
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
          <div className="section-header">
            <i className="fas fa-image"></i>
            <h2>Media</h2>
          </div>
          
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '16px', color: 'var(--accent-cyan)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-camera"></i> Photos
            </h3>
            <input type="file" ref={photoRef} onChange={addPhotos} accept="image/*" multiple style={{ display: 'none' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
              {photos.map(p => (
                <div key={p.id} style={{ aspectRatio: '1', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative', border: '1px solid var(--glass-border)' }}>
                  <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => setPhotos(photos.filter(x => x.id !== p.id))} style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
              <button onClick={() => photoRef.current?.click()} style={{ aspectRatio: '1', borderRadius: 'var(--radius-md)', border: '2px dashed var(--glass-border)', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', transition: 'var(--transition-base)' }}>
                <i className="fas fa-plus" style={{ fontSize: '24px' }}></i>
                <span style={{ fontSize: '12px' }}>Add Photo</span>
              </button>
            </div>
          </div>
          
          <div>
            <h3 style={{ fontSize: '16px', color: 'var(--accent-pink)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-video"></i> Videos
            </h3>
            <input type="file" ref={videoRef} onChange={addVideos} accept="video/*" multiple style={{ display: 'none' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {videos.map(v => (
                <div key={v.id} style={{ aspectRatio: '16/9', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)' }}>
                  <video src={v.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => setVideos(videos.filter(x => x.id !== v.id))} style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
              <button onClick={() => videoRef.current?.click()} style={{ aspectRatio: '16/9', borderRadius: 'var(--radius-md)', border: '2px dashed var(--glass-border)', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', transition: 'var(--transition-base)' }}>
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
        <div className="glass-card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '24px', marginBottom: '4px' }}>Live Preview</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>How recruiters will see your profile</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={() => setView(VIEWS.BUILDER)}>
                <i className="fas fa-edit"></i> Edit
              </button>
              <button className="btn btn-primary">
                <i className="fas fa-share"></i> Publish
              </button>
            </div>
          </div>
        </div>
        
        {/* Profile Card */}
        <div className="glass-card" style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            margin: '0 auto 24px', 
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary), var(--accent-cyan))', 
            borderRadius: 'var(--radius-2xl)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '40px', 
            fontWeight: '700', 
            fontFamily: 'Space Grotesk',
            boxShadow: 'var(--shadow-glow-purple)'
          }}>
            {profile.basics.name ? profile.basics.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?'}
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk', fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
            {profile.basics.name || 'Your Name'}
          </h1>
          <p style={{ fontSize: '20px', color: 'var(--accent-cyan)', fontWeight: '600', marginBottom: '12px' }}>
            {profile.basics.title || 'Your Title'}
          </p>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '16px', lineHeight: '1.6' }}>
            {profile.basics.tagline || 'Your professional tagline will appear here'}
          </p>
          
          {profile.skills.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '28px' }}>
              {profile.skills.slice(0, 8).map((s, i) => (
                <span key={i} className="skill-tag">{s}</span>
              ))}
            </div>
          )}
        </div>
        
        {/* Timeline */}
        {profile.experience.length > 0 && (
          <div className="glass-card">
            <div className="section-header" style={{ marginBottom: '32px' }}>
              <i className="fas fa-briefcase"></i>
              <h2>Career Timeline</h2>
            </div>
            
            <div className="timeline-wrapper">
              {profile.experience.map((exp, i) => (
                <div key={exp.id} className="timeline-item">
                  <h3 className="timeline-company">{exp.company || 'Company'}</h3>
                  <p className="timeline-role">{exp.role || 'Role'}</p>
                  <span className="timeline-dates">{exp.startDate || 'Start'} — {exp.endDate || 'End'}</span>
                  <p className="timeline-description">{exp.description || 'Description...'}</p>
                  
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
