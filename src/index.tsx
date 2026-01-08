import { Hono } from 'hono'

const app = new Hono()

// ============================================
// WEBUME: THE RESUME KILLER
// Premium Glassmorphism UI - Complete Redesign
// Built to take back control from Big Corporations
// ============================================

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Webume | The Resume Killer - Take Back Control</title>
  <meta name="description" content="The resume killer we've needed for 30 years. Transform your career into a living, verifiable proof-of-work empire. Real results, not paragraphs.">
  <meta property="og:title" content="Webume - Brad Powell | The Resume Killer">
  <meta property="og:description" content="30+ years of verified impact. Evidence wins. Take back control from Big Corporations.">
  <meta property="og:type" content="profile">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
  
  <!-- React 18 + Babel -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  
  <!-- Chart.js for metrics visualization -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  
  <!-- Premium Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  
  <!-- Font Awesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <style>
    /* ============================================
       CHUNK 1: PREMIUM DESIGN TOKENS
       Glassmorphism-centric color system
       ============================================ */
    :root {
      /* === VOID SCALE (Backgrounds) === */
      --void-900: #020204;
      --void-800: #050508;
      --void-700: #08080d;
      --void-600: #0c0c14;
      --void-500: #12121e;
      --void-400: #1a1a2a;
      --void-300: #242438;

      /* === PREMIUM GLASS TOKENS === */
      --glass-bg-ultra: rgba(255, 255, 255, 0.02);
      --glass-bg-light: rgba(255, 255, 255, 0.04);
      --glass-bg-medium: rgba(255, 255, 255, 0.08);
      --glass-bg-heavy: rgba(255, 255, 255, 0.12);
      --glass-bg-solid: rgba(255, 255, 255, 0.16);
      --glass-bg-tinted: rgba(99, 102, 241, 0.08);
      --glass-bg-tinted-heavy: rgba(99, 102, 241, 0.15);

      /* === GLASS BORDERS === */
      --glass-border-subtle: rgba(255, 255, 255, 0.04);
      --glass-border-light: rgba(255, 255, 255, 0.08);
      --glass-border-default: rgba(255, 255, 255, 0.12);
      --glass-border-heavy: rgba(255, 255, 255, 0.18);
      --glass-border-highlight: rgba(255, 255, 255, 0.25);
      --glass-border-glow: rgba(99, 102, 241, 0.5);

      /* === PRIMARY ACCENT SPECTRUM === */
      --accent-50: #eef2ff;
      --accent-100: #e0e7ff;
      --accent-200: #c7d2fe;
      --accent-300: #a5b4fc;
      --accent-400: #818cf8;
      --accent-500: #6366f1;
      --accent-600: #4f46e5;
      --accent-700: #4338ca;

      /* === VIOLET SPECTRUM === */
      --violet-400: #a78bfa;
      --violet-500: #8b5cf6;
      --violet-600: #7c3aed;

      /* === FUCHSIA/PINK SPECTRUM === */
      --fuchsia-400: #e879f9;
      --fuchsia-500: #d946ef;
      --fuchsia-600: #c026d3;

      /* === SEMANTIC COLORS === */
      --success-400: #4ade80;
      --success-500: #22c55e;
      --success-glow: rgba(34, 197, 94, 0.3);

      --warning-400: #fbbf24;
      --warning-500: #f59e0b;
      --warning-glow: rgba(245, 158, 11, 0.3);

      --danger-400: #f87171;
      --danger-500: #ef4444;
      --danger-glow: rgba(239, 68, 68, 0.3);

      --info-400: #22d3ee;
      --info-500: #06b6d4;
      --info-glow: rgba(6, 182, 212, 0.3);

      /* === TEXT HIERARCHY === */
      --text-100: #ffffff;
      --text-200: #f4f4f8;
      --text-300: #d8d8e4;
      --text-400: #a0a0b8;
      --text-500: #6e6e88;
      --text-600: #4a4a60;

      /* === PREMIUM GRADIENTS === */
      --gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
      --gradient-secondary: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%);
      --gradient-accent: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
      --gradient-success: linear-gradient(135deg, #22c55e 0%, #06b6d4 100%);
      --gradient-dark: linear-gradient(180deg, var(--void-600) 0%, var(--void-900) 100%);
      --gradient-radial: radial-gradient(ellipse at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
      
      /* === MESH GRADIENT (Premium Background) === */
      --gradient-mesh: 
        radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.25) 0px, transparent 50%),
        radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.20) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(217, 70, 239, 0.15) 0px, transparent 50%),
        radial-gradient(at 0% 100%, rgba(6, 182, 212, 0.18) 0px, transparent 50%),
        radial-gradient(at 50% 50%, rgba(168, 85, 247, 0.10) 0px, transparent 60%);

      /* === SHADOW SYSTEM === */
      --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
      --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.4);
      --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.5);
      --shadow-xl: 0 24px 64px rgba(0, 0, 0, 0.6);
      --shadow-glow-sm: 0 0 20px rgba(99, 102, 241, 0.25);
      --shadow-glow-md: 0 0 40px rgba(99, 102, 241, 0.35);
      --shadow-glow-lg: 0 0 60px rgba(99, 102, 241, 0.45);
      --shadow-glow-xl: 0 0 80px rgba(99, 102, 241, 0.55);
      --shadow-inner-glow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
      --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);

      /* === BLUR INTENSITIES === */
      --blur-xs: 4px;
      --blur-sm: 8px;
      --blur-md: 16px;
      --blur-lg: 24px;
      --blur-xl: 32px;
      --blur-2xl: 48px;

      /* === BORDER RADIUS === */
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --radius-xl: 20px;
      --radius-2xl: 28px;
      --radius-3xl: 36px;
      --radius-full: 9999px;

      /* === SPACING SCALE === */
      --space-1: 4px;
      --space-2: 8px;
      --space-3: 12px;
      --space-4: 16px;
      --space-5: 20px;
      --space-6: 24px;
      --space-8: 32px;
      --space-10: 40px;
      --space-12: 48px;
      --space-16: 64px;
      --space-20: 80px;
      --space-24: 96px;

      /* === TIMING FUNCTIONS === */
      --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
      --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
      --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);

      /* === DURATIONS === */
      --duration-fast: 150ms;
      --duration-normal: 300ms;
      --duration-slow: 500ms;
    }

    /* ============================================
       CHUNK 2: GLOBAL RESETS & BASE STYLES
       ============================================ */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      background: var(--void-900);
      color: var(--text-200);
      line-height: 1.6;
      overflow-x: hidden;
      min-height: 100vh;
    }

    /* Premium Scrollbar */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: var(--void-800); }
    ::-webkit-scrollbar-thumb { 
      background: linear-gradient(180deg, var(--accent-500), var(--violet-500));
      border-radius: var(--radius-full);
    }
    ::-webkit-scrollbar-thumb:hover { background: var(--accent-400); }

    /* Selection */
    ::selection { 
      background: rgba(99, 102, 241, 0.4); 
      color: var(--text-100);
    }

    /* Typography Hierarchy */
    h1, h2, h3, h4, h5, h6 { 
      font-family: 'Space Grotesk', sans-serif; 
      font-weight: 700;
      letter-spacing: -0.025em;
      line-height: 1.1;
    }

    /* ============================================
       CHUNK 3: ANIMATED BACKGROUND SYSTEM
       Premium mesh gradients + floating orbs
       ============================================ */
    
    /* Main Mesh Background */
    .mesh-bg {
      position: fixed;
      inset: 0;
      background: var(--gradient-mesh);
      z-index: -3;
      animation: meshFloat 40s ease-in-out infinite;
    }

    @keyframes meshFloat {
      0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.9; }
      25% { transform: scale(1.02) translate(1%, -1%); opacity: 1; }
      50% { transform: scale(0.98) translate(-1%, 1%); opacity: 0.85; }
      75% { transform: scale(1.01) translate(0.5%, 0.5%); opacity: 0.95; }
    }

    /* Premium Grid Overlay */
    .grid-overlay {
      position: fixed;
      inset: 0;
      background-image: 
        linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
      background-size: 80px 80px;
      z-index: -2;
      mask-image: radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at 50% 50%, black 20%, transparent 70%);
    }

    /* Floating Orbs */
    .orb {
      position: fixed;
      border-radius: 50%;
      pointer-events: none;
      z-index: -1;
    }

    .orb-1 {
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%);
      top: -300px;
      left: -300px;
      filter: blur(100px);
      animation: orbDrift1 30s ease-in-out infinite;
    }

    .orb-2 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, transparent 70%);
      bottom: -200px;
      right: -200px;
      filter: blur(80px);
      animation: orbDrift2 25s ease-in-out infinite;
    }

    .orb-3 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%);
      top: 40%;
      left: 60%;
      filter: blur(90px);
      animation: orbDrift3 35s ease-in-out infinite;
    }

    .orb-4 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(217, 70, 239, 0.25) 0%, transparent 70%);
      top: 60%;
      left: 10%;
      filter: blur(70px);
      animation: orbDrift4 28s ease-in-out infinite;
    }

    @keyframes orbDrift1 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(40px, 30px) scale(1.1); }
      66% { transform: translate(-30px, -20px) scale(0.9); }
    }

    @keyframes orbDrift2 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(-50px, -40px) scale(1.15); }
      66% { transform: translate(30px, 20px) scale(0.85); }
    }

    @keyframes orbDrift3 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(-60px, 40px) scale(1.05); }
    }

    @keyframes orbDrift4 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(50px, -30px) scale(1.1); }
    }

    /* ============================================
       CHUNK 4: GLASSMORPHISM COMPONENT CLASSES
       Premium glass cards with rim highlights
       ============================================ */
    
    /* Base Glass Card */
    .glass {
      background: var(--glass-bg-medium);
      backdrop-filter: blur(var(--blur-lg)) saturate(180%);
      -webkit-backdrop-filter: blur(var(--blur-lg)) saturate(180%);
      border: 1px solid var(--glass-border-default);
      border-top-color: var(--glass-border-heavy);
      box-shadow: var(--shadow-glass);
      position: relative;
    }

    .glass::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%);
      border-radius: inherit;
      pointer-events: none;
    }

    /* Heavy Glass */
    .glass-heavy {
      background: var(--glass-bg-heavy);
      backdrop-filter: blur(var(--blur-xl)) saturate(200%);
      -webkit-backdrop-filter: blur(var(--blur-xl)) saturate(200%);
      border: 1px solid var(--glass-border-heavy);
      border-top-color: var(--glass-border-highlight);
      box-shadow: var(--shadow-glass), var(--shadow-glow-sm);
      position: relative;
    }

    .glass-heavy::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%);
      border-radius: inherit;
      pointer-events: none;
    }

    /* Ultra Glass (Strongest effect) */
    .glass-ultra {
      background: var(--glass-bg-solid);
      backdrop-filter: blur(var(--blur-2xl)) saturate(220%);
      -webkit-backdrop-filter: blur(var(--blur-2xl)) saturate(220%);
      border: 1px solid var(--glass-border-highlight);
      box-shadow: 
        var(--shadow-lg),
        var(--shadow-glow-md),
        inset 0 1px 0 rgba(255, 255, 255, 0.15),
        inset 0 -1px 0 rgba(0, 0, 0, 0.1);
      position: relative;
    }

    .glass-ultra::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 35%);
      border-radius: inherit;
      pointer-events: none;
    }

    /* Tinted Glass */
    .glass-tinted {
      background: var(--glass-bg-tinted);
      backdrop-filter: blur(var(--blur-lg)) saturate(180%);
      -webkit-backdrop-filter: blur(var(--blur-lg)) saturate(180%);
      border: 1px solid rgba(99, 102, 241, 0.25);
      border-top-color: rgba(99, 102, 241, 0.35);
      box-shadow: var(--shadow-glass), 0 0 30px rgba(99, 102, 241, 0.15);
    }

    /* Card Hover Effects */
    .glass-card {
      transition: 
        transform var(--duration-normal) var(--ease-spring),
        box-shadow var(--duration-normal) var(--ease-smooth),
        border-color var(--duration-fast) var(--ease-smooth),
        background var(--duration-fast) var(--ease-smooth);
    }

    .glass-card:hover {
      transform: translateY(-6px);
      background: var(--glass-bg-heavy);
      border-color: var(--glass-border-glow);
      box-shadow: 
        var(--shadow-lg),
        var(--shadow-glow-lg),
        inset 0 1px 0 rgba(255, 255, 255, 0.12);
    }

    /* ============================================
       CHUNK 5: NAVIGATION
       Premium floating glass navbar
       ============================================ */
    .nav {
      position: fixed;
      top: var(--space-4);
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - var(--space-8));
      max-width: 1400px;
      z-index: 1000;
      padding: var(--space-3) var(--space-6);
      border-radius: var(--radius-2xl);
      background: rgba(8, 8, 13, 0.8);
      backdrop-filter: blur(var(--blur-xl)) saturate(180%);
      -webkit-backdrop-filter: blur(var(--blur-xl)) saturate(180%);
      border: 1px solid var(--glass-border-light);
      box-shadow: var(--shadow-lg), var(--shadow-glow-sm);
    }

    .nav-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-logo {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-100);
      text-decoration: none;
    }

    .nav-logo-icon {
      width: 44px;
      height: 44px;
      background: var(--gradient-primary);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      box-shadow: var(--shadow-glow-sm);
      position: relative;
      overflow: hidden;
    }

    .nav-logo-icon::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%);
    }

    .nav-links {
      display: flex;
      gap: var(--space-2);
      align-items: center;
    }

    .nav-link {
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-lg);
      color: var(--text-400);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
      transition: all var(--duration-fast) var(--ease-smooth);
      border: 1px solid transparent;
      background: transparent;
      cursor: pointer;
    }

    .nav-link:hover {
      color: var(--text-100);
      background: var(--glass-bg-medium);
      border-color: var(--glass-border-light);
    }

    .nav-link.active {
      color: var(--text-100);
      background: var(--glass-bg-tinted);
      border-color: rgba(99, 102, 241, 0.3);
    }

    /* ============================================
       CHUNK 6: BUTTON SYSTEM
       Premium buttons with glow effects
       ============================================ */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-6);
      border-radius: var(--radius-lg);
      font-family: 'Inter', sans-serif;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      border: none;
      text-decoration: none;
      position: relative;
      overflow: hidden;
      transition: all var(--duration-normal) var(--ease-spring);
    }

    /* Primary Button */
    .btn-primary {
      background: var(--gradient-primary);
      color: var(--text-100);
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4), var(--shadow-inner-glow);
    }

    .btn-primary::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%);
    }

    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 
        0 8px 30px rgba(99, 102, 241, 0.5),
        0 0 0 1px rgba(99, 102, 241, 0.5),
        var(--shadow-inner-glow);
    }

    .btn-primary:active {
      transform: translateY(-1px);
    }

    /* Secondary Button (Glass) */
    .btn-secondary {
      background: var(--glass-bg-heavy);
      backdrop-filter: blur(var(--blur-md));
      -webkit-backdrop-filter: blur(var(--blur-md));
      color: var(--text-200);
      border: 1px solid var(--glass-border-default);
      box-shadow: var(--shadow-sm);
    }

    .btn-secondary:hover {
      background: var(--glass-bg-solid);
      border-color: var(--accent-500);
      box-shadow: var(--shadow-md), var(--shadow-glow-sm);
      transform: translateY(-2px);
    }

    /* Ghost Button */
    .btn-ghost {
      background: transparent;
      color: var(--text-400);
      border: 1px solid var(--glass-border-light);
    }

    .btn-ghost:hover {
      color: var(--text-100);
      background: var(--glass-bg-light);
      border-color: var(--accent-500);
    }

    /* Button Sizes */
    .btn-lg {
      padding: var(--space-4) var(--space-8);
      font-size: 1.1rem;
      border-radius: var(--radius-xl);
    }

    .btn-sm {
      padding: var(--space-2) var(--space-4);
      font-size: 0.85rem;
    }

    /* Icon Button */
    .btn-icon {
      width: 44px;
      height: 44px;
      padding: 0;
      border-radius: var(--radius-lg);
    }

    /* ============================================
       CHUNK 7: HERO SECTION
       Epic landing with gradient text
       ============================================ */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 140px 0 100px;
      position: relative;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 var(--space-6);
      width: 100%;
    }

    .hero-content {
      text-align: center;
      max-width: 1000px;
      margin: 0 auto;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-5);
      background: var(--glass-bg-tinted);
      backdrop-filter: blur(var(--blur-md));
      -webkit-backdrop-filter: blur(var(--blur-md));
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: var(--radius-full);
      font-size: 0.9rem;
      color: var(--accent-400);
      font-weight: 600;
      margin-bottom: var(--space-8);
      box-shadow: var(--shadow-glow-sm);
      animation: fadeInUp 0.8s var(--ease-spring) forwards;
      opacity: 0;
    }

    .hero-badge i {
      font-size: 0.8rem;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .hero-title {
      font-size: clamp(3rem, 8vw, 6rem);
      line-height: 1.05;
      margin-bottom: var(--space-6);
      animation: fadeInUp 0.8s var(--ease-spring) 0.1s forwards;
      opacity: 0;
    }

    .hero-title-line {
      display: block;
    }

    .hero-title .gradient-text {
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-title .white-text {
      color: var(--text-100);
    }

    .hero-subtitle {
      font-size: clamp(1.1rem, 2.5vw, 1.4rem);
      color: var(--text-400);
      margin-bottom: var(--space-10);
      max-width: 750px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.7;
      animation: fadeInUp 0.8s var(--ease-spring) 0.2s forwards;
      opacity: 0;
    }

    .hero-subtitle strong {
      color: var(--text-200);
    }

    .hero-cta {
      display: flex;
      gap: var(--space-4);
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: var(--space-16);
      animation: fadeInUp 0.8s var(--ease-spring) 0.3s forwards;
      opacity: 0;
    }

    .hero-stats {
      display: flex;
      justify-content: center;
      gap: var(--space-12);
      flex-wrap: wrap;
      animation: fadeInUp 0.8s var(--ease-spring) 0.4s forwards;
      opacity: 0;
    }

    .hero-stat {
      text-align: center;
    }

    .hero-stat-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 700;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.2;
    }

    .hero-stat-label {
      font-size: 0.9rem;
      color: var(--text-500);
      margin-top: var(--space-1);
      font-weight: 500;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* ============================================
       CHUNK 8: PROFILE SECTION
       Brad Powell's premium profile display
       ============================================ */
    .profile-section {
      padding: var(--space-24) 0;
      position: relative;
    }

    .profile-header {
      text-align: center;
      margin-bottom: var(--space-16);
    }

    .profile-avatar {
      width: 160px;
      height: 160px;
      margin: 0 auto var(--space-6);
      border-radius: 50%;
      background: var(--gradient-primary);
      padding: 4px;
      box-shadow: var(--shadow-glow-lg);
      position: relative;
    }

    .profile-avatar-inner {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: var(--void-700);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4rem;
      overflow: hidden;
    }

    .profile-avatar-inner img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .profile-name {
      font-size: clamp(2.5rem, 6vw, 4rem);
      margin-bottom: var(--space-3);
      background: linear-gradient(135deg, var(--text-100) 0%, var(--text-300) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .profile-title {
      font-size: 1.4rem;
      color: var(--accent-400);
      font-weight: 600;
      margin-bottom: var(--space-4);
    }

    .profile-tagline {
      font-size: 1.15rem;
      color: var(--text-400);
      max-width: 600px;
      margin: 0 auto var(--space-8);
      line-height: 1.7;
    }

    .profile-video {
      max-width: 800px;
      margin: 0 auto;
      border-radius: var(--radius-2xl);
      overflow: hidden;
      box-shadow: var(--shadow-xl), var(--shadow-glow-md);
      border: 1px solid var(--glass-border-default);
    }

    .profile-video iframe {
      width: 100%;
      aspect-ratio: 16/9;
      display: block;
    }

    /* ============================================
       CHUNK 9: TIMELINE SECTION
       Premium career timeline with glow effects
       ============================================ */
    .timeline-section {
      padding: var(--space-24) 0;
      background: linear-gradient(180deg, transparent 0%, var(--void-800) 50%, transparent 100%);
    }

    .section-header {
      text-align: center;
      margin-bottom: var(--space-16);
    }

    .section-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-5);
      background: var(--glass-bg-tinted);
      backdrop-filter: blur(var(--blur-md));
      border: 1px solid rgba(99, 102, 241, 0.25);
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      color: var(--accent-400);
      font-weight: 600;
      margin-bottom: var(--space-5);
    }

    .section-title {
      font-size: clamp(2rem, 5vw, 3.5rem);
      margin-bottom: var(--space-4);
      color: var(--text-100);
    }

    .section-desc {
      font-size: 1.15rem;
      color: var(--text-400);
      max-width: 600px;
      margin: 0 auto;
    }

    /* Timeline Container */
    .timeline {
      position: relative;
      max-width: 1000px;
      margin: 0 auto;
      padding-left: var(--space-16);
    }

    /* Glowing Timeline Line */
    .timeline::before {
      content: '';
      position: absolute;
      left: 24px;
      top: 0;
      bottom: 0;
      width: 3px;
      background: linear-gradient(180deg, 
        var(--accent-500) 0%, 
        var(--violet-500) 50%, 
        var(--fuchsia-500) 100%
      );
      border-radius: var(--radius-full);
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
    }

    /* Timeline Entry */
    .timeline-entry {
      position: relative;
      margin-bottom: var(--space-12);
      padding: var(--space-8);
      border-radius: var(--radius-2xl);
      transition: all var(--duration-normal) var(--ease-spring);
    }

    .timeline-entry:last-child {
      margin-bottom: 0;
    }

    /* Timeline Node */
    .timeline-node {
      position: absolute;
      left: calc(-1 * var(--space-16) + 14px);
      top: var(--space-8);
      width: 24px;
      height: 24px;
      background: var(--void-800);
      border: 3px solid var(--accent-500);
      border-radius: 50%;
      box-shadow: 
        0 0 0 6px var(--void-800),
        var(--shadow-glow-md);
      z-index: 1;
    }

    .timeline-entry:hover .timeline-node {
      background: var(--accent-500);
      box-shadow: 
        0 0 0 6px var(--void-800),
        var(--shadow-glow-lg);
    }

    /* Timeline Content */
    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-4);
      flex-wrap: wrap;
      gap: var(--space-4);
    }

    .timeline-company {
      font-size: 1.75rem;
      color: var(--text-100);
      margin-bottom: var(--space-1);
    }

    .timeline-role {
      font-size: 1.1rem;
      color: var(--accent-400);
      font-weight: 600;
    }

    .timeline-dates {
      padding: var(--space-2) var(--space-4);
      background: var(--glass-bg-medium);
      border: 1px solid var(--glass-border-light);
      border-radius: var(--radius-full);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      color: var(--text-400);
    }

    .timeline-description {
      color: var(--text-300);
      line-height: 1.7;
      margin-bottom: var(--space-6);
    }

    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: var(--space-4);
      margin-top: var(--space-6);
    }

    .metric-card {
      padding: var(--space-5);
      background: var(--glass-bg-light);
      backdrop-filter: blur(var(--blur-sm));
      border: 1px solid var(--glass-border-light);
      border-radius: var(--radius-xl);
      text-align: center;
      transition: all var(--duration-fast) var(--ease-smooth);
    }

    .metric-card:hover {
      background: var(--glass-bg-medium);
      border-color: var(--accent-500);
      transform: translateY(-4px);
      box-shadow: var(--shadow-glow-sm);
    }

    .metric-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.75rem;
      font-weight: 700;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.2;
    }

    .metric-value.success {
      background: var(--gradient-success);
      -webkit-background-clip: text;
      background-clip: text;
    }

    .metric-label {
      font-size: 0.8rem;
      color: var(--text-500);
      margin-top: var(--space-1);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Chart Container */
    .chart-container {
      margin-top: var(--space-6);
      padding: var(--space-6);
      background: var(--glass-bg-light);
      border: 1px solid var(--glass-border-light);
      border-radius: var(--radius-xl);
    }

    .chart-container canvas {
      max-height: 300px;
    }

    /* ============================================
       CHUNK 10: TRUTH VAULT SECTION
       Company toxicity ratings with glow bars
       ============================================ */
    .truth-vault-section {
      padding: var(--space-24) 0;
    }

    .truth-vault-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: var(--space-6);
      max-width: 1200px;
      margin: 0 auto;
    }

    .truth-vault-card {
      padding: var(--space-6);
      border-radius: var(--radius-2xl);
      transition: all var(--duration-normal) var(--ease-spring);
    }

    .truth-vault-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
    }

    .truth-vault-company {
      font-size: 1.25rem;
      color: var(--text-100);
      font-weight: 600;
    }

    .truth-vault-score {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 2rem;
      font-weight: 700;
      line-height: 1;
    }

    .truth-vault-score.low {
      color: var(--success-400);
      text-shadow: 0 0 20px var(--success-glow);
    }

    .truth-vault-score.medium {
      color: var(--warning-400);
      text-shadow: 0 0 20px var(--warning-glow);
    }

    .truth-vault-score.high {
      color: var(--danger-400);
      text-shadow: 0 0 20px var(--danger-glow);
    }

    /* Toxicity Bar */
    .toxicity-bar {
      height: 10px;
      background: var(--void-500);
      border-radius: var(--radius-full);
      overflow: hidden;
      position: relative;
    }

    .toxicity-fill {
      height: 100%;
      border-radius: var(--radius-full);
      transition: width 1s var(--ease-spring);
      position: relative;
    }

    .toxicity-fill.low {
      background: linear-gradient(90deg, var(--success-500), var(--success-400));
      box-shadow: 0 0 15px var(--success-glow);
    }

    .toxicity-fill.medium {
      background: linear-gradient(90deg, var(--warning-500), var(--warning-400));
      box-shadow: 0 0 15px var(--warning-glow);
    }

    .toxicity-fill.high {
      background: linear-gradient(90deg, var(--danger-500), var(--danger-400));
      box-shadow: 0 0 15px var(--danger-glow);
    }

    .truth-vault-label {
      font-size: 0.85rem;
      color: var(--text-500);
      margin-top: var(--space-3);
      display: flex;
      justify-content: space-between;
    }

    /* ============================================
       CHUNK 11: VALIDATIONS SECTION
       Colleague endorsements with badges
       ============================================ */
    .validations-section {
      padding: var(--space-24) 0;
      background: linear-gradient(180deg, transparent 0%, var(--void-800) 50%, transparent 100%);
    }

    .validations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: var(--space-6);
      max-width: 1200px;
      margin: 0 auto;
    }

    .validation-card {
      padding: var(--space-6);
      border-radius: var(--radius-2xl);
    }

    .validation-quote {
      font-size: 1.1rem;
      color: var(--text-300);
      line-height: 1.7;
      margin-bottom: var(--space-5);
      font-style: italic;
      position: relative;
      padding-left: var(--space-6);
    }

    .validation-quote::before {
      content: '"';
      position: absolute;
      left: 0;
      top: -10px;
      font-size: 3rem;
      color: var(--accent-500);
      font-family: Georgia, serif;
      line-height: 1;
    }

    .validation-author {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .validation-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: white;
    }

    .validation-name {
      font-weight: 600;
      color: var(--text-100);
    }

    .validation-role {
      font-size: 0.85rem;
      color: var(--text-500);
    }

    .validation-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
      padding: var(--space-1) var(--space-3);
      background: var(--glass-bg-tinted);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      color: var(--accent-400);
      font-weight: 600;
      margin-top: var(--space-2);
    }

    .validation-badge i {
      font-size: 0.65rem;
    }

    /* ============================================
       CHUNK 12: HUNTER AGENT CHAT
       Premium floating chatbot
       ============================================ */
    .chat-trigger {
      position: fixed;
      bottom: var(--space-6);
      right: var(--space-6);
      width: 64px;
      height: 64px;
      background: var(--gradient-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: none;
      color: white;
      font-size: 24px;
      z-index: 1001;
      box-shadow: var(--shadow-lg), var(--shadow-glow-lg);
      transition: all var(--duration-normal) var(--ease-spring);
    }

    .chat-trigger::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%);
    }

    .chat-trigger:hover {
      transform: scale(1.1);
      box-shadow: var(--shadow-xl), var(--shadow-glow-xl);
    }

    .chat-trigger.active {
      transform: rotate(45deg);
    }

    .chat-window {
      position: fixed;
      bottom: 100px;
      right: var(--space-6);
      width: 400px;
      height: 550px;
      border-radius: var(--radius-2xl);
      display: flex;
      flex-direction: column;
      z-index: 1000;
      overflow: hidden;
      background: rgba(8, 8, 13, 0.95);
      backdrop-filter: blur(var(--blur-2xl)) saturate(180%);
      -webkit-backdrop-filter: blur(var(--blur-2xl)) saturate(180%);
      border: 1px solid var(--glass-border-default);
      box-shadow: var(--shadow-xl), var(--shadow-glow-lg);
      animation: slideUp 0.4s var(--ease-spring);
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .chat-header {
      padding: var(--space-5);
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      gap: var(--space-3);
      position: relative;
    }

    .chat-header::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%);
    }

    .chat-avatar {
      width: 48px;
      height: 48px;
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
    }

    .chat-info h4 {
      color: white;
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 2px;
    }

    .chat-info span {
      color: rgba(255,255,255,0.7);
      font-size: 0.8rem;
    }

    .chat-close {
      margin-left: auto;
      width: 36px;
      height: 36px;
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(10px);
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background var(--duration-fast);
      position: relative;
      z-index: 1;
    }

    .chat-close:hover {
      background: rgba(255,255,255,0.25);
    }

    .chat-messages {
      flex: 1;
      padding: var(--space-5);
      overflow-y: auto;
      background: var(--void-800);
    }

    .chat-message {
      margin-bottom: var(--space-4);
      max-width: 85%;
      animation: messageIn 0.3s var(--ease-spring);
    }

    @keyframes messageIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .chat-message.bot {
      margin-right: auto;
    }

    .chat-message.user {
      margin-left: auto;
    }

    .chat-bubble {
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-xl);
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .chat-message.bot .chat-bubble {
      background: var(--glass-bg-heavy);
      border: 1px solid var(--glass-border-light);
      color: var(--text-200);
      border-bottom-left-radius: var(--radius-sm);
    }

    .chat-message.user .chat-bubble {
      background: var(--gradient-primary);
      color: white;
      border-bottom-right-radius: var(--radius-sm);
    }

    .chat-input-area {
      padding: var(--space-4);
      background: var(--void-700);
      border-top: 1px solid var(--glass-border-light);
      display: flex;
      gap: var(--space-3);
    }

    .chat-input {
      flex: 1;
      padding: var(--space-3) var(--space-4);
      background: var(--void-600);
      border: 1px solid var(--glass-border-light);
      border-radius: var(--radius-full);
      color: var(--text-100);
      font-size: 0.95rem;
      outline: none;
      transition: border-color var(--duration-fast);
    }

    .chat-input:focus {
      border-color: var(--accent-500);
    }

    .chat-input::placeholder {
      color: var(--text-500);
    }

    .chat-send {
      width: 48px;
      height: 48px;
      background: var(--gradient-primary);
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform var(--duration-fast), box-shadow var(--duration-fast);
    }

    .chat-send:hover {
      transform: scale(1.05);
      box-shadow: var(--shadow-glow-sm);
    }

    /* Quick Actions */
    .chat-quick-actions {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
      margin-top: var(--space-3);
    }

    .quick-action-btn {
      padding: var(--space-2) var(--space-3);
      background: var(--glass-bg-medium);
      border: 1px solid var(--glass-border-light);
      border-radius: var(--radius-full);
      color: var(--text-300);
      font-size: 0.8rem;
      cursor: pointer;
      transition: all var(--duration-fast);
    }

    .quick-action-btn:hover {
      background: var(--glass-bg-tinted);
      border-color: var(--accent-500);
      color: var(--text-100);
    }

    /* ============================================
       CHUNK 13: FOOTER
       Premium footer with glass effects
       ============================================ */
    .footer {
      padding: var(--space-20) 0 var(--space-10);
      border-top: 1px solid var(--glass-border-subtle);
      background: linear-gradient(180deg, transparent 0%, var(--void-900) 100%);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: var(--space-12);
      margin-bottom: var(--space-12);
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-100);
      margin-bottom: var(--space-4);
    }

    .footer-brand-icon {
      width: 40px;
      height: 40px;
      background: var(--gradient-primary);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }

    .footer-desc {
      color: var(--text-400);
      line-height: 1.7;
      max-width: 320px;
      margin-bottom: var(--space-6);
    }

    .footer-social {
      display: flex;
      gap: var(--space-3);
    }

    .social-link {
      width: 44px;
      height: 44px;
      background: var(--glass-bg-medium);
      border: 1px solid var(--glass-border-light);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-400);
      text-decoration: none;
      transition: all var(--duration-fast) var(--ease-smooth);
    }

    .social-link:hover {
      background: var(--gradient-primary);
      border-color: var(--accent-500);
      color: white;
      transform: translateY(-3px);
      box-shadow: var(--shadow-glow-sm);
    }

    .footer-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-100);
      margin-bottom: var(--space-5);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .footer-links {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .footer-link {
      color: var(--text-400);
      text-decoration: none;
      font-size: 0.95rem;
      transition: color var(--duration-fast);
    }

    .footer-link:hover {
      color: var(--accent-400);
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: var(--space-6);
      border-top: 1px solid var(--glass-border-subtle);
      color: var(--text-500);
      font-size: 0.85rem;
    }

    .footer-tagline {
      color: var(--accent-400);
      font-weight: 500;
    }

    /* ============================================
       CHUNK 14: RESPONSIVE DESIGN
       Mobile-first breakpoints
       ============================================ */
    @media (max-width: 1024px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr;
        gap: var(--space-8);
      }

      .timeline {
        padding-left: var(--space-12);
      }

      .timeline::before {
        left: 16px;
      }

      .timeline-node {
        left: calc(-1 * var(--space-12) + 8px);
      }
    }

    @media (max-width: 768px) {
      .nav {
        width: calc(100% - var(--space-4));
        padding: var(--space-2) var(--space-4);
      }

      .nav-links {
        display: none;
      }

      .hero-title {
        font-size: clamp(2.5rem, 10vw, 4rem);
      }

      .hero-stats {
        gap: var(--space-6);
      }

      .timeline {
        padding-left: var(--space-8);
      }

      .timeline::before {
        left: 10px;
      }

      .timeline-node {
        left: calc(-1 * var(--space-8) + 4px);
        width: 18px;
        height: 18px;
      }

      .timeline-entry {
        padding: var(--space-5);
      }

      .chat-window {
        width: calc(100vw - var(--space-8));
        height: 70vh;
        bottom: 90px;
        right: var(--space-4);
      }

      .footer-grid {
        grid-template-columns: 1fr;
      }

      .footer-bottom {
        flex-direction: column;
        gap: var(--space-4);
        text-align: center;
      }

      .truth-vault-grid,
      .validations-grid {
        grid-template-columns: 1fr;
      }
    }

    /* ============================================
       CHUNK 15: ACCESSIBILITY & FALLBACKS
       ============================================ */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }

      .orb, .mesh-bg, .grid-overlay {
        animation: none !important;
      }
    }

    @supports not (backdrop-filter: blur(10px)) {
      .glass, .glass-heavy, .glass-ultra, .glass-tinted {
        background: rgba(12, 12, 20, 0.95);
      }

      .nav {
        background: rgba(8, 8, 13, 0.98);
      }

      .chat-window {
        background: rgba(8, 8, 13, 0.98);
      }
    }

    /* Focus States */
    :focus-visible {
      outline: 2px solid var(--accent-500);
      outline-offset: 3px;
    }

    /* Skip to main content (accessibility) */
    .skip-link {
      position: absolute;
      top: -100px;
      left: var(--space-4);
      padding: var(--space-3) var(--space-4);
      background: var(--accent-500);
      color: white;
      border-radius: var(--radius-md);
      z-index: 9999;
      transition: top var(--duration-fast);
    }

    .skip-link:focus {
      top: var(--space-4);
    }
  </style>
