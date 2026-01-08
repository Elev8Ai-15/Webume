import { Hono } from 'hono'

const app = new Hono()

// ============================================
// WEBUME: THE RESUME KILLER
// Premium Glassmorphism UI - Complete Platform
// Resume Upload → AI Analysis → Profile Builder → Live Preview
// ============================================

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Webume | The Resume Killer - Employee-for-Hire Empire</title>
  <meta name="description" content="Transform your resume into a living, verifiable proof-of-work empire. Upload your resume and let AI build your professional profile.">
  
  <!-- React 18 + Babel -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  
  <!-- Chart.js & PDF.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
  
  <!-- Premium Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <style>
    /* ============================================
       WEBUME DESIGN SYSTEM - GLASSMORPHISM 2.0
       Futuristic Corporate Empire Aesthetic
       ============================================ */
    
    :root {
      /* === VOID SCALE (Deep Space Background) === */
      --void-950: #020204;
      --void-900: #050508;
      --void-800: #08080d;
      --void-700: #0c0c14;
      --void-600: #12121e;
      --void-500: #1a1a2a;
      --void-400: #242438;
      --void-300: #2e2e48;

      /* === PREMIUM GLASS TOKENS === */
      --glass-bg-subtle: rgba(255, 255, 255, 0.02);
      --glass-bg-light: rgba(255, 255, 255, 0.04);
      --glass-bg-medium: rgba(255, 255, 255, 0.08);
      --glass-bg-heavy: rgba(255, 255, 255, 0.12);
      --glass-bg-solid: rgba(255, 255, 255, 0.18);
      --glass-bg-tinted: rgba(138, 43, 226, 0.12);
      --glass-bg-accent: rgba(255, 107, 53, 0.15);

      /* === GLASS BORDERS === */
      --glass-border-subtle: rgba(255, 255, 255, 0.04);
      --glass-border-light: rgba(255, 255, 255, 0.08);
      --glass-border-default: rgba(255, 255, 255, 0.12);
      --glass-border-heavy: rgba(255, 255, 255, 0.20);
      --glass-border-glow: rgba(138, 43, 226, 0.5);

      /* === PRIMARY ACCENT - ELECTRIC VIOLET === */
      --accent-50: #f5f3ff;
      --accent-100: #ede9fe;
      --accent-200: #ddd6fe;
      --accent-300: #c4b5fd;
      --accent-400: #a78bfa;
      --accent-500: #8b5cf6;
      --accent-600: #7c3aed;
      --accent-700: #6d28d9;

      /* === SECONDARY ACCENT - EMBER ORANGE === */
      --ember-400: #ff9f6b;
      --ember-500: #ff6b35;
      --ember-600: #e85a24;
      --ember-glow: rgba(255, 107, 53, 0.4);

      /* === TERTIARY - ELECTRIC CYAN === */
      --cyan-400: #22d3ee;
      --cyan-500: #06b6d4;
      --cyan-glow: rgba(6, 182, 212, 0.4);

      /* === SEMANTIC COLORS === */
      --success-400: #4ade80;
      --success-500: #22c55e;
      --success-glow: rgba(34, 197, 94, 0.4);

      --warning-400: #fbbf24;
      --warning-500: #f59e0b;

      --danger-400: #f87171;
      --danger-500: #ef4444;
      --danger-glow: rgba(239, 68, 68, 0.4);

      /* === TEXT HIERARCHY === */
      --text-100: #ffffff;
      --text-200: #f4f4f8;
      --text-300: #d8d8e4;
      --text-400: #a0a0b8;
      --text-500: #6e6e88;
      --text-600: #4a4a60;

      /* === PREMIUM GRADIENTS === */
      --gradient-hero: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 30%, #a78bfa 60%, #ff6b35 100%);
      --gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%);
      --gradient-accent: linear-gradient(135deg, #ff6b35 0%, #ff9f6b 100%);
      --gradient-glass: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%);
      --gradient-dark: linear-gradient(180deg, var(--void-700) 0%, var(--void-950) 100%);
      
      /* === MESH GRADIENT BACKGROUND === */
      --gradient-mesh: 
        radial-gradient(at 10% 10%, rgba(138, 43, 226, 0.35) 0px, transparent 50%),
        radial-gradient(at 90% 20%, rgba(109, 40, 217, 0.30) 0px, transparent 50%),
        radial-gradient(at 80% 80%, rgba(255, 107, 53, 0.25) 0px, transparent 50%),
        radial-gradient(at 20% 90%, rgba(6, 182, 212, 0.20) 0px, transparent 50%),
        radial-gradient(at 50% 50%, rgba(139, 92, 246, 0.15) 0px, transparent 60%);

      /* === SHADOWS === */
      --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.4);
      --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.5);
      --shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.6);
      --shadow-xl: 0 24px 80px rgba(0, 0, 0, 0.7);
      --shadow-glow-violet: 0 0 60px rgba(139, 92, 246, 0.4);
      --shadow-glow-ember: 0 0 60px rgba(255, 107, 53, 0.4);
      --shadow-glow-cyan: 0 0 40px rgba(6, 182, 212, 0.3);
      --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);

      /* === BLUR === */
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
      --radius-3xl: 40px;
      --radius-full: 9999px;

      /* === SPACING === */
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

      /* === ANIMATION === */
      --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
      --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
      --duration-fast: 150ms;
      --duration-normal: 300ms;
      --duration-slow: 500ms;
    }

    /* ============================================
       GLOBAL RESETS
       ============================================ */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
      -webkit-font-smoothing: antialiased;
    }

    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: var(--void-950);
      color: var(--text-200);
      line-height: 1.6;
      overflow-x: hidden;
      min-height: 100vh;
    }

    /* Premium Scrollbar */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: var(--void-800); }
    ::-webkit-scrollbar-thumb { 
      background: linear-gradient(180deg, var(--accent-500), var(--ember-500));
      border-radius: var(--radius-full);
    }

    ::selection { 
      background: rgba(139, 92, 246, 0.4); 
      color: var(--text-100);
    }

    h1, h2, h3, h4, h5, h6 { 
      font-family: 'Space Grotesk', sans-serif; 
      font-weight: 700;
      letter-spacing: -0.025em;
      line-height: 1.1;
    }

    /* ============================================
       ANIMATED BACKGROUND SYSTEM
       ============================================ */
    .bg-mesh {
      position: fixed;
      inset: 0;
      background: var(--gradient-mesh);
      z-index: -3;
      animation: meshPulse 30s ease-in-out infinite;
    }

    @keyframes meshPulse {
      0%, 100% { opacity: 0.9; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.02); }
    }

    .bg-grid {
      position: fixed;
      inset: 0;
      background-image: 
        linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      z-index: -2;
      mask-image: radial-gradient(ellipse at 50% 30%, black 0%, transparent 70%);
    }

    .bg-orb {
      position: fixed;
      border-radius: 50%;
      pointer-events: none;
      z-index: -1;
      filter: blur(80px);
    }

    .orb-1 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%);
      top: -200px;
      left: -200px;
      animation: orbFloat1 25s ease-in-out infinite;
    }

    .orb-2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(255, 107, 53, 0.4) 0%, transparent 70%);
      bottom: -150px;
      right: -150px;
      animation: orbFloat2 30s ease-in-out infinite;
    }

    .orb-3 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, transparent 70%);
      top: 50%;
      left: 60%;
      animation: orbFloat3 35s ease-in-out infinite;
    }

    @keyframes orbFloat1 {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(50px, 30px); }
    }

    @keyframes orbFloat2 {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(-40px, -30px); }
    }

    @keyframes orbFloat3 {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(-30px, 40px); }
    }

    /* ============================================
       GLASSMORPHISM COMPONENTS
       ============================================ */
    .glass {
      background: var(--glass-bg-medium);
      backdrop-filter: blur(var(--blur-lg)) saturate(180%);
      -webkit-backdrop-filter: blur(var(--blur-lg)) saturate(180%);
      border: 1px solid var(--glass-border-default);
      border-top-color: var(--glass-border-heavy);
      box-shadow: var(--shadow-glass);
    }

    .glass::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--gradient-glass);
      border-radius: inherit;
      pointer-events: none;
    }

    .glass-heavy {
      background: var(--glass-bg-heavy);
      backdrop-filter: blur(var(--blur-xl)) saturate(200%);
      -webkit-backdrop-filter: blur(var(--blur-xl)) saturate(200%);
      border: 1px solid var(--glass-border-heavy);
      box-shadow: var(--shadow-glass), var(--shadow-glow-violet);
    }

    .glass-card {
      position: relative;
      border-radius: var(--radius-2xl);
      transition: all var(--duration-normal) var(--ease-spring);
    }

    .glass-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-lg), var(--shadow-glow-violet);
      border-color: var(--accent-500);
    }

    /* ============================================
       NAVIGATION
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
      background: rgba(8, 8, 13, 0.85);
      backdrop-filter: blur(var(--blur-xl)) saturate(180%);
      border: 1px solid var(--glass-border-light);
      box-shadow: var(--shadow-lg);
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
      background: var(--gradient-hero);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      box-shadow: var(--shadow-glow-violet);
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
      transition: all var(--duration-fast);
      border: 1px solid transparent;
      background: transparent;
      cursor: pointer;
    }

    .nav-link:hover, .nav-link.active {
      color: var(--text-100);
      background: var(--glass-bg-medium);
      border-color: var(--glass-border-light);
    }

    /* ============================================
       BUTTONS
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
      transition: all var(--duration-normal) var(--ease-spring);
      position: relative;
      overflow: hidden;
    }

    .btn-primary {
      background: var(--gradient-hero);
      color: var(--text-100);
      box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
    }

    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(139, 92, 246, 0.5), var(--shadow-glow-violet);
    }

    .btn-secondary {
      background: var(--glass-bg-heavy);
      backdrop-filter: blur(var(--blur-md));
      color: var(--text-200);
      border: 1px solid var(--glass-border-default);
    }

    .btn-secondary:hover {
      background: var(--glass-bg-solid);
      border-color: var(--accent-500);
      box-shadow: var(--shadow-glow-violet);
    }

    .btn-ember {
      background: var(--gradient-accent);
      color: var(--text-100);
      box-shadow: 0 4px 20px var(--ember-glow);
    }

    .btn-ember:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 30px var(--ember-glow);
    }

    .btn-lg {
      padding: var(--space-4) var(--space-8);
      font-size: 1.1rem;
      border-radius: var(--radius-xl);
    }

    .btn-sm {
      padding: var(--space-2) var(--space-4);
      font-size: 0.85rem;
    }

    /* ============================================
       CONTAINER
       ============================================ */
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 var(--space-6);
      width: 100%;
    }

    /* ============================================
       HERO SECTION - LANDING
       ============================================ */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 140px 0 100px;
    }

    .hero-content {
      text-align: center;
      max-width: 900px;
      margin: 0 auto;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-5);
      background: var(--glass-bg-tinted);
      backdrop-filter: blur(var(--blur-md));
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: var(--radius-full);
      font-size: 0.9rem;
      color: var(--accent-400);
      font-weight: 600;
      margin-bottom: var(--space-8);
      box-shadow: var(--shadow-glow-violet);
      animation: fadeInUp 0.8s var(--ease-spring);
    }

    .hero-badge i {
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .hero-title {
      font-size: clamp(2.8rem, 7vw, 5rem);
      margin-bottom: var(--space-6);
      animation: fadeInUp 0.8s var(--ease-spring) 0.1s backwards;
    }

    .hero-title .gradient-text {
      background: var(--gradient-hero);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: clamp(1.1rem, 2.5vw, 1.35rem);
      color: var(--text-400);
      margin-bottom: var(--space-10);
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.7;
      animation: fadeInUp 0.8s var(--ease-spring) 0.2s backwards;
    }

    .hero-subtitle strong {
      color: var(--ember-400);
    }

    .hero-cta {
      display: flex;
      gap: var(--space-4);
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: var(--space-12);
      animation: fadeInUp 0.8s var(--ease-spring) 0.3s backwards;
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
       UPLOAD SECTION - THE STARTING POINT
       ============================================ */
    .upload-section {
      padding: var(--space-20) 0;
    }

    .section-header {
      text-align: center;
      margin-bottom: var(--space-12);
    }

    .section-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-5);
      background: var(--glass-bg-tinted);
      border: 1px solid rgba(139, 92, 246, 0.25);
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      color: var(--accent-400);
      font-weight: 600;
      margin-bottom: var(--space-5);
    }

    .section-title {
      font-size: clamp(2rem, 5vw, 3rem);
      margin-bottom: var(--space-4);
      color: var(--text-100);
    }

    .section-desc {
      font-size: 1.1rem;
      color: var(--text-400);
      max-width: 600px;
      margin: 0 auto;
    }

    /* Upload Zone */
    .upload-zone {
      max-width: 700px;
      margin: 0 auto;
      padding: var(--space-16) var(--space-8);
      border-radius: var(--radius-3xl);
      border: 2px dashed var(--glass-border-heavy);
      background: var(--glass-bg-light);
      backdrop-filter: blur(var(--blur-lg));
      text-align: center;
      cursor: pointer;
      transition: all var(--duration-normal) var(--ease-spring);
      position: relative;
      overflow: hidden;
    }

    .upload-zone::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--gradient-glass);
      opacity: 0;
      transition: opacity var(--duration-normal);
    }

    .upload-zone:hover, .upload-zone.drag-over {
      border-color: var(--accent-500);
      background: var(--glass-bg-medium);
      transform: translateY(-4px);
      box-shadow: var(--shadow-glow-violet);
    }

    .upload-zone:hover::before, .upload-zone.drag-over::before {
      opacity: 1;
    }

    .upload-zone.drag-over {
      border-style: solid;
      border-color: var(--ember-500);
      box-shadow: var(--shadow-glow-ember);
    }

    .upload-icon {
      width: 100px;
      height: 100px;
      margin: 0 auto var(--space-6);
      background: var(--gradient-hero);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      color: white;
      box-shadow: var(--shadow-glow-violet);
      position: relative;
      z-index: 1;
    }

    .upload-title {
      font-size: 1.5rem;
      color: var(--text-100);
      margin-bottom: var(--space-3);
      font-family: 'Space Grotesk', sans-serif;
      position: relative;
      z-index: 1;
    }

    .upload-desc {
      color: var(--text-400);
      margin-bottom: var(--space-6);
      position: relative;
      z-index: 1;
    }

    .upload-formats {
      display: flex;
      gap: var(--space-3);
      justify-content: center;
      flex-wrap: wrap;
      position: relative;
      z-index: 1;
    }

    .format-badge {
      padding: var(--space-2) var(--space-4);
      background: var(--glass-bg-medium);
      border: 1px solid var(--glass-border-light);
      border-radius: var(--radius-full);
      font-size: 0.8rem;
      color: var(--text-300);
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .format-badge i {
      color: var(--accent-400);
    }

    /* Upload Progress */
    .upload-progress {
      max-width: 700px;
      margin: 0 auto;
      padding: var(--space-8);
      border-radius: var(--radius-2xl);
      background: var(--glass-bg-medium);
      backdrop-filter: blur(var(--blur-lg));
      border: 1px solid var(--glass-border-default);
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4);
    }

    .progress-title {
      font-weight: 600;
      color: var(--text-100);
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .progress-spinner {
      width: 24px;
      height: 24px;
      border: 3px solid var(--glass-border-light);
      border-top-color: var(--accent-500);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .progress-bar {
      height: 8px;
      background: var(--void-500);
      border-radius: var(--radius-full);
      overflow: hidden;
      margin-bottom: var(--space-4);
    }

    .progress-fill {
      height: 100%;
      background: var(--gradient-hero);
      border-radius: var(--radius-full);
      transition: width 0.3s ease;
      box-shadow: var(--shadow-glow-violet);
    }

    .progress-steps {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .progress-step {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      color: var(--text-400);
      font-size: 0.9rem;
    }

    .progress-step.complete {
      color: var(--success-400);
    }

    .progress-step.active {
      color: var(--accent-400);
    }

    .progress-step i {
      width: 20px;
      text-align: center;
    }

    /* ============================================
       PROFILE BUILDER - MAIN EDITOR
       ============================================ */
    .builder-section {
      padding: var(--space-16) 0;
    }

    .builder-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: var(--space-6);
      align-items: start;
    }

    /* Sidebar Navigation */
    .builder-sidebar {
      position: sticky;
      top: 100px;
      padding: var(--space-5);
      border-radius: var(--radius-2xl);
      background: var(--glass-bg-medium);
      backdrop-filter: blur(var(--blur-lg));
      border: 1px solid var(--glass-border-default);
    }

    .sidebar-title {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-500);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: var(--space-3) var(--space-4);
      margin-bottom: var(--space-2);
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .sidebar-link {
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-lg);
      color: var(--text-400);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: var(--space-3);
      transition: all var(--duration-fast);
      cursor: pointer;
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
    }

    .sidebar-link:hover {
      color: var(--text-100);
      background: var(--glass-bg-light);
    }

    .sidebar-link.active {
      color: var(--text-100);
      background: var(--glass-bg-tinted);
      border: 1px solid rgba(139, 92, 246, 0.3);
    }

    .sidebar-link i {
      width: 20px;
      text-align: center;
      color: var(--accent-400);
    }

    /* Builder Main Content */
    .builder-main {
      min-height: 600px;
    }

    .builder-card {
      padding: var(--space-8);
      border-radius: var(--radius-2xl);
      background: var(--glass-bg-medium);
      backdrop-filter: blur(var(--blur-lg));
      border: 1px solid var(--glass-border-default);
      margin-bottom: var(--space-6);
    }

    .builder-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-6);
      padding-bottom: var(--space-4);
      border-bottom: 1px solid var(--glass-border-subtle);
    }

    .builder-card-title {
      font-size: 1.25rem;
      color: var(--text-100);
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .builder-card-title i {
      color: var(--accent-400);
    }

    /* Form Styles */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-5);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-300);
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .form-label i {
      color: var(--accent-400);
      font-size: 0.75rem;
    }

    .form-input, .form-textarea, .form-select {
      padding: var(--space-3) var(--space-4);
      background: var(--void-600);
      border: 1px solid var(--glass-border-light);
      border-radius: var(--radius-lg);
      color: var(--text-100);
      font-size: 0.95rem;
      font-family: inherit;
      transition: all var(--duration-fast);
      width: 100%;
    }

    .form-input:focus, .form-textarea:focus, .form-select:focus {
      outline: none;
      border-color: var(--accent-500);
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
    }

    .form-input::placeholder, .form-textarea::placeholder {
      color: var(--text-500);
    }

    .form-textarea {
      min-height: 120px;
      resize: vertical;
    }

    .form-select {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23a0a0b8' stroke-width='2'%3E%3Cpolyline points='6,9 12,15 18,9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 16px;
      padding-right: 40px;
    }

    /* Experience Entry Card */
    .experience-card {
      padding: var(--space-6);
      border-radius: var(--radius-xl);
      background: var(--glass-bg-light);
      border: 1px solid var(--glass-border-subtle);
      margin-bottom: var(--space-5);
      position: relative;
    }

    .experience-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-4);
    }

    .experience-number {
      width: 36px;
      height: 36px;
      background: var(--gradient-hero);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
      color: white;
      box-shadow: var(--shadow-glow-violet);
    }

    .experience-actions {
      display: flex;
      gap: var(--space-2);
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      padding: 0;
      border-radius: var(--radius-md);
      background: var(--glass-bg-medium);
      border: 1px solid var(--glass-border-light);
      color: var(--text-400);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--duration-fast);
    }

    .btn-icon:hover {
      color: var(--text-100);
      background: var(--glass-bg-heavy);
      border-color: var(--accent-500);
    }

    .btn-icon.danger:hover {
      color: var(--danger-400);
      border-color: var(--danger-500);
    }

    /* Day in the Life Section */
    .day-life-section {
      margin-top: var(--space-6);
      padding-top: var(--space-6);
      border-top: 1px solid var(--glass-border-subtle);
    }

    .day-life-title {
      font-size: 1rem;
      color: var(--text-200);
      margin-bottom: var(--space-4);
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .day-life-title i {
      color: var(--ember-400);
    }

    .timeline-mini {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      padding-left: var(--space-6);
      border-left: 2px solid var(--glass-border-default);
    }

    .timeline-mini-item {
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: var(--space-4);
      position: relative;
    }

    .timeline-mini-item::before {
      content: '';
      position: absolute;
      left: calc(-1 * var(--space-6) - 5px);
      top: 8px;
      width: 12px;
      height: 12px;
      background: var(--accent-500);
      border-radius: 50%;
      border: 2px solid var(--void-600);
    }

    .timeline-mini-time {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: var(--accent-400);
      font-weight: 500;
    }

    .timeline-mini-activity {
      font-size: 0.9rem;
      color: var(--text-300);
    }

    /* Metrics Input Section */
    .metrics-section {
      margin-top: var(--space-6);
      padding-top: var(--space-6);
      border-top: 1px solid var(--glass-border-subtle);
    }

    .metrics-title {
      font-size: 1rem;
      color: var(--text-200);
      margin-bottom: var(--space-4);
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .metrics-title i {
      color: var(--success-400);
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: var(--space-4);
    }

    .metric-input-card {
      padding: var(--space-4);
      background: var(--void-600);
      border: 1px solid var(--glass-border-light);
      border-radius: var(--radius-lg);
      text-align: center;
    }

    .metric-input-card input {
      width: 100%;
      text-align: center;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      background: transparent;
      border: none;
      color: var(--accent-400);
      margin-bottom: var(--space-2);
    }

    .metric-input-card input:focus {
      outline: none;
    }

    .metric-input-card input::placeholder {
      color: var(--text-500);
    }

    .metric-input-label {
      font-size: 0.75rem;
      color: var(--text-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Add Button */
    .btn-add {
      width: 100%;
      padding: var(--space-4);
      border-radius: var(--radius-xl);
      background: var(--glass-bg-light);
      border: 2px dashed var(--glass-border-default);
      color: var(--text-400);
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      transition: all var(--duration-fast);
    }

    .btn-add:hover {
      background: var(--glass-bg-medium);
      border-color: var(--accent-500);
      color: var(--text-100);
    }

    /* Media Upload Grid */
    .media-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: var(--space-4);
    }

    .media-upload-card {
      aspect-ratio: 1;
      border-radius: var(--radius-xl);
      background: var(--glass-bg-light);
      border: 2px dashed var(--glass-border-default);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--duration-fast);
      position: relative;
      overflow: hidden;
    }

    .media-upload-card:hover {
      background: var(--glass-bg-medium);
      border-color: var(--accent-500);
    }

    .media-upload-card i {
      font-size: 2rem;
      color: var(--text-500);
      margin-bottom: var(--space-2);
    }

    .media-upload-card span {
      font-size: 0.8rem;
      color: var(--text-500);
    }

    .media-preview-card {
      aspect-ratio: 1;
      border-radius: var(--radius-xl);
      background: var(--void-600);
      border: 1px solid var(--glass-border-light);
      position: relative;
      overflow: hidden;
    }

    .media-preview-card img, .media-preview-card video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .media-preview-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
      opacity: 0;
      transition: opacity var(--duration-fast);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: var(--space-3);
    }

    .media-preview-card:hover .media-preview-overlay {
      opacity: 1;
    }

    /* ============================================
       TEMPLATE SELECTOR
       ============================================ */
    .template-section {
      padding: var(--space-16) 0;
    }

    .template-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--space-6);
    }

    .template-card {
      padding: var(--space-6);
      border-radius: var(--radius-2xl);
      background: var(--glass-bg-medium);
      backdrop-filter: blur(var(--blur-lg));
      border: 2px solid var(--glass-border-default);
      cursor: pointer;
      transition: all var(--duration-normal) var(--ease-spring);
      position: relative;
      overflow: hidden;
    }

    .template-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--gradient-hero);
      opacity: 0;
      transition: opacity var(--duration-fast);
    }

    .template-card:hover {
      border-color: var(--accent-500);
      transform: translateY(-8px);
      box-shadow: var(--shadow-glow-violet);
    }

    .template-card:hover::before {
      opacity: 1;
    }

    .template-card.selected {
      border-color: var(--accent-500);
      background: var(--glass-bg-heavy);
    }

    .template-card.selected::before {
      opacity: 1;
    }

    .template-preview {
      height: 180px;
      border-radius: var(--radius-xl);
      background: var(--void-700);
      margin-bottom: var(--space-4);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .template-preview-mini {
      width: 90%;
      height: 90%;
      background: var(--void-600);
      border-radius: var(--radius-md);
      padding: var(--space-3);
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .template-mini-header {
      height: 20%;
      background: var(--glass-bg-medium);
      border-radius: var(--radius-sm);
    }

    .template-mini-body {
      flex: 1;
      display: flex;
      gap: var(--space-2);
    }

    .template-mini-sidebar {
      width: 30%;
      background: var(--glass-bg-light);
      border-radius: var(--radius-sm);
    }

    .template-mini-content {
      flex: 1;
      background: var(--glass-bg-light);
      border-radius: var(--radius-sm);
    }

    .template-name {
      font-size: 1.1rem;
      color: var(--text-100);
      font-weight: 600;
      margin-bottom: var(--space-2);
    }

    .template-desc {
      font-size: 0.85rem;
      color: var(--text-400);
      line-height: 1.5;
    }

    .template-badge {
      position: absolute;
      top: var(--space-4);
      right: var(--space-4);
      padding: var(--space-1) var(--space-3);
      background: var(--gradient-accent);
      border-radius: var(--radius-full);
      font-size: 0.7rem;
      font-weight: 700;
      color: white;
      text-transform: uppercase;
    }

    /* ============================================
       PREVIEW MODE
       ============================================ */
    .preview-section {
      padding: var(--space-16) 0;
    }

    .preview-frame {
      border-radius: var(--radius-2xl);
      background: var(--void-800);
      border: 1px solid var(--glass-border-default);
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .preview-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-4) var(--space-6);
      background: var(--glass-bg-medium);
      border-bottom: 1px solid var(--glass-border-subtle);
    }

    .preview-device-toggle {
      display: flex;
      gap: var(--space-2);
    }

    .device-btn {
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-md);
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-400);
      cursor: pointer;
      transition: all var(--duration-fast);
    }

    .device-btn:hover, .device-btn.active {
      background: var(--glass-bg-medium);
      color: var(--text-100);
      border-color: var(--glass-border-light);
    }

    .preview-content {
      padding: var(--space-8);
      min-height: 600px;
    }

    /* ============================================
       TIMELINE PREVIEW
       ============================================ */
    .timeline {
      position: relative;
      padding-left: var(--space-12);
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 20px;
      top: 0;
      bottom: 0;
      width: 3px;
      background: linear-gradient(180deg, var(--accent-500), var(--ember-500));
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-glow-violet);
    }

    .timeline-entry {
      position: relative;
      margin-bottom: var(--space-10);
      padding: var(--space-6);
      border-radius: var(--radius-xl);
      background: var(--glass-bg-medium);
      border: 1px solid var(--glass-border-default);
    }

    .timeline-node {
      position: absolute;
      left: calc(-1 * var(--space-12) + 8px);
      top: var(--space-6);
      width: 28px;
      height: 28px;
      background: var(--void-700);
      border: 3px solid var(--accent-500);
      border-radius: 50%;
      box-shadow: 0 0 0 6px var(--void-800), var(--shadow-glow-violet);
    }

    .timeline-company {
      font-size: 1.5rem;
      color: var(--text-100);
      margin-bottom: var(--space-1);
    }

    .timeline-role {
      font-size: 1rem;
      color: var(--accent-400);
      font-weight: 600;
      margin-bottom: var(--space-2);
    }

    .timeline-dates {
      display: inline-flex;
      padding: var(--space-1) var(--space-3);
      background: var(--glass-bg-light);
      border: 1px solid var(--glass-border-light);
      border-radius: var(--radius-full);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: var(--text-400);
      margin-bottom: var(--space-4);
    }

    .timeline-description {
      color: var(--text-300);
      line-height: 1.7;
    }

    /* Preview Metrics */
    .preview-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: var(--space-4);
      margin-top: var(--space-5);
    }

    .preview-metric {
      padding: var(--space-4);
      background: var(--glass-bg-light);
      border: 1px solid var(--glass-border-subtle);
      border-radius: var(--radius-lg);
      text-align: center;
    }

    .preview-metric-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      background: var(--gradient-hero);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .preview-metric-label {
      font-size: 0.75rem;
      color: var(--text-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: var(--space-1);
    }

    /* ============================================
       FOOTER
       ============================================ */
    .footer {
      padding: var(--space-16) 0 var(--space-8);
      border-top: 1px solid var(--glass-border-subtle);
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--space-4);
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-100);
    }

    .footer-brand-icon {
      width: 36px;
      height: 36px;
      background: var(--gradient-hero);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .footer-links {
      display: flex;
      gap: var(--space-6);
    }

    .footer-link {
      color: var(--text-400);
      text-decoration: none;
      font-size: 0.9rem;
      transition: color var(--duration-fast);
    }

    .footer-link:hover {
      color: var(--accent-400);
    }

    .footer-copy {
      color: var(--text-500);
      font-size: 0.85rem;
    }

    /* ============================================
       RESPONSIVE
       ============================================ */
    @media (max-width: 1024px) {
      .builder-layout {
        grid-template-columns: 1fr;
      }

      .builder-sidebar {
        position: static;
        margin-bottom: var(--space-6);
      }

      .sidebar-nav {
        flex-direction: row;
        flex-wrap: wrap;
      }

      .sidebar-link {
        width: auto;
      }
    }

    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }

      .hero-title {
        font-size: clamp(2rem, 8vw, 3rem);
      }

      .upload-zone {
        padding: var(--space-10) var(--space-4);
      }

      .template-grid {
        grid-template-columns: 1fr;
      }

      .footer-content {
        flex-direction: column;
        text-align: center;
      }

      .footer-links {
        flex-wrap: wrap;
        justify-content: center;
      }
    }

    /* ============================================
       ANIMATIONS
       ============================================ */
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .slide-in {
      animation: slideIn 0.5s var(--ease-spring);
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect, useRef } = React;

    // ============================================
    // APP VIEWS/PAGES
    // ============================================
    const VIEWS = {
      LANDING: 'landing',
      UPLOAD: 'upload',
      BUILDER: 'builder',
      TEMPLATES: 'templates',
      PREVIEW: 'preview'
    };

    // ============================================
    // DEFAULT PROFILE DATA STRUCTURE
    // ============================================
    const DEFAULT_PROFILE = {
      basics: {
        name: '',
        title: '',
        tagline: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: ''
      },
      experience: [],
      achievements: [],
      awards: [],
      reviews: [],
      payHistory: [],
      events: [],
      projects: [],
      photos: [],
      videos: [],
      truthVault: [],
      template: 'executive'
    };

    const DEFAULT_EXPERIENCE = {
      id: Date.now(),
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
      tasks: '',
      dayInLife: [
        { time: '8:00 AM', activity: '' },
        { time: '10:00 AM', activity: '' },
        { time: '12:00 PM', activity: '' },
        { time: '2:00 PM', activity: '' },
        { time: '4:00 PM', activity: '' }
      ],
      metrics: [
        { value: '', label: 'Revenue Impact' },
        { value: '', label: 'Cost Savings' },
        { value: '', label: 'Team Size' },
        { value: '', label: 'Efficiency Gain' }
      ],
      toxicity: 5
    };

    // ============================================
    // TEMPLATES
    // ============================================
    const TEMPLATES = [
      {
        id: 'executive',
        name: 'Executive Empire',
        desc: 'Bold, authoritative design for senior leaders. Dark theme with powerful accents.',
        popular: true
      },
      {
        id: 'creative',
        name: 'Creative Maverick',
        desc: 'Vibrant gradients and dynamic layouts for creative professionals.',
        popular: false
      },
      {
        id: 'tech',
        name: 'Tech Pioneer',
        desc: 'Clean, data-driven design with emphasis on metrics and achievements.',
        popular: true
      },
      {
        id: 'minimal',
        name: 'Minimal Impact',
        desc: 'Elegant simplicity that lets your accomplishments speak for themselves.',
        popular: false
      }
    ];

    // ============================================
    // SIMULATED AI PARSING
    // ============================================
    const simulateAIParsing = (filename) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            basics: {
              name: 'Alex Thompson',
              title: 'Senior Product Manager',
              tagline: '10+ years driving product innovation and team excellence',
              email: 'alex.thompson@email.com',
              phone: '+1 (555) 123-4567',
              location: 'San Francisco, CA',
              linkedin: 'linkedin.com/in/alexthompson',
              website: 'alexthompson.io'
            },
            experience: [
              {
                id: 1,
                company: 'TechCorp Industries',
                role: 'Senior Product Manager',
                startDate: '2020-01',
                endDate: 'Present',
                description: 'Led product strategy for enterprise SaaS platform serving 2M+ users. Drove 40% revenue growth through strategic feature launches and market expansion.',
                tasks: 'Product roadmap development, Cross-functional team leadership, Customer research and insights, Go-to-market strategy, Stakeholder management',
                dayInLife: [
                  { time: '8:00 AM', activity: 'Review overnight metrics and customer feedback' },
                  { time: '10:00 AM', activity: 'Sprint planning with engineering team' },
                  { time: '12:00 PM', activity: 'Customer discovery calls' },
                  { time: '2:00 PM', activity: 'Strategy sessions with leadership' },
                  { time: '4:00 PM', activity: 'Product reviews and documentation' }
                ],
                metrics: [
                  { value: '+40%', label: 'Revenue Growth' },
                  { value: '2M+', label: 'Active Users' },
                  { value: '-30%', label: 'Churn Rate' },
                  { value: '15', label: 'Team Size' }
                ],
                toxicity: 3
              },
              {
                id: 2,
                company: 'StartupXYZ',
                role: 'Product Manager',
                startDate: '2017-03',
                endDate: '2019-12',
                description: 'Built product function from ground up at Series A startup. Launched MVP that achieved product-market fit and drove company to Series B.',
                tasks: 'MVP development, User research, Agile methodology implementation, Investor presentations',
                dayInLife: [
                  { time: '9:00 AM', activity: 'Standup with development team' },
                  { time: '11:00 AM', activity: 'User testing sessions' },
                  { time: '1:00 PM', activity: 'Feature prioritization' },
                  { time: '3:00 PM', activity: 'Competitor analysis' },
                  { time: '5:00 PM', activity: 'Roadmap updates' }
                ],
                metrics: [
                  { value: '0→1', label: 'Product Launch' },
                  { value: '$15M', label: 'Series B' },
                  { value: '+200%', label: 'User Growth' },
                  { value: '8', label: 'Team Built' }
                ],
                toxicity: 7
              }
            ],
            achievements: [
              { id: 1, title: 'Drove $10M ARR milestone', description: 'Led product initiatives that pushed company past $10M ARR within 18 months' },
              { id: 2, title: 'Built high-performing team', description: 'Hired and developed product team that consistently exceeded OKRs' }
            ],
            awards: [
              { id: 1, title: 'Product Leader of the Year', org: 'ProductCon 2022', year: '2022' },
              { id: 2, title: 'Innovation Award', org: 'TechCorp Industries', year: '2021' }
            ],
            reviews: [
              { id: 1, quote: 'Alex transformed our product culture', author: 'Sarah Chen', role: 'CEO, TechCorp' },
              { id: 2, quote: 'Best PM I have ever worked with', author: 'Marcus Johnson', role: 'Engineering Lead' }
            ],
            payHistory: [
              { id: 1, year: '2023', base: '$185,000', bonus: '$45,000', equity: '$120,000' },
              { id: 2, year: '2021', base: '$165,000', bonus: '$35,000', equity: '$80,000' }
            ],
            projects: [
              { id: 1, name: 'Enterprise Dashboard', description: 'Led redesign of enterprise dashboard', impact: '+50% user engagement' },
              { id: 2, name: 'Mobile App Launch', description: 'Launched mobile companion app', impact: '500K downloads in 3 months' }
            ],
            template: 'executive'
          });
        }, 3000);
      });
    };

    // ============================================
    // MAIN APP COMPONENT
    // ============================================
    const App = () => {
      const [view, setView] = useState(VIEWS.LANDING);
      const [profile, setProfile] = useState(DEFAULT_PROFILE);
      const [isUploading, setIsUploading] = useState(false);
      const [uploadProgress, setUploadProgress] = useState(0);
      const [uploadSteps, setUploadSteps] = useState([
        { label: 'Reading document...', status: 'pending' },
        { label: 'Extracting text content...', status: 'pending' },
        { label: 'Analyzing with AI...', status: 'pending' },
        { label: 'Building chronological timeline...', status: 'pending' },
        { label: 'Generating day-in-life insights...', status: 'pending' }
      ]);
      const [activeSection, setActiveSection] = useState('basics');

      const handleFileUpload = async (file) => {
        setIsUploading(true);
        setUploadProgress(0);
        
        // Simulate upload progress
        const steps = [...uploadSteps];
        for (let i = 0; i < steps.length; i++) {
          await new Promise(r => setTimeout(r, 600));
          steps[i].status = 'complete';
          if (i < steps.length - 1) steps[i + 1].status = 'active';
          setUploadSteps([...steps]);
          setUploadProgress((i + 1) / steps.length * 100);
        }

        // Simulate AI parsing
        const parsedData = await simulateAIParsing(file.name);
        setProfile({ ...DEFAULT_PROFILE, ...parsedData });
        
        await new Promise(r => setTimeout(r, 500));
        setIsUploading(false);
        setView(VIEWS.BUILDER);
      };

      return (
        <>
          {/* Background Effects */}
          <div className="bg-mesh" aria-hidden="true"></div>
          <div className="bg-grid" aria-hidden="true"></div>
          <div className="bg-orb orb-1" aria-hidden="true"></div>
          <div className="bg-orb orb-2" aria-hidden="true"></div>
          <div className="bg-orb orb-3" aria-hidden="true"></div>

          {/* Navigation */}
          <Navigation view={view} setView={setView} hasProfile={profile.basics.name !== ''} />

          {/* Main Content */}
          <main>
            {view === VIEWS.LANDING && (
              <LandingPage setView={setView} />
            )}
            
            {view === VIEWS.UPLOAD && (
              <UploadPage 
                onUpload={handleFileUpload}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                uploadSteps={uploadSteps}
              />
            )}
            
            {view === VIEWS.BUILDER && (
              <BuilderPage 
                profile={profile}
                setProfile={setProfile}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                setView={setView}
              />
            )}
            
            {view === VIEWS.TEMPLATES && (
              <TemplatesPage 
                profile={profile}
                setProfile={setProfile}
                setView={setView}
              />
            )}
            
            {view === VIEWS.PREVIEW && (
              <PreviewPage 
                profile={profile}
                setView={setView}
              />
            )}
          </main>

          {/* Footer */}
          <Footer />
        </>
      );
    };

    // ============================================
    // NAVIGATION
    // ============================================
    const Navigation = ({ view, setView, hasProfile }) => (
      <nav className="nav">
        <div className="nav-inner">
          <a href="#" className="nav-logo" onClick={() => setView(VIEWS.LANDING)}>
            <div className="nav-logo-icon">⚡</div>
            Webume
          </a>
          <div className="nav-links">
            <button 
              className={"nav-link" + (view === VIEWS.UPLOAD ? " active" : "")}
              onClick={() => setView(VIEWS.UPLOAD)}
            >
              Upload Resume
            </button>
            {hasProfile && (
              <>
                <button 
                  className={"nav-link" + (view === VIEWS.BUILDER ? " active" : "")}
                  onClick={() => setView(VIEWS.BUILDER)}
                >
                  Edit Profile
                </button>
                <button 
                  className={"nav-link" + (view === VIEWS.TEMPLATES ? " active" : "")}
                  onClick={() => setView(VIEWS.TEMPLATES)}
                >
                  Templates
                </button>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setView(VIEWS.PREVIEW)}
                >
                  <i className="fas fa-eye"></i> Preview
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    );

    // ============================================
    // LANDING PAGE
    // ============================================
    const LandingPage = ({ setView }) => (
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <i className="fas fa-bolt"></i>
              The Resume Killer
            </div>
            
            <h1 className="hero-title">
              <span className="gradient-text">Employee-for-Hire</span>
              <br />
              <span style={{ color: 'var(--text-100)' }}>Empire Builder</span>
            </h1>
            
            <p className="hero-subtitle">
              Upload your resume. Let AI transform it into a <strong>living, 
              breathing proof-of-work</strong> portfolio. Real metrics. Verified impact. 
              Take back control from Big Corporations.
            </p>
            
            <div className="hero-cta">
              <button className="btn btn-primary btn-lg" onClick={() => setView(VIEWS.UPLOAD)}>
                <i className="fas fa-upload"></i> Upload Your Resume
              </button>
              <button className="btn btn-secondary btn-lg">
                <i className="fas fa-play"></i> See Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    );

    // ============================================
    // UPLOAD PAGE
    // ============================================
    const UploadPage = ({ onUpload, isUploading, uploadProgress, uploadSteps }) => {
      const [isDragOver, setIsDragOver] = useState(false);
      const fileInputRef = useRef(null);

      const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
      };

      const handleDragLeave = () => {
        setIsDragOver(false);
      };

      const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) onUpload(file);
      };

      const handleClick = () => {
        fileInputRef.current?.click();
      };

      const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) onUpload(file);
      };

      return (
        <section className="upload-section" style={{ minHeight: '100vh', paddingTop: '140px' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-badge">
                <i className="fas fa-rocket"></i> Start Here
              </div>
              <h2 className="section-title">Upload Your Resume</h2>
              <p className="section-desc">
                Our AI will analyze your resume and build a chronological profile 
                with day-in-life insights for each role.
              </p>
            </div>

            {!isUploading ? (
              <div 
                className={"upload-zone" + (isDragOver ? " drag-over" : "")}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  style={{ display: 'none' }}
                />
                
                <div className="upload-icon">
                  <i className="fas fa-cloud-upload-alt"></i>
                </div>
                
                <h3 className="upload-title">Drop your resume here</h3>
                <p className="upload-desc">or click to browse files</p>
                
                <div className="upload-formats">
                  <span className="format-badge">
                    <i className="fas fa-file-pdf"></i> PDF
                  </span>
                  <span className="format-badge">
                    <i className="fas fa-file-word"></i> DOCX
                  </span>
                  <span className="format-badge">
                    <i className="fas fa-file-alt"></i> TXT
                  </span>
                </div>
              </div>
            ) : (
              <div className="upload-progress">
                <div className="progress-header">
                  <span className="progress-title">
                    <div className="progress-spinner"></div>
                    AI Analyzing Resume...
                  </span>
                  <span style={{ color: 'var(--accent-400)', fontWeight: 600 }}>
                    {Math.round(uploadProgress)}%
                  </span>
                </div>
                
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: uploadProgress + '%' }}></div>
                </div>
                
                <div className="progress-steps">
                  {uploadSteps.map((step, i) => (
                    <div key={i} className={"progress-step " + step.status}>
                      <i className={
                        step.status === 'complete' ? 'fas fa-check-circle' :
                        step.status === 'active' ? 'fas fa-spinner fa-spin' :
                        'far fa-circle'
                      }></i>
                      {step.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      );
    };

    // ============================================
    // BUILDER PAGE
    // ============================================
    const BuilderPage = ({ profile, setProfile, activeSection, setActiveSection, setView }) => {
      const sections = [
        { id: 'basics', label: 'Basic Info', icon: 'fa-user' },
        { id: 'experience', label: 'Experience', icon: 'fa-briefcase' },
        { id: 'achievements', label: 'Achievements', icon: 'fa-trophy' },
        { id: 'awards', label: 'Awards', icon: 'fa-award' },
        { id: 'reviews', label: 'Reviews', icon: 'fa-star' },
        { id: 'pay', label: 'Pay History', icon: 'fa-dollar-sign' },
        { id: 'projects', label: 'Projects', icon: 'fa-folder' },
        { id: 'media', label: 'Media', icon: 'fa-image' }
      ];

      const updateProfile = (key, value) => {
        setProfile(prev => ({ ...prev, [key]: value }));
      };

      const updateBasics = (field, value) => {
        setProfile(prev => ({
          ...prev,
          basics: { ...prev.basics, [field]: value }
        }));
      };

      return (
        <section className="builder-section" style={{ paddingTop: '120px' }}>
          <div className="container">
            <div className="section-header" style={{ marginBottom: 'var(--space-8)' }}>
              <h2 className="section-title">Build Your Empire</h2>
              <p className="section-desc">Customize your profile with all the details that matter.</p>
            </div>

            <div className="builder-layout">
              {/* Sidebar */}
              <aside className="builder-sidebar">
                <div className="sidebar-title">Profile Sections</div>
                <nav className="sidebar-nav">
                  {sections.map(section => (
                    <button
                      key={section.id}
                      className={"sidebar-link" + (activeSection === section.id ? " active" : "")}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <i className={"fas " + section.icon}></i>
                      {section.label}
                    </button>
                  ))}
                </nav>
                
                <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <button className="btn btn-secondary" onClick={() => setView(VIEWS.TEMPLATES)}>
                    <i className="fas fa-palette"></i> Templates
                  </button>
                  <button className="btn btn-ember" onClick={() => setView(VIEWS.PREVIEW)}>
                    <i className="fas fa-eye"></i> Preview
                  </button>
                </div>
              </aside>

              {/* Main Content */}
              <div className="builder-main">
                {activeSection === 'basics' && (
                  <BasicsEditor profile={profile} updateBasics={updateBasics} />
                )}
                
                {activeSection === 'experience' && (
                  <ExperienceEditor 
                    experience={profile.experience} 
                    setExperience={(exp) => updateProfile('experience', exp)}
                  />
                )}
                
                {activeSection === 'achievements' && (
                  <ListEditor
                    title="Achievements"
                    icon="fa-trophy"
                    items={profile.achievements}
                    setItems={(items) => updateProfile('achievements', items)}
                    fields={[
                      { key: 'title', label: 'Achievement Title', type: 'input' },
                      { key: 'description', label: 'Description', type: 'textarea' }
                    ]}
                  />
                )}
                
                {activeSection === 'awards' && (
                  <ListEditor
                    title="Awards & Recognition"
                    icon="fa-award"
                    items={profile.awards}
                    setItems={(items) => updateProfile('awards', items)}
                    fields={[
                      { key: 'title', label: 'Award Name', type: 'input' },
                      { key: 'org', label: 'Organization', type: 'input' },
                      { key: 'year', label: 'Year', type: 'input' }
                    ]}
                  />
                )}
                
                {activeSection === 'reviews' && (
                  <ListEditor
                    title="Reviews & Testimonials"
                    icon="fa-star"
                    items={profile.reviews}
                    setItems={(items) => updateProfile('reviews', items)}
                    fields={[
                      { key: 'quote', label: 'Quote', type: 'textarea' },
                      { key: 'author', label: 'Author Name', type: 'input' },
                      { key: 'role', label: 'Author Role/Company', type: 'input' }
                    ]}
                  />
                )}
                
                {activeSection === 'pay' && (
                  <ListEditor
                    title="Pay History"
                    icon="fa-dollar-sign"
                    items={profile.payHistory}
                    setItems={(items) => updateProfile('payHistory', items)}
                    fields={[
                      { key: 'year', label: 'Year', type: 'input' },
                      { key: 'base', label: 'Base Salary', type: 'input' },
                      { key: 'bonus', label: 'Bonus', type: 'input' },
                      { key: 'equity', label: 'Equity Value', type: 'input' }
                    ]}
                  />
                )}
                
                {activeSection === 'projects' && (
                  <ListEditor
                    title="Key Projects"
                    icon="fa-folder"
                    items={profile.projects}
                    setItems={(items) => updateProfile('projects', items)}
                    fields={[
                      { key: 'name', label: 'Project Name', type: 'input' },
                      { key: 'description', label: 'Description', type: 'textarea' },
                      { key: 'impact', label: 'Impact/Results', type: 'input' }
                    ]}
                  />
                )}
                
                {activeSection === 'media' && (
                  <MediaEditor 
                    photos={profile.photos}
                    videos={profile.videos}
                    setPhotos={(p) => updateProfile('photos', p)}
                    setVideos={(v) => updateProfile('videos', v)}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      );
    };

    // ============================================
    // BASICS EDITOR
    // ============================================
    const BasicsEditor = ({ profile, updateBasics }) => (
      <div className="builder-card">
        <div className="builder-card-header">
          <h3 className="builder-card-title">
            <i className="fas fa-user"></i>
            Basic Information
          </h3>
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
          
          <div className="form-group full-width">
            <label className="form-label"><i className="fas fa-quote-left"></i> Professional Tagline</label>
            <input 
              type="text" 
              className="form-input"
              value={profile.basics.tagline}
              onChange={(e) => updateBasics('tagline', e.target.value)}
              placeholder="10+ years driving product innovation and team excellence"
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
      </div>
    );

    // ============================================
    // EXPERIENCE EDITOR
    // ============================================
    const ExperienceEditor = ({ experience, setExperience }) => {
      const addExperience = () => {
        setExperience([...experience, { ...DEFAULT_EXPERIENCE, id: Date.now() }]);
      };

      const updateExperience = (index, field, value) => {
        const updated = [...experience];
        updated[index] = { ...updated[index], [field]: value };
        setExperience(updated);
      };

      const removeExperience = (index) => {
        setExperience(experience.filter((_, i) => i !== index));
      };

      const updateDayInLife = (expIndex, timeIndex, value) => {
        const updated = [...experience];
        updated[expIndex].dayInLife[timeIndex].activity = value;
        setExperience(updated);
      };

      const updateMetric = (expIndex, metricIndex, field, value) => {
        const updated = [...experience];
        updated[expIndex].metrics[metricIndex][field] = value;
        setExperience(updated);
      };

      return (
        <div className="builder-card">
          <div className="builder-card-header">
            <h3 className="builder-card-title">
              <i className="fas fa-briefcase"></i>
              Work Experience
            </h3>
          </div>

          {experience.map((exp, index) => (
            <div key={exp.id} className="experience-card slide-in">
              <div className="experience-card-header">
                <div className="experience-number">{index + 1}</div>
                <div className="experience-actions">
                  <button className="btn-icon danger" onClick={() => removeExperience(index)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Job Title</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={exp.role}
                    onChange={(e) => updateExperience(index, 'role', e.target.value)}
                    placeholder="Your Role"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input 
                    type="month" 
                    className="form-input"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input 
                    type="text" 
                    className="form-input"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                    placeholder="Present or YYYY-MM"
                  />
                </div>
                
                <div className="form-group full-width">
                  <label className="form-label">Job Description</label>
                  <textarea 
                    className="form-textarea"
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    placeholder="Describe your role and key responsibilities..."
                  />
                </div>
                
                <div className="form-group full-width">
                  <label className="form-label">Key Tasks & Responsibilities</label>
                  <textarea 
                    className="form-textarea"
                    value={exp.tasks}
                    onChange={(e) => updateExperience(index, 'tasks', e.target.value)}
                    placeholder="List main tasks separated by commas..."
                    style={{ minHeight: '80px' }}
                  />
                </div>

                {/* Toxicity Rating */}
                <div className="form-group full-width">
                  <label className="form-label">
                    <i className="fas fa-shield-halved"></i> 
                    Truth Vault - Company Toxicity: {exp.toxicity}/10
                  </label>
                  <input 
                    type="range"
                    min="1"
                    max="10"
                    value={exp.toxicity}
                    onChange={(e) => updateExperience(index, 'toxicity', parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: exp.toxicity <= 3 ? 'var(--success-400)' : exp.toxicity <= 6 ? 'var(--warning-400)' : 'var(--danger-400)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-500)' }}>
                    <span>Great Culture</span>
                    <span>Challenging</span>
                  </div>
                </div>
              </div>

              {/* Day in the Life */}
              <div className="day-life-section">
                <h4 className="day-life-title">
                  <i className="fas fa-sun"></i>
                  A Day in the Life at {exp.company || 'This Company'}
                </h4>
                <div className="timeline-mini">
                  {exp.dayInLife.map((item, timeIndex) => (
                    <div key={timeIndex} className="timeline-mini-item">
                      <span className="timeline-mini-time">{item.time}</span>
                      <input
                        type="text"
                        className="form-input"
                        value={item.activity}
                        onChange={(e) => updateDayInLife(index, timeIndex, e.target.value)}
                        placeholder="What did you typically do?"
                        style={{ padding: 'var(--space-2) var(--space-3)', fontSize: '0.85rem' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="metrics-section">
                <h4 className="metrics-title">
                  <i className="fas fa-chart-line"></i>
                  Impact Metrics
                </h4>
                <div className="metrics-grid">
                  {exp.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex} className="metric-input-card">
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
                        style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'center', color: 'var(--text-400)' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <button className="btn-add" onClick={addExperience}>
            <i className="fas fa-plus"></i> Add Experience
          </button>
        </div>
      );
    };

    // ============================================
    // GENERIC LIST EDITOR
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
        <div className="builder-card">
          <div className="builder-card-header">
            <h3 className="builder-card-title">
              <i className={"fas " + icon}></i>
              {title}
            </h3>
          </div>

          {items.map((item, index) => (
            <div key={item.id} className="experience-card slide-in">
              <div className="experience-card-header">
                <div className="experience-number">{index + 1}</div>
                <button className="btn-icon danger" onClick={() => removeItem(index)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>

              <div className="form-grid">
                {fields.map(field => (
                  <div key={field.key} className={"form-group" + (field.type === 'textarea' ? " full-width" : "")}>
                    <label className="form-label">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        className="form-textarea"
                        value={item[field.key] || ''}
                        onChange={(e) => updateItem(index, field.key, e.target.value)}
                        placeholder={"Enter " + field.label.toLowerCase()}
                        style={{ minHeight: '80px' }}
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-input"
                        value={item[field.key] || ''}
                        onChange={(e) => updateItem(index, field.key, e.target.value)}
                        placeholder={"Enter " + field.label.toLowerCase()}
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
      const photoInputRef = useRef(null);
      const videoInputRef = useRef(null);

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
        <div className="builder-card">
          <div className="builder-card-header">
            <h3 className="builder-card-title">
              <i className="fas fa-image"></i>
              Photos & Videos
            </h3>
          </div>

          {/* Photos */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h4 style={{ color: 'var(--text-200)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <i className="fas fa-camera" style={{ color: 'var(--accent-400)' }}></i> Photos
            </h4>
            <input 
              type="file" 
              ref={photoInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              multiple
              style={{ display: 'none' }}
            />
            <div className="media-grid">
              {photos.map((photo) => (
                <div key={photo.id} className="media-preview-card">
                  <img src={photo.url} alt={photo.name} />
                  <div className="media-preview-overlay">
                    <button 
                      className="btn-icon danger"
                      onClick={() => setPhotos(photos.filter(p => p.id !== photo.id))}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
              <div className="media-upload-card" onClick={() => photoInputRef.current?.click()}>
                <i className="fas fa-plus"></i>
                <span>Add Photo</span>
              </div>
            </div>
          </div>

          {/* Videos */}
          <div>
            <h4 style={{ color: 'var(--text-200)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <i className="fas fa-video" style={{ color: 'var(--ember-400)' }}></i> Videos
            </h4>
            <input 
              type="file" 
              ref={videoInputRef}
              onChange={handleVideoUpload}
              accept="video/*"
              multiple
              style={{ display: 'none' }}
            />
            <div className="media-grid">
              {videos.map((video) => (
                <div key={video.id} className="media-preview-card">
                  <video src={video.url} />
                  <div className="media-preview-overlay">
                    <button 
                      className="btn-icon danger"
                      onClick={() => setVideos(videos.filter(v => v.id !== video.id))}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
              <div className="media-upload-card" onClick={() => videoInputRef.current?.click()}>
                <i className="fas fa-plus"></i>
                <span>Add Video</span>
              </div>
            </div>
          </div>
        </div>
      );
    };

    // ============================================
    // TEMPLATES PAGE
    // ============================================
    const TemplatesPage = ({ profile, setProfile, setView }) => {
      const selectTemplate = (templateId) => {
        setProfile(prev => ({ ...prev, template: templateId }));
      };

      return (
        <section className="template-section" style={{ minHeight: '100vh', paddingTop: '140px' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-badge">
                <i className="fas fa-palette"></i> Customize
              </div>
              <h2 className="section-title">Choose Your Template</h2>
              <p className="section-desc">
                Select a design that matches your professional brand.
              </p>
            </div>

            <div className="template-grid">
              {TEMPLATES.map(template => (
                <div 
                  key={template.id}
                  className={"template-card" + (profile.template === template.id ? " selected" : "")}
                  onClick={() => selectTemplate(template.id)}
                >
                  {template.popular && <div className="template-badge">Popular</div>}
                  <div className="template-preview">
                    <div className="template-preview-mini">
                      <div className="template-mini-header"></div>
                      <div className="template-mini-body">
                        <div className="template-mini-sidebar"></div>
                        <div className="template-mini-content"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="template-name">{template.name}</h3>
                  <p className="template-desc">{template.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
              <button className="btn btn-ember btn-lg" onClick={() => setView(VIEWS.PREVIEW)}>
                <i className="fas fa-eye"></i> Preview Your Profile
              </button>
            </div>
          </div>
        </section>
      );
    };

    // ============================================
    // PREVIEW PAGE
    // ============================================
    const PreviewPage = ({ profile, setView }) => {
      const [device, setDevice] = useState('desktop');

      return (
        <section className="preview-section" style={{ minHeight: '100vh', paddingTop: '120px' }}>
          <div className="container">
            <div className="section-header" style={{ marginBottom: 'var(--space-6)' }}>
              <h2 className="section-title">Live Preview</h2>
            </div>

            <div className="preview-frame">
              <div className="preview-toolbar">
                <div className="preview-device-toggle">
                  <button 
                    className={"device-btn" + (device === 'desktop' ? " active" : "")}
                    onClick={() => setDevice('desktop')}
                  >
                    <i className="fas fa-desktop"></i> Desktop
                  </button>
                  <button 
                    className={"device-btn" + (device === 'tablet' ? " active" : "")}
                    onClick={() => setDevice('tablet')}
                  >
                    <i className="fas fa-tablet-alt"></i> Tablet
                  </button>
                  <button 
                    className={"device-btn" + (device === 'mobile' ? " active" : "")}
                    onClick={() => setDevice('mobile')}
                  >
                    <i className="fas fa-mobile-alt"></i> Mobile
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => setView(VIEWS.BUILDER)}>
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button className="btn btn-primary btn-sm">
                    <i className="fas fa-share"></i> Publish
                  </button>
                </div>
              </div>

              <div className="preview-content" style={{
                maxWidth: device === 'mobile' ? '375px' : device === 'tablet' ? '768px' : '100%',
                margin: '0 auto',
                transition: 'max-width 0.3s ease'
              }}>
                {/* Profile Header */}
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    margin: '0 auto var(--space-5)',
                    borderRadius: '50%',
                    background: 'var(--gradient-hero)',
                    padding: '4px',
                    boxShadow: 'var(--shadow-glow-violet)'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: 'var(--void-700)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem'
                    }}>
                      {profile.basics.name ? profile.basics.name.split(' ').map(n => n[0]).join('') : '👤'}
                    </div>
                  </div>
                  <h2 style={{ fontSize: '2rem', color: 'var(--text-100)', marginBottom: 'var(--space-2)' }}>
                    {profile.basics.name || 'Your Name'}
                  </h2>
                  <p style={{ color: 'var(--accent-400)', fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                    {profile.basics.title || 'Your Title'}
                  </p>
                  <p style={{ color: 'var(--text-400)', maxWidth: '500px', margin: '0 auto' }}>
                    {profile.basics.tagline || 'Your professional tagline'}
                  </p>
                </div>

                {/* Timeline */}
                {profile.experience.length > 0 && (
                  <div className="timeline">
                    {profile.experience.map((exp, index) => (
                      <div key={exp.id} className="timeline-entry glass">
                        <div className="timeline-node"></div>
                        <h3 className="timeline-company">{exp.company}</h3>
                        <p className="timeline-role">{exp.role}</p>
                        <span className="timeline-dates">
                          {exp.startDate} - {exp.endDate}
                        </span>
                        <p className="timeline-description">{exp.description}</p>
                        
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
                      </div>
                    ))}
                  </div>
                )}

                {profile.experience.length === 0 && (
                  <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--text-500)' }}>
                    <i className="fas fa-briefcase" style={{ fontSize: '3rem', marginBottom: 'var(--space-4)', opacity: 0.5 }}></i>
                    <p>No experience added yet. Go back and add your work history!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      );
    };

    // ============================================
    // FOOTER
    // ============================================
    const Footer = () => (
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-brand-icon">⚡</div>
              Webume
            </div>
            <div className="footer-links">
              <a href="#" className="footer-link">About</a>
              <a href="#" className="footer-link">Privacy</a>
              <a href="#" className="footer-link">Terms</a>
              <a href="#" className="footer-link">Contact</a>
            </div>
            <div className="footer-copy">
              © 2026 Webume. The future of professional profiles.
            </div>
          </div>
        </div>
      </footer>
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
