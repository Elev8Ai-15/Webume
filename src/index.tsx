import { Hono } from 'hono'

const app = new Hono()

// Main Webume Application - The Future of Professional Profiles
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Webume | The Future of Professional Profiles</title>
  <meta name="description" content="Transform your resume into a living, breathing professional empire. Upload once, own forever.">
  <meta property="og:title" content="Webume - Your Employee-for-Hire Empire">
  <meta property="og:description" content="Not just a resume. A revolution in professional profiles.">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
  
  <!-- React 18 -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  
  <!-- PDF.js for resume parsing -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <style>
    :root {
      --bg-void: #030308;
      --bg-deep: #0a0a12;
      --bg-surface: #12121c;
      --bg-elevated: #1a1a28;
      --bg-glass: rgba(255, 255, 255, 0.03);
      --bg-glass-heavy: rgba(255, 255, 255, 0.06);
      --text-white: #ffffff;
      --text-primary: #e8e8f0;
      --text-secondary: #9898a8;
      --text-muted: #5a5a6e;
      --accent-primary: #6366f1;
      --accent-secondary: #8b5cf6;
      --accent-tertiary: #a855f7;
      --accent-cyan: #06b6d4;
      --accent-emerald: #10b981;
      --accent-amber: #f59e0b;
      --accent-rose: #f43f5e;
      --gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
      --gradient-glow: linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.4) 100%);
      --gradient-mesh: radial-gradient(at 40% 20%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
                       radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.1) 0px, transparent 50%),
                       radial-gradient(at 0% 50%, rgba(6, 182, 212, 0.1) 0px, transparent 50%),
                       radial-gradient(at 80% 50%, rgba(168, 85, 247, 0.1) 0px, transparent 50%),
                       radial-gradient(at 0% 100%, rgba(16, 185, 129, 0.1) 0px, transparent 50%);
      --border-glass: rgba(255, 255, 255, 0.08);
      --border-glow: rgba(99, 102, 241, 0.3);
      --shadow-glow: 0 0 60px rgba(99, 102, 241, 0.15);
      --shadow-card: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --radius-xl: 24px;
      --radius-2xl: 32px;
    }
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    html { scroll-behavior: smooth; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-void);
      color: var(--text-primary);
      line-height: 1.6;
      overflow-x: hidden;
      min-height: 100vh;
    }
    
    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--accent-primary); border-radius: 3px; }
    
    /* Selection */
    ::selection { background: var(--accent-primary); color: white; }
    
    /* Typography */
    h1, h2, h3, h4, h5, h6 { 
      font-family: 'Space Grotesk', sans-serif; 
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    
    /* Glassmorphism Base */
    .glass {
      background: var(--bg-glass);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--border-glass);
    }
    
    .glass-heavy {
      background: var(--bg-glass-heavy);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
      border: 1px solid var(--border-glass);
    }
    
    /* Animated Background */
    .bg-mesh {
      position: fixed;
      inset: 0;
      background: var(--gradient-mesh);
      z-index: -1;
      animation: meshMove 30s ease-in-out infinite;
    }
    
    @keyframes meshMove {
      0%, 100% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(3deg); }
    }
    
    /* Grid Lines Background */
    .grid-bg {
      position: fixed;
      inset: 0;
      background-image: 
        linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      z-index: -1;
    }
    
    /* Floating Orbs */
    .orb {
      position: fixed;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.5;
      animation: orbFloat 20s ease-in-out infinite;
      pointer-events: none;
      z-index: -1;
    }
    
    .orb-1 { width: 600px; height: 600px; background: var(--accent-primary); top: -200px; left: -200px; }
    .orb-2 { width: 400px; height: 400px; background: var(--accent-secondary); bottom: -100px; right: -100px; animation-delay: -10s; }
    .orb-3 { width: 300px; height: 300px; background: var(--accent-cyan); top: 50%; left: 50%; animation-delay: -5s; }
    
    @keyframes orbFloat {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -30px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
    }
    
    /* Container */
    .container { max-width: 1400px; margin: 0 auto; padding: 0 24px; }
    
    /* Navigation */
    .nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 16px 0;
    }
    
    .nav-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 24px;
      border-radius: var(--radius-xl);
    }
    
    .nav-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-white);
    }
    
    .nav-logo-icon {
      width: 40px;
      height: 40px;
      background: var(--gradient-primary);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }
    
    .nav-links { display: flex; gap: 8px; align-items: center; }
    
    .nav-link {
      padding: 10px 20px;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      border: 1px solid transparent;
    }
    
    .nav-link:hover { 
      color: var(--text-white); 
      background: var(--bg-glass);
      border-color: var(--border-glass);
    }
    
    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 28px;
      border-radius: var(--radius-lg);
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      text-decoration: none;
      position: relative;
      overflow: hidden;
    }
    
    .btn-primary {
      background: var(--gradient-primary);
      color: white;
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
    }
    
    .btn-primary:hover { 
      transform: translateY(-2px); 
      box-shadow: 0 8px 30px rgba(99, 102, 241, 0.5);
    }
    
    .btn-primary::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%);
    }
    
    .btn-secondary {
      background: var(--bg-glass-heavy);
      color: var(--text-white);
      border: 1px solid var(--border-glass);
      backdrop-filter: blur(20px);
    }
    
    .btn-secondary:hover { 
      background: var(--bg-elevated);
      border-color: var(--accent-primary);
    }
    
    .btn-ghost {
      background: transparent;
      color: var(--text-secondary);
      border: 1px solid var(--border-glass);
    }
    
    .btn-ghost:hover { 
      color: var(--text-white);
      border-color: var(--accent-primary);
      background: var(--bg-glass);
    }
    
    .btn-lg { padding: 18px 36px; font-size: 1.1rem; }
    .btn-sm { padding: 10px 20px; font-size: 0.85rem; }
    
    /* Hero Section */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 120px 0 80px;
      position: relative;
    }
    
    .hero-content {
      text-align: center;
      max-width: 900px;
      margin: 0 auto;
    }
    
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 20px;
      background: var(--bg-glass);
      border: 1px solid var(--border-glass);
      border-radius: 50px;
      font-size: 0.85rem;
      color: var(--accent-cyan);
      font-weight: 500;
      margin-bottom: 32px;
      backdrop-filter: blur(20px);
    }
    
    .hero-badge i { font-size: 0.75rem; }
    
    .hero-title {
      font-size: clamp(3rem, 8vw, 5.5rem);
      line-height: 1.05;
      margin-bottom: 24px;
      background: linear-gradient(135deg, var(--text-white) 0%, var(--text-secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .hero-title .highlight {
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .hero-subtitle {
      font-size: 1.35rem;
      color: var(--text-secondary);
      margin-bottom: 48px;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.7;
    }
    
    .hero-cta {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 64px;
    }
    
    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 48px;
      flex-wrap: wrap;
    }
    
    .hero-stat {
      text-align: center;
    }
    
    .hero-stat-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 2.5rem;
      font-weight: 700;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .hero-stat-label {
      font-size: 0.9rem;
      color: var(--text-muted);
      margin-top: 4px;
    }
    
    /* Upload Section */
    .upload-section {
      padding: 100px 0;
      position: relative;
    }
    
    .upload-card {
      max-width: 800px;
      margin: 0 auto;
      padding: 48px;
      border-radius: var(--radius-2xl);
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    .upload-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--gradient-glow);
      opacity: 0.1;
      z-index: -1;
    }
    
    .upload-zone {
      border: 2px dashed var(--border-glass);
      border-radius: var(--radius-xl);
      padding: 64px 48px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }
    
    .upload-zone:hover {
      border-color: var(--accent-primary);
      background: var(--bg-glass);
    }
    
    .upload-zone.dragging {
      border-color: var(--accent-primary);
      background: rgba(99, 102, 241, 0.1);
      transform: scale(1.02);
    }
    
    .upload-icon {
      width: 80px;
      height: 80px;
      background: var(--gradient-primary);
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      font-size: 2rem;
      color: white;
    }
    
    .upload-title {
      font-size: 1.5rem;
      margin-bottom: 12px;
      color: var(--text-white);
    }
    
    .upload-desc {
      color: var(--text-secondary);
      margin-bottom: 24px;
    }
    
    .upload-formats {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .format-badge {
      padding: 6px 14px;
      background: var(--bg-elevated);
      border-radius: 50px;
      font-size: 0.8rem;
      color: var(--text-muted);
      font-family: 'JetBrains Mono', monospace;
    }
    
    /* Features Grid */
    .features-section {
      padding: 100px 0;
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 64px;
    }
    
    .section-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 20px;
      background: var(--bg-glass);
      border: 1px solid var(--border-glass);
      border-radius: 50px;
      font-size: 0.85rem;
      color: var(--accent-primary);
      font-weight: 600;
      margin-bottom: 20px;
      backdrop-filter: blur(20px);
    }
    
    .section-title {
      font-size: clamp(2rem, 5vw, 3rem);
      margin-bottom: 16px;
    }
    
    .section-desc {
      font-size: 1.15rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
    }
    
    .feature-card {
      padding: 32px;
      border-radius: var(--radius-xl);
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;
    }
    
    .feature-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--gradient-primary);
      opacity: 0;
      transition: opacity 0.4s ease;
      z-index: -1;
    }
    
    .feature-card:hover {
      transform: translateY(-8px);
      border-color: var(--accent-primary);
    }
    
    .feature-card:hover::before { opacity: 0.05; }
    
    .feature-icon {
      width: 56px;
      height: 56px;
      background: var(--bg-elevated);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      font-size: 1.5rem;
      transition: all 0.3s ease;
    }
    
    .feature-card:hover .feature-icon {
      background: var(--gradient-primary);
      color: white;
    }
    
    .feature-title {
      font-size: 1.25rem;
      margin-bottom: 12px;
      color: var(--text-white);
    }
    
    .feature-desc {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.7;
    }
    
    /* Profile Builder */
    .builder-section {
      padding: 100px 0;
      background: var(--bg-deep);
      position: relative;
    }
    
    .builder-container {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 32px;
      min-height: 80vh;
    }
    
    /* Sidebar */
    .builder-sidebar {
      padding: 24px;
      border-radius: var(--radius-xl);
      height: fit-content;
      position: sticky;
      top: 100px;
    }
    
    .sidebar-section {
      margin-bottom: 32px;
    }
    
    .sidebar-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      margin-bottom: 16px;
    }
    
    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
    }
    
    .sidebar-link:hover { 
      background: var(--bg-glass);
      color: var(--text-white);
    }
    
    .sidebar-link.active {
      background: var(--gradient-primary);
      color: white;
    }
    
    .sidebar-link i { width: 20px; text-align: center; }
    
    /* Builder Main */
    .builder-main {
      padding: 32px;
      border-radius: var(--radius-xl);
      min-height: 600px;
    }
    
    .builder-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .builder-title {
      font-size: 1.75rem;
    }
    
    .builder-actions {
      display: flex;
      gap: 12px;
    }
    
    /* Form Elements */
    .form-group {
      margin-bottom: 24px;
    }
    
    .form-label {
      display: block;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }
    
    .form-input, .form-textarea, .form-select {
      width: 100%;
      padding: 14px 18px;
      background: var(--bg-elevated);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      color: var(--text-white);
      font-size: 1rem;
      font-family: inherit;
      transition: all 0.2s ease;
    }
    
    .form-input:focus, .form-textarea:focus, .form-select:focus {
      outline: none;
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    
    .form-textarea { min-height: 120px; resize: vertical; }
    
    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }
    
    /* Experience Cards */
    .experience-card {
      background: var(--bg-elevated);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      padding: 24px;
      margin-bottom: 16px;
      transition: all 0.3s ease;
    }
    
    .experience-card:hover {
      border-color: var(--accent-primary);
    }
    
    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    
    .experience-company {
      font-size: 1.25rem;
      color: var(--text-white);
      margin-bottom: 4px;
    }
    
    .experience-role {
      color: var(--accent-primary);
      font-weight: 600;
    }
    
    .experience-dates {
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    
    .experience-actions {
      display: flex;
      gap: 8px;
    }
    
    .exp-action-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-glass);
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .exp-action-btn:hover {
      color: var(--text-white);
      border-color: var(--accent-primary);
      background: var(--bg-glass);
    }
    
    /* Day in the Life */
    .day-life-section {
      background: var(--bg-surface);
      border-radius: var(--radius-lg);
      padding: 24px;
      margin-top: 16px;
    }
    
    .day-life-title {
      font-size: 1rem;
      color: var(--accent-cyan);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .timeline-mini {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .timeline-item-mini {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }
    
    .timeline-time {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      color: var(--accent-primary);
      min-width: 60px;
    }
    
    .timeline-content-mini {
      flex: 1;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }
    
    /* Media Upload Grid */
    .media-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    
    .media-item {
      aspect-ratio: 1;
      background: var(--bg-elevated);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      overflow: hidden;
      position: relative;
    }
    
    .media-item:hover {
      border-color: var(--accent-primary);
    }
    
    .media-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .media-add {
      flex-direction: column;
      gap: 8px;
      color: var(--text-muted);
      border-style: dashed;
    }
    
    .media-add:hover {
      color: var(--accent-primary);
      background: var(--bg-glass);
    }
    
    /* Metrics Section */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    
    .metric-input-card {
      background: var(--bg-elevated);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      padding: 20px;
    }
    
    .metric-input-card input {
      width: 100%;
      background: transparent;
      border: none;
      font-size: 2rem;
      font-weight: 700;
      color: var(--accent-primary);
      font-family: 'Space Grotesk', sans-serif;
      text-align: center;
      outline: none;
    }
    
    .metric-input-card input::placeholder {
      color: var(--text-muted);
    }
    
    .metric-label-input {
      width: 100%;
      background: transparent;
      border: none;
      font-size: 0.85rem;
      color: var(--text-secondary);
      text-align: center;
      outline: none;
      margin-top: 8px;
    }
    
    /* Profile Preview */
    .profile-preview {
      padding: 100px 0;
    }
    
    .preview-frame {
      background: var(--bg-deep);
      border-radius: var(--radius-2xl);
      overflow: hidden;
      box-shadow: var(--shadow-card);
    }
    
    .preview-header {
      padding: 32px;
      background: var(--gradient-primary);
      position: relative;
      overflow: hidden;
    }
    
    .preview-header::before {
      content: '';
      position: absolute;
      inset: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    
    .preview-avatar {
      width: 120px;
      height: 120px;
      background: var(--bg-glass-heavy);
      border: 4px solid rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      margin-bottom: 20px;
      backdrop-filter: blur(10px);
    }
    
    .preview-name {
      font-size: 2.5rem;
      color: white;
      margin-bottom: 8px;
    }
    
    .preview-tagline {
      color: rgba(255,255,255,0.8);
      font-size: 1.2rem;
    }
    
    .preview-body {
      padding: 32px;
    }
    
    /* Achievements Section */
    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }
    
    .achievement-card {
      background: var(--bg-elevated);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-lg);
      padding: 20px;
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }
    
    .achievement-icon {
      width: 48px;
      height: 48px;
      background: var(--gradient-primary);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: white;
      flex-shrink: 0;
    }
    
    .achievement-title {
      font-weight: 600;
      color: var(--text-white);
      margin-bottom: 4px;
    }
    
    .achievement-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
    }
    
    /* Chat Widget */
    .chat-trigger {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 64px;
      height: 64px;
      background: var(--gradient-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
      z-index: 1000;
      transition: all 0.3s ease;
      border: none;
      color: white;
      font-size: 24px;
    }
    
    .chat-trigger:hover { transform: scale(1.1); }
    
    .chat-window {
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 400px;
      height: 550px;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-card);
      display: flex;
      flex-direction: column;
      z-index: 1000;
      animation: slideUp 0.3s ease;
      overflow: hidden;
    }
    
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .chat-header {
      padding: 20px;
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .chat-avatar {
      width: 44px;
      height: 44px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }
    
    .chat-info h4 { color: white; font-size: 1rem; margin-bottom: 2px; }
    .chat-info span { color: rgba(255,255,255,0.7); font-size: 0.8rem; }
    
    .chat-close {
      margin-left: auto;
      width: 32px;
      height: 32px;
      background: rgba(255,255,255,0.1);
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
    }
    
    .chat-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      background: var(--bg-surface);
    }
    
    .chat-message {
      margin-bottom: 16px;
      max-width: 85%;
    }
    
    .chat-message.bot { margin-right: auto; }
    .chat-message.user { margin-left: auto; }
    
    .chat-bubble {
      padding: 12px 16px;
      border-radius: var(--radius-lg);
      font-size: 0.95rem;
      line-height: 1.5;
    }
    
    .chat-message.bot .chat-bubble {
      background: var(--bg-elevated);
      color: var(--text-primary);
      border-bottom-left-radius: 4px;
    }
    
    .chat-message.user .chat-bubble {
      background: var(--gradient-primary);
      color: white;
      border-bottom-right-radius: 4px;
    }
    
    .chat-input-area {
      padding: 16px;
      background: var(--bg-elevated);
      display: flex;
      gap: 12px;
    }
    
    .chat-input {
      flex: 1;
      padding: 12px 16px;
      background: var(--bg-surface);
      border: 1px solid var(--border-glass);
      border-radius: 50px;
      color: var(--text-white);
      font-size: 0.95rem;
      outline: none;
    }
    
    .chat-send {
      width: 44px;
      height: 44px;
      background: var(--gradient-primary);
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
    }
    
    /* Footer */
    .footer {
      padding: 80px 0 40px;
      border-top: 1px solid var(--border-glass);
    }
    
    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 48px;
      margin-bottom: 48px;
    }
    
    .footer-brand {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .footer-desc {
      color: var(--text-secondary);
      margin-bottom: 24px;
      max-width: 300px;
    }
    
    .footer-social {
      display: flex;
      gap: 12px;
    }
    
    .social-link {
      width: 40px;
      height: 40px;
      background: var(--bg-glass);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.2s ease;
    }
    
    .social-link:hover {
      background: var(--gradient-primary);
      border-color: var(--accent-primary);
      color: white;
    }
    
    .footer-title {
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 20px;
      color: var(--text-white);
    }
    
    .footer-links {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .footer-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s;
    }
    
    .footer-link:hover { color: var(--accent-primary); }
    
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 24px;
      border-top: 1px solid var(--border-glass);
      color: var(--text-muted);
      font-size: 0.85rem;
    }
    
    /* Templates */
    .template-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }
    
    .template-card {
      background: var(--bg-elevated);
      border: 2px solid var(--border-glass);
      border-radius: var(--radius-xl);
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .template-card:hover {
      border-color: var(--accent-primary);
      transform: translateY(-4px);
    }
    
    .template-card.selected {
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
    }
    
    .template-preview {
      aspect-ratio: 4/3;
      background: var(--bg-surface);
      position: relative;
      overflow: hidden;
    }
    
    .template-info {
      padding: 20px;
    }
    
    .template-name {
      font-weight: 600;
      color: var(--text-white);
      margin-bottom: 4px;
    }
    
    .template-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    
    /* Responsive */
    @media (max-width: 1024px) {
      .builder-container {
        grid-template-columns: 1fr;
      }
      
      .builder-sidebar {
        position: relative;
        top: 0;
      }
      
      .footer-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    
    @media (max-width: 768px) {
      .nav-links { display: none; }
      .hero-title { font-size: 2.5rem; }
      .hero-stats { gap: 24px; }
      .hero-stat-value { font-size: 2rem; }
      .upload-card { padding: 24px; }
      .upload-zone { padding: 40px 24px; }
      .chat-window { width: calc(100vw - 48px); height: 70vh; }
      .footer-grid { grid-template-columns: 1fr; }
      .footer-bottom { flex-direction: column; gap: 16px; text-align: center; }
    }
    
    /* Animations */
    .fade-in {
      animation: fadeIn 0.6s ease forwards;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .stagger-1 { animation-delay: 0.1s; }
    .stagger-2 { animation-delay: 0.2s; }
    .stagger-3 { animation-delay: 0.3s; }
    .stagger-4 { animation-delay: 0.4s; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect, useRef } = React;

    // ============================================
    // INITIAL STATE
    // ============================================
    const initialProfile = {
      basics: {
        name: '',
        title: '',
        tagline: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: '',
        avatar: null
      },
      experiences: [],
      achievements: [],
      awards: [],
      reviews: [],
      payHistory: [],
      events: [],
      projects: [],
      media: { photos: [], videos: [] },
      template: 'executive'
    };

    const templates = [
      { id: 'executive', name: 'Executive', desc: 'Clean, professional, leadership-focused' },
      { id: 'creative', name: 'Creative', desc: 'Bold colors, unique layouts' },
      { id: 'tech', name: 'Tech Pioneer', desc: 'Modern, data-driven, metrics-heavy' },
      { id: 'minimal', name: 'Minimal', desc: 'Simple, elegant, content-first' }
    ];

    // ============================================
    // MAIN APP
    // ============================================
    const App = () => {
      const [view, setView] = useState('landing'); // landing, builder, preview
      const [profile, setProfile] = useState(initialProfile);
      const [activeSection, setActiveSection] = useState('basics');
      const [chatOpen, setChatOpen] = useState(false);
      const [uploadProgress, setUploadProgress] = useState(0);
      const [isAnalyzing, setIsAnalyzing] = useState(false);

      // Load saved profile
      useEffect(() => {
        const saved = localStorage.getItem('webumeProfile');
        if (saved) {
          try {
            setProfile(JSON.parse(saved));
          } catch (e) {}
        }
      }, []);

      // Save profile
      useEffect(() => {
        localStorage.setItem('webumeProfile', JSON.stringify(profile));
      }, [profile]);

      const handleResumeUpload = async (file) => {
        setIsAnalyzing(true);
        setUploadProgress(0);
        
        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        // Simulate parsing (in real app, this would be server-side or use PDF.js)
        setTimeout(() => {
          clearInterval(progressInterval);
          setUploadProgress(100);
          
          // Mock parsed data
          const parsedProfile = {
            ...initialProfile,
            basics: {
              name: 'Alex Thompson',
              title: 'Senior Product Manager',
              tagline: 'Building products that matter. 10+ years driving innovation.',
              email: 'alex@example.com',
              phone: '+1 (555) 123-4567',
              location: 'San Francisco, CA',
              linkedin: 'linkedin.com/in/alexthompson',
              website: 'alexthompson.dev',
              avatar: null
            },
            experiences: [
              {
                id: 1,
                company: 'TechCorp Global',
                role: 'Senior Product Manager',
                startDate: '2020-03',
                endDate: 'Present',
                description: 'Led product strategy for enterprise SaaS platform serving 2M+ users. Drove 40% revenue growth through data-driven feature prioritization.',
                tasks: [
                  'Define and execute product roadmap aligned with business objectives',
                  'Lead cross-functional team of 15 engineers, designers, and analysts',
                  'Conduct user research and translate insights into product requirements',
                  'Present quarterly business reviews to C-suite executives'
                ],
                dayInLife: [
                  { time: '8:00 AM', activity: 'Review metrics dashboard and overnight alerts' },
                  { time: '9:00 AM', activity: 'Daily standup with engineering team' },
                  { time: '10:00 AM', activity: 'Customer feedback analysis session' },
                  { time: '12:00 PM', activity: 'Cross-team sync on Q3 initiatives' },
                  { time: '2:00 PM', activity: 'Sprint planning and backlog refinement' },
                  { time: '4:00 PM', activity: 'Stakeholder presentations and updates' }
                ],
                metrics: [
                  { value: '+40%', label: 'Revenue Growth' },
                  { value: '2M+', label: 'Active Users' },
                  { value: '15', label: 'Team Size' },
                  { value: '98%', label: 'Retention Rate' }
                ]
              },
              {
                id: 2,
                company: 'StartupXYZ',
                role: 'Product Manager',
                startDate: '2017-06',
                endDate: '2020-02',
                description: 'First PM hire. Built product function from ground up. Took product from MVP to Series B.',
                tasks: [
                  'Established product development processes and best practices',
                  'Hired and mentored team of 5 associate product managers',
                  'Launched 3 major product lines generating $5M ARR'
                ],
                dayInLife: [
                  { time: '7:30 AM', activity: 'Early morning deep work on strategy docs' },
                  { time: '10:00 AM', activity: 'Customer discovery calls' },
                  { time: '1:00 PM', activity: 'Design review sessions' },
                  { time: '3:00 PM', activity: 'Engineering collaboration' }
                ],
                metrics: [
                  { value: '$5M', label: 'ARR Generated' },
                  { value: '3', label: 'Product Lines' },
                  { value: '5', label: 'PMs Hired' }
                ]
              }
            ],
            achievements: [
              { id: 1, icon: 'fa-trophy', title: 'Product of the Year', desc: 'TechCrunch Disrupt 2022' },
              { id: 2, icon: 'fa-star', title: 'Top 40 Under 40', desc: 'Business Insider 2021' },
              { id: 3, icon: 'fa-award', title: 'Innovation Award', desc: 'Company-wide recognition' }
            ],
            awards: [
              { id: 1, title: 'Best Product Launch', organization: 'Product Hunt', year: '2023' },
              { id: 2, title: 'Excellence in Leadership', organization: 'TechCorp', year: '2022' }
            ],
            reviews: [
              { id: 1, text: 'Alex transformed our product culture. Exceptional strategic thinker.', author: 'Sarah Chen', role: 'CEO, TechCorp', rating: 5 },
              { id: 2, text: 'Best PM I have worked with. Data-driven but deeply empathetic.', author: 'Marcus Johnson', role: 'Engineering Lead', rating: 5 }
            ]
          };
          
          setProfile(parsedProfile);
          setIsAnalyzing(false);
          setView('builder');
        }, 2500);
      };

      return (
        <div>
          {/* Background Effects */}
          <div className="bg-mesh"></div>
          <div className="grid-bg"></div>
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>

          {/* Navigation */}
          <Navigation view={view} setView={setView} />

          {/* Views */}
          {view === 'landing' && (
            <LandingPage 
              onUpload={handleResumeUpload}
              uploadProgress={uploadProgress}
              isAnalyzing={isAnalyzing}
              setView={setView}
            />
          )}

          {view === 'builder' && (
            <BuilderPage 
              profile={profile}
              setProfile={setProfile}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              setView={setView}
            />
          )}

          {view === 'preview' && (
            <PreviewPage 
              profile={profile}
              setView={setView}
            />
          )}

          {/* Hunter Agent Chat */}
          <HunterChat 
            isOpen={chatOpen}
            onToggle={() => setChatOpen(!chatOpen)}
            profile={profile}
          />
        </div>
      );
    };

    // ============================================
    // NAVIGATION
    // ============================================
    const Navigation = ({ view, setView }) => (
      <nav className="nav">
        <div className="container">
          <div className="nav-inner glass">
            <div className="nav-logo">
              <div className="nav-logo-icon">⚡</div>
              Webume
            </div>
            <div className="nav-links">
              <a href="#features" className="nav-link">Features</a>
              <a href="#templates" className="nav-link">Templates</a>
              <a href="#pricing" className="nav-link">Pricing</a>
              {view !== 'landing' && (
                <button className="nav-link" onClick={() => setView('landing')}>Home</button>
              )}
              <button className="btn btn-primary btn-sm" onClick={() => setView('builder')}>
                <i className="fas fa-rocket"></i> Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>
    );

    // ============================================
    // LANDING PAGE
    // ============================================
    const LandingPage = ({ onUpload, uploadProgress, isAnalyzing, setView }) => {
      const [dragging, setDragging] = useState(false);
      const fileInputRef = useRef(null);

      const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) onUpload(file);
      };

      const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) onUpload(file);
      };

      return (
        <>
          {/* Hero Section */}
          <section className="hero">
            <div className="container hero-content">
              <div className="hero-badge fade-in">
                <i className="fas fa-bolt"></i>
                The Future of Professional Profiles
              </div>
              
              <h1 className="hero-title fade-in stagger-1">
                Your <span className="highlight">Employee-for-Hire</span> Empire Starts Here
              </h1>
              
              <p className="hero-subtitle fade-in stagger-2">
                Transform your resume into a living, breathing professional profile. 
                Upload once, customize endlessly, own forever. This isn't just a resume — 
                it's your <strong>Webume</strong>.
              </p>
              
              <div className="hero-cta fade-in stagger-3">
                <button className="btn btn-primary btn-lg" onClick={() => fileInputRef.current?.click()}>
                  <i className="fas fa-upload"></i> Upload Your Resume
                </button>
                <button className="btn btn-secondary btn-lg" onClick={() => setView('builder')}>
                  <i className="fas fa-wand-magic-sparkles"></i> Start from Scratch
                </button>
              </div>
              
              <div className="hero-stats fade-in stagger-4">
                <div className="hero-stat">
                  <div className="hero-stat-value">50K+</div>
                  <div className="hero-stat-label">Profiles Created</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-value">94%</div>
                  <div className="hero-stat-label">Interview Rate</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-value">2.5x</div>
                  <div className="hero-stat-label">Faster Hiring</div>
                </div>
              </div>
            </div>
          </section>

          {/* Upload Section */}
          <section className="upload-section" id="upload">
            <div className="container">
              <div className="upload-card glass-heavy">
                {isAnalyzing ? (
                  <div style={{ padding: '40px' }}>
                    <div className="upload-icon" style={{ animation: 'pulse 2s infinite' }}>
                      <i className="fas fa-brain"></i>
                    </div>
                    <h3 className="upload-title">Analyzing Your Resume...</h3>
                    <p className="upload-desc">Our AI is extracting and organizing your experience</p>
                    <div style={{ 
                      height: '8px', 
                      background: 'var(--bg-elevated)', 
                      borderRadius: '4px',
                      overflow: 'hidden',
                      maxWidth: '400px',
                      margin: '24px auto'
                    }}>
                      <div style={{
                        height: '100%',
                        width: uploadProgress + '%',
                        background: 'var(--gradient-primary)',
                        transition: 'width 0.3s ease',
                        borderRadius: '4px'
                      }}></div>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {uploadProgress < 30 && 'Reading document...'}
                      {uploadProgress >= 30 && uploadProgress < 60 && 'Extracting experience...'}
                      {uploadProgress >= 60 && uploadProgress < 90 && 'Building your timeline...'}
                      {uploadProgress >= 90 && 'Almost there...'}
                    </p>
                  </div>
                ) : (
                  <div 
                    className={"upload-zone" + (dragging ? " dragging" : "")}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                    <div className="upload-icon">
                      <i className="fas fa-cloud-arrow-up"></i>
                    </div>
                    <h3 className="upload-title">Drop your resume here</h3>
                    <p className="upload-desc">or click to browse your files</p>
                    <div className="upload-formats">
                      <span className="format-badge">.PDF</span>
                      <span className="format-badge">.DOC</span>
                      <span className="format-badge">.DOCX</span>
                      <span className="format-badge">.TXT</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="features-section" id="features">
            <div className="container">
              <div className="section-header">
                <div className="section-badge">
                  <i className="fas fa-sparkles"></i> Features
                </div>
                <h2 className="section-title">Everything Your Resume Should Have Been</h2>
                <p className="section-desc">
                  Not limitations. Possibilities. Build the professional profile you deserve.
                </p>
              </div>

              <div className="features-grid">
                {[
                  { icon: 'fa-brain', title: 'AI-Powered Analysis', desc: 'Upload your resume and watch our AI transform it into a structured, chronological masterpiece.' },
                  { icon: 'fa-clock', title: 'Day in the Life', desc: 'Show recruiters what you actually do. Real schedules, real tasks, real impact.' },
                  { icon: 'fa-photo-video', title: 'Rich Media', desc: 'Photos, videos, project demos. Prove your work, do not just describe it.' },
                  { icon: 'fa-chart-line', title: 'Metrics Dashboard', desc: 'Quantify your impact. Revenue grown, costs saved, teams built.' },
                  { icon: 'fa-users', title: 'Colleague Validations', desc: 'Verified endorsements from people who worked with you.' },
                  { icon: 'fa-trophy', title: 'Achievements Showcase', desc: 'Awards, certifications, milestones — all in one place.' },
                  { icon: 'fa-shield-halved', title: 'Truth Vault', desc: 'Anonymous company ratings. Know where you are going before you go.' },
                  { icon: 'fa-robot', title: 'AI Headhunter', desc: 'Your personal agent that sells you 24/7 to recruiters.' }
                ].map((feature, i) => (
                  <div key={i} className="feature-card glass">
                    <div className="feature-icon">
                      <i className={"fas " + feature.icon}></i>
                    </div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-desc">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Templates Section */}
          <section className="features-section" id="templates" style={{ background: 'var(--bg-deep)' }}>
            <div className="container">
              <div className="section-header">
                <div className="section-badge">
                  <i className="fas fa-palette"></i> Templates
                </div>
                <h2 className="section-title">Start With a Vision</h2>
                <p className="section-desc">
                  Choose your template, then customize every detail to match your brand.
                </p>
              </div>

              <div className="template-grid">
                {templates.map(template => (
                  <div key={template.id} className="template-card">
                    <div className="template-preview" style={{
                      background: template.id === 'executive' ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' :
                                 template.id === 'creative' ? 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)' :
                                 template.id === 'tech' ? 'linear-gradient(135deg, #00d2d3 0%, #54a0ff 100%)' :
                                 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                    }}>
                      <div style={{ 
                        position: 'absolute', 
                        inset: '20px', 
                        background: 'rgba(255,255,255,0.1)', 
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '3rem'
                      }}>
                        {template.id === 'executive' && '👔'}
                        {template.id === 'creative' && '🎨'}
                        {template.id === 'tech' && '💻'}
                        {template.id === 'minimal' && '✨'}
                      </div>
                    </div>
                    <div className="template-info">
                      <div className="template-name">{template.name}</div>
                      <div className="template-desc">{template.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="features-section">
            <div className="container">
              <div className="upload-card glass-heavy" style={{ textAlign: 'center', padding: '64px' }}>
                <h2 className="section-title" style={{ marginBottom: '16px' }}>
                  Ready to Build Your Empire?
                </h2>
                <p className="section-desc" style={{ marginBottom: '32px' }}>
                  Join 50,000+ professionals who ditched the resume and built their Webume.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary btn-lg" onClick={() => fileInputRef.current?.click()}>
                    <i className="fas fa-upload"></i> Upload Resume
                  </button>
                  <button className="btn btn-secondary btn-lg" onClick={() => setView('builder')}>
                    <i className="fas fa-edit"></i> Build Manually
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <Footer />
        </>
      );
    };

    // ============================================
    // BUILDER PAGE
    // ============================================
    const BuilderPage = ({ profile, setProfile, activeSection, setActiveSection, setView }) => {
      const sections = [
        { id: 'basics', icon: 'fa-user', label: 'Basic Info' },
        { id: 'experience', icon: 'fa-briefcase', label: 'Experience' },
        { id: 'achievements', icon: 'fa-trophy', label: 'Achievements' },
        { id: 'awards', icon: 'fa-award', label: 'Awards' },
        { id: 'reviews', icon: 'fa-star', label: 'Reviews' },
        { id: 'pay', icon: 'fa-dollar-sign', label: 'Pay History' },
        { id: 'projects', icon: 'fa-diagram-project', label: 'Projects' },
        { id: 'media', icon: 'fa-images', label: 'Media' },
        { id: 'template', icon: 'fa-palette', label: 'Template' }
      ];

      const updateBasics = (field, value) => {
        setProfile(prev => ({
          ...prev,
          basics: { ...prev.basics, [field]: value }
        }));
      };

      const addExperience = () => {
        const newExp = {
          id: Date.now(),
          company: '',
          role: '',
          startDate: '',
          endDate: '',
          description: '',
          tasks: [],
          dayInLife: [],
          metrics: []
        };
        setProfile(prev => ({
          ...prev,
          experiences: [...prev.experiences, newExp]
        }));
      };

      const updateExperience = (id, field, value) => {
        setProfile(prev => ({
          ...prev,
          experiences: prev.experiences.map(exp => 
            exp.id === id ? { ...exp, [field]: value } : exp
          )
        }));
      };

      const deleteExperience = (id) => {
        setProfile(prev => ({
          ...prev,
          experiences: prev.experiences.filter(exp => exp.id !== id)
        }));
      };

      return (
        <section className="builder-section">
          <div className="container">
            <div className="builder-container">
              {/* Sidebar */}
              <div className="builder-sidebar glass-heavy">
                <div className="sidebar-section">
                  <div className="sidebar-title">Build Your Profile</div>
                  <div className="sidebar-nav">
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
                  </div>
                </div>

                <div className="sidebar-section">
                  <div className="sidebar-title">Actions</div>
                  <div className="sidebar-nav">
                    <button className="sidebar-link" onClick={() => setView('preview')}>
                      <i className="fas fa-eye"></i> Preview Profile
                    </button>
                    <button className="sidebar-link">
                      <i className="fas fa-download"></i> Export PDF
                    </button>
                    <button className="sidebar-link">
                      <i className="fas fa-share"></i> Share Link
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="builder-main glass-heavy">
                <div className="builder-header">
                  <h2 className="builder-title">
                    {sections.find(s => s.id === activeSection)?.label}
                  </h2>
                  <div className="builder-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => setView('preview')}>
                      <i className="fas fa-eye"></i> Preview
                    </button>
                    <button className="btn btn-primary btn-sm">
                      <i className="fas fa-save"></i> Save
                    </button>
                  </div>
                </div>

                {/* Basic Info */}
                {activeSection === 'basics' && (
                  <div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input 
                          className="form-input"
                          placeholder="John Doe"
                          value={profile.basics.name}
                          onChange={(e) => updateBasics('name', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Professional Title</label>
                        <input 
                          className="form-input"
                          placeholder="Senior Product Manager"
                          value={profile.basics.title}
                          onChange={(e) => updateBasics('title', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tagline</label>
                      <input 
                        className="form-input"
                        placeholder="Building products that matter..."
                        value={profile.basics.tagline}
                        onChange={(e) => updateBasics('tagline', e.target.value)}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input 
                          className="form-input"
                          type="email"
                          placeholder="john@example.com"
                          value={profile.basics.email}
                          onChange={(e) => updateBasics('email', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input 
                          className="form-input"
                          placeholder="+1 (555) 123-4567"
                          value={profile.basics.phone}
                          onChange={(e) => updateBasics('phone', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Location</label>
                        <input 
                          className="form-input"
                          placeholder="San Francisco, CA"
                          value={profile.basics.location}
                          onChange={(e) => updateBasics('location', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">LinkedIn</label>
                        <input 
                          className="form-input"
                          placeholder="linkedin.com/in/username"
                          value={profile.basics.linkedin}
                          onChange={(e) => updateBasics('linkedin', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Experience */}
                {activeSection === 'experience' && (
                  <div>
                    {profile.experiences.map((exp, index) => (
                      <div key={exp.id} className="experience-card">
                        <div className="experience-header">
                          <div>
                            <input
                              className="form-input"
                              style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}
                              placeholder="Company Name"
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                            />
                            <input
                              className="form-input"
                              style={{ color: 'var(--accent-primary)' }}
                              placeholder="Your Role/Title"
                              value={exp.role}
                              onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                            />
                          </div>
                          <div className="experience-actions">
                            <button className="exp-action-btn" onClick={() => deleteExperience(exp.id)}>
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>

                        <div className="form-row" style={{ marginTop: '16px' }}>
                          <div className="form-group">
                            <label className="form-label">Start Date</label>
                            <input 
                              className="form-input"
                              type="month"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">End Date</label>
                            <input 
                              className="form-input"
                              type="month"
                              placeholder="Present"
                              value={exp.endDate}
                              onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Description</label>
                          <textarea 
                            className="form-textarea"
                            placeholder="Describe your role, responsibilities, and impact..."
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                          />
                        </div>

                        {/* Day in the Life */}
                        <div className="day-life-section">
                          <h4 className="day-life-title">
                            <i className="fas fa-sun"></i>
                            A Day in the Life at {exp.company || 'Company'}
                          </h4>
                          <div className="timeline-mini">
                            {(exp.dayInLife || []).map((item, i) => (
                              <div key={i} className="timeline-item-mini">
                                <input
                                  className="timeline-time"
                                  style={{ background: 'transparent', border: 'none', outline: 'none' }}
                                  value={item.time}
                                  onChange={(e) => {
                                    const newDayInLife = [...exp.dayInLife];
                                    newDayInLife[i].time = e.target.value;
                                    updateExperience(exp.id, 'dayInLife', newDayInLife);
                                  }}
                                />
                                <input
                                  className="timeline-content-mini form-input"
                                  value={item.activity}
                                  onChange={(e) => {
                                    const newDayInLife = [...exp.dayInLife];
                                    newDayInLife[i].activity = e.target.value;
                                    updateExperience(exp.id, 'dayInLife', newDayInLife);
                                  }}
                                />
                              </div>
                            ))}
                            <button 
                              className="btn btn-ghost btn-sm"
                              onClick={() => {
                                const newDayInLife = [...(exp.dayInLife || []), { time: '9:00 AM', activity: '' }];
                                updateExperience(exp.id, 'dayInLife', newDayInLife);
                              }}
                            >
                              <i className="fas fa-plus"></i> Add Time Block
                            </button>
                          </div>
                        </div>

                        {/* Metrics */}
                        <div style={{ marginTop: '24px' }}>
                          <label className="form-label">Key Metrics</label>
                          <div className="metrics-grid">
                            {(exp.metrics || []).map((metric, i) => (
                              <div key={i} className="metric-input-card">
                                <input 
                                  placeholder="+40%"
                                  value={metric.value}
                                  onChange={(e) => {
                                    const newMetrics = [...exp.metrics];
                                    newMetrics[i].value = e.target.value;
                                    updateExperience(exp.id, 'metrics', newMetrics);
                                  }}
                                />
                                <input 
                                  className="metric-label-input"
                                  placeholder="Metric Label"
                                  value={metric.label}
                                  onChange={(e) => {
                                    const newMetrics = [...exp.metrics];
                                    newMetrics[i].label = e.target.value;
                                    updateExperience(exp.id, 'metrics', newMetrics);
                                  }}
                                />
                              </div>
                            ))}
                            <div 
                              className="metric-input-card"
                              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              onClick={() => {
                                const newMetrics = [...(exp.metrics || []), { value: '', label: '' }];
                                updateExperience(exp.id, 'metrics', newMetrics);
                              }}
                            >
                              <i className="fas fa-plus" style={{ color: 'var(--text-muted)' }}></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button className="btn btn-secondary" onClick={addExperience}>
                      <i className="fas fa-plus"></i> Add Experience
                    </button>
                  </div>
                )}

                {/* Achievements */}
                {activeSection === 'achievements' && (
                  <div>
                    <div className="achievements-grid">
                      {profile.achievements.map((achievement, i) => (
                        <div key={achievement.id} className="achievement-card">
                          <div className="achievement-icon">
                            <i className={"fas " + achievement.icon}></i>
                          </div>
                          <div>
                            <input
                              className="form-input"
                              style={{ fontWeight: '600', marginBottom: '4px' }}
                              placeholder="Achievement Title"
                              value={achievement.title}
                              onChange={(e) => {
                                const newAchievements = [...profile.achievements];
                                newAchievements[i].title = e.target.value;
                                setProfile(prev => ({ ...prev, achievements: newAchievements }));
                              }}
                            />
                            <input
                              className="form-input"
                              style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}
                              placeholder="Description"
                              value={achievement.desc}
                              onChange={(e) => {
                                const newAchievements = [...profile.achievements];
                                newAchievements[i].desc = e.target.value;
                                setProfile(prev => ({ ...prev, achievements: newAchievements }));
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button 
                      className="btn btn-secondary"
                      style={{ marginTop: '24px' }}
                      onClick={() => {
                        setProfile(prev => ({
                          ...prev,
                          achievements: [...prev.achievements, { id: Date.now(), icon: 'fa-star', title: '', desc: '' }]
                        }));
                      }}
                    >
                      <i className="fas fa-plus"></i> Add Achievement
                    </button>
                  </div>
                )}

                {/* Media */}
                {activeSection === 'media' && (
                  <div>
                    <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Photos</h3>
                    <div className="media-grid">
                      {profile.media.photos.map((photo, i) => (
                        <div key={i} className="media-item">
                          <img src={photo} alt={"Photo " + (i+1)} />
                        </div>
                      ))}
                      <div className="media-item media-add">
                        <i className="fas fa-plus"></i>
                        <span style={{ fontSize: '0.8rem' }}>Add Photo</span>
                      </div>
                    </div>

                    <h3 style={{ marginBottom: '16px', marginTop: '32px', color: 'var(--text-secondary)' }}>Videos</h3>
                    <div className="media-grid">
                      {profile.media.videos.map((video, i) => (
                        <div key={i} className="media-item">
                          <i className="fas fa-play" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}></i>
                        </div>
                      ))}
                      <div className="media-item media-add">
                        <i className="fas fa-video"></i>
                        <span style={{ fontSize: '0.8rem' }}>Add Video</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Template */}
                {activeSection === 'template' && (
                  <div>
                    <div className="template-grid">
                      {templates.map(template => (
                        <div 
                          key={template.id} 
                          className={"template-card" + (profile.template === template.id ? " selected" : "")}
                          onClick={() => setProfile(prev => ({ ...prev, template: template.id }))}
                        >
                          <div className="template-preview" style={{
                            background: template.id === 'executive' ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' :
                                       template.id === 'creative' ? 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)' :
                                       template.id === 'tech' ? 'linear-gradient(135deg, #00d2d3 0%, #54a0ff 100%)' :
                                       'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                          }}>
                            {profile.template === template.id && (
                              <div style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                background: 'var(--accent-primary)',
                                color: 'white',
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <i className="fas fa-check"></i>
                              </div>
                            )}
                          </div>
                          <div className="template-info">
                            <div className="template-name">{template.name}</div>
                            <div className="template-desc">{template.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Placeholder for other sections */}
                {['awards', 'reviews', 'pay', 'projects'].includes(activeSection) && (
                  <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
                    <i className="fas fa-hammer" style={{ fontSize: '3rem', marginBottom: '16px' }}></i>
                    <h3>Coming Soon</h3>
                    <p>This section is under construction</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      );
    };

    // ============================================
    // PREVIEW PAGE
    // ============================================
    const PreviewPage = ({ profile, setView }) => {
      return (
        <section className="profile-preview" style={{ paddingTop: '120px' }}>
          <div className="container">
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setView('builder')}>
                <i className="fas fa-arrow-left"></i> Back to Editor
              </button>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-secondary">
                  <i className="fas fa-download"></i> Export PDF
                </button>
                <button className="btn btn-primary">
                  <i className="fas fa-share"></i> Share Profile
                </button>
              </div>
            </div>

            <div className="preview-frame">
              <div className="preview-header">
                <div className="preview-avatar">
                  {profile.basics.name ? profile.basics.name.split(' ').map(n => n[0]).join('') : '?'}
                </div>
                <h1 className="preview-name">{profile.basics.name || 'Your Name'}</h1>
                <p className="preview-tagline">{profile.basics.tagline || 'Your professional tagline'}</p>
                
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                  {profile.basics.email && (
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                      <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>
                      {profile.basics.email}
                    </span>
                  )}
                  {profile.basics.location && (
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                      <i className="fas fa-location-dot" style={{ marginRight: '8px' }}></i>
                      {profile.basics.location}
                    </span>
                  )}
                </div>
              </div>

              <div className="preview-body">
                {/* Experience Timeline */}
                {profile.experiences.length > 0 && (
                  <div style={{ marginBottom: '48px' }}>
                    <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>
                      <i className="fas fa-briefcase" style={{ marginRight: '12px', color: 'var(--accent-primary)' }}></i>
                      Experience
                    </h2>
                    
                    {profile.experiences.map(exp => (
                      <div key={exp.id} className="experience-card" style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                          <div>
                            <h3 style={{ color: 'var(--text-white)', marginBottom: '4px' }}>{exp.role}</h3>
                            <p style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>{exp.company}</p>
                          </div>
                          <span style={{ color: 'var(--text-muted)' }}>
                            {exp.startDate} — {exp.endDate || 'Present'}
                          </span>
                        </div>
                        
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{exp.description}</p>
                        
                        {exp.metrics && exp.metrics.length > 0 && (
                          <div className="metrics-grid" style={{ marginBottom: '16px' }}>
                            {exp.metrics.filter(m => m.value).map((metric, i) => (
                              <div key={i} style={{ 
                                background: 'var(--bg-surface)', 
                                padding: '16px', 
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center'
                              }}>
                                <div style={{ 
                                  fontSize: '1.5rem', 
                                  fontWeight: '700', 
                                  color: 'var(--accent-primary)',
                                  fontFamily: 'Space Grotesk'
                                }}>{metric.value}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{metric.label}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {exp.dayInLife && exp.dayInLife.length > 0 && (
                          <div className="day-life-section">
                            <h4 className="day-life-title">
                              <i className="fas fa-sun"></i>
                              A Day in the Life
                            </h4>
                            <div className="timeline-mini">
                              {exp.dayInLife.map((item, i) => (
                                <div key={i} className="timeline-item-mini">
                                  <span className="timeline-time">{item.time}</span>
                                  <span className="timeline-content-mini">{item.activity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Achievements */}
                {profile.achievements.length > 0 && (
                  <div style={{ marginBottom: '48px' }}>
                    <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>
                      <i className="fas fa-trophy" style={{ marginRight: '12px', color: 'var(--accent-primary)' }}></i>
                      Achievements
                    </h2>
                    <div className="achievements-grid">
                      {profile.achievements.map(achievement => (
                        <div key={achievement.id} className="achievement-card">
                          <div className="achievement-icon">
                            <i className={"fas " + achievement.icon}></i>
                          </div>
                          <div>
                            <div className="achievement-title">{achievement.title}</div>
                            <div className="achievement-desc">{achievement.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews */}
                {profile.reviews && profile.reviews.length > 0 && (
                  <div>
                    <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>
                      <i className="fas fa-star" style={{ marginRight: '12px', color: 'var(--accent-primary)' }}></i>
                      What People Say
                    </h2>
                    {profile.reviews.map(review => (
                      <div key={review.id} style={{
                        background: 'var(--bg-elevated)',
                        padding: '24px',
                        borderRadius: 'var(--radius-lg)',
                        marginBottom: '16px'
                      }}>
                        <p style={{ fontStyle: 'italic', marginBottom: '16px', fontSize: '1.1rem' }}>
                          "{review.text}"
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'var(--gradient-primary)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '600'
                          }}>
                            {review.author.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600' }}>{review.author}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{review.role}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      );
    };

    // ============================================
    // HUNTER CHAT
    // ============================================
    const HunterChat = ({ isOpen, onToggle, profile }) => {
      const [messages, setMessages] = useState([]);
      const [input, setInput] = useState('');
      const messagesEndRef = useRef(null);

      useEffect(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, [messages]);

      useEffect(() => {
        if (isOpen && messages.length === 0) {
          setTimeout(() => {
            const name = profile.basics.name || 'this candidate';
            setMessages([{
              id: 1,
              type: 'bot',
              text: "Hey there! I'm the AI Headhunter for " + name + ". Looking to hire someone exceptional? You're in the right place. What would you like to know?"
            }]);
          }, 500);
        }
      }, [isOpen, profile.basics.name]);

      const sendMessage = () => {
        if (!input.trim()) return;
        
        setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: input }]);
        setInput('');

        setTimeout(() => {
          const lower = input.toLowerCase();
          let response = "I'd be happy to tell you more about " + (profile.basics.name || 'this candidate') + "'s experience. What specifically interests you?";
          
          if (lower.includes('experience') || lower.includes('background')) {
            response = profile.experiences.length > 0 
              ? "Great question! " + profile.basics.name + " has " + profile.experiences.length + " key roles to highlight. Most recently at " + profile.experiences[0].company + " as " + profile.experiences[0].role + ". Want the details?"
              : "The experience section is still being built. Check back soon!";
          } else if (lower.includes('salary') || lower.includes('compensation')) {
            response = "Compensation discussions are best handled directly. I can help schedule a call to discuss expectations. Interested?";
          } else if (lower.includes('available') || lower.includes('start')) {
            response = "Great timing! " + (profile.basics.name || 'This candidate') + " is actively exploring new opportunities. Would you like to schedule an intro call?";
          }

          setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: response }]);
        }, 800);
      };

      return (
        <>
          <button className="chat-trigger" onClick={onToggle}>
            <i className={"fas " + (isOpen ? "fa-times" : "fa-comments")}></i>
          </button>

          {isOpen && (
            <div className="chat-window glass-heavy">
              <div className="chat-header">
                <div className="chat-avatar">🤖</div>
                <div className="chat-info">
                  <h4>AI Headhunter</h4>
                  <span>Always online</span>
                </div>
                <button className="chat-close" onClick={onToggle}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="chat-messages">
                {messages.map(msg => (
                  <div key={msg.id} className={"chat-message " + msg.type}>
                    <div className="chat-bubble">{msg.text}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-area">
                <input
                  className="chat-input"
                  placeholder="Ask about this candidate..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="chat-send" onClick={sendMessage}>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          )}
        </>
      );
    };

    // ============================================
    // FOOTER
    // ============================================
    const Footer = () => (
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <span style={{ fontSize: '1.5rem' }}>⚡</span>
                Webume
              </div>
              <p className="footer-desc">
                The future of professional profiles. Build your employee-for-hire empire.
              </p>
              <div className="footer-social">
                <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-link"><i className="fab fa-linkedin"></i></a>
                <a href="#" className="social-link"><i className="fab fa-github"></i></a>
              </div>
            </div>
            <div>
              <h4 className="footer-title">Product</h4>
              <div className="footer-links">
                <a href="#" className="footer-link">Features</a>
                <a href="#" className="footer-link">Templates</a>
                <a href="#" className="footer-link">Pricing</a>
                <a href="#" className="footer-link">API</a>
              </div>
            </div>
            <div>
              <h4 className="footer-title">Company</h4>
              <div className="footer-links">
                <a href="#" className="footer-link">About</a>
                <a href="#" className="footer-link">Blog</a>
                <a href="#" className="footer-link">Careers</a>
                <a href="#" className="footer-link">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="footer-title">Legal</h4>
              <div className="footer-links">
                <a href="#" className="footer-link">Privacy</a>
                <a href="#" className="footer-link">Terms</a>
                <a href="#" className="footer-link">Security</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2025 Webume. All rights reserved.</span>
            <span>Built for the future of work.</span>
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