</head>
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect, useRef } = React;

    // ============================================
    // WEBUME DATA - Brad Powell Profile
    // Preserving all original data points
    // ============================================
    const PROFILE_DATA = {
      name: "Brad Powell",
      title: "Senior Operations Leader",
      tagline: "30+ years of verified impact. Real results, not paragraphs. Evidence wins.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=BP&backgroundColor=6366f1",
      calendlyUrl: "https://calendly.com/bradpowell/30min",
      
      timeline: [
        {
          id: 1,
          company: "Acme Corp",
          role: "Senior Ops Leader",
          period: "2015 - 2025",
          description: "Led enterprise-wide operational transformation, driving measurable impact across revenue, cost optimization, and team performance. Implemented data-driven decision frameworks that revolutionized how we approach operational excellence.",
          metrics: [
            { value: "+47%", label: "Revenue Growth" },
            { value: "-22%", label: "Costs Reduced" },
            { value: "+65%", label: "Team Efficiency" },
            { value: "+35%", label: "Customer Sat" }
          ],
          chartUrl: "https://via.placeholder.com/800x400?text=Revenue+Growth+Chart"
        },
        {
          id: 2,
          company: "TechGiant Inc",
          role: "Operations Manager",
          period: "2008 - 2015",
          description: "Scaled operations from startup phase to enterprise level. Built and led cross-functional teams that delivered unprecedented growth while maintaining quality standards.",
          metrics: [
            { value: "+1000%", label: "Volume Growth" },
            { value: "-90%", label: "Error Rate" },
            { value: "-60%", label: "Processing Time" },
            { value: "50+", label: "Team Size" }
          ]
        }
      ],

      truthVault: [
        { company: "Acme Corp", toxicity: 3, period: "2015-2025" },
        { company: "TechGiant Inc", toxicity: 8, period: "2008-2015" },
        { company: "GoodPlace LLC", toxicity: 2, period: "2005-2008" },
        { company: "StartupXYZ", toxicity: 9, period: "2002-2005" }
      ],

      validations: [
        {
          id: 1,
          quote: "Brad transformed our entire operations culture. His data-driven approach and genuine leadership style made him invaluable. One of the most impactful leaders I have worked with.",
          author: "Sarah Chen",
          role: "CEO, Acme Corp",
          avatar: "SC"
        },
        {
          id: 2,
          quote: "Working with Brad was a masterclass in operational excellence. He does not just optimize processes—he builds teams that sustain excellence long after implementation.",
          author: "Marcus Johnson",
          role: "VP Engineering, TechGiant",
          avatar: "MJ"
        },
        {
          id: 3,
          quote: "Brad's ability to see both the big picture and the critical details is rare. He delivered results that exceeded our most optimistic projections.",
          author: "Elena Rodriguez",
          role: "COO, Acme Corp",
          avatar: "ER"
        }
      ]
    };

    // ============================================
    // HUNTER AGENT RESPONSES
    // Intelligent chatbot responses
    // ============================================
    const AGENT_RESPONSES = {
      greeting: "Hey! I'm Brad's AI Hunter Agent. I'm here to help recruiters and hiring managers learn about Brad's experience. What would you like to know?",
      
      experience: "Brad brings 30+ years of verified impact:\\n\\n• Acme Corp (2015-2025): Senior Ops Leader\\n  → +47% revenue, -22% costs, +65% efficiency\\n\\n• TechGiant Inc (2008-2015): Operations Manager\\n  → +1000% volume growth, -90% error rate\\n\\nEvery metric is backed by real data.",
      
      salary: "Brad's compensation expectations are aligned with senior leadership roles in operations. Given his track record (+47% revenue growth, -22% cost reduction), he's seeking opportunities that reflect this proven impact. Let's schedule a call to discuss specifics.",
      
      availability: "Brad is currently exploring new opportunities and is available for:\\n\\n✓ Immediate start for the right role\\n✓ Remote, hybrid, or on-site\\n✓ Open to relocation for exceptional opportunities\\n\\nWant to book a 30-minute call?",
      
      culture: "Great question! Brad has worked across different company cultures. His Truth Vault shows transparent ratings:\\n\\n• Acme Corp: 3/10 toxicity (Great!)\\n• TechGiant: 8/10 toxicity (Challenging)\\n\\nHe thrives in collaborative, data-driven environments.",
      
      skills: "Brad's core competencies:\\n\\n⚡ Operational Excellence\\n⚡ Team Leadership (50+ direct reports)\\n⚡ Process Optimization\\n⚡ Data-Driven Decision Making\\n⚡ Cross-functional Collaboration\\n⚡ Change Management\\n⚡ P&L Ownership",
      
      book: "Excellent! You can book a 30-minute call with Brad directly:\\n\\n📅 calendly.com/bradpowell/30min\\n\\nOr I can help answer more questions first. What else would you like to know?",
      
      default: "I can help you learn about Brad's:\\n\\n• Experience & achievements\\n• Salary expectations\\n• Availability\\n• Company culture preferences\\n• Core skills\\n\\nOr you can book a call directly. What interests you?"
    };

    // ============================================
    // MAIN APP COMPONENT
    // ============================================
    const App = () => {
      const [chatOpen, setChatOpen] = useState(false);

      return (
        <>
          {/* Premium Background Effects */}
          <div className="mesh-bg" aria-hidden="true"></div>
          <div className="grid-overlay" aria-hidden="true"></div>
          <div className="orb orb-1" aria-hidden="true"></div>
          <div className="orb orb-2" aria-hidden="true"></div>
          <div className="orb orb-3" aria-hidden="true"></div>
          <div className="orb orb-4" aria-hidden="true"></div>

          {/* Navigation */}
          <Navigation />

          {/* Main Content */}
          <main id="main">
            <HeroSection />
            <ProfileSection data={PROFILE_DATA} />
            <TimelineSection data={PROFILE_DATA.timeline} />
            <TruthVaultSection data={PROFILE_DATA.truthVault} />
            <ValidationsSection data={PROFILE_DATA.validations} />
          </main>

          {/* Hunter Agent Chat */}
          <HunterChat 
            isOpen={chatOpen} 
            onToggle={() => setChatOpen(!chatOpen)}
            profile={PROFILE_DATA}
          />

          {/* Footer */}
          <Footer />
        </>
      );
    };

    // ============================================
    // NAVIGATION COMPONENT
    // ============================================
    const Navigation = () => (
      <nav className="nav" role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            <div className="nav-logo-icon">⚡</div>
            Webume
          </a>
          <div className="nav-links">
            <a href="#profile" className="nav-link">Profile</a>
            <a href="#timeline" className="nav-link">Timeline</a>
            <a href="#truth-vault" className="nav-link">Truth Vault</a>
            <a href="#validations" className="nav-link">Validations</a>
            <button className="btn btn-primary btn-sm">
              <i className="fas fa-calendar"></i> Book a Call
            </button>
          </div>
        </div>
      </nav>
    );

    // ============================================
    // HERO SECTION
    // ============================================
    const HeroSection = () => (
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <i className="fas fa-bolt"></i>
              The Resume Killer
            </div>
            
            <h1 className="hero-title">
              <span className="hero-title-line white-text">Take Back Control</span>
              <span className="hero-title-line gradient-text">From Big Corporations</span>
            </h1>
            
            <p className="hero-subtitle">
              This isn't a resume. It's a <strong>living, breathing proof-of-work</strong> that puts 
              power back in the hands of job seekers. Real metrics. Verified impact. 
              <strong> Evidence wins.</strong>
            </p>
            
            <div className="hero-cta">
              <button className="btn btn-primary btn-lg">
                <i className="fas fa-rocket"></i> View Full Profile
              </button>
              <button className="btn btn-secondary btn-lg">
                <i className="fas fa-play"></i> Watch Intro
              </button>
            </div>
            
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">30+</div>
                <div className="hero-stat-label">Years Experience</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">+47%</div>
                <div className="hero-stat-label">Revenue Growth</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">-22%</div>
                <div className="hero-stat-label">Costs Reduced</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">200+</div>
                <div className="hero-stat-label">Team Members Led</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );

    // ============================================
    // PROFILE SECTION
    // ============================================
    const ProfileSection = ({ data }) => (
      <section className="profile-section" id="profile">
        <div className="container">
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="profile-avatar-inner">
                <img src={data.avatarUrl} alt={data.name} />
              </div>
            </div>
            <h2 className="profile-name">{data.name}</h2>
            <p className="profile-title">{data.title}</p>
            <p className="profile-tagline">{data.tagline}</p>
          </div>

          <div className="profile-video">
            <iframe 
              src={data.videoUrl}
              title="Introduction Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
    );

    // ============================================
    // TIMELINE SECTION
    // ============================================
    const TimelineSection = ({ data }) => {
      const chartRef = useRef(null);
      const chartInstance = useRef(null);

      useEffect(() => {
        if (chartRef.current && window.Chart) {
          if (chartInstance.current) {
            chartInstance.current.destroy();
          }

          const ctx = chartRef.current.getContext('2d');
          chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
              labels: ['2015', '2017', '2019', '2021', '2023', '2025'],
              datasets: [
                {
                  label: 'Revenue Growth',
                  data: [100, 115, 128, 135, 142, 147],
                  borderColor: '#6366f1',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  fill: true,
                  tension: 0.4
                },
                {
                  label: 'Cost Index',
                  data: [100, 95, 88, 84, 80, 78],
                  borderColor: '#22c55e',
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  fill: true,
                  tension: 0.4
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: { color: '#a0a0b8' }
                }
              },
              scales: {
                x: {
                  grid: { color: 'rgba(255,255,255,0.05)' },
                  ticks: { color: '#6e6e88' }
                },
                y: {
                  grid: { color: 'rgba(255,255,255,0.05)' },
                  ticks: { color: '#6e6e88' }
                }
              }
            }
          });
        }

        return () => {
          if (chartInstance.current) {
            chartInstance.current.destroy();
          }
        };
      }, []);

      return (
        <section className="timeline-section" id="timeline">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">
                <i className="fas fa-briefcase"></i> Career Timeline
              </div>
              <h2 className="section-title">Verified Impact</h2>
              <p className="section-desc">
                Every metric below is backed by real data. No fluff, no exaggeration—just evidence.
              </p>
            </div>

            <div className="timeline">
              {data.map((entry, index) => (
                <div key={entry.id} className="timeline-entry glass-heavy glass-card">
                  <div className="timeline-node"></div>
                  
                  <div className="timeline-header">
                    <div>
                      <h3 className="timeline-company">{entry.company}</h3>
                      <p className="timeline-role">{entry.role}</p>
                    </div>
                    <span className="timeline-dates">{entry.period}</span>
                  </div>
                  
                  <p className="timeline-description">{entry.description}</p>
                  
                  <div className="metrics-grid">
                    {entry.metrics.map((metric, i) => (
                      <div key={i} className="metric-card">
                        <div className={"metric-value" + (metric.value.startsWith('-') || metric.value.startsWith('+') && metric.label.includes('Reduced') ? ' success' : '')}>
                          {metric.value}
                        </div>
                        <div className="metric-label">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  {index === 0 && (
                    <div className="chart-container">
                      <canvas ref={chartRef} height="250"></canvas>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    };

    // ============================================
    // TRUTH VAULT SECTION
    // ============================================
    const TruthVaultSection = ({ data }) => {
      const getToxicityClass = (score) => {
        if (score <= 3) return 'low';
        if (score <= 6) return 'medium';
        return 'high';
      };

      const getToxicityLabel = (score) => {
        if (score <= 3) return 'Great Culture';
        if (score <= 6) return 'Mixed Experience';
        return 'Challenging Environment';
      };

      return (
        <section className="truth-vault-section" id="truth-vault">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">
                <i className="fas fa-shield-halved"></i> Truth Vault
              </div>
              <h2 className="section-title">Honest Company Ratings</h2>
              <p className="section-desc">
                Anonymous toxicity scores from real experience. Transparency exposes bad employers.
              </p>
            </div>

            <div className="truth-vault-grid">
              {data.map((entry, index) => (
                <div key={index} className="truth-vault-card glass-heavy glass-card">
                  <div className="truth-vault-header">
                    <div>
                      <h3 className="truth-vault-company">{entry.company}</h3>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-500)' }}>{entry.period}</span>
                    </div>
                    <div className={"truth-vault-score " + getToxicityClass(entry.toxicity)}>
                      {entry.toxicity}/10
                    </div>
                  </div>
                  
                  <div className="toxicity-bar">
                    <div 
                      className={"toxicity-fill " + getToxicityClass(entry.toxicity)}
                      style={{ width: (entry.toxicity * 10) + '%' }}
                    ></div>
                  </div>
                  
                  <div className="truth-vault-label">
                    <span>{getToxicityLabel(entry.toxicity)}</span>
                    <span>Toxicity Index</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    };

    // ============================================
    // VALIDATIONS SECTION
    // ============================================
    const ValidationsSection = ({ data }) => (
      <section className="validations-section" id="validations">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <i className="fas fa-users"></i> Colleague Validations
            </div>
            <h2 className="section-title">Verified Endorsements</h2>
            <p className="section-desc">
              Real testimonials from people who worked directly with Brad.
            </p>
          </div>

          <div className="validations-grid">
            {data.map((validation) => (
              <div key={validation.id} className="validation-card glass-heavy glass-card">
                <p className="validation-quote">{validation.quote}</p>
                
                <div className="validation-author">
                  <div className="validation-avatar">{validation.avatar}</div>
                  <div>
                    <div className="validation-name">{validation.author}</div>
                    <div className="validation-role">{validation.role}</div>
                    <div className="validation-badge">
                      <i className="fas fa-check-circle"></i>
                      Verified Colleague
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );

    // ============================================
    // HUNTER CHAT COMPONENT
    // ============================================
    const HunterChat = ({ isOpen, onToggle, profile }) => {
      const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: AGENT_RESPONSES.greeting }
      ]);
      const [input, setInput] = useState('');
      const messagesEndRef = useRef(null);

      const scrollToBottom = () => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      };

      useEffect(() => {
        scrollToBottom();
      }, [messages]);

      const getResponse = (query) => {
        const q = query.toLowerCase();
        if (q.includes('experience') || q.includes('work') || q.includes('history') || q.includes('background')) {
          return AGENT_RESPONSES.experience;
        }
        if (q.includes('salary') || q.includes('compensation') || q.includes('pay') || q.includes('money')) {
          return AGENT_RESPONSES.salary;
        }
        if (q.includes('available') || q.includes('start') || q.includes('when') || q.includes('timeline')) {
          return AGENT_RESPONSES.availability;
        }
        if (q.includes('culture') || q.includes('environment') || q.includes('toxic') || q.includes('truth')) {
          return AGENT_RESPONSES.culture;
        }
        if (q.includes('skill') || q.includes('competenc') || q.includes('strength') || q.includes('good at')) {
          return AGENT_RESPONSES.skills;
        }
        if (q.includes('book') || q.includes('call') || q.includes('meet') || q.includes('schedule') || q.includes('calendly')) {
          return AGENT_RESPONSES.book;
        }
        return AGENT_RESPONSES.default;
      };

      const sendMessage = () => {
        if (!input.trim()) return;
        
        const userMessage = { id: Date.now(), type: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        
        setTimeout(() => {
          const botResponse = { id: Date.now() + 1, type: 'bot', text: getResponse(input) };
          setMessages(prev => [...prev, botResponse]);
        }, 600);
      };

      const handleQuickAction = (action) => {
        setInput(action);
        setTimeout(() => sendMessage(), 100);
      };

      return (
        <>
          <button 
            className={"chat-trigger" + (isOpen ? " active" : "")}
            onClick={onToggle}
            aria-label={isOpen ? "Close chat" : "Open chat"}
          >
            <i className={"fas " + (isOpen ? "fa-times" : "fa-robot")}></i>
          </button>

          {isOpen && (
            <div className="chat-window" role="dialog" aria-label="Hunter Agent Chat">
              <div className="chat-header">
                <div className="chat-avatar">🤖</div>
                <div className="chat-info">
                  <h4>Hunter Agent</h4>
                  <span>Brad's AI Representative</span>
                </div>
                <button className="chat-close" onClick={onToggle} aria-label="Close chat">
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="chat-messages">
                {messages.map(msg => (
                  <div key={msg.id} className={"chat-message " + msg.type}>
                    <div className="chat-bubble">
                      {msg.text.split('\\n').map((line, i) => (
                        <span key={i}>{line}<br/></span>
                      ))}
                    </div>
                    {msg.type === 'bot' && msg.id === 1 && (
                      <div className="chat-quick-actions">
                        <button className="quick-action-btn" onClick={() => handleQuickAction('Tell me about experience')}>
                          Experience
                        </button>
                        <button className="quick-action-btn" onClick={() => handleQuickAction('What are salary expectations?')}>
                          Salary
                        </button>
                        <button className="quick-action-btn" onClick={() => handleQuickAction('When can Brad start?')}>
                          Availability
                        </button>
                        <button className="quick-action-btn" onClick={() => handleQuickAction('Book a call')}>
                          Book Call
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-area">
                <input
                  className="chat-input"
                  placeholder="Ask about Brad..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="chat-send" onClick={sendMessage} aria-label="Send message">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          )}
        </>
      );
    };

    // ============================================
    // FOOTER COMPONENT
    // ============================================
    const Footer = () => (
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <div className="footer-brand-icon">⚡</div>
                Webume
              </div>
              <p className="footer-desc">
                The resume killer we've needed for 30 years. Take back control from Big Corporations. 
                Merit-based storytelling wins.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="social-link" aria-label="GitHub">
                  <i className="fab fa-github"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="footer-title">Profile</h4>
              <div className="footer-links">
                <a href="#timeline" className="footer-link">Career Timeline</a>
                <a href="#truth-vault" className="footer-link">Truth Vault</a>
                <a href="#validations" className="footer-link">Validations</a>
                <a href="#" className="footer-link">Download PDF</a>
              </div>
            </div>
            
            <div>
              <h4 className="footer-title">Connect</h4>
              <div className="footer-links">
                <a href="#" className="footer-link">Book a Call</a>
                <a href="#" className="footer-link">Send Message</a>
                <a href="#" className="footer-link">LinkedIn</a>
                <a href="#" className="footer-link">Email</a>
              </div>
            </div>
            
            <div>
              <h4 className="footer-title">Webume</h4>
              <div className="footer-links">
                <a href="#" className="footer-link">Create Yours</a>
                <a href="#" className="footer-link">How It Works</a>
                <a href="#" className="footer-link">Privacy</a>
                <a href="#" className="footer-link">Terms</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <span>© 2025 Webume. The future of professional profiles.</span>
            <span className="footer-tagline">Built to disrupt. Designed to win.</span>
          </div>
        </div>
      </footer>
    );

    // ============================================
    // RENDER APPLICATION
    // ============================================
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`)
})

export default app
