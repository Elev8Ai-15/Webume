export function mainAppTemplate(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Webumé | Your WebApp Resume</title>
  <link rel="icon" type="image/png" href="/static/icon-192.png">
  <link rel="apple-touch-icon" href="/static/icon-192.png">
  <link rel="apple-touch-icon" sizes="152x152" href="/static/icon-152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/static/icon-192.png">
  <link rel="apple-touch-icon" sizes="167x167" href="/static/icon-192.png">
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#1e3a5f">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Webumé">
  <meta name="application-name" content="Webumé">
  <meta name="msapplication-TileColor" content="#1e3a5f">
  <meta name="msapplication-TileImage" content="/static/icon-144.png">
  <meta name="description" content="Transform your resume into an immersive digital experience. AI-powered resume parsing, interactive career timeline, and professional templates.">
  <meta property="og:title" content="Webumé - Digital Resume Revolution">
  <meta property="og:description" content="AI-powered digital profiles that get you hired. Create stunning interactive resumes in minutes.">
  <meta property="og:type" content="website">
  <meta property="og:image" content="/static/icon-512.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Webumé - Digital Resume Revolution">
  <meta name="twitter:description" content="AI-powered digital profiles that get you hired">
  
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
  <script>pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';</script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
  
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <style>
    :root {
      /* ============================================
         PREMIUM DEEP BLACK PALETTE
         High-shine reflective black like luxury automotive
         Minimal color - chrome/silver accents only
         ============================================ */
      --primary: #08080a;           /* Pure deep black */
      --primary-light: #121215;     /* Slightly lighter black */
      --accent: #18181b;            /* Dark charcoal accent */
      --accent-light: #27272a;      /* Lighter charcoal */
      --accent-dark: #09090b;       /* Near-black */
      --accent-glow: #a1a1aa;       /* Silver/chrome glow */
      --chrome: #a1a1aa;            /* Chrome/silver accent */
      --chrome-bright: #e4e4e7;     /* Bright chrome/white */
      --surface-black: #030303;     /* Deep reflective black */
      --surface-shine: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, rgba(255,255,255,0.02) 100%);
      
      /* Legacy variable aliases - mapped to black/chrome palette */
      --purple-main: #18181b;       /* -> Dark charcoal */
      --purple-light: #a1a1aa;      /* -> Chrome */
      --pink-main: #27272a;         /* -> Lighter charcoal */
      --cyan-main: #d4d4d8;         /* -> Light silver */
      
      --green-main: #10B981;        /* Keep for success states */
      --red-main: #ef4444;          /* Keep for error states */
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    html, body, #root {
      height: 100%;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow: hidden;
      -webkit-tap-highlight-color: transparent;
      /* Safe area support for notched devices */
      padding-top: env(safe-area-inset-top);
      padding-bottom: env(safe-area-inset-bottom);
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    }
    
    /* CRITICAL: Root element must be above the fixed background */
    #root {
      position: relative;
      z-index: 10;
      pointer-events: auto;
    }
    
    /* Ensure all interactive elements work on touch devices */
    input, button, textarea, select, a {
      touch-action: manipulation;
      -webkit-user-select: text;
      user-select: text;
    }
    
    button {
      -webkit-user-select: none;
      user-select: none;
    }
    
    /* ===========================================================
       PREMIUM BACKGROUND - Deep Reflective Black
       Automotive-grade finish with subtle depth
       =========================================================== */
    .premium-bg {
      position: fixed;
      inset: 0;
      background: var(--surface-black);
      overflow: hidden;
      pointer-events: none;
      z-index: -1;
    }
    
    /* Background - Pure deep black with subtle shine */
    .bg-image {
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(ellipse 100% 60% at 50% 0%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
        radial-gradient(ellipse 60% 40% at 80% 90%, rgba(255, 255, 255, 0.015) 0%, transparent 40%),
        linear-gradient(180deg, #050505 0%, #030303 50%, #020202 100%);
      background-size: cover;
      background-position: center;
    }
    
    /* Reflective shine overlay - automotive clear coat effect */
    .bg-gradient {
      position: absolute;
      inset: 0;
      background: 
        linear-gradient(165deg, rgba(255,255,255,0.03) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.02) 100%),
        linear-gradient(45deg, transparent 40%, rgba(30,58,95,0.05) 50%, transparent 60%);
      pointer-events: none;
    }
    
    /* Subtle texture for depth - like brushed metal */
    .noise-overlay {
      position: absolute;
      inset: 0;
      opacity: 0.015;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      pointer-events: none;
    }
    
    /* ============================================
       PREMIUM DEPTH & TEXTURE EFFECTS
       Automotive-grade finish details
       ============================================ */
    
    /* Chrome highlight line - like a polished bezel */
    .chrome-line {
      height: 1px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(192, 200, 212, 0.15) 20%,
        rgba(232, 236, 242, 0.35) 50%,
        rgba(192, 200, 212, 0.15) 80%,
        transparent 100%);
      margin: 16px 0;
    }
    
    /* Deep embossed effect - recessed panel */
    .embossed {
      box-shadow: 
        inset 0 2px 6px rgba(0, 0, 0, 0.4),
        inset 0 -1px 0 rgba(255, 255, 255, 0.03),
        0 1px 0 rgba(255, 255, 255, 0.02);
    }
    
    /* Raised element - polished button/badge */
    .raised {
      box-shadow: 
        0 4px 16px rgba(0, 0, 0, 0.4),
        0 1px 0 rgba(255, 255, 255, 0.06) inset,
        0 -1px 0 rgba(0, 0, 0, 0.2) inset;
    }
    
    /* High-shine accent - like chrome trim */
    .shine-accent {
      position: relative;
    }
    .shine-accent::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(180deg, 
        rgba(255, 255, 255, 0.05) 0%, 
        transparent 100%);
      pointer-events: none;
      border-radius: inherit;
    }
    
    /* Steel border - refined edge */
    .steel-border {
      border: 1px solid rgba(45, 90, 135, 0.12);
      box-shadow: 
        0 0 0 1px rgba(0, 0, 0, 0.3),
        inset 0 0 0 1px rgba(255, 255, 255, 0.02);
    }
    
    /* Glow accent - for active/highlight states */
    .glow-accent {
      box-shadow: 
        0 0 20px rgba(61, 122, 184, 0.2),
        0 0 40px rgba(30, 58, 95, 0.1);
    }
    
    /* Premium text styles */
    .text-chrome {
      color: var(--chrome);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
    }
    
    .text-chrome-bright {
      color: var(--chrome-bright);
      text-shadow: 
        0 1px 2px rgba(0, 0, 0, 0.5),
        0 0 20px rgba(232, 236, 242, 0.1);
    }
    
    .text-glow {
      color: var(--accent-glow);
      text-shadow: 0 0 12px rgba(61, 122, 184, 0.4);
    }
    
    /* Brushed metal texture overlay */
    .brushed-metal {
      position: relative;
    }
    .brushed-metal::before {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        90deg,
        transparent 0px,
        rgba(255, 255, 255, 0.01) 1px,
        transparent 2px
      );
      pointer-events: none;
      border-radius: inherit;
    }
    
    /* ===========================================================
       GLASSMORPHISM COMPONENTS - Alternating Panels
       PREMIUM AUTOMOTIVE / TIMEPIECE DESIGN SYSTEM
       Deep reflective black with high-shine dark blue highlights
       Alternating glassmorphism for visual rhythm
       =========================================================== */
    
    /* Base glass - Deep shiny black */
    .glass {
      background: linear-gradient(145deg, 
        rgba(18, 18, 21, 0.98) 0%, 
        rgba(8, 8, 10, 0.99) 50%,
        rgba(3, 3, 3, 1) 100%);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      position: relative;
      z-index: 10;
      pointer-events: auto;
      box-shadow: 
        0 4px 32px rgba(0, 0, 0, 0.8),
        0 1px 0 rgba(255, 255, 255, 0.04) inset,
        0 -1px 0 rgba(0, 0, 0, 0.5) inset;
    }
    
    /* ============================================
       ALTERNATING PANEL SYSTEM
       Odd panels: Glass blur effect (frost)
       Even panels: Solid reflective (mirror)
       ============================================ */
    
    /* Glass panel - WITH subtle blur, deep black */
    .glass-panel {
      background: rgba(10, 10, 12, 0.85);
      backdrop-filter: blur(12px) saturate(100%);
      -webkit-backdrop-filter: blur(12px) saturate(100%);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      box-shadow: 
        0 8px 48px rgba(0, 0, 0, 0.8),
        0 1px 0 rgba(255, 255, 255, 0.03) inset;
    }
    
    /* Solid panel - Deep reflective black */
    .glass-solid {
      background: linear-gradient(165deg, 
        #0c0c0e 0%, 
        #060606 40%,
        #030303 100%);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 16px;
      box-shadow: 
        0 4px 40px rgba(0, 0, 0, 0.85),
        0 1px 0 rgba(255, 255, 255, 0.03) inset,
        0 -2px 8px rgba(0, 0, 0, 0.5) inset;
      /* Premium shine highlight */
      background-image: 
        linear-gradient(165deg, 
          rgba(255,255,255,0.03) 0%, 
          transparent 25%, 
          transparent 75%, 
          rgba(255,255,255,0.01) 100%);
    }
    
    /* Glass card - Deep shiny black with subtle highlight */
    .glass-card {
      background: linear-gradient(155deg, 
        rgba(16, 16, 18, 0.95) 0%, 
        rgba(8, 8, 10, 0.98) 50%,
        rgba(3, 3, 3, 1) 100%);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      box-shadow: 
        0 12px 56px rgba(0, 0, 0, 0.75),
        0 1px 0 rgba(255, 255, 255, 0.04) inset,
        0 -1px 0 rgba(0, 0, 0, 0.4) inset;
      position: relative;
      overflow: hidden;
    }
    
    /* Chrome accent highlight - subtle silver shine line */
    .glass-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 10%;
      right: 10%;
      height: 1px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(255, 255, 255, 0.12) 30%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0.12) 70%,
        transparent 100%);
      pointer-events: none;
    }
    
    /* Solid card - Deep reflective black */
    .glass-card-solid {
      background: linear-gradient(155deg, 
        #0e0e10 0%, 
        #070708 40%,
        #030303 100%);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 20px;
      box-shadow: 
        0 8px 44px rgba(0, 0, 0, 0.8),
        0 1px 0 rgba(255, 255, 255, 0.03) inset;
      position: relative;
    }
    
    /* Reflective shine overlay for solid cards */
    .glass-card-solid::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 40%;
      background: linear-gradient(180deg, 
        rgba(255,255,255,0.025) 0%, 
        transparent 100%);
      pointer-events: none;
      border-radius: 20px 20px 0 0;
    }
    
    /* Sidebar - Deep black with subtle edge */
    .glass-sidebar {
      background: linear-gradient(180deg, 
        rgba(12, 12, 14, 0.98) 0%, 
        rgba(5, 5, 6, 0.99) 100%);
      border-right: 1px solid rgba(255, 255, 255, 0.04);
      box-shadow: 
        4px 0 40px rgba(0, 0, 0, 0.6),
        1px 0 0 rgba(255, 255, 255, 0.02);
    }
    
    /* Input - Recessed deep black */
    .glass-input {
      background: linear-gradient(165deg, 
        rgba(5, 5, 6, 0.98) 0%, 
        rgba(10, 10, 12, 0.95) 100%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 14px 18px;
      color: #e4e4e7;
      font-family: inherit;
      font-size: 14px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 
        inset 0 2px 6px rgba(0, 0, 0, 0.5),
        0 1px 0 rgba(255, 255, 255, 0.02);
      width: 100%;
      position: relative;
      z-index: 10;
      pointer-events: auto;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    .glass-input:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.15);
      box-shadow: 
        0 0 0 3px rgba(255, 255, 255, 0.08),
        inset 0 2px 6px rgba(0, 0, 0, 0.5),
        0 0 24px rgba(255, 255, 255, 0.03);
    }
    
    .glass-input::placeholder {
      color: rgba(161, 161, 170, 0.5);
    }
    
    /* ===========================================================
       LAYOUT - Dashboard Style with Sidebar
       =========================================================== */
    .app-container {
      position: relative;
      z-index: 10;
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
      filter: drop-shadow(0 8px 24px rgba(30, 58, 95, 0.5)) brightness(1.1);
      transition: transform 0.3s ease, filter 0.3s ease;
    }
    
    .logo-img:hover {
      transform: scale(1.05);
      filter: drop-shadow(0 12px 32px rgba(45, 90, 135, 0.6)) brightness(1.15);
    }
    
    .nav-group {
      margin-bottom: 28px;
    }
    
    .nav-label {
      font-size: 11px;
      font-weight: 600;
      color: rgba(192, 200, 212, 0.4);
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
      color: rgba(192, 200, 212, 0.6);
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.25s ease;
      text-align: left;
    }
    
    .nav-btn:hover {
      background: linear-gradient(135deg, rgba(30, 58, 95, 0.3) 0%, rgba(10, 22, 40, 0.5) 100%);
      color: var(--chrome-bright);
      border: 1px solid rgba(45, 90, 135, 0.2);
    }
    
    .nav-btn.active {
      background: linear-gradient(135deg, rgba(30, 58, 95, 0.5) 0%, rgba(10, 22, 40, 0.7) 100%);
      color: var(--chrome-bright);
      border: 1px solid rgba(45, 90, 135, 0.4);
      box-shadow: 
        0 4px 16px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }
    
    .nav-btn i {
      width: 20px;
      font-size: 15px;
      color: var(--accent-light);
    }
    
    .sidebar-footer {
      margin-top: auto;
      padding: 20px;
      background: linear-gradient(145deg, rgba(10, 22, 40, 0.8) 0%, rgba(5, 10, 16, 0.9) 100%);
      border: 1px solid rgba(45, 90, 135, 0.25);
      border-radius: 16px;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }
    
    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
    }
    
    .stat-row:not(:last-child) {
      border-bottom: 1px solid rgba(45, 90, 135, 0.15);
    }
    
    .stat-name {
      font-size: 13px;
      color: rgba(192, 200, 212, 0.5);
    }
    
    .stat-num {
      font-size: 20px;
      font-weight: 700;
      color: var(--chrome-bright);
      text-shadow: 0 0 20px rgba(45, 90, 135, 0.5);
    }
    
    /* Main Content Area */
    .main {
      flex: 1;
      padding: 28px 32px;
      overflow-y: auto;
    }
    
    .main::-webkit-scrollbar { width: 6px; }
    .main::-webkit-scrollbar-track { background: rgba(5, 10, 16, 0.5); }
    .main::-webkit-scrollbar-thumb { 
      background: linear-gradient(180deg, var(--accent) 0%, var(--primary) 100%); 
      border-radius: 3px;
    }
    .main::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, var(--accent-light) 0%, var(--accent) 100%);
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
      color: var(--chrome-bright);
      letter-spacing: -0.5px;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    
    .page-desc {
      font-size: 14px;
      color: rgba(192, 200, 212, 0.5);
      margin-top: 6px;
    }
    
    /* ===========================================================
       STAT CARDS GRID - Premium Automotive Style
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
      background: linear-gradient(145deg, rgba(10, 22, 40, 0.9) 0%, rgba(5, 10, 16, 0.95) 100%);
      border: 1px solid rgba(45, 90, 135, 0.2);
      border-radius: 16px;
    }
    
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--accent), var(--accent-light), var(--accent));
    }
    
    /* Chrome accent shine */
    .stat-card::after {
      content: '';
      position: absolute;
      top: 0;
      left: 20%;
      right: 20%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(192, 200, 212, 0.2), transparent);
    }
    
    .stat-card.cyan::before {
      background: linear-gradient(90deg, #1a4d5c, #2d7a8c, #1a4d5c);
    }
    
    .stat-card.green::before {
      background: linear-gradient(90deg, #0d4a3a, var(--green-main), #0d4a3a);
    }
    
    .stat-icon-wrap {
      width: 52px;
      height: 52px;
      background: linear-gradient(145deg, rgba(30, 58, 95, 0.4) 0%, rgba(10, 22, 40, 0.6) 100%);
      border: 1px solid rgba(45, 90, 135, 0.3);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 18px;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }
    
    .stat-icon-wrap i {
      font-size: 22px;
      color: var(--accent-light);
    }
    
    .stat-card.cyan .stat-icon-wrap {
      background: linear-gradient(145deg, rgba(26, 77, 92, 0.4) 0%, rgba(10, 22, 40, 0.6) 100%);
      border-color: rgba(45, 122, 140, 0.3);
    }
    
    .stat-card.cyan .stat-icon-wrap i {
      color: #4da6b8;
    }
    
    .stat-card.green .stat-icon-wrap {
      background: linear-gradient(145deg, rgba(13, 74, 58, 0.4) 0%, rgba(10, 22, 40, 0.6) 100%);
      border-color: rgba(16, 185, 129, 0.3);
    }
    
    .stat-card.green .stat-icon-wrap i {
      color: var(--green-main);
    }
    
    .stat-card .value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 40px;
      font-weight: 700;
      color: var(--chrome-bright);
      line-height: 1;
      margin-bottom: 6px;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    
    .stat-card .label {
      font-size: 13px;
      color: rgba(192, 200, 212, 0.5);
      font-weight: 500;
    }
    
    /* ===========================================================
       UPLOAD ZONE - Premium Automotive Style
       =========================================================== */
    .upload-zone {
      padding: 60px 48px;
      text-align: center;
    }
    
    .dropzone {
      padding: 70px 50px;
      border: 2px dashed rgba(45, 90, 135, 0.5);
      border-radius: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: linear-gradient(145deg, rgba(10, 22, 40, 0.6) 0%, rgba(5, 10, 16, 0.8) 100%);
      position: relative;
      overflow: hidden;
    }
    
    /* Subtle shine effect */
    .dropzone::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(192, 200, 212, 0.03), transparent);
      transition: left 0.5s ease;
    }
    
    .dropzone:hover::before {
      left: 100%;
    }
    
    .dropzone:hover {
      border-color: var(--accent-light);
      background: linear-gradient(145deg, rgba(30, 58, 95, 0.3) 0%, rgba(10, 22, 40, 0.7) 100%);
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(45, 90, 135, 0.15);
    }
    
    .dropzone.drag-active {
      border-color: var(--accent-glow);
      border-style: solid;
      background: linear-gradient(145deg, rgba(45, 90, 135, 0.2) 0%, rgba(10, 22, 40, 0.8) 100%);
      box-shadow: 0 0 40px rgba(45, 90, 135, 0.3);
    }
    
    .upload-logo {
      width: 280px;
      height: auto;
      margin: 0 auto 32px;
      filter: drop-shadow(0 20px 50px rgba(30, 58, 95, 0.6)) brightness(1.1);
      animation: floatLogo 4s ease-in-out infinite;
    }
    
    @keyframes floatLogo {
      0%, 100% { transform: translateY(0) scale(1); filter: drop-shadow(0 20px 50px rgba(30, 58, 95, 0.6)) brightness(1.1); }
      50% { transform: translateY(-15px) scale(1.02); filter: drop-shadow(0 30px 60px rgba(45, 90, 135, 0.7)) brightness(1.15); }
    }
    
    .upload-icon-wrap {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: linear-gradient(145deg, var(--accent) 0%, var(--primary) 100%);
      border: 1px solid rgba(45, 90, 135, 0.4);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 
        0 16px 40px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        0 0 30px rgba(45, 90, 135, 0.2);
    }
    
    .upload-icon-wrap i {
      font-size: 32px;
      color: var(--chrome-bright);
    }
    
    .upload-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 30px;
      font-weight: 700;
      color: var(--chrome-bright);
      margin-bottom: 10px;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    
    .upload-subtitle {
      font-size: 15px;
      color: rgba(192, 200, 212, 0.5);
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
      background: linear-gradient(145deg, rgba(10, 22, 40, 0.8) 0%, rgba(5, 10, 16, 0.9) 100%);
      border: 1px solid rgba(45, 90, 135, 0.25);
      border-radius: 100px;
      font-size: 13px;
      font-weight: 500;
      color: rgba(192, 200, 212, 0.7);
    }
    
    .format-pill i {
      color: var(--accent-light);
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
      box-shadow: 0 0 60px rgba(30, 58, 95, 0.5);
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
      background: rgba(30, 58, 95, 0.12);
      border-color: rgba(30, 58, 95, 0.25);
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
      position: relative;
      z-index: 10;
      pointer-events: auto;
    }
    
    .btn-primary {
      background: linear-gradient(145deg, #1a1a1c 0%, #0e0e10 50%, #080808 100%);
      color: var(--chrome-bright);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 
        0 10px 36px rgba(0, 0, 0, 0.7),
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 0 1px rgba(255, 255, 255, 0.1);
    }
    
    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 
        0 15px 48px rgba(0, 0, 0, 0.8),
        inset 0 1px 0 rgba(255, 255, 255, 0.12),
        0 0 2px rgba(255, 255, 255, 0.15);
      background: linear-gradient(145deg, #222224 0%, #141416 50%, #0a0a0b 100%);
    }
    
    .btn-secondary {
      background: linear-gradient(145deg, rgba(14, 14, 16, 0.95) 0%, rgba(6, 6, 8, 0.98) 100%);
      color: var(--chrome);
      border: 1px solid rgba(255, 255, 255, 0.06);
    }
    
    .btn-secondary:hover {
      background: linear-gradient(145deg, rgba(22, 22, 24, 0.95) 0%, rgba(10, 10, 12, 0.98) 100%);
      color: var(--chrome-bright);
      border-color: rgba(255, 255, 255, 0.1);
    }
    
    .btn-ghost {
      width: 100%;
      padding: 18px;
      background: transparent;
      border: 2px dashed rgba(255, 255, 255, 0.1);
      color: rgba(161, 161, 170, 0.6);
      border-radius: 14px;
    }
    
    .btn-ghost:hover {
      border-color: rgba(255, 255, 255, 0.2);
      color: var(--chrome);
      background: rgba(255, 255, 255, 0.02);
    }
    
    .btn-icon {
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(145deg, rgba(14, 14, 16, 0.9) 0%, rgba(6, 6, 8, 0.95) 100%);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      color: rgba(161, 161, 170, 0.6);
      cursor: pointer;
      font-size: 14px;
    }
    
    .btn-icon:hover {
      background: linear-gradient(145deg, rgba(239, 68, 68, 0.15) 0%, rgba(10, 10, 12, 0.95) 100%);
      border-color: rgba(239, 68, 68, 0.3);
      color: #EF4444;
    }
    
    /* ===========================================================
       EXPERIENCE CARDS - Premium Style
       =========================================================== */
    .exp-entry {
      padding: 26px;
      margin-bottom: 18px;
      border-left: 4px solid var(--accent);
      background: linear-gradient(145deg, rgba(10, 22, 40, 0.6) 0%, rgba(5, 10, 16, 0.8) 100%);
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
      background: rgba(30, 58, 95, 0.15);
      border: 1px solid rgba(30, 58, 95, 0.25);
      border-radius: 100px;
      font-size: 13px;
      font-weight: 500;
      color: #c0c8d4;
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
      box-shadow: 0 20px 50px rgba(30, 58, 95, 0.35);
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
      background: rgba(30, 58, 95, 0.15);
      border: 1px solid rgba(30, 58, 95, 0.25);
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
    
    /* ===========================================================
       COMPREHENSIVE MOBILE RESPONSIVE STYLES
       Optimized for 320px-480px screens (iPhone SE to standard phones)
       =========================================================== */
    
    /* Mobile Navigation - Show hamburger menu when sidebar hidden */
    .mobile-nav-toggle {
      display: none;
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 1000;
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: rgba(12, 12, 14, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #e4e4e7;
      font-size: 20px;
      cursor: pointer;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    }
    
    @media (max-width: 800px) {
      .mobile-nav-toggle { display: flex; align-items: center; justify-content: center; }
    }
    
    /* Mobile sidebar drawer */
    .mobile-sidebar-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 998;
      backdrop-filter: blur(4px);
    }
    
    .mobile-sidebar-overlay.active { display: block; }
    
    .mobile-sidebar {
      position: fixed;
      top: 0;
      left: -300px;
      width: 280px;
      height: 100vh;
      background: linear-gradient(180deg, rgba(12, 12, 14, 0.98) 0%, rgba(5, 5, 6, 0.99) 100%);
      border-right: 1px solid rgba(255, 255, 255, 0.06);
      z-index: 999;
      transition: left 0.3s ease;
      overflow-y: auto;
      padding: 20px;
    }
    
    .mobile-sidebar.active { left: 0; }
    
    /* Tablet breakpoint (600-800px) */
    @media (max-width: 800px) and (min-width: 601px) {
      .main-content { padding: 20px; }
      .page-header { margin-bottom: 20px; }
      .glass-card { padding: 20px; }
    }
    
    /* Mobile breakpoint (max 600px) - Primary mobile styles */
    @media (max-width: 600px) {
      /* ===== GLOBAL MOBILE ADJUSTMENTS ===== */
      body, #root {
        font-size: 14px;
      }
      
      .main-content {
        padding: 16px;
        padding-top: 70px; /* Space for mobile nav */
      }
      
      /* ===== AUTH/LOGIN SCREEN MOBILE ===== */
      .auth-container {
        padding: 16px !important;
        min-height: 100vh;
        align-items: flex-start !important;
        padding-top: 40px !important;
      }
      
      .auth-card {
        padding: 28px 20px !important;
        max-width: 100% !important;
        border-radius: 20px !important;
      }
      
      .auth-logo {
        width: 80px !important;
        margin-bottom: 16px !important;
      }
      
      .auth-title {
        font-size: 22px !important;
        margin-bottom: 6px !important;
      }
      
      .auth-subtitle {
        font-size: 13px !important;
      }
      
      .auth-form-label {
        font-size: 12px !important;
      }
      
      .auth-input {
        padding: 12px 14px !important;
        font-size: 16px !important; /* Prevent iOS zoom */
      }
      
      .auth-submit-btn {
        padding: 14px !important;
        font-size: 15px !important;
        min-height: 50px !important;
      }
      
      /* ===== PAGE HEADERS MOBILE ===== */
      .page-header {
        margin-bottom: 16px;
      }
      
      .page-title {
        font-size: 22px !important;
      }
      
      .page-desc {
        font-size: 13px !important;
      }
      
      /* ===== UPLOAD ZONE MOBILE ===== */
      .upload-zone {
        padding: 24px 16px !important;
      }
      
      .upload-logo {
        width: 160px !important;
        margin-bottom: 16px !important;
      }
      
      .upload-icon-wrap {
        width: 64px !important;
        height: 64px !important;
        font-size: 28px !important;
      }
      
      .upload-title {
        font-size: 18px !important;
      }
      
      .upload-subtitle {
        font-size: 12px !important;
      }
      
      .format-pills {
        gap: 8px !important;
      }
      
      .format-pill {
        padding: 8px 12px !important;
        font-size: 11px !important;
      }
      
      /* ===== BUILDER VIEW MOBILE ===== */
      .builder-header {
        padding: 12px 16px !important;
        flex-direction: column !important;
        gap: 8px !important;
      }
      
      .builder-header-logo {
        height: 28px !important;
      }
      
      /* Workflow steps - stack vertically on mobile */
      .workflow-progress {
        flex-direction: column !important;
        gap: 12px !important;
        padding: 16px !important;
      }
      
      .workflow-step {
        flex-direction: row !important;
        gap: 12px !important;
        width: 100% !important;
      }
      
      .workflow-connector {
        display: none !important;
      }
      
      .workflow-step-circle {
        width: 32px !important;
        height: 32px !important;
        min-width: 32px !important;
      }
      
      .workflow-step-label {
        font-size: 12px !important;
      }
      
      /* ===== GLASS CARDS MOBILE ===== */
      .glass, .glass-card, .glass-panel, .glass-solid {
        border-radius: 16px !important;
      }
      
      .glass-card {
        padding: 16px !important;
      }
      
      /* ===== BUTTONS MOBILE ===== */
      .btn {
        padding: 12px 16px !important;
        font-size: 14px !important;
        min-height: 44px !important; /* Apple touch target guideline */
      }
      
      .btn-icon {
        width: 40px !important;
        height: 40px !important;
      }
      
      /* ===== INPUTS MOBILE ===== */
      .glass-input {
        padding: 12px 14px !important;
        font-size: 16px !important; /* Prevent iOS zoom */
        border-radius: 10px !important;
      }
      
      /* ===== PREVIEW/PUBLIC PROFILE MOBILE ===== */
      .preview-header {
        padding: 12px 16px !important;
      }
      
      .preview-header-logo {
        height: 28px !important;
      }
      
      /* ===== TAILOR VIEW MOBILE ===== */
      .tailor-header {
        padding: 20px 16px !important;
      }
      
      .tailor-title {
        font-size: 22px !important;
      }
      
      .tailor-logo {
        height: 32px !important;
      }
      
      /* ===== NAV ITEMS MOBILE ===== */
      .nav-btn {
        padding: 12px 14px !important;
        font-size: 13px !important;
      }
      
      .nav-btn i {
        width: 18px !important;
        font-size: 14px !important;
      }
      
      /* ===== SAVE INDICATOR MOBILE ===== */
      .save-indicator {
        top: 70px !important;
        right: 12px !important;
        padding: 10px 14px !important;
        font-size: 12px !important;
      }
      
      /* ===== EXPERIENCE CARDS MOBILE ===== */
      .experience-card {
        padding: 16px !important;
      }
      
      .experience-header {
        flex-direction: column !important;
        gap: 12px !important;
      }
      
      .company-logo {
        width: 48px !important;
        height: 48px !important;
      }
      
      /* ===== FORM SECTIONS MOBILE ===== */
      .form-section-title {
        font-size: 16px !important;
      }
      
      .form-row {
        gap: 12px !important;
      }
      
      /* ===== MODALS MOBILE ===== */
      .modal-content {
        padding: 20px !important;
        margin: 16px !important;
        max-height: 90vh !important;
        border-radius: 20px !important;
      }
    }
    
    /* Extra small screens (iPhone SE, 320px) */
    @media (max-width: 375px) {
      .auth-card {
        padding: 24px 16px !important;
      }
      
      .auth-logo {
        width: 64px !important;
      }
      
      .auth-title {
        font-size: 20px !important;
      }
      
      .upload-logo {
        width: 120px !important;
      }
      
      .page-title {
        font-size: 20px !important;
      }
      
      .btn {
        padding: 10px 14px !important;
        font-size: 13px !important;
      }
    }
    
    /* ============================================
       MOBILE BOTTOM NAVIGATION BAR
       Appears when sidebar is hidden (< 800px)
       ============================================ */
    .mobile-bottom-nav {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 64px;
      padding-bottom: env(safe-area-inset-bottom);
      background: linear-gradient(180deg, rgba(12, 12, 14, 0.98) 0%, rgba(3, 3, 3, 1) 100%);
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      z-index: 1000;
      box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.5);
    }
    
    .mobile-bottom-nav-inner {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 64px;
      max-width: 500px;
      margin: 0 auto;
      padding: 0 8px;
    }
    
    .mobile-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 8px 12px;
      min-width: 64px;
      border-radius: 12px;
      background: transparent;
      border: none;
      color: rgba(161, 161, 170, 0.7);
      font-size: 10px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      -webkit-tap-highlight-color: transparent;
    }
    
    .mobile-nav-item i {
      font-size: 20px;
      transition: transform 0.2s ease;
    }
    
    .mobile-nav-item.active {
      color: var(--chrome-bright);
      background: rgba(255, 255, 255, 0.08);
    }
    
    .mobile-nav-item.active i {
      transform: scale(1.1);
    }
    
    .mobile-nav-item:active {
      transform: scale(0.95);
      background: rgba(255, 255, 255, 0.05);
    }
    
    @media (max-width: 800px) {
      .mobile-bottom-nav {
        display: block;
      }
      
      /* Adjust main content to not be hidden by bottom nav */
      .main-content {
        padding-bottom: calc(80px + env(safe-area-inset-bottom)) !important;
      }
    }
    
    /* Animation for floating save indicator */
    @keyframes slideIn {
      from { transform: translateX(100px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    /* Responsibilities editor styles */
    .resp-section {
      margin-top: 24px;
      padding: 20px;
      background: rgba(30, 58, 95, 0.06);
      border: 1px solid rgba(30, 58, 95, 0.15);
      border-radius: 14px;
    }
    
    .resp-header {
      font-size: 13px;
      font-weight: 600;
      color: var(--purple-light);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .resp-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 10px;
    }
    
    .resp-bullet {
      width: 24px;
      height: 24px;
      min-width: 24px;
      background: rgba(30, 58, 95, 0.2);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: var(--purple-light);
      margin-top: 8px;
    }
    
    .resp-input {
      flex: 1;
      padding: 10px 14px;
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #fff;
      font-size: 13px;
      line-height: 1.5;
    }
    
    .resp-input:focus {
      outline: none;
      border-color: var(--purple-main);
    }
    
    .resp-delete {
      width: 28px;
      height: 28px;
      min-width: 28px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 6px;
      color: rgba(239, 68, 68, 0.6);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      margin-top: 8px;
      transition: all 0.2s;
    }
    
    .resp-delete:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #EF4444;
    }
    
    .add-resp-btn {
      width: 100%;
      padding: 12px;
      margin-top: 12px;
      background: transparent;
      border: 2px dashed rgba(30, 58, 95, 0.3);
      border-radius: 8px;
      color: var(--purple-light);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .add-resp-btn:hover {
      border-color: var(--purple-main);
      background: rgba(30, 58, 95, 0.1);
    }
    
    /* Enhanced image quality rendering */
    img {
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      image-rendering: -webkit-optimize-contrast;
    }
    
    /* Video player improvements */
    video {
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }
    
    video::-webkit-media-controls {
      background: linear-gradient(transparent, rgba(0,0,0,0.7));
    }
    
    video::-webkit-media-controls-enclosure {
      padding: 0;
    }
    
    video::-webkit-media-controls-panel {
      padding: 0 8px 8px;
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
    const { useState, useRef, useEffect } = React;
    
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
    
    const VIEW = { AUTH: 0, UPLOAD: 1, BUILDER: 2, PREVIEW: 3, TAILOR: 4 };
    
    // INDUSTRY-SPECIFIC TEMPLATES - 10 Premium Options
    const TEMPLATE_CATEGORIES = [
      { id: 'professional', name: 'Professional', icon: 'fa-briefcase' },
      { id: 'service', name: 'Service Industry', icon: 'fa-hands-helping' },
      { id: 'creative', name: 'Creative', icon: 'fa-palette' },
      { id: 'technical', name: 'Technical', icon: 'fa-code' }
    ];
    
    const TEMPLATES = [
      // Professional Category
      { 
        id: 'executive', 
        category: 'professional',
        name: 'Executive', 
        desc: 'Bold & authoritative for C-suite and senior leaders', 
        color: '#1e3a5f', 
        accent2: '#0d1f33',
        icon: 'fa-crown',
        gradient: 'linear-gradient(135deg, #1e3a5f, #0d1f33, #0a1628)',
        industries: ['Finance', 'Consulting', 'Legal', 'Corporate']
      },
      { 
        id: 'corporate', 
        category: 'professional',
        name: 'Corporate', 
        desc: 'Professional navy & gold for business roles', 
        color: '#1E3A5F', 
        accent2: '#D4AF37',
        icon: 'fa-building',
        gradient: 'linear-gradient(135deg, #1E3A5F, #2C5282, #D4AF37)',
        industries: ['Banking', 'Insurance', 'Real Estate', 'Management']
      },
      { 
        id: 'nonprofit', 
        category: 'professional',
        name: 'Nonprofit', 
        desc: 'Trust-building blues & greens for mission-driven work', 
        color: '#0891B2', 
        accent2: '#059669',
        icon: 'fa-heart',
        gradient: 'linear-gradient(135deg, #0891B2, #0D9488, #059669)',
        industries: ['Charity', 'NGO', 'Social Work', 'Education']
      },
      
      // Service Industry Category
      { 
        id: 'healthcare', 
        category: 'service',
        name: 'Healthcare', 
        desc: 'Calming blues & teals for medical professionals', 
        color: '#0EA5E9', 
        accent2: '#14B8A6',
        icon: 'fa-heartbeat',
        gradient: 'linear-gradient(135deg, #0EA5E9, #06B6D4, #14B8A6)',
        industries: ['Medical', 'Nursing', 'Pharmacy', 'Dental']
      },
      { 
        id: 'restaurant', 
        category: 'service',
        name: 'Restaurant & Hospitality', 
        desc: 'Warm appetizing colors for food service', 
        color: '#DC2626', 
        accent2: '#EA580C',
        icon: 'fa-utensils',
        gradient: 'linear-gradient(135deg, #DC2626, #EA580C, #F59E0B)',
        industries: ['Chef', 'Server', 'Hotel', 'Catering']
      },
      { 
        id: 'trades', 
        category: 'service',
        name: 'Trades & Services', 
        desc: 'Strong earth tones for skilled trades', 
        color: '#D97706', 
        accent2: '#78716C',
        icon: 'fa-tools',
        gradient: 'linear-gradient(135deg, #D97706, #B45309, #78716C)',
        industries: ['Plumbing', 'Electric', 'HVAC', 'Construction']
      },
      { 
        id: 'beauty', 
        category: 'service',
        name: 'Beauty & Wellness', 
        desc: 'Elegant rose gold & soft tones for salons & spas', 
        color: '#3d7ab8', 
        accent2: '#1a2d4a',
        icon: 'fa-spa',
        gradient: 'linear-gradient(135deg, #3d7ab8, #2d5a87, #1a2d4a)',
        industries: ['Hair Salon', 'Spa', 'Makeup', 'Fitness']
      },
      
      // Creative Category
      { 
        id: 'creative', 
        category: 'creative',
        name: 'Creative', 
        desc: 'Vibrant gradients for designers & artists', 
        color: '#4d8ab8', 
        accent2: '#3d7ab8',
        icon: 'fa-paint-brush',
        gradient: 'linear-gradient(135deg, #4d8ab8, #4d8ab8, #3d7ab8)',
        industries: ['Design', 'Art', 'Photography', 'Marketing']
      },
      
      // Technical Category
      { 
        id: 'tech', 
        category: 'technical',
        name: 'Tech Pioneer', 
        desc: 'Data-driven cyan & neon for engineers', 
        color: '#06B6D4', 
        accent2: '#22D3EE',
        icon: 'fa-microchip',
        gradient: 'linear-gradient(135deg, #06B6D4, #22D3EE, #67E8F9)',
        industries: ['Software', 'Data Science', 'DevOps', 'IT']
      },
      { 
        id: 'minimal', 
        category: 'technical',
        name: 'Minimal', 
        desc: 'Clean & elegant simplicity for any industry', 
        color: '#10B981', 
        accent2: '#34D399',
        icon: 'fa-feather',
        gradient: 'linear-gradient(135deg, #10B981, #34D399, #6EE7B7)',
        industries: ['General', 'Startup', 'Freelance', 'Academic']
      }
    ];
    
    // Storage keys
    const STORAGE_KEYS = {
      PROFILE: 'webume_profile',
      PHOTO: 'webume_photo',
      TEMPLATE: 'webume_template',
      RAW_TEXT: 'webume_rawtext',
      LAST_SAVED: 'webume_last_saved'
    };
    
    // Auth View Component - Simplified for maximum compatibility
    const AuthView = ({ onLogin, authLoading, authError, clearAuthError }) => {
      const [isLogin, setIsLogin] = useState(true);
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [name, setName] = useState('');
      const [error, setError] = useState('');
      const [showPassword, setShowPassword] = useState(false);
      
      const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('📝 Form submitted!', { email, password: '***', name, isLogin });
        setError('');
        
        if (!email || !password || (!isLogin && !name)) {
          console.log('❌ Validation failed - missing fields');
          setError('Please fill in all fields');
          return;
        }
        
        console.log('✅ Validation passed, calling onLogin...');
        onLogin(isLogin, email, password, name);
      };
      
      // Direct input handlers for maximum compatibility
      const handleEmailChange = (e) => {
        console.log('📧 Email:', e.target.value);
        setEmail(e.target.value);
      };
      
      const handlePasswordChange = (e) => {
        console.log('🔑 Password changed');
        setPassword(e.target.value);
      };
      
      const handleNameChange = (e) => {
        console.log('👤 Name:', e.target.value);
        setName(e.target.value);
      };
      
      return (
        <div className="auth-container" style={{ 
          minHeight: '100dvh', /* Dynamic viewport height for mobile - handles keyboard */
          minHeight: '-webkit-fill-available', /* Fallback for older Safari */
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: 'clamp(12px, 3vw, 24px)',
          paddingTop: 'max(env(safe-area-inset-top), clamp(20px, 5vh, 40px))',
          paddingBottom: 'max(env(safe-area-inset-bottom), 20px)',
          position: 'relative',
          zIndex: 100,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          <div className="glass auth-card" style={{ 
            width: '100%', 
            maxWidth: 'min(420px, calc(100% - 24px))', 
            padding: 'clamp(24px, 5vw, 48px) clamp(20px, 5vw, 40px)',
            borderRadius: 'clamp(20px, 4vw, 28px)',
            position: 'relative',
            zIndex: 200
          }}>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(24px, 5vw, 36px)' }}>
              <img 
                src="/static/logo.png" 
                alt="Webumé" 
                className="auth-logo"
                style={{
                  width: 'clamp(80px, 20vw, 120px)',
                  height: 'auto',
                  margin: '0 auto clamp(16px, 4vw, 24px)',
                  display: 'block',
                  filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))'
                }}
              />
              <h1 className="auth-title" style={{ fontSize: 'clamp(22px, 5vw, 28px)', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h1>
              <p className="auth-subtitle" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(13px, 3vw, 14px)' }}>
                {isLogin ? 'Sign in to access your saved profiles' : 'Start building your digital profile'}
              </p>
            </div>
            
            {(error || authError) && (
              <div style={{
                padding: '14px 18px',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '12px',
                marginBottom: '20px',
                color: '#EF4444',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <i className="fas fa-exclamation-circle"></i>
                {error || authError}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div style={{ marginBottom: 'clamp(14px, 3vw, 18px)' }}>
                  <label className="auth-form-label" style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(12px, 2.5vw, 13px)', fontWeight: '600', marginBottom: '8px' }}>
                    <i className="fas fa-user" style={{ marginRight: '8px', color: 'var(--chrome)' }}></i>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="glass-input auth-input"
                    id="auth-name"
                    name="name"
                    value={name}
                    onChange={handleNameChange}
                    onFocus={() => console.log('👤 Name focused')}
                    placeholder="John Smith"
                    autoComplete="name"
                    style={{ 
                      width: '100%', 
                      padding: 'clamp(12px, 3vw, 14px) clamp(14px, 3vw, 16px)', 
                      fontSize: '16px',
                      WebkitAppearance: 'none',
                      appearance: 'none'
                    }}
                  />
                </div>
              )}
              
              <div style={{ marginBottom: 'clamp(14px, 3vw, 18px)' }}>
                <label className="auth-form-label" style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(12px, 2.5vw, 13px)', fontWeight: '600', marginBottom: '8px' }}>
                  <i className="fas fa-envelope" style={{ marginRight: '8px', color: 'var(--chrome)' }}></i>
                  Email Address
                </label>
                <input
                  type="email"
                  id="auth-email"
                  name="email"
                  className="glass-input auth-input"
                  value={email}
                  onChange={handleEmailChange}
                  onFocus={() => console.log('📧 Email focused')}
                  onTouchStart={() => console.log('📧 Email touch start')}
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  inputMode="email"
                  style={{ 
                    width: '100%', 
                    padding: 'clamp(12px, 3vw, 14px) clamp(14px, 3vw, 16px)', 
                    fontSize: '16px',
                    WebkitAppearance: 'none',
                    appearance: 'none'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: 'clamp(20px, 4vw, 28px)' }}>
                <label className="auth-form-label" style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(12px, 2.5vw, 13px)', fontWeight: '600', marginBottom: '8px' }}>
                  <i className="fas fa-lock" style={{ marginRight: '8px', color: 'var(--chrome)' }}></i>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="auth-password"
                    name="password"
                    className="glass-input auth-input"
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={() => console.log('🔑 Password focused')}
                    onTouchStart={() => console.log('🔑 Password touch start')}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    style={{ 
                      width: '100%', 
                      padding: 'clamp(12px, 3vw, 14px) clamp(14px, 3vw, 16px)', 
                      fontSize: '16px',
                      paddingRight: '50px',
                      WebkitAppearance: 'none',
                      appearance: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '44px',
                      minHeight: '44px'
                    }}
                  >
                    <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </button>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary auth-submit-btn"
                disabled={authLoading}
                onClick={(e) => { 
                  console.log('🖱️ BUTTON CLICKED!');
                  // If form submit doesn't work, try direct call
                  if (email && password && (isLogin || name)) {
                    handleSubmit(e);
                  }
                }}
                onTouchEnd={(e) => {
                  console.log('👆 BUTTON TOUCH END!');
                }}
                style={{ 
                  width: '100%', 
                  padding: 'clamp(14px, 3.5vw, 18px)', 
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 'clamp(48px, 10vw, 56px)',
                  WebkitTapHighlightColor: 'transparent',
                  gap: '10px',
                  position: 'relative',
                  zIndex: 100
                }}
              >
                {authLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    <i className={isLogin ? 'fas fa-sign-in-alt' : 'fas fa-user-plus'}></i>
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </>
                )}
              </button>
            </form>
            
            <div style={{ marginTop: 'clamp(20px, 4vw, 28px)', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(12px, 2.5vw, 13px)' }}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => { setIsLogin(!isLogin); setError(''); if(clearAuthError) clearAuthError(); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--chrome)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginLeft: '6px',
                    padding: '8px 4px',
                    minHeight: '44px'
                  }}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
            
            <div style={{ marginTop: 'clamp(24px, 5vw, 32px)', paddingTop: 'clamp(16px, 4vw, 24px)', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 'clamp(10px, 2vw, 11px)' }}>
                <i className="fas fa-shield-alt" style={{ marginRight: '6px' }}></i>
                Your data is securely stored and never shared
              </p>
            </div>
          </div>
        </div>
      );
    };
    
    const App = () => {
      const [view, setViewInternal] = useState(VIEW.AUTH);
      
      // Wrapper to log view changes
      const setView = (newView) => {
        const viewNames = { 0: 'AUTH', 1: 'UPLOAD', 2: 'BUILDER', 3: 'PREVIEW', 4: 'TAILOR' };
        console.log('📍 View changing from', viewNames[view], 'to', viewNames[newView]);
        setViewInternal(newView);
      };
      const [user, setUser] = useState(null);
      const [authLoading, setAuthLoading] = useState(true);
      const [authError, setAuthError] = useState('');
      const [profile, setProfile] = useState(null);
      const [loading, setLoading] = useState(false);
      const [progress, setProgress] = useState(0);
      const [activeTab, setTab] = useState('basics');
      const [rawText, setRawText] = useState('');
      const [selectedTemplate, setTemplate] = useState('executive');
      const [profilePhoto, setProfilePhoto] = useState(null);
      const [lastSaved, setLastSaved] = useState(null);
      const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'saved', 'error'
      const [slug, setSlug] = useState('');
      const [isPublic, setIsPublic] = useState(false);
      const [profileViews, setProfileViews] = useState(0);
      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
      const [steps, setSteps] = useState([
        { text: 'Reading file', state: 'pending' },
        { text: 'Extracting text', state: 'pending' },
        { text: 'AI deep analysis', state: 'pending' },
        { text: 'Extracting experiences', state: 'pending' },
        { text: 'Generating descriptions', state: 'pending' },
        { text: 'Building rich profile', state: 'pending' }
      ]);
      
      // Check auth status on mount
      React.useEffect(() => {
        checkAuth();
      }, []);
      
      const checkAuth = async () => {
        try {
          const res = await fetch('/api/auth/me', { credentials: 'include' });
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            // Load profile from server - loadProfile handles setting the view
            await loadProfile();
          } else {
            setView(VIEW.AUTH);
          }
        } catch (e) {
          console.error('Auth check failed:', e);
          setView(VIEW.AUTH);
        }
        setAuthLoading(false);
      };
      
      const loadProfile = async () => {
        try {
          const res = await fetch('/api/profile/load', { credentials: 'include' });
          const data = await res.json();
          
          if (data.profile) {
            setProfile(data.profile);
            if (data.profilePhoto) setProfilePhoto(data.profilePhoto);
            if (data.selectedTemplate) setTemplate(data.selectedTemplate);
            if (data.rawText) setRawText(data.rawText);
            if (data.slug) setSlug(data.slug);
            if (data.isPublic !== undefined) setIsPublic(data.isPublic);
            if (data.profileViews) setProfileViews(data.profileViews);
            setView(VIEW.BUILDER);
            console.log('✅ Loaded profile from server');
          } else {
            // No profile exists, go to upload
            setView(VIEW.UPLOAD);
            console.log('📤 No profile found, redirecting to upload');
          }
        } catch (e) {
          console.error('Error loading profile:', e);
          // On error, go to upload as fallback
          setView(VIEW.UPLOAD);
        }
      };
      
      const handleAuth = async (isLogin, email, password, name) => {
        setAuthLoading(true);
        setAuthError('');
        console.log('🔐 Auth attempt:', isLogin ? 'login' : 'register', email);
        
        try {
          const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
          const body = isLogin ? { email, password } : { email, password, name };
          
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            credentials: 'include' // Ensure cookies are sent
          });
          
          console.log('📡 Auth response status:', res.status);
          const data = await res.json();
          console.log('📦 Auth response data:', data);
          
          if (data.error) {
            setAuthError(data.error);
            setAuthLoading(false);
            return;
          }
          
          if (!data.user) {
            setAuthError('Invalid response from server');
            setAuthLoading(false);
            return;
          }
          
          console.log('✅ Auth successful, user:', data.user.email);
          setUser(data.user);
          
          if (data.user.hasProfile) {
            console.log('📂 Loading existing profile...');
            await loadProfile();
          } else {
            console.log('🆕 New user, going to upload');
            setView(VIEW.UPLOAD);
          }
        } catch (e) {
          setAuthError('Connection error. Please try again.');
        }
        setAuthLoading(false);
      };
      
      const handleLogout = async () => {
        if (confirm('Are you sure you want to sign out?')) {
          await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
          setUser(null);
          setProfile(null);
          setProfilePhoto(null);
          setRawText('');
          setTemplate('executive');
          setView(VIEW.AUTH);
        }
      };
      
      // Auto-save profile to SERVER when it changes
      React.useEffect(() => {
        if (profile && user) {
          setSaveStatus('saving');
          
          const saveTimeout = setTimeout(async () => {
            try {
              const res = await fetch('/api/profile/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                  profile,
                  profilePhoto,
                  selectedTemplate,
                  rawText
                })
              });
              
              const data = await res.json();
              if (data.success) {
                setLastSaved(new Date(data.savedAt));
                setSaveStatus('saved');
                console.log('✅ Auto-saved to server at', data.savedAt);
              } else {
                throw new Error(data.error);
              }
              setTimeout(() => setSaveStatus(''), 3000);
            } catch (e) {
              console.error('Error saving profile:', e);
              setSaveStatus('error');
              setTimeout(() => setSaveStatus(''), 5000);
            }
          }, 1000);
          return () => clearTimeout(saveTimeout);
        }
      }, [profile, profilePhoto, selectedTemplate]);
      
      // Manual save function
      const saveProgress = async () => {
        if (!profile) {
          alert('No profile to save yet. Upload a resume first.');
          return;
        }
        if (!user) {
          alert('Please sign in to save your profile.');
          return;
        }
        try {
          setSaveStatus('saving');
          const res = await fetch('/api/profile/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              profile,
              profilePhoto,
              selectedTemplate,
              rawText
            })
          });
          const data = await res.json();
          if (data.success) {
            setLastSaved(new Date(data.savedAt));
            setSaveStatus('saved');
            alert('✅ Profile saved to your account! You can access it from any device.');
          } else {
            throw new Error(data.error);
          }
        } catch (e) {
          setSaveStatus('error');
          alert('❌ Error saving profile: ' + e.message);
        }
      };
      
      // Clear saved data (server + local)
      const clearSavedData = async () => {
        if (confirm('Are you sure you want to clear ALL profile data? This cannot be undone.')) {
          try {
            await fetch('/api/profile/save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                profile: null,
                profilePhoto: null,
                selectedTemplate: 'executive',
                rawText: ''
              })
            });
          } catch (e) {}
          setProfile(null);
          setProfilePhoto(null);
          setRawText('');
          setTemplate('executive');
          setLastSaved(null);
          setView(VIEW.UPLOAD);
          alert('All profile data has been cleared.');
        }
      };
      
      // Format last saved time
      const formatLastSaved = (date) => {
        if (!date) return null;
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
        if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
        return date.toLocaleDateString();
      };
      
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
      
      // Helper to get company logo URL from Clearbit
      const getCompanyLogoUrl = (domain) => {
        if (!domain) return null;
        // Clean domain
        const cleanDomain = domain.replace(/^(https?:\\/\\/)?(www\\.)?/, '').split('/')[0];
        return \`https://logo.clearbit.com/\${cleanDomain}\`;
      };
      
      const buildProfile = (aiData, text) => {
        if (aiData && !aiData.error && aiData.basics) {
          return {
            basics: { 
              ...aiData.basics,
              summary: aiData.basics.summary || ''
            },
            experience: (aiData.experience || []).map((e, i) => {
              // Auto-generate logo URL from company domain
              const companyInfo = e.companyInfo || {};
              const domain = companyInfo.domain || '';
              const logoUrl = getCompanyLogoUrl(domain);
              
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
                logoUrl: logoUrl,
                customLogo: null, // For manual upload
                responsibilities: e.responsibilities || [],
                // Rich content for Employer Detail Page
                projects: e.projects || [],
                victories: e.victories || [],
                challenges: e.challenges || [],
                reviews: e.reviews || [],
                media: e.media || { photos: [], videos: [] },
                dayInLife: e.dayInLife || [
                  { time: '9:00 AM', activity: '' },
                  { time: '10:30 AM', activity: '' },
                  { time: '12:00 PM', activity: '' },
                  { time: '2:00 PM', activity: '' },
                  { time: '4:00 PM', activity: '' },
                  { time: '5:30 PM', activity: '' }
                ],
                metrics: e.metrics || [
                  { value: '', label: '' },
                  { value: '', label: '' },
                  { value: '', label: '' },
                  { value: '', label: '' }
                ]
              };
            }),
            skills: aiData.skills || [],
            achievements: (aiData.achievements || []).map((a, i) => ({
              id: Date.now() + i + 1000,
              ...a
            })),
            education: (aiData.education || []).map((e, i) => ({
              id: Date.now() + i + 2000,
              ...e
            })),
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
          basics: {
            name, title: '', tagline: '', email, phone,
            location: '', linkedin: '', website: '', summary: ''
          },
          experience: [],
          skills: [],
          achievements: [],
          education: [],
          certifications: [],
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
        { id: 'education', icon: 'fa-graduation-cap', label: 'Education' },
        { id: 'awards', icon: 'fa-award', label: 'Awards' },
        { id: 'reviews', icon: 'fa-star', label: 'Reviews' },
        { id: 'pay', icon: 'fa-dollar-sign', label: 'Pay History' },
        { id: 'projects', icon: 'fa-folder', label: 'Projects' },
        { id: 'media', icon: 'fa-image', label: 'Media' },
        { id: 'templates', icon: 'fa-palette', label: 'Templates' }
      ];
      
      // Show loading state while checking auth
      if (authLoading && view === VIEW.AUTH) {
        return (
          <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '20px',
            position: 'relative',
            zIndex: 100
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, var(--purple-main), var(--pink-main))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 40px rgba(30, 58, 95,0.4)'
            }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: '#fff' }}></i>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Loading...</p>
          </div>
        );
      }
      
      // Show Auth view if not logged in
      if (view === VIEW.AUTH) {
        return <AuthView onLogin={handleAuth} authLoading={authLoading} authError={authError} clearAuthError={() => setAuthError('')} />;
      }
      
      return (
        <div className="app-container">
          {/* MOBILE NAVIGATION */}
          <button 
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <i className={mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
          </button>
          
          {/* Mobile sidebar overlay */}
          <div 
            className={'mobile-sidebar-overlay' + (mobileMenuOpen ? ' active' : '')}
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          
          {/* Mobile sidebar drawer */}
          <div className={'mobile-sidebar' + (mobileMenuOpen ? ' active' : '')}>
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <img src="/static/logo.png" alt="Webumé" style={{ width: '140px', height: 'auto' }} />
            </div>
            
            {user && (
              <div style={{
                padding: '14px',
                marginBottom: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div style={{ color: '#fff', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                  {user.name}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
                  {user.email}
                </div>
              </div>
            )}
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '10px', paddingLeft: '12px' }}>
                Navigation
              </div>
              {[
                { view: VIEW.UPLOAD, icon: 'fa-upload', label: 'Upload Resume' },
                { view: VIEW.BUILDER, icon: 'fa-edit', label: 'Edit Profile', needsProfile: true },
                { view: VIEW.PREVIEW, icon: 'fa-eye', label: 'Preview', needsProfile: true },
                { view: VIEW.TAILOR, icon: 'fa-magic', label: 'AI Tailor', needsProfile: true }
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => {
                    if (!item.needsProfile || profile) {
                      setView(item.view);
                      setMobileMenuOpen(false);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: view === item.view ? 'rgba(255,255,255,0.08)' : 'transparent',
                    border: 'none',
                    borderRadius: '10px',
                    color: item.needsProfile && !profile ? 'rgba(255,255,255,0.3)' : '#e4e4e7',
                    fontSize: '14px',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: item.needsProfile && !profile ? 'not-allowed' : 'pointer',
                    marginBottom: '4px'
                  }}
                >
                  <i className={'fas ' + item.icon} style={{ width: '18px' }}></i>
                  {item.label}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '10px',
                color: '#EF4444',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                marginTop: 'auto'
              }}
            >
              <i className="fas fa-sign-out-alt"></i>
              Sign Out
            </button>
          </div>
          
          {/* FLOATING AUTO-SAVE INDICATOR - Always visible */}
          {saveStatus && (
            <div className="save-indicator" style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 9999,
              padding: 'clamp(10px, 2vw, 12px) clamp(14px, 3vw, 20px)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: 'clamp(11px, 2.5vw, 13px)',
              fontWeight: '600',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              animation: 'slideIn 0.3s ease',
              background: saveStatus === 'saving' 
                ? 'linear-gradient(135deg, rgba(6,182,212,0.9), rgba(30, 58, 95,0.9))' 
                : saveStatus === 'saved'
                ? 'linear-gradient(135deg, rgba(16,185,129,0.9), rgba(6,182,212,0.9))'
                : 'linear-gradient(135deg, rgba(239,68,68,0.9), rgba(61, 122, 184,0.9))',
              color: '#fff',
              backdropFilter: 'blur(10px)'
            }}>
              {saveStatus === 'saving' && (
                <>
                  <i className="fas fa-circle-notch fa-spin"></i>
                  Auto-saving...
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <i className="fas fa-check-circle"></i>
                  All changes saved!
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <i className="fas fa-exclamation-triangle"></i>
                  Save failed - click Save Now
                </>
              )}
            </div>
          )}
          
          {/* Sidebar */}
          <aside className="sidebar glass-sidebar">
            <div className="logo">
              <img src="/static/logo.png" alt="Webumé" className="logo-img" />
            </div>
            
            {/* User Info */}
            {user && (
              <div style={{
                padding: '16px',
                margin: '0 16px 16px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #1a1a1c, #0e0e10)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#a1a1aa',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#fff', fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.name}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Sign Out
                </button>
              </div>
            )}
            
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
              <button 
                className="nav-btn" 
                onClick={() => profile && setView(VIEW.TAILOR)}
                style={{ 
                  background: 'linear-gradient(135deg, rgba(61, 122, 184,0.2), rgba(30, 58, 95,0.2))',
                  borderColor: 'rgba(61, 122, 184,0.4)'
                }}
              >
                <i className="fas fa-magic" style={{ color: '#3d7ab8' }}></i>
                <span style={{ color: '#3d7ab8' }}>AI Tailor</span>
                <span style={{ 
                  fontSize: '9px', 
                  background: 'linear-gradient(135deg, #3d7ab8, #1e3a5f)',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  marginLeft: '4px'
                }}>PRO</span>
              </button>
              <button className="nav-btn" onClick={() => setView(VIEW.UPLOAD)}>
                <i className="fas fa-upload"></i>
                Upload New
              </button>
            </div>
            
            {/* Save/Load Section */}
            <div className="nav-group">
              <div className="nav-label">Save Progress</div>
              <button 
                className="nav-btn" 
                onClick={saveProgress}
                style={{ background: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.3)' }}
              >
                <i className="fas fa-save" style={{ color: 'var(--green-main)' }}></i>
                <span style={{ color: 'var(--green-main)' }}>Save Now</span>
              </button>
              <button 
                className="nav-btn" 
                onClick={clearSavedData}
                style={{ opacity: 0.7 }}
              >
                <i className="fas fa-trash-alt"></i>
                Clear Saved Data
              </button>
              
              {/* Save Status */}
              {(lastSaved || saveStatus) && (
                <div style={{ 
                  padding: '10px 16px', 
                  fontSize: '11px',
                  color: saveStatus === 'error' ? '#EF4444' : 'rgba(255,255,255,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {saveStatus === 'saving' && (
                    <>
                      <i className="fas fa-spinner fa-spin" style={{ color: 'var(--cyan-main)' }}></i>
                      Saving...
                    </>
                  )}
                  {saveStatus === 'saved' && (
                    <>
                      <i className="fas fa-check-circle" style={{ color: 'var(--green-main)' }}></i>
                      Saved!
                    </>
                  )}
                  {saveStatus === 'error' && (
                    <>
                      <i className="fas fa-exclamation-circle"></i>
                      Save failed
                    </>
                  )}
                  {!saveStatus && lastSaved && (
                    <>
                      <i className="fas fa-clock"></i>
                      Last saved: {formatLastSaved(lastSaved)}
                    </>
                  )}
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
            {view === VIEW.BUILDER && (
              profile ? (
                <BuilderView
                  profile={profile}
                  setProfile={setProfile}
                  activeTab={activeTab}
                  rawText={rawText}
                  profilePhoto={profilePhoto}
                  setProfilePhoto={setProfilePhoto}
                  selectedTemplate={selectedTemplate}
                  setTemplate={setTemplate}
                  onBack={() => setView(VIEW.UPLOAD)}
                  onPreview={() => setView(VIEW.PREVIEW)}
                  onSave={saveProgress}
                  saveStatus={saveStatus}
                />
              ) : (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <div style={{ fontSize: '80px', marginBottom: '24px' }}>🚀</div>
                  <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>Let's Get Started!</h2>
                  <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px' }}>
                    Upload your resume to auto-fill your profile, or create one from scratch.
                  </p>
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => setView(VIEW.UPLOAD)}
                      style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #1e3a5f, #3d7ab8)' }}
                    >
                      <i className="fas fa-upload" style={{ marginRight: '10px' }}></i>
                      Upload Resume
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => {
                        // Create empty profile to start from scratch
                        setProfile({
                          basics: { name: user?.name || '', title: '', tagline: '', email: user?.email || '', phone: '', location: '', linkedin: '', website: '', summary: '' },
                          experience: [],
                          skills: [],
                          achievements: [],
                          education: [],
                          certifications: [],
                          awards: [],
                          reviews: [],
                          payHistory: [],
                          projects: [],
                          photos: [],
                          videos: []
                        });
                      }}
                      style={{ padding: '14px 28px' }}
                    >
                      <i className="fas fa-pencil-alt" style={{ marginRight: '10px' }}></i>
                      Start From Scratch
                    </button>
                  </div>
                </div>
              )
            )}
            {view === VIEW.PREVIEW && (
              profile ? (
                <PreviewView
                  profile={profile}
                  setProfile={setProfile}
                  setView={setView}
                  profilePhoto={profilePhoto}
                  selectedTemplate={selectedTemplate}
                  slug={slug}
                  isPublic={isPublic}
                  setIsPublic={setIsPublic}
                  profileViews={profileViews}
                />
              ) : (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <div style={{ fontSize: '80px', marginBottom: '24px' }}>📋</div>
                  <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>No Profile Data</h2>
                  <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px' }}>
                    You need to create or upload a profile before you can preview it.
                  </p>
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => setView(VIEW.UPLOAD)}
                      style={{ padding: '14px 28px' }}
                    >
                      <i className="fas fa-upload" style={{ marginRight: '10px' }}></i>
                      Upload Resume
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => setView(VIEW.BUILDER)}
                      style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #1e3a5f, #3d7ab8)' }}
                    >
                      <i className="fas fa-plus" style={{ marginRight: '10px' }}></i>
                      Create Profile
                    </button>
                  </div>
                </div>
              )
            )}
            {view === VIEW.TAILOR && profile && (
              <TailorView
                profile={profile}
                user={user}
                setView={setView}
              />
            )}
          </main>
          
          {/* AI Chat Assistant - Available on all views except AUTH */}
          {view !== VIEW.AUTH && (
            <ChatWidget
              user={user}
              profile={profile}
              setProfile={setProfile}
              view={view}
            />
          )}
          
          {/* MOBILE BOTTOM NAVIGATION BAR */}
          <nav className="mobile-bottom-nav">
            <div className="mobile-bottom-nav-inner">
              <button 
                className={'mobile-nav-item' + (view === VIEW.UPLOAD ? ' active' : '')}
                onClick={() => setView(VIEW.UPLOAD)}
              >
                <i className="fas fa-upload"></i>
                <span>Upload</span>
              </button>
              <button 
                className={'mobile-nav-item' + (view === VIEW.BUILDER ? ' active' : '')}
                onClick={() => profile && setView(VIEW.BUILDER)}
                style={{ opacity: profile ? 1 : 0.4 }}
              >
                <i className="fas fa-edit"></i>
                <span>Edit</span>
              </button>
              <button 
                className={'mobile-nav-item' + (view === VIEW.PREVIEW ? ' active' : '')}
                onClick={() => profile && setView(VIEW.PREVIEW)}
                style={{ opacity: profile ? 1 : 0.4 }}
              >
                <i className="fas fa-eye"></i>
                <span>Preview</span>
              </button>
              <button 
                className={'mobile-nav-item' + (view === VIEW.TAILOR ? ' active' : '')}
                onClick={() => profile && setView(VIEW.TAILOR)}
                style={{ opacity: profile ? 1 : 0.4 }}
              >
                <i className="fas fa-magic"></i>
                <span>AI Tailor</span>
              </button>
              <button 
                className="mobile-nav-item"
                onClick={() => setMobileMenuOpen(true)}
              >
                <i className="fas fa-ellipsis-h"></i>
                <span>More</span>
              </button>
            </div>
          </nav>
        </div>
      );
    };
    
    // Upload View Component
    const UploadView = ({ onUpload, loading, progress, steps, hasSavedData, savedName, onContinue }) => {
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
          
          {/* Welcome Back Card - Show if there's saved data */}
          {hasSavedData && (
            <div className="glass-card" style={{ 
              padding: '24px 28px', 
              marginBottom: '24px',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.05))',
              border: '1px solid rgba(16,185,129,0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'rgba(16,185,129,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="fas fa-user-check" style={{ fontSize: '22px', color: 'var(--green-main)' }}></i>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                      Welcome back{savedName ? ', ' + savedName.split(' ')[0] : ''}!
                    </h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                      You have a saved profile. Continue where you left off or start fresh.
                    </p>
                  </div>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={onContinue}
                  style={{ background: 'linear-gradient(135deg, var(--green-main), var(--cyan-main))' }}
                >
                  <i className="fas fa-arrow-right"></i>
                  Continue Editing
                </button>
              </div>
            </div>
          )}
          
          <div className="glass-card upload-zone">
            <div
              className={'dropzone' + (isDragging ? ' drag-active' : '')}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              onTouchStart={() => {}} // Enable touch feedback
              style={{ 
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent'
              }}
              role="button"
              tabIndex={0}
              aria-label="Upload resume file"
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
              
              <h2 className="upload-title">Tap to Upload Resume</h2>
              <p className="upload-subtitle">Powered by Gemini AI • Instant Career Analysis</p>
              
              <div className="format-pills">
                <span className="format-pill"><i className="fas fa-file-pdf"></i> PDF</span>
                <span className="format-pill"><i className="fas fa-file-word"></i> DOCX</span>
                <span className="format-pill"><i className="fas fa-file-alt"></i> TXT</span>
              </div>
              
              {/* Mobile-friendly tap button */}
              <button 
                className="btn btn-primary"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                style={{ 
                  marginTop: '20px',
                  padding: '14px 32px',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <i className="fas fa-folder-open"></i>
                Choose File
              </button>
            </div>
          </div>
        </div>
      );
    };
    
    // Builder View Component
    const BuilderView = ({ profile, setProfile, activeTab, rawText, profilePhoto, setProfilePhoto, selectedTemplate, setTemplate, onBack, onPreview, onSave, saveStatus }) => {
      const updateField = (key, value) => setProfile(p => ({ ...p, [key]: value }));
      const updateBasics = (key, value) => setProfile(p => ({ ...p, basics: { ...p.basics, [key]: value } }));
      
      return (
        <div>
          {/* Header with Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            padding: '16px 20px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            <img src="/static/logo.png" alt="Webumé" style={{ height: '36px', width: 'auto' }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Profile Builder</span>
          </div>
          
          {/* Workflow Progress Indicator */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0',
            marginBottom: '24px',
            padding: '16px 20px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            {[
              { num: 1, label: 'Upload', icon: 'fa-upload', done: true },
              { num: 2, label: 'Edit Profile', icon: 'fa-edit', active: true },
              { num: 3, label: 'Preview & Publish', icon: 'fa-eye', done: false }
            ].map((step, i) => (
              <React.Fragment key={step.num}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: step.done ? 'pointer' : 'default',
                  opacity: step.active ? 1 : step.done ? 0.8 : 0.4
                }}
                onClick={() => {
                  if (step.num === 1) onBack();
                  if (step.num === 3 && profile) onPreview();
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: step.active ? 'linear-gradient(135deg, #1a1a1c, #27272a)' : step.done ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                    border: step.active ? '1px solid rgba(255,255,255,0.15)' : step.done ? '2px solid #10B981' : '2px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: step.active ? '#e4e4e7' : step.done ? '#10B981' : 'rgba(255,255,255,0.4)',
                    fontSize: '14px'
                  }}>
                    {step.done && !step.active ? <i className="fas fa-check"></i> : <i className={'fas ' + step.icon}></i>}
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: step.active ? '600' : '500',
                    color: step.active ? 'white' : 'rgba(255,255,255,0.5)'
                  }}>{step.label}</span>
                </div>
                {i < 2 && (
                  <div style={{
                    width: '60px',
                    height: '2px',
                    background: step.done ? 'linear-gradient(90deg, #10B981, rgba(255,255,255,0.2))' : 'rgba(255,255,255,0.1)',
                    margin: '0 8px',
                    marginBottom: '20px'
                  }}></div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="page-header">
            <div>
              <h1 className="page-title">{activeTab === 'templates' ? 'Templates' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
              <p className="page-desc">{activeTab === 'templates' ? 'Choose your profile style' : 'Edit and customize your profile information'}</p>
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
              <BasicsEditor 
                profile={profile} 
                updateBasics={updateBasics} 
                rawText={rawText}
                profilePhoto={profilePhoto}
                setProfilePhoto={setProfilePhoto}
              />
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
            {activeTab === 'education' && (
              <ListEditor
                title="Education"
                items={profile.education || []}
                setItems={(i) => updateField('education', i)}
                fields={[
                  { key: 'degree', label: 'Degree', placeholder: 'Bachelor of Science in Computer Science' },
                  { key: 'school', label: 'School', placeholder: 'Stanford University' },
                  { key: 'year', label: 'Year', placeholder: '2020' },
                  { key: 'details', label: 'Details', placeholder: 'GPA, honors, relevant coursework' }
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
            {activeTab === 'templates' && (
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                setTemplate={setTemplate}
              />
            )}
          </div>
          
          {/* Navigation Footer - Always visible */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '24px',
            padding: '20px 24px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <button
              onClick={onBack}
              style={{
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px'
              }}
            >
              <i className="fas fa-arrow-left"></i>
              Back to Upload
            </button>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={onSave}
                disabled={saveStatus === 'saving'}
                style={{
                  padding: '12px 24px',
                  background: saveStatus === 'saved' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid ' + (saveStatus === 'saved' ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.15)'),
                  borderRadius: '10px',
                  color: saveStatus === 'saved' ? '#10B981' : 'white',
                  cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}
              >
                {saveStatus === 'saving' ? (
                  <><i className="fas fa-spinner fa-spin"></i> Saving...</>
                ) : saveStatus === 'saved' ? (
                  <><i className="fas fa-check"></i> Saved!</>
                ) : (
                  <><i className="fas fa-save"></i> Save Progress</>
                )}
              </button>
              
              <button
                onClick={() => {
                  console.log('🔍 Preview clicked - profile:', profile);
                  console.log('🔍 Preview clicked - profile.basics:', profile?.basics);
                  if (!profile || !profile.basics) {
                    alert('Please fill in your basic profile information first (Name, Title, etc.)');
                    return;
                  }
                  onPreview();
                }}
                style={{
                  padding: '12px 28px',
                  background: 'linear-gradient(135deg, #1e3a5f, #3d7ab8)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Preview & Publish
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      );
    };
    
    // Basics Editor with Profile Photo Upload - ENHANCED with quality handling
    const BasicsEditor = ({ profile, updateBasics, rawText, profilePhoto, setProfilePhoto }) => {
      const photoInputRef = useRef(null);
      const [photoLoading, setPhotoLoading] = useState(false);
      
      const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setPhotoLoading(true);
        
        try {
          // Create high-quality image with proper handling
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              // Create canvas for optimal quality
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              // Target size for profile photos (high quality - preserve larger images)
              const maxSize = 1600;
              let width = img.width;
              let height = img.height;
              
              // Scale down if needed while maintaining aspect ratio
              if (width > height && width > maxSize) {
                height = (height * maxSize) / width;
                width = maxSize;
              } else if (height > maxSize) {
                width = (width * maxSize) / height;
                height = maxSize;
              }
              
              canvas.width = width;
              canvas.height = height;
              
              // Use high quality rendering
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(img, 0, 0, width, height);
              
              // Convert to high quality (0.95 quality, use PNG for best quality)
              const dataUrl = canvas.toDataURL('image/png', 0.95);
              setProfilePhoto(dataUrl);
              setPhotoLoading(false);
            };
            img.onerror = () => {
              // Fallback to original if processing fails
              setProfilePhoto(URL.createObjectURL(file));
              setPhotoLoading(false);
            };
            img.src = event.target.result;
          };
          reader.readAsDataURL(file);
        } catch (err) {
          console.error('Photo processing error:', err);
          setProfilePhoto(URL.createObjectURL(file));
          setPhotoLoading(false);
        }
      };
      
      return (
        <div>
          {/* Profile Photo Section - ENHANCED */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', marginBottom: '32px', padding: '24px', background: 'rgba(30, 58, 95,0.08)', borderRadius: '20px', border: '1px solid rgba(30, 58, 95,0.2)' }}>
            <input
              type="file"
              ref={photoInputRef}
              onChange={handlePhotoChange}
              accept="image/jpeg,image/png,image/webp,image/heic"
              hidden
            />
            <div
              onClick={() => !photoLoading && photoInputRef.current?.click()}
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '24px',
                background: profilePhoto ? '#1a1a2e' : 'linear-gradient(135deg, var(--purple-main), var(--pink-main))',
                border: profilePhoto ? '4px solid var(--purple-main)' : '3px dashed rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: photoLoading ? 'wait' : 'pointer',
                overflow: 'hidden',
                flexShrink: 0,
                transition: 'all 0.3s ease',
                boxShadow: profilePhoto ? '0 12px 40px rgba(30, 58, 95,0.35)' : '0 8px 32px rgba(30, 58, 95,0.25)',
                position: 'relative'
              }}
            >
              {photoLoading ? (
                <div style={{ textAlign: 'center', color: '#fff' }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }}></i>
                  <span style={{ fontSize: '11px', fontWeight: '600' }}>Processing...</span>
                </div>
              ) : profilePhoto ? (
                <img 
                  src={profilePhoto} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    imageRendering: '-webkit-optimize-contrast',
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                  }} 
                  alt="Profile"
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#fff' }}>
                  <i className="fas fa-camera" style={{ fontSize: '32px', marginBottom: '10px', display: 'block' }}></i>
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>Add Photo</span>
                </div>
              )}
              
              {/* Hover overlay */}
              {profilePhoto && !photoLoading && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  borderRadius: '20px'
                }} className="photo-hover-overlay">
                  <i className="fas fa-camera" style={{ color: '#fff', fontSize: '24px' }}></i>
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
                Profile Photo
                {profilePhoto && <i className="fas fa-check-circle" style={{ marginLeft: '10px', color: 'var(--green-main)', fontSize: '14px' }}></i>}
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '14px' }}>
                Upload a professional headshot (JPEG, PNG, WebP supported)
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ padding: '10px 20px', fontSize: '13px' }}
                  onClick={() => photoInputRef.current?.click()}
                  disabled={photoLoading}
                >
                  <i className={photoLoading ? 'fas fa-spinner fa-spin' : 'fas fa-upload'}></i> 
                  {photoLoading ? 'Processing...' : profilePhoto ? 'Change Photo' : 'Upload Photo'}
                </button>
                {profilePhoto && (
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '10px 20px', fontSize: '13px' }}
                    onClick={() => { setProfilePhoto(null); localStorage.removeItem(STORAGE_KEYS.PHOTO); }}
                  >
                    <i className="fas fa-trash"></i> Remove
                  </button>
                )}
              </div>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '10px' }}>
                <i className="fas fa-info-circle" style={{ marginRight: '6px' }}></i>
                High-quality images are automatically optimized for best display
              </p>
            </div>
          </div>
          
          <style>{\`
            .photo-hover-overlay:hover { opacity: 1 !important; }
          \`}</style>
          
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
            <div className="form-field full-width">
              <label className="form-label">Professional Summary</label>
              <textarea
                className="glass-input form-textarea"
                value={profile.basics.summary || ''}
                onChange={(e) => updateBasics('summary', e.target.value)}
                placeholder="A compelling 2-3 sentence summary of your professional background and expertise..."
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
            <div className="form-field">
              <label className="form-label">Website</label>
              <input
                className="glass-input"
                value={profile.basics.website || ''}
                onChange={(e) => updateBasics('website', e.target.value)}
                placeholder="yourwebsite.com"
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
    };
    
    // Experience Editor with Company Logo Support
    const ExperienceEditor = ({ experiences, setExperiences }) => {
      const [logoErrors, setLogoErrors] = useState({});
      const [showCompanyInfo, setShowCompanyInfo] = useState({});
      const logoInputRefs = useRef({});
      
      const addExperience = () => {
        setExperiences([...experiences, {
          id: Date.now(),
          company: '',
          companyInfo: {
            website: '',
            domain: '',
            industry: '',
            location: '',
            size: '',
            description: ''
          },
          logoUrl: null,
          customLogo: null,
          role: '',
          startDate: '',
          endDate: '',
          description: '',
          responsibilities: [],
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
          ],
          // NEW: Employer-specific rich content
          challenges: [],      // Challenges faced at this employer
          victories: [],       // Key wins and successes
          impactStories: [],   // Detailed impact narratives
          projects: [],        // Projects at this employer
          awards: [],          // Awards received at this employer
          reviews: [],         // Performance reviews/testimonials
          photos: [],          // Photos from this employer
          videos: [],          // Videos from this employer
          skills: []           // Skills learned/used at this employer
        }]);
      };
      
      const updateExperience = (idx, key, value) => {
        const updated = [...experiences];
        updated[idx] = { ...updated[idx], [key]: value };
        setExperiences(updated);
      };
      
      const updateCompanyInfo = (idx, key, value) => {
        const updated = [...experiences];
        updated[idx].companyInfo = { ...updated[idx].companyInfo, [key]: value };
        
        // Auto-update logo URL when domain changes
        if (key === 'domain' && value) {
          const cleanDomain = value.replace(/^(https?:\\/\\/)?(www\\.)?/, '').split('/')[0];
          updated[idx].logoUrl = \`https://logo.clearbit.com/\${cleanDomain}\`;
          // Clear any previous error
          setLogoErrors(prev => ({ ...prev, [idx]: false }));
        }
        
        setExperiences(updated);
      };
      
      const removeExperience = (idx) => {
        if (confirm('Are you sure you want to remove this experience? This action cannot be undone.')) {
          setExperiences(experiences.filter((_, i) => i !== idx));
        }
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
      
      // Responsibility management functions
      const addResponsibility = (expIdx) => {
        const updated = [...experiences];
        if (!updated[expIdx].responsibilities) {
          updated[expIdx].responsibilities = [];
        }
        updated[expIdx].responsibilities.push('');
        setExperiences(updated);
      };
      
      const updateResponsibility = (expIdx, respIdx, value) => {
        const updated = [...experiences];
        updated[expIdx].responsibilities[respIdx] = value;
        setExperiences(updated);
      };
      
      const removeResponsibility = (expIdx, respIdx) => {
        const updated = [...experiences];
        updated[expIdx].responsibilities = updated[expIdx].responsibilities.filter((_, i) => i !== respIdx);
        setExperiences(updated);
      };
      
      const handleLogoUpload = (idx, e) => {
        const file = e.target.files[0];
        if (file) {
          if (confirm('Upload this logo for ' + (experiences[idx].company || 'this company') + '?')) {
            const url = URL.createObjectURL(file);
            const updated = [...experiences];
            updated[idx].customLogo = url;
            setExperiences(updated);
          }
        }
      };
      
      const handleLogoError = (idx) => {
        setLogoErrors(prev => ({ ...prev, [idx]: true }));
      };
      
      const clearCustomLogo = (idx) => {
        if (confirm('Remove custom logo and revert to auto-detected logo?')) {
          const updated = [...experiences];
          updated[idx].customLogo = null;
          setExperiences(updated);
        }
      };
      
      const toggleCompanyInfo = (idx) => {
        setShowCompanyInfo(prev => ({ ...prev, [idx]: !prev[idx] }));
      };
      
      // Get display logo - custom takes priority over auto
      const getDisplayLogo = (exp, idx) => {
        if (exp.customLogo) return exp.customLogo;
        if (exp.logoUrl && !logoErrors[idx]) return exp.logoUrl;
        return null;
      };
      
      return (
        <div>
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="glass exp-entry">
              <div className="exp-head">
                {/* Company Logo Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <input
                    type="file"
                    ref={el => logoInputRefs.current[idx] = el}
                    onChange={(e) => handleLogoUpload(idx, e)}
                    accept="image/*"
                    hidden
                  />
                  <div
                    onClick={() => logoInputRefs.current[idx]?.click()}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '14px',
                      background: getDisplayLogo(exp, idx) ? '#fff' : 'linear-gradient(135deg, var(--purple-main), var(--pink-main))',
                      border: '2px solid rgba(255,255,255,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      flexShrink: 0,
                      position: 'relative'
                    }}
                    title={getDisplayLogo(exp, idx) ? "Click to upload custom logo" : "Auto-detect or upload company logo"}
                  >
                    {getDisplayLogo(exp, idx) ? (
                      <img 
                        src={getDisplayLogo(exp, idx)} 
                        onError={() => handleLogoError(idx)}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} 
                      />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#fff' }}>
                        <i className="fas fa-building" style={{ fontSize: '20px' }}></i>
                      </div>
                    )}
                    {/* Upload overlay */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      borderRadius: '12px'
                    }} className="logo-upload-overlay">
                      <i className="fas fa-camera" style={{ color: '#fff', fontSize: '16px' }}></i>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                      {exp.company || 'New Experience'}
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                      {exp.role || 'Role'} • {exp.startDate || 'Start'} - {exp.endDate || 'End'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {exp.customLogo && (
                    <button 
                      className="btn-icon" 
                      onClick={() => clearCustomLogo(idx)}
                      title="Remove custom logo"
                      style={{ background: 'rgba(61, 122, 184,0.15)', borderColor: 'rgba(61, 122, 184,0.3)' }}
                    >
                      <i className="fas fa-image" style={{ color: 'var(--pink-main)' }}></i>
                    </button>
                  )}
                  <button 
                    className="btn-icon" 
                    onClick={() => toggleCompanyInfo(idx)}
                    title="Company details"
                    style={{ 
                      background: showCompanyInfo[idx] ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.05)',
                      borderColor: showCompanyInfo[idx] ? 'var(--cyan-main)' : 'rgba(255,255,255,0.1)'
                    }}
                  >
                    <i className="fas fa-info-circle" style={{ color: showCompanyInfo[idx] ? 'var(--cyan-main)' : 'rgba(255,255,255,0.5)' }}></i>
                  </button>
                  <button className="btn-icon" onClick={() => removeExperience(idx)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              {/* Company Info Section - Expandable */}
              {showCompanyInfo[idx] && (
                <div style={{ 
                  margin: '20px 0', 
                  padding: '20px', 
                  background: 'rgba(6,182,212,0.08)', 
                  borderRadius: '14px',
                  border: '1px solid rgba(6,182,212,0.2)'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--cyan-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-building"></i>
                    Company Information
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '400', marginLeft: 'auto' }}>
                      Auto-generated • Edit if needed
                    </span>
                  </div>
                  <div className="form-row">
                    <div className="form-field">
                      <label className="form-label">Domain (for logo)</label>
                      <input
                        className="glass-input"
                        value={exp.companyInfo?.domain || ''}
                        onChange={(e) => updateCompanyInfo(idx, 'domain', e.target.value)}
                        placeholder="google.com"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Website</label>
                      <input
                        className="glass-input"
                        value={exp.companyInfo?.website || ''}
                        onChange={(e) => updateCompanyInfo(idx, 'website', e.target.value)}
                        placeholder="https://company.com"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Industry</label>
                      <input
                        className="glass-input"
                        value={exp.companyInfo?.industry || ''}
                        onChange={(e) => updateCompanyInfo(idx, 'industry', e.target.value)}
                        placeholder="Technology, Finance, etc."
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Location</label>
                      <input
                        className="glass-input"
                        value={exp.companyInfo?.location || ''}
                        onChange={(e) => updateCompanyInfo(idx, 'location', e.target.value)}
                        placeholder="San Francisco, CA"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Company Size</label>
                      <input
                        className="glass-input"
                        value={exp.companyInfo?.size || ''}
                        onChange={(e) => updateCompanyInfo(idx, 'size', e.target.value)}
                        placeholder="1000+ employees"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Description</label>
                      <input
                        className="glass-input"
                        value={exp.companyInfo?.description || ''}
                        onChange={(e) => updateCompanyInfo(idx, 'description', e.target.value)}
                        placeholder="Brief company description"
                      />
                    </div>
                  </div>
                  {(logoErrors[idx] && !exp.customLogo) && (
                    <div style={{ 
                      marginTop: '12px', 
                      padding: '10px 14px', 
                      background: 'rgba(239,68,68,0.1)', 
                      border: '1px solid rgba(239,68,68,0.2)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#EF4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <i className="fas fa-exclamation-triangle"></i>
                      Logo not found for this domain. Please upload a custom logo.
                    </div>
                  )}
                </div>
              )}
              
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
                    style={{ minHeight: '120px' }}
                  />
                </div>
              </div>
              
              {/* KEY RESPONSIBILITIES - Editable List */}
              <div className="resp-section">
                <div className="resp-header">
                  <i className="fas fa-tasks"></i>
                  Key Responsibilities
                  <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '400' }}>
                    {(exp.responsibilities || []).length} items
                  </span>
                </div>
                
                {(exp.responsibilities || []).map((resp, respIdx) => (
                  <div key={respIdx} className="resp-item">
                    <div className="resp-bullet">{respIdx + 1}</div>
                    <input
                      className="resp-input"
                      value={resp}
                      onChange={(e) => updateResponsibility(idx, respIdx, e.target.value)}
                      placeholder="Led a team of 5 engineers to deliver..."
                    />
                    <button 
                      className="resp-delete"
                      onClick={() => removeResponsibility(idx, respIdx)}
                      title="Remove this responsibility"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
                
                <button className="add-resp-btn" onClick={() => addResponsibility(idx)}>
                  <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
                  Add Responsibility
                </button>
              </div>
              
              {/* Day in Life */}
              <div className="day-section">
                <div className="day-header">
                  <i className="fas fa-sun"></i>
                  Day in the Life
                </div>
                {(exp.dayInLife || []).map((day, dayIdx) => (
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
                  {(exp.metrics || []).map((metric, metricIdx) => (
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
              
              {/* Rich Content Summary & Link */}
              <div style={{
                marginTop: '20px',
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(30, 58, 95,0.1), rgba(61, 122, 184,0.05))',
                borderRadius: '14px',
                border: '1px solid rgba(30, 58, 95,0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
                      <i className="fas fa-folder-open" style={{ marginRight: '10px', color: '#2d5a87' }}></i>
                      Employer Content Library
                    </h4>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                      Add projects, achievements, challenges, photos, videos, and reviews specific to this employer
                    </p>
                  </div>
                </div>
                
                {/* Content Summary */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ 
                    padding: '6px 14px', 
                    background: (exp.projects?.length > 0) ? 'rgba(30, 58, 95,0.2)' : 'rgba(255,255,255,0.05)', 
                    borderRadius: '8px', 
                    fontSize: '12px', 
                    color: (exp.projects?.length > 0) ? '#2d5a87' : 'rgba(255,255,255,0.4)',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-folder" style={{ marginRight: '6px' }}></i>
                    {exp.projects?.length || 0} Projects
                  </span>
                  <span style={{ 
                    padding: '6px 14px', 
                    background: (exp.victories?.length > 0) ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)', 
                    borderRadius: '8px', 
                    fontSize: '12px', 
                    color: (exp.victories?.length > 0) ? '#F59E0B' : 'rgba(255,255,255,0.4)',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-trophy" style={{ marginRight: '6px' }}></i>
                    {exp.victories?.length || 0} Victories
                  </span>
                  <span style={{ 
                    padding: '6px 14px', 
                    background: (exp.challenges?.length > 0) ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)', 
                    borderRadius: '8px', 
                    fontSize: '12px', 
                    color: (exp.challenges?.length > 0) ? '#EF4444' : 'rgba(255,255,255,0.4)',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-mountain" style={{ marginRight: '6px' }}></i>
                    {exp.challenges?.length || 0} Challenges
                  </span>
                  <span style={{ 
                    padding: '6px 14px', 
                    background: (exp.photos?.length > 0) ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.05)', 
                    borderRadius: '8px', 
                    fontSize: '12px', 
                    color: (exp.photos?.length > 0) ? '#06B6D4' : 'rgba(255,255,255,0.4)',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-images" style={{ marginRight: '6px' }}></i>
                    {exp.photos?.length || 0} Photos
                  </span>
                  <span style={{ 
                    padding: '6px 14px', 
                    background: (exp.videos?.length > 0) ? 'rgba(61, 122, 184,0.2)' : 'rgba(255,255,255,0.05)', 
                    borderRadius: '8px', 
                    fontSize: '12px', 
                    color: (exp.videos?.length > 0) ? '#3d7ab8' : 'rgba(255,255,255,0.4)',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-video" style={{ marginRight: '6px' }}></i>
                    {exp.videos?.length || 0} Videos
                  </span>
                  <span style={{ 
                    padding: '6px 14px', 
                    background: (exp.reviews?.length > 0) ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)', 
                    borderRadius: '8px', 
                    fontSize: '12px', 
                    color: (exp.reviews?.length > 0) ? '#10B981' : 'rgba(255,255,255,0.4)',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-star" style={{ marginRight: '6px' }}></i>
                    {exp.reviews?.length || 0} Reviews
                  </span>
                </div>
                
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                  <i className="fas fa-lightbulb" style={{ marginRight: '6px' }}></i>
                  Tip: Go to Live Preview and click on this experience to add rich content
                </p>
              </div>
            </div>
          ))}
          
          <button className="btn-ghost" onClick={addExperience}>
            <i className="fas fa-plus"></i> Add Experience
          </button>
          
          <style>{\`
            .exp-entry:hover .logo-upload-overlay {
              opacity: 1 !important;
            }
          \`}</style>
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
    
    // Template Selector Component - Enhanced with Industry Categories
    const TemplateSelector = ({ selectedTemplate, setTemplate }) => {
      const [activeCategory, setActiveCategory] = useState('all');
      
      const filteredTemplates = activeCategory === 'all' 
        ? TEMPLATES 
        : TEMPLATES.filter(t => t.category === activeCategory);
      
      return (
        <div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '20px' }}>
            Choose a template designed for your industry. Your data is preserved when switching.
          </p>
          
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveCategory('all')}
              style={{
                padding: '10px 18px',
                borderRadius: '100px',
                border: activeCategory === 'all' ? '2px solid var(--purple-main)' : '2px solid rgba(255,255,255,0.1)',
                background: activeCategory === 'all' ? 'rgba(30, 58, 95,0.2)' : 'rgba(255,255,255,0.03)',
                color: activeCategory === 'all' ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <i className="fas fa-th" style={{ marginRight: '8px' }}></i>
              All Templates
            </button>
            {TEMPLATE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '100px',
                  border: activeCategory === cat.id ? '2px solid var(--purple-main)' : '2px solid rgba(255,255,255,0.1)',
                  background: activeCategory === cat.id ? 'rgba(30, 58, 95,0.2)' : 'rgba(255,255,255,0.03)',
                  color: activeCategory === cat.id ? '#fff' : 'rgba(255,255,255,0.5)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <i className={'fas ' + cat.icon} style={{ marginRight: '8px' }}></i>
                {cat.name}
              </button>
            ))}
          </div>
          
          {/* Templates Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                onClick={() => setTemplate(template.id)}
                style={{
                  padding: '24px',
                  borderRadius: '20px',
                  background: selectedTemplate === template.id 
                    ? 'linear-gradient(135deg, rgba(30, 58, 95,0.15), rgba(61, 122, 184,0.08))'
                    : 'rgba(255,255,255,0.03)',
                  border: selectedTemplate === template.id 
                    ? '2px solid ' + template.color
                    : '2px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Gradient header bar */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: template.gradient
                }} />
                
                {/* Template Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: template.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    color: '#fff',
                    boxShadow: '0 8px 24px ' + template.color + '40'
                  }}>
                    <i className={'fas ' + template.icon}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                      {template.name}
                    </h3>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.4' }}>
                      {template.desc}
                    </p>
                  </div>
                </div>
                
                {/* Industry Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                  {template.industries.map((ind, i) => (
                    <span key={i} style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.06)',
                      fontSize: '10px',
                      fontWeight: '500',
                      color: 'rgba(255,255,255,0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px'
                    }}>
                      {ind}
                    </span>
                  ))}
                </div>
                
                {/* Mini Preview */}
                <div style={{
                  padding: '14px',
                  background: 'rgba(0,0,0,0.25)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: template.gradient
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ width: '60%', height: '7px', background: 'rgba(255,255,255,0.25)', borderRadius: '4px', marginBottom: '4px' }} />
                      <div style={{ width: '40%', height: '5px', background: template.color + '50', borderRadius: '3px' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                    {[1,2,3].map(i => (
                      <div key={i} style={{ 
                        flex: 1, 
                        height: '20px', 
                        background: i === 1 ? template.color + '30' : 'rgba(255,255,255,0.08)', 
                        borderRadius: '4px' 
                      }} />
                    ))}
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', marginBottom: '6px' }} />
                  <div style={{ width: '70%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }} />
                </div>
                
                {/* Selected checkmark */}
                {selectedTemplate === template.id && (
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: template.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '11px',
                    boxShadow: '0 4px 12px ' + template.color + '50'
                  }}>
                    <i className="fas fa-check"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Template count */}
          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
            Showing {filteredTemplates.length} of {TEMPLATES.length} templates
          </p>
        </div>
      );
    };
    
    // Known company domain mappings for automatic logo lookup (for EmployerDetailPage)
    const KNOWN_COMPANY_DOMAINS_EMPLOYER = {
      'in the house productions': 'inthehouseproductions.com',
      'in the house production': 'inthehouseproductions.com',
      'in house productions': 'inthehouseproductions.com',
      'inthehouseproductions': 'inthehouseproductions.com',
      'in-the-house productions': 'inthehouseproductions.com',
      'the house productions': 'inthehouseproductions.com',
      'house productions': 'inthehouseproductions.com',
      'google': 'google.com',
      'stripe': 'stripe.com',
      'salesforce': 'salesforce.com',
      'amazon': 'amazon.com',
      'microsoft': 'microsoft.com',
      'apple': 'apple.com',
      'meta': 'meta.com',
      'facebook': 'facebook.com',
      'netflix': 'netflix.com',
      'walmart': 'walmart.com',
      'target': 'target.com',
      'starbucks': 'starbucks.com',
      'mcdonalds': 'mcdonalds.com',
      "mcdonald's": 'mcdonalds.com',
      'publix': 'publix.com',
      'cvs': 'cvs.com',
      'walgreens': 'walgreens.com',
      'bank of america': 'bankofamerica.com',
      'wells fargo': 'wellsfargo.com',
      'chase': 'chase.com',
      'jpmorgan': 'jpmorgan.com',
      'citibank': 'citibank.com',
    };
    
    // Local static logo mappings - for companies without good external logos
    const LOCAL_LOGOS_EMPLOYER = {
      'in the house productions': '/static/inthehouse-logo.png',
      'in the house production': '/static/inthehouse-logo.png',
      'in house productions': '/static/inthehouse-logo.png',
      'inthehouseproductions': '/static/inthehouse-logo.png',
      'in-the-house productions': '/static/inthehouse-logo.png',
      'the house productions': '/static/inthehouse-logo.png',
      'house productions': '/static/inthehouse-logo.png',
      'chapters health system': '/static/chapters-health-logo.png',
      'chapters health': '/static/chapters-health-logo.png',
      'chapters': '/static/chapters-health-logo.png',
    };
    
    const getLocalLogoForEmployer = (companyName) => {
      if (!companyName) return null;
      const lowerName = companyName.toLowerCase().trim();
      if (LOCAL_LOGOS_EMPLOYER[lowerName]) return LOCAL_LOGOS_EMPLOYER[lowerName];
      for (const [key, path] of Object.entries(LOCAL_LOGOS_EMPLOYER)) {
        if (lowerName.includes(key) || key.includes(lowerName)) return path;
      }
      return null;
    };
    
    // Helper to get domain from company name
    const getCompanyDomainForEmployer = (companyName, existingDomain) => {
      if (existingDomain) return existingDomain;
      if (!companyName) return null;
      const lowerName = companyName.toLowerCase().trim();
      // Check exact match first
      if (KNOWN_COMPANY_DOMAINS_EMPLOYER[lowerName]) return KNOWN_COMPANY_DOMAINS_EMPLOYER[lowerName];
      // Check partial matches
      for (const [key, domain] of Object.entries(KNOWN_COMPANY_DOMAINS_EMPLOYER)) {
        if (lowerName.includes(key) || key.includes(lowerName)) {
          return domain;
        }
      }
      return null;
    };
    
    // EMPLOYER DETAIL PAGE - Full immersive view for each employer experience
    const EmployerDetailPage = ({ experience, onClose, template, isEditing, onUpdate }) => {
      const [activeSection, setActiveSection] = useState('overview');
      const [expandedPhoto, setExpandedPhoto] = useState(null);
      const [expandedVideo, setExpandedVideo] = useState(null);
      const photoInputRef = useRef(null);
      const videoInputRef = useRef(null);
      
      const styles = {
        accent: template?.color || '#1e3a5f',
        gradient: template?.gradient || 'linear-gradient(135deg, #1e3a5f, #0d1f33)',
      };
      
      const exp = experience || {};
      // Use customLogo first, then logoUrl, then local static logo, then try logo.dev API with domain
      const expLocalLogo = getLocalLogoForEmployer(exp.company);
      const expDomain = getCompanyDomainForEmployer(exp.company, exp.companyInfo?.domain);
      const displayLogo = exp.customLogo || exp.logoUrl || expLocalLogo || (expDomain ? \`https://img.logo.dev/\${expDomain}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ\` : null);
      
      // Calculate tenure
      const calculateTenure = () => {
        if (!exp.startDate) return '';
        const start = new Date(exp.startDate);
        const end = exp.endDate && exp.endDate !== 'Present' ? new Date(exp.endDate) : new Date();
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        if (years > 0 && remainingMonths > 0) return \`\${years} yr\${years > 1 ? 's' : ''} \${remainingMonths} mo\`;
        if (years > 0) return \`\${years} year\${years > 1 ? 's' : ''}\`;
        return \`\${remainingMonths} month\${remainingMonths > 1 ? 's' : ''}\`;
      };
      
      const sections = [
        { id: 'overview', icon: 'fa-eye', label: 'Overview' },
        { id: 'responsibilities', icon: 'fa-tasks', label: 'Responsibilities' },
        { id: 'projects', icon: 'fa-folder', label: 'Projects' },
        { id: 'achievements', icon: 'fa-trophy', label: 'Achievements' },
        { id: 'challenges', icon: 'fa-mountain', label: 'Challenges' },
        { id: 'media', icon: 'fa-photo-video', label: 'Media' },
        { id: 'reviews', icon: 'fa-star', label: 'Reviews' },
        { id: 'dayinlife', icon: 'fa-sun', label: 'Day in Life' },
      ];
      
      // Handle photo upload for this employer
      const handlePhotoUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        const newPhotos = await Promise.all(files.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                const maxSize = 1600;
                let { width, height } = img;
                if (width > maxSize || height > maxSize) {
                  if (width > height) { height = (height / width) * maxSize; width = maxSize; }
                  else { width = (width / height) * maxSize; height = maxSize; }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);
                resolve({ id: Date.now() + Math.random(), url: canvas.toDataURL('image/png', 0.95), name: file.name });
              };
              img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
          });
        }));
        const updatedPhotos = [...(exp.photos || []), ...newPhotos];
        onUpdate('photos', updatedPhotos);
      };
      
      // Handle video upload for this employer
      const handleVideoUpload = (e) => {
        const files = Array.from(e.target.files || []);
        const newVideos = files.map(file => ({
          id: Date.now() + Math.random(),
          url: URL.createObjectURL(file),
          name: file.name,
          type: file.type
        }));
        const updatedVideos = [...(exp.videos || []), ...newVideos];
        onUpdate('videos', updatedVideos);
      };
      
      // Add item helpers
      const addProject = () => {
        const projects = [...(exp.projects || []), { id: Date.now(), name: '', description: '', url: '', techStack: [], outcome: '' }];
        onUpdate('projects', projects);
      };
      
      const addChallenge = () => {
        const challenges = [...(exp.challenges || []), { id: Date.now(), title: '', situation: '', approach: '', outcome: '' }];
        onUpdate('challenges', challenges);
      };
      
      const addVictory = () => {
        const victories = [...(exp.victories || []), { id: Date.now(), title: '', description: '', impact: '' }];
        onUpdate('victories', victories);
      };
      
      const addReview = () => {
        const reviews = [...(exp.reviews || []), { id: Date.now(), quote: '', author: '', role: '', date: '' }];
        onUpdate('reviews', reviews);
      };
      
      return (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.95)',
          zIndex: 20000,
          overflow: 'auto'
        }}>
          {/* Photo Modal */}
          {expandedPhoto && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 30000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setExpandedPhoto(null)}>
              <img src={expandedPhoto} style={{ maxWidth: '95%', maxHeight: '95%', borderRadius: '12px' }} />
              <button onClick={() => setExpandedPhoto(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
          
          {/* Video Modal */}
          {expandedVideo && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 30000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setExpandedVideo(null)}>
              <video src={expandedVideo} controls autoPlay style={{ maxWidth: '95%', maxHeight: '95%', borderRadius: '12px' }} onClick={e => e.stopPropagation()} />
              <button onClick={() => setExpandedVideo(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
          
          {/* Header */}
          <div style={{
            position: 'sticky',
            top: 0,
            background: 'linear-gradient(135deg, #0a0a12 0%, #1a1a2e 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            padding: '20px 40px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            zIndex: 100
          }}>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '12px 20px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}>
              <i className="fas fa-arrow-left"></i>
              Back to Timeline
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
              {displayLogo ? (
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '14px',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={displayLogo} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} 
                    onError={(e) => {
                      const ddgUrl = expDomain ? \`https://icons.duckduckgo.com/ip3/\${expDomain}.ico\` : null;
                      if (ddgUrl && e.target.src !== ddgUrl) {
                        e.target.src = ddgUrl;
                      } else {
                        e.target.style.display = 'none';
                      }
                    }} 
                  />
                </div>
              ) : (
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '14px',
                  background: \`linear-gradient(135deg, \${styles.accent}, #0d1f33)\`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: '700'
                }}>
                  {(exp.company || 'C').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#fff', marginBottom: '4px', fontFamily: 'Space Grotesk, sans-serif' }}>
                  {exp.company || 'Company Name'}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <span style={{ color: styles.accent, fontSize: '16px', fontWeight: '600' }}>{exp.role || 'Your Role'}</span>
                  <span style={{ padding: '4px 12px', background: styles.accent + '20', borderRadius: '100px', fontSize: '12px', color: styles.accent }}>
                    {exp.startDate || 'Start'} — {exp.endDate || 'Present'}
                  </span>
                  {calculateTenure() && (
                    <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                      <i className="fas fa-clock" style={{ marginRight: '6px' }}></i>{calculateTenure()}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div style={{ display: 'flex', gap: '20px' }}>
              {exp.metrics?.filter(m => m.value).slice(0, 3).map((m, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: styles.accent }}>{m.value}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div style={{
            position: 'sticky',
            top: '100px',
            background: 'rgba(10,10,18,0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            padding: '0 40px',
            zIndex: 99,
            display: 'flex',
            gap: '8px',
            overflowX: 'auto'
          }}>
            {sections.map(sec => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                style={{
                  padding: '16px 24px',
                  background: activeSection === sec.id ? styles.accent + '15' : 'transparent',
                  border: 'none',
                  borderBottom: activeSection === sec.id ? \`3px solid \${styles.accent}\` : '3px solid transparent',
                  color: activeSection === sec.id ? styles.accent : 'rgba(255,255,255,0.5)',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap'
                }}
              >
                <i className={\`fas \${sec.icon}\`}></i>
                {sec.label}
              </button>
            ))}
          </div>
          
          {/* Content */}
          <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* OVERVIEW SECTION */}
            {activeSection === 'overview' && (
              <div>
                {/* Company Info Card */}
                {exp.companyInfo && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                    {exp.companyInfo.industry && (
                      <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <i className="fas fa-industry" style={{ color: styles.accent, marginBottom: '8px', display: 'block' }}></i>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Industry</div>
                        <div style={{ fontSize: '15px', color: '#fff', fontWeight: '600' }}>{exp.companyInfo.industry}</div>
                      </div>
                    )}
                    {exp.companyInfo.location && (
                      <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <i className="fas fa-map-marker-alt" style={{ color: styles.accent, marginBottom: '8px', display: 'block' }}></i>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Location</div>
                        <div style={{ fontSize: '15px', color: '#fff', fontWeight: '600' }}>{exp.companyInfo.location}</div>
                      </div>
                    )}
                    {exp.companyInfo.size && (
                      <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <i className="fas fa-users" style={{ color: styles.accent, marginBottom: '8px', display: 'block' }}></i>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Company Size</div>
                        <div style={{ fontSize: '15px', color: '#fff', fontWeight: '600' }}>{exp.companyInfo.size}</div>
                      </div>
                    )}
                    {exp.companyInfo.website && (
                      <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <i className="fas fa-globe" style={{ color: styles.accent, marginBottom: '8px', display: 'block' }}></i>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Website</div>
                        <a href={exp.companyInfo.website} target="_blank" style={{ fontSize: '15px', color: styles.accent, fontWeight: '600', textDecoration: 'none' }}>{exp.companyInfo.domain || 'Visit Site'}</a>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Description */}
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '32px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
                    <i className="fas fa-user-tie" style={{ marginRight: '12px', color: styles.accent }}></i>
                    Role Overview
                  </h3>
                  <p style={{ fontSize: '16px', lineHeight: '1.9', color: 'rgba(255,255,255,0.75)' }}>
                    {exp.description || 'Add a description of your role, responsibilities, and impact at this company.'}
                  </p>
                </div>
                
                {/* Impact Metrics */}
                {exp.metrics?.some(m => m.value) && (
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '20px' }}>
                      <i className="fas fa-chart-line" style={{ marginRight: '12px', color: styles.accent }}></i>
                      Key Impact Metrics
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                      {exp.metrics.filter(m => m.value).map((metric, idx) => (
                        <div key={idx} style={{
                          background: \`linear-gradient(135deg, \${styles.accent}15, \${styles.accent}05)\`,
                          borderRadius: '16px',
                          padding: '24px',
                          border: \`1px solid \${styles.accent}25\`,
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '32px', fontWeight: '800', color: styles.accent, marginBottom: '8px' }}>{metric.value}</div>
                          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Skills Used */}
                {exp.skills?.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
                      <i className="fas fa-tools" style={{ marginRight: '12px', color: styles.accent }}></i>
                      Skills Applied
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {exp.skills.map((skill, idx) => (
                        <span key={idx} style={{
                          padding: '10px 18px',
                          background: styles.accent + '15',
                          border: \`1px solid \${styles.accent}30\`,
                          borderRadius: '100px',
                          fontSize: '13px',
                          fontWeight: '500',
                          color: styles.accent
                        }}>{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* RESPONSIBILITIES SECTION */}
            {activeSection === 'responsibilities' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#fff' }}>
                    <i className="fas fa-tasks" style={{ marginRight: '12px', color: styles.accent }}></i>
                    Key Responsibilities
                  </h3>
                  {isEditing && (
                    <button onClick={() => {
                      const resp = [...(exp.responsibilities || []), ''];
                      onUpdate('responsibilities', resp);
                    }} style={{
                      padding: '10px 20px',
                      background: styles.gradient,
                      border: 'none',
                      borderRadius: '10px',
                      color: '#fff',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>Add Responsibility
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'grid', gap: '12px' }}>
                  {(exp.responsibilities || []).map((resp, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      padding: '20px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '14px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: styles.accent + '20',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: styles.accent,
                        fontWeight: '700',
                        fontSize: '14px',
                        flexShrink: 0
                      }}>{idx + 1}</div>
                      <p style={{ flex: 1, fontSize: '15px', lineHeight: '1.7', color: 'rgba(255,255,255,0.75)', margin: 0 }}>{resp}</p>
                    </div>
                  ))}
                  {(!exp.responsibilities || exp.responsibilities.length === 0) && (
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', padding: '40px', textAlign: 'center' }}>
                      No responsibilities added yet. {isEditing ? 'Click "Add Responsibility" to start.' : ''}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* PROJECTS SECTION */}
            {activeSection === 'projects' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#fff' }}>
                    <i className="fas fa-folder" style={{ marginRight: '12px', color: styles.accent }}></i>
                    Projects at {exp.company || 'This Company'}
                  </h3>
                  {isEditing && (
                    <button onClick={addProject} style={{
                      padding: '10px 20px',
                      background: styles.gradient,
                      border: 'none',
                      borderRadius: '10px',
                      color: '#fff',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>Add Project
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                  {(exp.projects || []).map((project, idx) => (
                    <div key={project.id || idx} style={{
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '18px',
                      padding: '28px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>
                        <i className="fas fa-project-diagram" style={{ marginRight: '10px', color: styles.accent }}></i>
                        {project.name || 'Project Name'}
                      </h4>
                      <p style={{ fontSize: '15px', lineHeight: '1.8', color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>
                        {project.description || 'Project description...'}
                      </p>
                      {project.techStack?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                          {project.techStack.map((tech, tidx) => (
                            <span key={tidx} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{tech}</span>
                          ))}
                        </div>
                      )}
                      {project.outcome && (
                        <div style={{ padding: '16px', background: styles.accent + '10', borderRadius: '12px', borderLeft: \`4px solid \${styles.accent}\` }}>
                          <div style={{ fontSize: '12px', color: styles.accent, fontWeight: '600', marginBottom: '4px' }}>OUTCOME</div>
                          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>{project.outcome}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {(!exp.projects || exp.projects.length === 0) && (
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', padding: '40px', textAlign: 'center' }}>
                      No projects added yet.
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* ACHIEVEMENTS/VICTORIES SECTION */}
            {activeSection === 'achievements' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#fff' }}>
                    <i className="fas fa-trophy" style={{ marginRight: '12px', color: '#F59E0B' }}></i>
                    Achievements & Victories
                  </h3>
                  {isEditing && (
                    <button onClick={addVictory} style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#fff',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>Add Victory
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                  {(exp.victories || []).map((victory, idx) => (
                    <div key={victory.id || idx} style={{
                      background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.02))',
                      borderRadius: '18px',
                      padding: '28px',
                      border: '1px solid rgba(245,158,11,0.2)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <i className="fas fa-trophy" style={{ position: 'absolute', right: '20px', top: '20px', fontSize: '48px', color: 'rgba(245,158,11,0.1)' }}></i>
                      <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>{victory.title || 'Victory Title'}</h4>
                      <p style={{ fontSize: '15px', lineHeight: '1.8', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>{victory.description}</p>
                      {victory.impact && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(245,158,11,0.2)', borderRadius: '8px' }}>
                          <i className="fas fa-bolt" style={{ color: '#F59E0B' }}></i>
                          <span style={{ fontSize: '14px', color: '#F59E0B', fontWeight: '600' }}>{victory.impact}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Awards at this company */}
                  {(exp.awards || []).map((award, idx) => (
                    <div key={award.id || idx} style={{
                      background: 'linear-gradient(135deg, rgba(30, 58, 95,0.1), rgba(30, 58, 95,0.02))',
                      borderRadius: '18px',
                      padding: '28px',
                      border: '1px solid rgba(30, 58, 95,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px'
                    }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, #1e3a5f, #0d1f33)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-award" style={{ fontSize: '28px', color: '#fff' }}></i>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '17px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{award.title || 'Award Name'}</h4>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>{award.organization} • {award.year}</p>
                      </div>
                    </div>
                  ))}
                  
                  {(!exp.victories || exp.victories.length === 0) && (!exp.awards || exp.awards.length === 0) && (
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', padding: '40px', textAlign: 'center' }}>
                      No achievements or victories added yet.
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* CHALLENGES SECTION */}
            {activeSection === 'challenges' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#fff' }}>
                    <i className="fas fa-mountain" style={{ marginRight: '12px', color: '#EF4444' }}></i>
                    Challenges Overcome
                  </h3>
                  {isEditing && (
                    <button onClick={addChallenge} style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#fff',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>Add Challenge
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'grid', gap: '24px' }}>
                  {(exp.challenges || []).map((challenge, idx) => (
                    <div key={challenge.id || idx} style={{
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                          <i className="fas fa-flag" style={{ marginRight: '10px', color: '#EF4444' }}></i>
                          {challenge.title || 'Challenge Title'}
                        </h4>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        <div style={{ padding: '20px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ fontSize: '11px', color: '#EF4444', fontWeight: '700', marginBottom: '10px', letterSpacing: '1px' }}>SITUATION</div>
                          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7' }}>{challenge.situation || 'What was the situation?'}</p>
                        </div>
                        <div style={{ padding: '20px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ fontSize: '11px', color: '#F59E0B', fontWeight: '700', marginBottom: '10px', letterSpacing: '1px' }}>APPROACH</div>
                          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7' }}>{challenge.approach || 'How did you tackle it?'}</p>
                        </div>
                        <div style={{ padding: '20px' }}>
                          <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '700', marginBottom: '10px', letterSpacing: '1px' }}>OUTCOME</div>
                          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7' }}>{challenge.outcome || 'What was the result?'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!exp.challenges || exp.challenges.length === 0) && (
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', padding: '40px', textAlign: 'center' }}>
                      No challenges documented yet. Add challenges you overcame to showcase problem-solving skills.
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* MEDIA SECTION */}
            {activeSection === 'media' && (
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '24px' }}>
                  <i className="fas fa-photo-video" style={{ marginRight: '12px', color: styles.accent }}></i>
                  Media Gallery from {exp.company || 'This Company'}
                </h3>
                
                {/* Photos */}
                <div style={{ marginBottom: '40px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>
                      <i className="fas fa-images" style={{ marginRight: '10px' }}></i>
                      Photos ({(exp.photos || []).length})
                    </h4>
                    {isEditing && (
                      <>
                        <input type="file" ref={photoInputRef} onChange={handlePhotoUpload} multiple accept="image/*" hidden />
                        <button onClick={() => photoInputRef.current?.click()} style={{
                          padding: '8px 16px',
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                          <i className="fas fa-plus" style={{ marginRight: '6px' }}></i>Add Photos
                        </button>
                      </>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                    {(exp.photos || []).map((photo, idx) => (
                      <div key={photo.id || idx} onClick={() => setExpandedPhoto(photo.url)} style={{
                        aspectRatio: '4/3',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        position: 'relative'
                      }}>
                        <img src={photo.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)', opacity: 0, transition: 'opacity 0.2s' }} className="photo-overlay">
                          <i className="fas fa-expand" style={{ position: 'absolute', bottom: '12px', right: '12px', color: '#fff' }}></i>
                        </div>
                      </div>
                    ))}
                    {(exp.photos || []).length === 0 && (
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
                        No photos added yet.
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Videos */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>
                      <i className="fas fa-video" style={{ marginRight: '10px' }}></i>
                      Videos ({(exp.videos || []).length})
                    </h4>
                    {isEditing && (
                      <>
                        <input type="file" ref={videoInputRef} onChange={handleVideoUpload} multiple accept="video/*" hidden />
                        <button onClick={() => videoInputRef.current?.click()} style={{
                          padding: '8px 16px',
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                          <i className="fas fa-plus" style={{ marginRight: '6px' }}></i>Add Videos
                        </button>
                      </>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {(exp.videos || []).map((video, idx) => (
                      <div key={video.id || idx} style={{
                        aspectRatio: '16/9',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        background: 'rgba(0,0,0,0.3)',
                        position: 'relative',
                        cursor: 'pointer'
                      }} onClick={() => setExpandedVideo(video.url)}>
                        <video src={video.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(0,0,0,0.4)'
                        }}>
                          <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: styles.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <i className="fas fa-play" style={{ color: '#fff', fontSize: '20px', marginLeft: '4px' }}></i>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(exp.videos || []).length === 0 && (
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
                        No videos added yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* REVIEWS SECTION */}
            {activeSection === 'reviews' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#fff' }}>
                    <i className="fas fa-star" style={{ marginRight: '12px', color: '#F59E0B' }}></i>
                    Reviews & Testimonials
                  </h3>
                  {isEditing && (
                    <button onClick={addReview} style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#fff',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>Add Review
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                  {(exp.reviews || []).map((review, idx) => (
                    <div key={review.id || idx} style={{
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '20px',
                      padding: '28px',
                      border: '1px solid rgba(255,255,255,0.06)',
                      position: 'relative'
                    }}>
                      <i className="fas fa-quote-left" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '24px', color: 'rgba(245,158,11,0.2)' }}></i>
                      <p style={{ fontSize: '17px', lineHeight: '1.9', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', marginBottom: '20px', paddingLeft: '40px' }}>
                        "{review.quote || 'Add a quote from your reviewer...'}"
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '40px' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: styles.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: '16px'
                        }}>
                          {(review.author || 'A')[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>{review.author || 'Reviewer Name'}</div>
                          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{review.role || 'Role'}{review.date ? \` • \${review.date}\` : ''}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!exp.reviews || exp.reviews.length === 0) && (
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', padding: '40px', textAlign: 'center' }}>
                      No reviews or testimonials added yet. Add feedback from managers, colleagues, or clients.
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* DAY IN LIFE SECTION */}
            {activeSection === 'dayinlife' && (
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '24px' }}>
                  <i className="fas fa-sun" style={{ marginRight: '12px', color: styles.accent }}></i>
                  A Day in This Role
                </h3>
                
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}>
                  <div style={{ position: 'relative' }}>
                    {/* Timeline line */}
                    <div style={{
                      position: 'absolute',
                      left: '50px',
                      top: '20px',
                      bottom: '20px',
                      width: '2px',
                      background: \`linear-gradient(to bottom, \${styles.accent}, \${styles.accent}30)\`
                    }}></div>
                    
                    {(exp.dayInLife || []).filter(d => d.activity).map((day, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '24px',
                        marginBottom: idx < (exp.dayInLife || []).length - 1 ? '28px' : 0,
                        position: 'relative'
                      }}>
                        <div style={{
                          width: '100px',
                          textAlign: 'right',
                          fontSize: '15px',
                          fontWeight: '700',
                          color: styles.accent,
                          paddingTop: '4px'
                        }}>{day.time}</div>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: styles.accent,
                          border: '4px solid #0a0a12',
                          flexShrink: 0,
                          marginTop: '6px'
                        }}></div>
                        <div style={{
                          flex: 1,
                          padding: '16px 20px',
                          background: styles.accent + '10',
                          borderRadius: '12px',
                          borderLeft: \`3px solid \${styles.accent}\`
                        }}>
                          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>{day.activity}</p>
                        </div>
                      </div>
                    ))}
                    
                    {(!exp.dayInLife || !exp.dayInLife.some(d => d.activity)) && (
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', padding: '40px', textAlign: 'center' }}>
                        No daily activities documented yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    };
    
    // Media Editor - ENHANCED with proper video playback and image quality
    const MediaEditor = ({ photos, videos, setPhotos, setVideos }) => {
      const photoInputRef = useRef(null);
      const videoInputRef = useRef(null);
      const [expandedVideo, setExpandedVideo] = useState(null);
      const [expandedPhoto, setExpandedPhoto] = useState(null);
      
      const handlePhotoUpload = async (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = await Promise.all(files.map(async (file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxSize = 1200;
                let width = img.width;
                let height = img.height;
                
                if (width > height && width > maxSize) {
                  height = (height * maxSize) / width;
                  width = maxSize;
                } else if (height > maxSize) {
                  width = (width * maxSize) / height;
                  height = maxSize;
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);
                
                resolve({
                  id: Date.now() + Math.random(),
                  url: canvas.toDataURL('image/jpeg', 0.9),
                  name: file.name
                });
              };
              img.onerror = () => {
                resolve({
                  id: Date.now() + Math.random(),
                  url: URL.createObjectURL(file),
                  name: file.name
                });
              };
              img.src = event.target.result;
            };
            reader.readAsDataURL(file);
          });
        }));
        setPhotos([...photos, ...newPhotos]);
      };
      
      const handleVideoUpload = (e) => {
        const files = Array.from(e.target.files);
        const newVideos = files.map(f => ({
          id: Date.now() + Math.random(),
          url: URL.createObjectURL(f),
          name: f.name,
          type: f.type
        }));
        setVideos([...videos, ...newVideos]);
      };
      
      return (
        <div>
          {/* Expanded Photo Modal */}
          {expandedPhoto && (
            <div 
              onClick={() => setExpandedPhoto(null)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.9)',
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                cursor: 'zoom-out'
              }}
            >
              <img 
                src={expandedPhoto.url} 
                style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} 
                alt="Expanded"
              />
              <button
                onClick={() => setExpandedPhoto(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
          
          {/* Expanded Video Modal */}
          {expandedVideo && (
            <div 
              onClick={(e) => e.target === e.currentTarget && setExpandedVideo(null)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.95)',
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px'
              }}
            >
              <video 
                src={expandedVideo.url} 
                controls 
                autoPlay
                playsInline
                style={{ 
                  maxWidth: '90vw', 
                  maxHeight: '85vh', 
                  borderRadius: '12px', 
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  objectFit: 'contain',
                  background: '#000'
                }}
              />
              <button
                onClick={() => setExpandedVideo(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
        
          <h3 style={{ fontSize: '14px', color: 'var(--cyan-main)', marginBottom: '18px', fontWeight: '600' }}>
            <i className="fas fa-camera" style={{ marginRight: '10px' }}></i>
            Photos
            <span style={{ marginLeft: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '400' }}>
              ({photos.length} uploaded)
            </span>
          </h3>
          
          <input
            type="file"
            ref={photoInputRef}
            onChange={handlePhotoUpload}
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            hidden
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '14px', marginBottom: '36px' }}>
            {photos.map(photo => (
              <div 
                key={photo.id} 
                style={{
                  aspectRatio: '1',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '2px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => setExpandedPhoto(photo)}
              >
                <img 
                  src={photo.url} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'high-quality' }} 
                  alt={photo.name || 'Photo'}
                />
                {/* Hover overlay with zoom icon */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.7))',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  padding: '10px',
                  opacity: 0,
                  transition: 'opacity 0.2s'
                }} className="media-hover">
                  <i className="fas fa-search-plus" style={{ color: '#fff', fontSize: '18px' }}></i>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setPhotos(photos.filter(p => p.id !== photo.id)); }}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(239,68,68,0.9)',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '12px',
                    opacity: 0,
                    transition: 'opacity 0.2s'
                  }}
                  className="delete-btn"
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
                border: '2px dashed rgba(6,182,212,0.4)',
                background: 'rgba(6,182,212,0.05)',
                cursor: 'pointer',
                color: 'var(--cyan-main)',
                fontSize: '18px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <i className="fas fa-plus"></i>
              <span style={{ fontSize: '11px', fontWeight: '600' }}>Add Photo</span>
            </button>
          </div>
          
          <h3 style={{ fontSize: '14px', color: 'var(--pink-main)', marginBottom: '18px', fontWeight: '600' }}>
            <i className="fas fa-video" style={{ marginRight: '10px' }}></i>
            Videos
            <span style={{ marginLeft: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '400' }}>
              ({videos.length} uploaded)
            </span>
          </h3>
          
          <input
            type="file"
            ref={videoInputRef}
            onChange={handleVideoUpload}
            accept="video/mp4,video/webm,video/mov,video/quicktime"
            multiple
            hidden
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {videos.map(video => (
              <div 
                key={video.id} 
                style={{
                  borderRadius: '14px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '2px solid rgba(255,255,255,0.1)',
                  background: '#0a0a12'
                }}
              >
                {/* Video with controls - Fixed playback */}
                <video 
                  src={video.url} 
                  controls
                  preload="auto"
                  playsInline
                  style={{ 
                    width: '100%', 
                    minHeight: '180px',
                    maxHeight: '300px',
                    objectFit: 'contain',
                    background: '#000',
                    display: 'block'
                  }}
                  onClick={(e) => e.target.paused ? e.target.play() : e.target.pause()}
                />
                
                {/* Video info bar */}
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-film"></i>
                    {video.name || 'Video'}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setExpandedVideo(video)}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        background: 'rgba(61, 122, 184,0.2)',
                        border: 'none',
                        color: 'var(--pink-main)',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      title="Full screen"
                    >
                      <i className="fas fa-expand"></i>
                    </button>
                    <button
                      onClick={() => setVideos(videos.filter(v => v.id !== video.id))}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        background: 'rgba(239,68,68,0.2)',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => videoInputRef.current?.click()}
              style={{
                aspectRatio: '16/9',
                borderRadius: '14px',
                border: '2px dashed rgba(61, 122, 184,0.4)',
                background: 'rgba(61, 122, 184,0.05)',
                cursor: 'pointer',
                color: 'var(--pink-main)',
                fontSize: '18px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.2s'
              }}
            >
              <i className="fas fa-plus"></i>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>Add Video</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>MP4, WebM, MOV</span>
            </button>
          </div>
          
          <style>{\`
            .media-hover:hover, div:hover > .media-hover { opacity: 1 !important; }
            div:hover > .delete-btn { opacity: 1 !important; }
          \`}</style>
        </div>
      );
    };
    
    // ============================================================
    // AI CHAT ASSISTANT WIDGET
    // ============================================================
    const ChatWidget = ({ user, profile, setProfile, view }) => {
      const [isOpen, setIsOpen] = useState(false);
      const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm your WebUME assistant. I can help you navigate the app, answer questions, or even edit your profile. What would you like to do?" }
      ]);
      const [input, setInput] = useState('');
      const [loading, setLoading] = useState(false);
      const messagesEndRef = React.useRef(null);
      
      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      };
      
      React.useEffect(() => {
        scrollToBottom();
      }, [messages]);
      
      // Process action from AI response
      const processAction = (action) => {
        if (!action || !profile) return false;
        
        try {
          const { type, section, action: actionType, data } = action;
          
          if (type !== 'edit_profile') return false;
          
          let updatedProfile = { ...profile };
          
          switch (section) {
            case 'basics':
              updatedProfile.basics = { ...updatedProfile.basics, ...data };
              break;
              
            case 'skills':
              if (actionType === 'add' && data.name) {
                const newSkill = {
                  id: Date.now().toString(),
                  name: data.name,
                  category: data.category || 'Technical',
                  level: data.level || 'Intermediate'
                };
                updatedProfile.skills = [...(updatedProfile.skills || []), newSkill];
              } else if (actionType === 'delete' && data.name) {
                updatedProfile.skills = (updatedProfile.skills || []).filter(s => 
                  s.name.toLowerCase() !== data.name.toLowerCase()
                );
              }
              break;
              
            case 'achievements':
              if (actionType === 'add' && data.title) {
                const newAch = {
                  id: Date.now().toString(),
                  title: data.title,
                  description: data.description || ''
                };
                updatedProfile.achievements = [...(updatedProfile.achievements || []), newAch];
              }
              break;
              
            case 'education':
              if (actionType === 'add' && data.degree) {
                const newEdu = {
                  id: Date.now().toString(),
                  degree: data.degree,
                  school: data.school || '',
                  year: data.year || '',
                  details: data.details || ''
                };
                updatedProfile.education = [...(updatedProfile.education || []), newEdu];
              }
              break;
              
            case 'experience':
              if (actionType === 'add' && data.employer) {
                const newExp = {
                  id: Date.now().toString(),
                  employer: data.employer,
                  title: data.title || '',
                  startDate: data.startDate || '',
                  endDate: data.endDate || 'Present',
                  description: data.description || '',
                  responsibilities: data.responsibilities || [],
                  projects: [],
                  victories: [],
                  challenges: [],
                  dayInLife: [],
                  media: { photos: [], videos: [] }
                };
                updatedProfile.experience = [...(updatedProfile.experience || []), newExp];
              } else if (actionType === 'update' && data.experienceId) {
                updatedProfile.experience = (updatedProfile.experience || []).map(exp =>
                  exp.id === data.experienceId ? { ...exp, ...data } : exp
                );
              }
              break;
              
            default:
              return false;
          }
          
          setProfile(updatedProfile);
          return true;
        } catch (e) {
          console.error('Error processing action:', e);
          return false;
        }
      };
      
      const sendMessage = async () => {
        if (!input.trim() || loading) return;
        
        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);
        
        try {
          // Include conversation history for context
          const currentMessages = [...messages, { role: 'user', content: userMessage }];
          
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: userMessage,
              context: { view },
              conversationHistory: currentMessages.slice(-6), // Last 6 messages for context
              profile: profile ? {
                basics: profile.basics,
                experience: profile.experience?.map(e => ({ id: e.id, employer: e.employer, title: e.title })),
                skills: profile.skills?.map(s => ({ name: s.name, category: s.category })),
                achievements: profile.achievements?.length,
                education: profile.education?.length
              } : null
            })
          });
          
          const data = await res.json();
          
          if (data.error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
          } else {
            // Process any action first
            let actionMessage = '';
            if (data.action) {
              const success = processAction(data.action);
              if (success) {
                actionMessage = '\\n\\n✅ I\\'ve updated your profile!';
              }
            }
            
            setMessages(prev => [...prev, { 
              role: 'assistant', 
              content: data.response + actionMessage 
            }]);
          }
        } catch (e) {
          setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please check your internet and try again.' }]);
        }
        
        setLoading(false);
      };
      
      const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      };
      
      // Quick action buttons
      const quickActions = [
        { label: '📝 How to edit?', message: 'How do I edit my profile sections?' },
        { label: '🎯 Improve ATS', message: 'How can I improve my ATS score?' },
        { label: '✨ Add skill', message: 'Help me add a new skill to my profile' },
        { label: '🚀 What\\'s next?', message: 'What should I do next to complete my profile?' }
      ];
      
      return (
        <>
          {/* Chat Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e3a5f, #3d7ab8)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(30, 58, 95, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9998,
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <i className={isOpen ? 'fas fa-times' : 'fas fa-comment-dots'} style={{ fontSize: '24px', color: 'white' }}></i>
          </button>
          
          {/* Chat Window */}
          {isOpen && (
            <div style={{
              position: 'fixed',
              bottom: '100px',
              right: '24px',
              width: '380px',
              maxWidth: 'calc(100vw - 48px)',
              height: '500px',
              maxHeight: 'calc(100vh - 140px)',
              background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
              borderRadius: '20px',
              border: '1px solid rgba(30, 58, 95, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 9999
            }}>
              {/* Header */}
              <div style={{
                padding: '16px 20px',
                background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.2), rgba(236, 72, 153, 0.2))',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #1e3a5f, #3d7ab8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-robot" style={{ color: 'white', fontSize: '18px' }}></i>
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: 'white', fontSize: '15px' }}>WebUME Assistant</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Always here to help</div>
                </div>
              </div>
              
              {/* Messages */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {messages.map((msg, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                  }}>
                    <div style={{
                      maxWidth: '85%',
                      padding: '12px 16px',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: msg.role === 'user' 
                        ? 'linear-gradient(135deg, #1e3a5f, #2d5a87)' 
                        : 'rgba(255, 255, 255, 0.08)',
                      color: 'white',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '16px 16px 16px 4px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: '14px'
                    }}>
                      <i className="fas fa-circle-notch fa-spin" style={{ marginRight: '8px' }}></i>
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Quick Actions */}
              {messages.length <= 2 && (
                <div style={{
                  padding: '8px 16px',
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  borderTop: '1px solid rgba(255,255,255,0.05)'
                }}>
                  {quickActions.map((qa, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setInput(qa.message); }}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        background: 'rgba(30, 58, 95, 0.15)',
                        border: '1px solid rgba(30, 58, 95, 0.3)',
                        borderRadius: '20px',
                        color: 'rgba(255,255,255,0.8)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(30, 58, 95, 0.3)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(30, 58, 95, 0.15)'; }}
                    >
                      {qa.label}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Input */}
              <div style={{
                padding: '12px 16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                gap: '10px'
              }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  style={{
                    padding: '12px 16px',
                    background: loading || !input.trim() ? 'rgba(30, 58, 95, 0.3)' : 'linear-gradient(135deg, #1e3a5f, #3d7ab8)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          )}
        </>
      );
    };
    
    // ============================================================
    // AI RESUME TAILOR VIEW - Premium Feature
    // ============================================================
    const TailorView = ({ profile, user, setView }) => {
      const [jobDescription, setJobDescription] = useState('');
      const [jobTitle, setJobTitle] = useState('');
      const [company, setCompany] = useState('');
      const [jobUrl, setJobUrl] = useState('');
      const [loading, setLoading] = useState(false);
      const [result, setResult] = useState(null);
      const [error, setError] = useState(null);
      const [savedResumes, setSavedResumes] = useState([]);
      const [showSaved, setShowSaved] = useState(false);
      const [saving, setSaving] = useState(false);
      
      const isPremium = user?.subscription?.planId === 'pro' || user?.subscription?.planId === 'enterprise';
      
      // Load saved resumes on mount
      useEffect(() => {
        if (isPremium) {
          fetch('/api/tailored-resumes')
            .then(res => res.json())
            .then(data => setSavedResumes(data.resumes || []))
            .catch(() => {});
        }
      }, [isPremium]);
      
      const handleTailor = async () => {
        if (!jobDescription.trim()) {
          setError('Please paste or enter a job description');
          return;
        }
        
        setLoading(true);
        setError(null);
        setResult(null);
        
        try {
          const res = await fetch('/api/tailor-resume', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobDescription, jobTitle, company, jobUrl })
          });
          
          const data = await res.json();
          
          if (!res.ok) {
            if (res.status === 403) {
              setError(data);
            } else {
              setError({ message: data.error || 'Failed to tailor resume' });
            }
            return;
          }
          
          setResult(data);
        } catch (err) {
          setError({ message: 'Network error. Please try again.' });
        } finally {
          setLoading(false);
        }
      };
      
      const handleSave = async () => {
        if (!result) return;
        
        setSaving(true);
        try {
          const res = await fetch('/api/tailored-resumes/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tailoredResume: {
                jobTitle: result.metadata?.jobTitle || jobTitle || 'Untitled Position',
                company: result.metadata?.company || company || 'Unknown Company',
                jobUrl,
                matchScore: result.matchAnalysis?.overallScore,
                tailoredProfile: result.tailoredProfile,
                matchAnalysis: result.matchAnalysis,
                coverLetterHints: result.coverLetterHints,
                interviewTips: result.interviewTips
              }
            })
          });
          
          const data = await res.json();
          if (data.success) {
            setSavedResumes(prev => [...prev, data.resume]);
            alert('✅ Tailored resume saved successfully!');
          }
        } catch (err) {
          alert('Failed to save resume');
        } finally {
          setSaving(false);
        }
      };
      
      const handleDelete = async (id) => {
        if (!confirm('Delete this tailored resume?')) return;
        
        try {
          await fetch(\`/api/tailored-resumes/\${id}\`, { method: 'DELETE', credentials: 'include' });
          setSavedResumes(prev => prev.filter(r => r.id !== id));
        } catch (err) {
          alert('Failed to delete');
        }
      };
      
      // Premium upgrade prompt
      if (!isPremium) {
        return (
          <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <img src="/static/logo.png" alt="Webumé" style={{ height: '40px', width: 'auto', marginBottom: '30px', display: 'block' }} />
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '50px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎯</div>
              <h2 style={{ fontSize: '28px', marginBottom: '15px', color: '#e4e4e7' }}>
                AI Resume Tailor
              </h2>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px' }}>
                Create perfectly tailored resumes for every job application. Our AI analyzes job descriptions and customizes your resume to maximize your chances of landing interviews.
              </p>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '20px', 
                marginBottom: '40px',
                textAlign: 'left'
              }}>
                {[
                  { icon: '🔍', title: 'Keyword Optimization', desc: 'Match exact ATS keywords' },
                  { icon: '✨', title: 'Smart Reframing', desc: 'Highlight relevant experience' },
                  { icon: '📊', title: 'Match Score', desc: 'See how well you fit' },
                  { icon: '💡', title: 'Interview Tips', desc: 'Prep for tough questions' }
                ].map((f, i) => (
                  <div key={i} style={{ 
                    background: 'rgba(0,0,0,0.3)', 
                    padding: '20px', 
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{f.icon}</div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{f.title}</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{f.desc}</div>
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => window.location.href = '/?upgrade=pro'}
                  style={{
                    padding: '15px 40px',
                    fontSize: '16px',
                    fontWeight: '600',
                    background: 'linear-gradient(135deg, #3d7ab8, #1e3a5f)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Upgrade to Pro - $9.99/mo
                </button>
                <button
                  onClick={() => setView(VIEW.PREVIEW)}
                  style={{
                    padding: '15px 30px',
                    fontSize: '14px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    cursor: 'pointer'
                  }}
                >
                  Back to Preview
                </button>
              </div>
            </div>
          </div>
        );
      }
      
      return (
        <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img src="/static/logo.png" alt="Webumé" style={{ height: '40px', width: 'auto' }} />
              <div>
                <h1 style={{ 
                  fontSize: '24px', 
                  fontWeight: '700',
                  color: '#e4e4e7',
                  marginBottom: '5px'
                }}>
                  <i className="fas fa-magic" style={{ marginRight: '10px', color: '#a1a1aa' }}></i>
                  AI Resume Tailor
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                  Paste a job description and get a perfectly tailored resume in seconds
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setView(VIEW.PREVIEW)}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fas fa-arrow-left"></i>
                Back to Preview
              </button>
              <button
                onClick={() => setShowSaved(!showSaved)}
                style={{
                  padding: '10px 20px',
                  background: showSaved ? 'rgba(30, 58, 95,0.2)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fas fa-folder-open"></i>
                Saved ({savedResumes.length})
              </button>
            </div>
          </div>
          
          {/* Saved Resumes Panel */}
          {showSaved && (
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '30px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>
                <i className="fas fa-history" style={{ marginRight: '10px', color: '#1e3a5f' }}></i>
                Saved Tailored Resumes
              </h3>
              {savedResumes.length === 0 ? (
                <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '30px' }}>
                  No saved resumes yet. Tailor your first resume below!
                </p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                  {savedResumes.map(resume => (
                    <div key={resume.id} style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      padding: '15px',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{resume.jobTitle}</div>
                          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{resume.company}</div>
                        </div>
                        <div style={{
                          background: resume.matchScore >= 80 ? 'rgba(16,185,129,0.2)' : resume.matchScore >= 60 ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
                          color: resume.matchScore >= 80 ? '#10B981' : resume.matchScore >= 60 ? '#F59E0B' : '#EF4444',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {resume.matchScore}%
                        </div>
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '10px' }}>
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <button
                          onClick={() => setResult({ tailoredProfile: resume.tailoredProfile, matchAnalysis: resume.matchAnalysis, coverLetterHints: resume.coverLetterHints, interviewTips: resume.interviewTips, metadata: { jobTitle: resume.jobTitle, company: resume.company } })}
                          style={{ flex: 1, padding: '8px', background: 'rgba(30, 58, 95,0.2)', border: 'none', borderRadius: '8px', color: '#2d5a87', cursor: 'pointer', fontSize: '12px' }}
                        >
                          <i className="fas fa-eye"></i> View
                        </button>
                        <button
                          onClick={() => handleDelete(resume.id)}
                          style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '8px', color: '#EF4444', cursor: 'pointer', fontSize: '12px' }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '30px' }}>
            {/* Input Section */}
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '16px',
              padding: '25px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>
                <i className="fas fa-paste" style={{ marginRight: '10px', color: '#3d7ab8' }}></i>
                Job Details
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Senior Product Manager"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                    Company
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g., Google, Stripe, etc."
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                  Job Posting URL (optional)
                </label>
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                  Job Description *
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here...

Include:
• Responsibilities
• Requirements
• Qualifications
• Nice-to-haves

The more detail, the better the tailored resume!"
                  style={{
                    width: '100%',
                    minHeight: '300px',
                    padding: '15px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '14px',
                    resize: 'vertical',
                    lineHeight: '1.6'
                  }}
                />
              </div>
              
              {error && error.message && (
                <div style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '10px',
                  padding: '15px',
                  marginBottom: '20px',
                  color: '#EF4444'
                }}>
                  <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
                  {error.message}
                </div>
              )}
              
              <button
                onClick={handleTailor}
                disabled={loading || !jobDescription.trim()}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: loading ? 'rgba(30, 58, 95,0.3)' : 'linear-gradient(135deg, #3d7ab8, #1e3a5f)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Tailoring Your Resume...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic"></i>
                    Tailor My Resume
                  </>
                )}
              </button>
            </div>
            
            {/* Result Section */}
            {result && (
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '16px',
                padding: '25px',
                border: '1px solid rgba(16,185,129,0.3)',
                maxHeight: 'calc(100vh - 200px)',
                overflowY: 'auto'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px' }}>
                    <i className="fas fa-check-circle" style={{ marginRight: '10px', color: '#10B981' }}></i>
                    Tailored Resume
                  </h3>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(16,185,129,0.2)',
                      border: '1px solid rgba(16,185,129,0.3)',
                      borderRadius: '8px',
                      color: '#10B981',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                    {' '}Save
                  </button>
                </div>
                
                {/* Match Score */}
                {result.matchAnalysis && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.1))',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      fontSize: '48px', 
                      fontWeight: '700',
                      color: result.matchAnalysis.overallScore >= 80 ? '#10B981' : result.matchAnalysis.overallScore >= 60 ? '#F59E0B' : '#EF4444'
                    }}>
                      {result.matchAnalysis.overallScore}%
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Match Score</div>
                    
                    {result.matchAnalysis.matchedKeywords?.length > 0 && (
                      <div style={{ marginTop: '15px' }}>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Matched Keywords</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                          {result.matchAnalysis.matchedKeywords.slice(0, 8).map((kw, i) => (
                            <span key={i} style={{
                              background: 'rgba(16,185,129,0.2)',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              color: '#10B981'
                            }}>{kw}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Tailored Summary */}
                {result.tailoredProfile?.basics && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '10px', color: 'rgba(255,255,255,0.6)' }}>
                      <i className="fas fa-user" style={{ marginRight: '8px' }}></i>
                      Tailored Summary
                    </h4>
                    <div style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '10px',
                      padding: '15px'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '5px' }}>{result.tailoredProfile.basics.title}</div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
                        {result.tailoredProfile.basics.summary}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Cover Letter Hints */}
                {result.coverLetterHints?.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '10px', color: 'rgba(255,255,255,0.6)' }}>
                      <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>
                      Cover Letter Tips
                    </h4>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '15px' }}>
                      {result.coverLetterHints.map((hint, i) => (
                        <div key={i} style={{ 
                          display: 'flex', 
                          gap: '10px', 
                          marginBottom: i < result.coverLetterHints.length - 1 ? '10px' : 0,
                          fontSize: '13px',
                          color: 'rgba(255,255,255,0.7)'
                        }}>
                          <span style={{ color: '#1e3a5f' }}>•</span>
                          {hint}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Interview Tips */}
                {result.interviewTips?.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '14px', marginBottom: '10px', color: 'rgba(255,255,255,0.6)' }}>
                      <i className="fas fa-comments" style={{ marginRight: '8px' }}></i>
                      Interview Prep
                    </h4>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '15px' }}>
                      {result.interviewTips.map((tip, i) => (
                        <div key={i} style={{ 
                          display: 'flex', 
                          gap: '10px', 
                          marginBottom: i < result.interviewTips.length - 1 ? '10px' : 0,
                          fontSize: '13px',
                          color: 'rgba(255,255,255,0.7)'
                        }}>
                          <span style={{ color: '#3d7ab8' }}>•</span>
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    };
    
    // Preview View with Template Support - ENHANCED for all 10 templates
    // Known company domain mappings for automatic logo lookup (for PreviewView)
    const KNOWN_COMPANY_DOMAINS_PREVIEW = {
      'in the house productions': 'inthehouseproductions.com',
      'in the house production': 'inthehouseproductions.com',
      'in house productions': 'inthehouseproductions.com',
      'inthehouseproductions': 'inthehouseproductions.com',
      'in-the-house productions': 'inthehouseproductions.com',
      'the house productions': 'inthehouseproductions.com',
      'house productions': 'inthehouseproductions.com',
      'google': 'google.com',
      'stripe': 'stripe.com',
      'salesforce': 'salesforce.com',
      'amazon': 'amazon.com',
      'microsoft': 'microsoft.com',
      'apple': 'apple.com',
      'meta': 'meta.com',
      'facebook': 'facebook.com',
      'netflix': 'netflix.com',
      'walmart': 'walmart.com',
      'target': 'target.com',
      'starbucks': 'starbucks.com',
      'mcdonalds': 'mcdonalds.com',
      "mcdonald's": 'mcdonalds.com',
      'publix': 'publix.com',
      'cvs': 'cvs.com',
      'walgreens': 'walgreens.com',
      'bank of america': 'bankofamerica.com',
      'wells fargo': 'wellsfargo.com',
      'chase': 'chase.com',
      'jpmorgan': 'jpmorgan.com',
      'citibank': 'citibank.com',
    };
    
    // Local static logo mappings - for companies without good external logos
    const LOCAL_LOGOS_PREVIEW = {
      'in the house productions': '/static/inthehouse-logo.png',
      'in the house production': '/static/inthehouse-logo.png',
      'in house productions': '/static/inthehouse-logo.png',
      'inthehouseproductions': '/static/inthehouse-logo.png',
      'in-the-house productions': '/static/inthehouse-logo.png',
      'the house productions': '/static/inthehouse-logo.png',
      'house productions': '/static/inthehouse-logo.png',
      'chapters health system': '/static/chapters-health-logo.png',
      'chapters health': '/static/chapters-health-logo.png',
      'chapters': '/static/chapters-health-logo.png',
    };
    
    const getLocalLogoForPreview = (companyName) => {
      if (!companyName) return null;
      const lowerName = companyName.toLowerCase().trim();
      if (LOCAL_LOGOS_PREVIEW[lowerName]) return LOCAL_LOGOS_PREVIEW[lowerName];
      for (const [key, path] of Object.entries(LOCAL_LOGOS_PREVIEW)) {
        if (lowerName.includes(key) || key.includes(lowerName)) return path;
      }
      return null;
    };
    
    // Helper to get domain from company name
    const getCompanyDomain = (companyName, existingDomain) => {
      if (existingDomain) return existingDomain;
      if (!companyName) return null;
      const lowerName = companyName.toLowerCase().trim();
      // Check exact match first
      if (KNOWN_COMPANY_DOMAINS_PREVIEW[lowerName]) return KNOWN_COMPANY_DOMAINS_PREVIEW[lowerName];
      // Check partial matches
      for (const [key, domain] of Object.entries(KNOWN_COMPANY_DOMAINS_PREVIEW)) {
        if (lowerName.includes(key) || key.includes(lowerName)) {
          return domain;
        }
      }
      return null;
    };
    
    const PreviewView = ({ profile, setView, profilePhoto, selectedTemplate, slug, isPublic, setIsPublic, profileViews, setProfile }) => {
      console.log('🎨 PreviewView rendering with:', { profile, selectedTemplate, slug, isPublic });
      
      // Safety check - ensure profile has required structure
      if (!profile || !profile.basics) {
        console.log('⚠️ PreviewView - profile or basics missing:', { profile, basics: profile?.basics });
        return (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>⚠️</div>
            <h2 style={{ fontSize: '24px', marginBottom: '10px', color: '#fff' }}>Profile Not Ready</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
              Your profile data is incomplete. Please go back and fill in your information.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={() => setView(VIEW.BUILDER)}
              style={{ padding: '12px 24px' }}
            >
              <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
              Back to Builder
            </button>
          </div>
        );
      }
      
      // Ensure experience array exists
      if (!profile.experience) {
        profile.experience = [];
      }
      
      const template = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];
      const [showPublishModal, setShowPublishModal] = useState(false);
      const [publishing, setPublishing] = useState(false);
      const [qrCode, setQrCode] = useState(null);
      const [atsScore, setAtsScore] = useState(null);
      const [showAtsModal, setShowAtsModal] = useState(false);
      const [selectedEmployer, setSelectedEmployer] = useState(null); // For employer detail page
      const [hoveredExp, setHoveredExp] = useState(null); // For hover effect
      
      // Update experience data when editing in employer detail page
      const updateExperienceField = (expId, field, value) => {
        const updatedExperience = profile.experience.map(exp => 
          exp.id === expId ? { ...exp, [field]: value } : exp
        );
        setProfile({ ...profile, experience: updatedExperience });
      };
      
      const publicUrl = window.location.origin + '/p/' + slug;
      
      // Generate QR code when modal opens
      useEffect(() => {
        if (showPublishModal && window.QRCode && slug) {
          QRCode.toDataURL(publicUrl, { width: 200, margin: 2 })
            .then(url => setQrCode(url))
            .catch(() => {});
        }
      }, [showPublishModal, slug]);
      
      const handlePublish = async () => {
        setPublishing(true);
        try {
          const res = await fetch('/api/profile/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isPublic: !isPublic })
          });
          const data = await res.json();
          if (data.success) {
            setIsPublic(!isPublic);
          }
        } catch (e) {
          alert('Failed to update publish status');
        }
        setPublishing(false);
      };
      
      const copyLink = () => {
        navigator.clipboard.writeText(publicUrl);
        alert('Link copied to clipboard!');
      };
      
      const shareProfile = (platform) => {
        const text = encodeURIComponent(profile.basics?.name + ' - Professional Profile');
        const url = encodeURIComponent(publicUrl);
        const links = {
          linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + url,
          twitter: 'https://twitter.com/intent/tweet?text=' + text + '&url=' + url,
          email: 'mailto:?subject=' + text + '&body=Check out my professional profile: ' + publicUrl
        };
        window.open(links[platform], '_blank');
      };
      
      const checkAtsScore = async () => {
        setShowAtsModal(true);
        try {
          const res = await fetch('/api/ats-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile })
          });
          const data = await res.json();
          setAtsScore(data);
        } catch (e) {
          setAtsScore({ error: 'Failed to analyze profile' });
        }
      };
      
      // Use template's own gradient and color
      const styles = {
        accent: template.color,
        gradient: template.gradient,
        cardBg: template.color + '12',
        border: template.color + '30'
      };
      
      return (
        <div>
          {/* Publish Modal */}
          {showPublishModal && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }} onClick={() => setShowPublishModal(false)}>
              <div onClick={e => e.stopPropagation()} style={{
                background: 'linear-gradient(135deg, #1a1a2e, #0f0f1a)',
                borderRadius: '24px',
                padding: '36px',
                maxWidth: '500px',
                width: '100%',
                border: '1px solid rgba(30, 58, 95,0.3)'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#fff' }}>
                  <i className="fas fa-share-alt" style={{ marginRight: '12px', color: 'var(--purple-main)' }}></i>
                  Share Your Profile
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '28px' }}>
                  Make your profile public and share it with recruiters
                </p>
                
                {/* Public Toggle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px',
                  background: isPublic ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                  borderRadius: '14px',
                  marginBottom: '24px',
                  border: '1px solid ' + (isPublic ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)')
                }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                      {isPublic ? '🌐 Profile is Public' : '🔒 Profile is Private'}
                    </h4>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                      {isPublic ? 'Anyone with the link can view' : 'Only you can see your profile'}
                    </p>
                  </div>
                  <button
                    onClick={handlePublish}
                    disabled={publishing}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      background: isPublic ? 'rgba(239,68,68,0.2)' : 'var(--green-main)',
                      color: isPublic ? '#EF4444' : '#fff',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    {publishing ? '...' : isPublic ? 'Make Private' : 'Publish'}
                  </button>
                </div>
                
                {/* URL and QR */}
                {isPublic && (
                  <>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', display: 'block' }}>
                        Your Public URL
                      </label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                          value={publicUrl}
                          readOnly
                          style={{
                            flex: 1,
                            padding: '14px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '10px',
                            color: '#fff',
                            fontSize: '13px'
                          }}
                        />
                        <button onClick={copyLink} style={{
                          padding: '14px 20px',
                          background: 'var(--purple-main)',
                          border: 'none',
                          borderRadius: '10px',
                          color: '#fff',
                          cursor: 'pointer'
                        }}>
                          <i className="fas fa-copy"></i>
                        </button>
                      </div>
                    </div>
                    
                    {/* QR Code */}
                    {qrCode && (
                      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <img src={qrCode} style={{ borderRadius: '12px', background: '#fff', padding: '10px' }} alt="QR Code" />
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>Scan to view profile</p>
                      </div>
                    )}
                    
                    {/* Social Share */}
                    <div>
                      <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', display: 'block' }}>
                        Share on
                      </label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => shareProfile('linkedin')} style={{
                          flex: 1,
                          padding: '14px',
                          background: '#0A66C2',
                          border: 'none',
                          borderRadius: '10px',
                          color: '#fff',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                          <i className="fab fa-linkedin" style={{ marginRight: '8px' }}></i>LinkedIn
                        </button>
                        <button onClick={() => shareProfile('twitter')} style={{
                          flex: 1,
                          padding: '14px',
                          background: '#1DA1F2',
                          border: 'none',
                          borderRadius: '10px',
                          color: '#fff',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                          <i className="fab fa-twitter" style={{ marginRight: '8px' }}></i>Twitter
                        </button>
                        <button onClick={() => shareProfile('email')} style={{
                          flex: 1,
                          padding: '14px',
                          background: 'rgba(255,255,255,0.1)',
                          border: 'none',
                          borderRadius: '10px',
                          color: '#fff',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                          <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>Email
                        </button>
                      </div>
                    </div>
                  </>
                )}
                
                {/* View Stats */}
                {isPublic && profileViews > 0 && (
                  <div style={{ marginTop: '20px', textAlign: 'center', padding: '14px', background: 'rgba(30, 58, 95,0.1)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--purple-main)' }}>{profileViews}</span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginLeft: '8px' }}>profile views</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* ATS Score Modal */}
          {showAtsModal && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }} onClick={() => setShowAtsModal(false)}>
              <div onClick={e => e.stopPropagation()} style={{
                background: 'linear-gradient(135deg, #1a1a2e, #0f0f1a)',
                borderRadius: '24px',
                padding: '36px',
                maxWidth: '500px',
                width: '100%',
                border: '1px solid rgba(6,182,212,0.3)'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#fff' }}>
                  <i className="fas fa-chart-line" style={{ marginRight: '12px', color: 'var(--cyan-main)' }}></i>
                  ATS Compatibility Score
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '28px' }}>
                  See how well your profile matches ATS requirements
                </p>
                
                {!atsScore ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: 'var(--cyan-main)' }}></i>
                    <p style={{ marginTop: '16px', color: 'rgba(255,255,255,0.5)' }}>Analyzing your profile...</p>
                  </div>
                ) : atsScore.error ? (
                  <p style={{ color: '#EF4444' }}>{atsScore.error}</p>
                ) : (
                  <>
                    {/* Score Circle */}
                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                      <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'conic-gradient(var(--cyan-main) ' + (atsScore.score * 3.6) + 'deg, rgba(255,255,255,0.1) 0deg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto'
                      }}>
                        <div style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          background: '#1a1a2e',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column'
                        }}>
                          <span style={{ fontSize: '32px', fontWeight: '800', color: 'var(--cyan-main)' }}>{atsScore.score}</span>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>/ 100</span>
                        </div>
                      </div>
                      <p style={{ marginTop: '12px', fontSize: '18px', fontWeight: '700', color: atsScore.score >= 80 ? 'var(--green-main)' : atsScore.score >= 60 ? '#F59E0B' : '#EF4444' }}>
                        Grade: {atsScore.grade}
                      </p>
                    </div>
                    
                    {/* Keywords Found */}
                    {atsScore.matches?.length > 0 && (
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '13px', color: 'var(--green-main)', marginBottom: '10px' }}>
                          <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>Keywords Found
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {atsScore.matches.map((k, i) => (
                            <span key={i} style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.15)', borderRadius: '6px', fontSize: '12px', color: 'var(--green-main)' }}>{k}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Suggestions */}
                    {atsScore.tips?.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: '13px', color: '#F59E0B', marginBottom: '10px' }}>
                          <i className="fas fa-lightbulb" style={{ marginRight: '8px' }}></i>Suggestions
                        </h4>
                        <ul style={{ paddingLeft: '20px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: '1.8' }}>
                          {atsScore.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
          
          <div className="glass preview-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img src="/static/logo.png" alt="Webumé" style={{ height: '40px', width: 'auto' }} />
              <div>
                <h1 className="page-title">Live Preview</h1>
              <p className="page-desc">
                <span style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '4px 12px',
                  background: styles.accent + '20',
                  borderRadius: '100px',
                  fontSize: '12px',
                  color: styles.accent,
                  fontWeight: '600'
                }}>
                  <i className={'fas ' + template.icon}></i>
                  {template.name} Template
                </span>
                {isPublic && (
                  <span style={{ 
                    marginLeft: '10px',
                    padding: '4px 12px',
                    background: 'rgba(16,185,129,0.2)',
                    borderRadius: '100px',
                    fontSize: '12px',
                    color: 'var(--green-main)',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-globe" style={{ marginRight: '6px' }}></i>Public
                  </span>
                )}
              </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={checkAtsScore}>
                <i className="fas fa-chart-line"></i> ATS Score
              </button>
              <button className="btn btn-secondary" onClick={() => setView(VIEW.BUILDER)}>
                <i className="fas fa-edit"></i> Edit
              </button>
              <button className="btn btn-secondary" onClick={() => setView(VIEW.TAILOR)} style={{ 
                background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)',
                border: 'none',
                color: '#fff'
              }}>
                <i className="fas fa-magic"></i> AI Tailor
              </button>
              <button className="btn btn-primary" style={{ background: styles.gradient }} onClick={() => setShowPublishModal(true)}>
                <i className="fas fa-share"></i> {isPublic ? 'Share' : 'Publish'}
              </button>
            </div>
          </div>
          
          {/* Profile Hero with Photo Support */}
          <div className="glass-card profile-hero" style={{ borderTop: '4px solid ' + styles.accent }}>
            {profilePhoto ? (
              <div style={{
                width: '130px',
                height: '130px',
                margin: '0 auto 24px',
                borderRadius: '32px',
                overflow: 'hidden',
                border: '4px solid ' + styles.accent,
                boxShadow: '0 20px 50px ' + styles.accent + '40'
              }}>
                <img src={profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div className="profile-avatar" style={{ background: styles.gradient }}>
                {profile.basics.name
                  ? profile.basics.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                  : '?'}
              </div>
            )}
            <h1 className="profile-name">{profile.basics.name || 'Your Name'}</h1>
            <p className="profile-title" style={{ color: styles.accent }}>{profile.basics.title || 'Your Title'}</p>
            <p className="profile-tagline">{profile.basics.tagline || 'Your professional tagline'}</p>
            
            {profile.basics.summary && (
              <p style={{ 
                color: 'rgba(255,255,255,0.6)', 
                maxWidth: '600px', 
                margin: '18px auto 0', 
                fontSize: '14px',
                lineHeight: '1.8',
                fontStyle: 'italic'
              }}>
                "{profile.basics.summary}"
              </p>
            )}
            
            {/* Contact Info */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', justifyContent: 'center', marginTop: '28px' }}>
              {profile.basics.email && (
                <a href={'mailto:' + profile.basics.email} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '13px', textDecoration: 'none' }}>
                  <i className="fas fa-envelope" style={{ color: styles.accent }}></i>
                  {profile.basics.email}
                </a>
              )}
              {profile.basics.phone && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                  <i className="fas fa-phone" style={{ color: styles.accent }}></i>
                  {profile.basics.phone}
                </span>
              )}
              {profile.basics.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                  <i className="fas fa-map-marker-alt" style={{ color: styles.accent }}></i>
                  {profile.basics.location}
                </span>
              )}
              {profile.basics.linkedin && (
                <a href={'https://' + profile.basics.linkedin.replace(/^https?:\\/\\//, '')} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '13px', textDecoration: 'none' }}>
                  <i className="fab fa-linkedin" style={{ color: styles.accent }}></i>
                  LinkedIn
                </a>
              )}
            </div>
            
            {profile.skills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '28px' }}>
                {profile.skills.slice(0, 10).map((skill, idx) => (
                  <span key={idx} style={{
                    padding: '8px 16px',
                    background: styles.accent + '15',
                    border: '1px solid ' + styles.accent + '30',
                    borderRadius: '100px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: styles.accent
                  }}>{typeof skill === 'string' ? skill : skill.name || skill}</span>
                ))}
                {profile.skills.length > 10 && (
                  <span style={{
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '100px',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.4)'
                  }}>+{profile.skills.length - 10} more</span>
                )}
              </div>
            )}
          </div>
          
          {/* Employer Detail Page Modal */}
          {selectedEmployer && (
            <EmployerDetailPage
              experience={selectedEmployer}
              onClose={() => setSelectedEmployer(null)}
              template={template}
              isEditing={true}
              onUpdate={(field, value) => updateExperienceField(selectedEmployer.id, field, value)}
            />
          )}
          
          {/* Career Timeline - INTERACTIVE */}
          {profile.experience.length > 0 && (
            <div className="glass-card" style={{ padding: '28px', marginTop: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                <i className="fas fa-briefcase" style={{ marginRight: '14px', color: styles.accent }}></i>
                Career Timeline
              </h2>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '28px' }}>
                <i className="fas fa-hand-pointer" style={{ marginRight: '8px' }}></i>
                Click on any experience to explore the full story
              </p>
              
              <div className="timeline-wrap" style={{ '--timeline-color': styles.accent }}>
                {profile.experience.map((exp, idx) => {
                  // Use customLogo first, then logoUrl, then local static logo, then try logo.dev API with domain
                  const timelineLocalLogo = getLocalLogoForPreview(exp.company);
                  const timelineDomain = getCompanyDomain(exp.company, exp.companyInfo?.domain);
                  const displayLogo = exp.customLogo || exp.logoUrl || timelineLocalLogo || (timelineDomain ? \`https://img.logo.dev/\${timelineDomain}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ\` : null);
                  const isHovered = hoveredExp === exp.id;
                  const hasRichContent = (exp.projects?.length > 0) || (exp.victories?.length > 0) || 
                                         (exp.challenges?.length > 0) || (exp.photos?.length > 0) || 
                                         (exp.videos?.length > 0) || (exp.reviews?.length > 0);
                  return (
                  <div 
                    key={exp.id} 
                    className="glass timeline-item"
                    onClick={() => setSelectedEmployer(exp)}
                    onMouseEnter={() => setHoveredExp(exp.id)}
                    onMouseLeave={() => setHoveredExp(null)}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: isHovered ? 'translateX(8px) scale(1.01)' : 'none',
                      boxShadow: isHovered ? \`0 10px 40px \${styles.accent}30\` : 'none',
                      borderLeft: isHovered ? \`4px solid \${styles.accent}\` : '4px solid transparent'
                    }}
                  >
                    {/* Click Indicator */}
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      background: isHovered ? styles.accent : 'rgba(255,255,255,0.05)',
                      borderRadius: '100px',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: isHovered ? '#fff' : 'rgba(255,255,255,0.4)',
                      transition: 'all 0.2s ease'
                    }}>
                      <i className="fas fa-expand-alt"></i>
                      {isHovered ? 'View Details' : 'Expand'}
                    </div>
                    
                    {/* Company Header with Logo */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                      {displayLogo && (
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '12px',
                          background: '#fff',
                          border: isHovered ? \`3px solid \${styles.accent}\` : '2px solid rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0,
                          transition: 'all 0.2s ease'
                        }}>
                          <img 
                            src={displayLogo} 
                            onError={(e) => {
                              // Try DuckDuckGo favicon as fallback
                              const ddgUrl = timelineDomain ? \`https://icons.duckduckgo.com/ip3/\${timelineDomain}.ico\` : null;
                              if (ddgUrl && e.target.src !== ddgUrl) {
                                e.target.src = ddgUrl;
                              } else {
                                e.target.style.display = 'none';
                              }
                            }}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} 
                          />
                        </div>
                      )}
                      {!displayLogo && (
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '12px',
                          background: \`linear-gradient(135deg, \${styles.accent}, #0d1f33)\`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          color: 'white',
                          fontSize: '20px',
                          fontWeight: '700'
                        }}>
                          {(exp.company || 'C').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <h3 className="timeline-company" style={{ marginBottom: '4px' }}>{exp.company || 'Company'}</h3>
                        <p className="timeline-role" style={{ color: styles.accent, marginBottom: '8px' }}>{exp.role || 'Role'}</p>
                        <span className="timeline-dates" style={{ background: styles.accent + '15', borderColor: styles.accent + '30', color: styles.accent }}>
                          {exp.startDate || 'Start'} — {exp.endDate || 'End'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Company Info Badge */}
                    {exp.companyInfo && (exp.companyInfo.industry || exp.companyInfo.location) && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                        {exp.companyInfo.industry && (
                          <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                            <i className="fas fa-industry" style={{ marginRight: '6px' }}></i>{exp.companyInfo.industry}
                          </span>
                        )}
                        {exp.companyInfo.location && (
                          <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                            <i className="fas fa-map-marker-alt" style={{ marginRight: '6px' }}></i>{exp.companyInfo.location}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Brief Description */}
                    <p className="timeline-desc" style={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      marginBottom: '16px'
                    }}>
                      {exp.description || 'Click to add details about your role and achievements'}
                    </p>
                    
                    {/* Quick Metrics Preview */}
                    {exp.metrics?.some(m => m.value) && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                        {exp.metrics.filter(m => m.value).slice(0, 3).map((metric, midx) => (
                          <div key={midx} style={{ 
                            padding: '8px 14px', 
                            background: styles.accent + '10', 
                            borderRadius: '8px',
                            border: \`1px solid \${styles.accent}20\`
                          }}>
                            <span style={{ fontSize: '16px', fontWeight: '700', color: styles.accent }}>{metric.value}</span>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginLeft: '6px' }}>{metric.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Content Indicators */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {exp.responsibilities?.length > 0 && (
                        <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                          <i className="fas fa-tasks" style={{ marginRight: '4px' }}></i>{exp.responsibilities.length} Responsibilities
                        </span>
                      )}
                      {exp.projects?.length > 0 && (
                        <span style={{ padding: '4px 10px', background: 'rgba(30, 58, 95,0.1)', borderRadius: '6px', fontSize: '10px', color: '#2d5a87' }}>
                          <i className="fas fa-folder" style={{ marginRight: '4px' }}></i>{exp.projects.length} Projects
                        </span>
                      )}
                      {exp.victories?.length > 0 && (
                        <span style={{ padding: '4px 10px', background: 'rgba(245,158,11,0.1)', borderRadius: '6px', fontSize: '10px', color: '#F59E0B' }}>
                          <i className="fas fa-trophy" style={{ marginRight: '4px' }}></i>{exp.victories.length} Victories
                        </span>
                      )}
                      {exp.photos?.length > 0 && (
                        <span style={{ padding: '4px 10px', background: 'rgba(6,182,212,0.1)', borderRadius: '6px', fontSize: '10px', color: '#06B6D4' }}>
                          <i className="fas fa-images" style={{ marginRight: '4px' }}></i>{exp.photos.length} Photos
                        </span>
                      )}
                      {exp.videos?.length > 0 && (
                        <span style={{ padding: '4px 10px', background: 'rgba(61, 122, 184,0.1)', borderRadius: '6px', fontSize: '10px', color: '#3d7ab8' }}>
                          <i className="fas fa-video" style={{ marginRight: '4px' }}></i>{exp.videos.length} Videos
                        </span>
                      )}
                      {exp.reviews?.length > 0 && (
                        <span style={{ padding: '4px 10px', background: 'rgba(16,185,129,0.1)', borderRadius: '6px', fontSize: '10px', color: '#10B981' }}>
                          <i className="fas fa-star" style={{ marginRight: '4px' }}></i>{exp.reviews.length} Reviews
                        </span>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Education Section */}
          {profile.education && profile.education.length > 0 && (
            <div className="glass-card" style={{ padding: '28px', marginTop: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '28px', color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                <i className="fas fa-graduation-cap" style={{ marginRight: '14px', color: styles.accent }}></i>
                Education
              </h2>
              <div style={{ display: 'grid', gap: '18px' }}>
                {profile.education.map((edu, idx) => (
                  <div key={edu.id || idx} style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '14px', borderLeft: '4px solid ' + styles.accent }}>
                    <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>{edu.degree || 'Degree'}</h3>
                    <p style={{ fontSize: '14px', color: styles.accent, marginBottom: '8px' }}>{edu.school || 'School'} • {edu.year || 'Year'}</p>
                    {edu.details && <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{edu.details}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Achievements Section */}
          {profile.achievements && profile.achievements.length > 0 && (
            <div className="glass-card" style={{ padding: '28px', marginTop: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '28px', color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                <i className="fas fa-trophy" style={{ marginRight: '14px', color: styles.accent }}></i>
                Achievements
              </h2>
              <div style={{ display: 'grid', gap: '18px' }}>
                {profile.achievements.map((ach, idx) => (
                  <div key={ach.id || idx} style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '14px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
                      <i className="fas fa-star" style={{ marginRight: '10px', color: styles.accent, fontSize: '14px' }}></i>
                      {ach.title || 'Achievement'}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.7' }}>{ach.description || 'Description'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    };
    
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
    
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/static/sw.js')
          .then(registration => {
            console.log('✅ ServiceWorker registered:', registration.scope);
          })
          .catch(error => {
            console.log('ServiceWorker registration failed:', error);
          });
      });
    }
  </script>
</body>
</html>`
}
