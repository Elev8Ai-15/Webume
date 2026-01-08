import { Hono } from 'hono'

const app = new Hono()

// ============================================
// WEBUME: THE RESUME KILLER
// Premium Dashboard UI + Real Resume Parsing
// ============================================

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Webume | Employee-for-Hire Empire</title>
  
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
       WEBUME PREMIUM DASHBOARD UI
       Based on Reference Designs
       ============================================ */
    
    :root {
      /* Background Gradient - Deep Purple/Blue */
      --bg-primary: #0f0a1e;
      --bg-secondary: #1a1333;
      --bg-tertiary: #251d3d;
      --bg-card: rgba(30, 24, 54, 0.85);
      --bg-card-hover: rgba(40, 32, 70, 0.95);
      
      /* Accent Colors - Vibrant Purple/Pink/Cyan */
      --accent-purple: #9a77ff;
      --accent-pink: #f15bb5;
      --accent-cyan: #1cd5a9;
      --accent-blue: #3b46db;
      --accent-orange: #ff9f43;
      --accent-red: #ff6b6b;
      
      /* Gradients */
      --gradient-purple: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --gradient-pink: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      --gradient-cyan: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      --gradient-card: linear-gradient(145deg, rgba(154, 119, 255, 0.1) 0%, rgba(241, 91, 181, 0.05) 100%);
      --gradient-bg: radial-gradient(ellipse at 20% 0%, rgba(154, 119, 255, 0.15) 0%, transparent 50%),
                     radial-gradient(ellipse at 80% 100%, rgba(241, 91, 181, 0.1) 0%, transparent 50%),
                     radial-gradient(ellipse at 50% 50%, rgba(28, 213, 169, 0.05) 0%, transparent 60%);
      
      /* Text */
      --text-primary: #ffffff;
      --text-secondary: #b8b5c9;
      --text-muted: #6b6889;
      
      /* Glass Effect */
      --glass-bg: rgba(255, 255, 255, 0.03);
      --glass-border: rgba(255, 255, 255, 0.08);
      --glass-highlight: rgba(255, 255, 255, 0.12);
      
      /* Shadows */
      --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
      --shadow-md: 0 8px 32px rgba(0, 0, 0, 0.4);
      --shadow-lg: 0 16px 64px rgba(0, 0, 0, 0.5);
      --shadow-glow: 0 0 40px rgba(154, 119, 255, 0.3);
      --shadow-glow-pink: 0 0 40px rgba(241, 91, 181, 0.3);
      --shadow-glow-cyan: 0 0 40px rgba(28, 213, 169, 0.3);
      
      /* Sizing */
      --sidebar-width: 280px;
      --header-height: 72px;
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --radius-xl: 24px;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html, body, #root {
      height: 100%;
    }
    
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.5;
      overflow: hidden;
    }
    
    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { 
      background: var(--accent-purple);
      border-radius: 3px;
    }
    
    /* ============================================
       APP LAYOUT - Dashboard Style
       ============================================ */
    .app {
      display: flex;
      height: 100vh;
      background: var(--gradient-bg), var(--bg-primary);
    }
    
    /* ============================================
       SIDEBAR
       ============================================ */
    .sidebar {
      width: var(--sidebar-width);
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      border-right: 1px solid var(--glass-border);
      display: flex;
      flex-direction: column;
      padding: 24px 16px;
      position: relative;
      z-index: 100;
    }
    
    .sidebar::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 200px;
      background: linear-gradient(180deg, rgba(154, 119, 255, 0.1) 0%, transparent 100%);
      pointer-events: none;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 12px;
      margin-bottom: 40px;
      position: relative;
    }
    
    .logo-icon {
      width: 48px;
      height: 48px;
      background: var(--gradient-purple);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      box-shadow: var(--shadow-glow);
    }
    
    .logo-text {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(135deg, #fff 0%, #b8b5c9 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .nav-section {
      margin-bottom: 32px;
    }
    
    .nav-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: var(--text-muted);
      padding: 0 16px;
      margin-bottom: 12px;
    }
    
    .nav-items {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .nav-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 16px;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
      position: relative;
    }
    
    .nav-item:hover {
      background: var(--glass-bg);
      color: var(--text-primary);
    }
    
    .nav-item.active {
      background: linear-gradient(135deg, rgba(154, 119, 255, 0.2) 0%, rgba(154, 119, 255, 0.05) 100%);
      color: var(--text-primary);
      border: 1px solid rgba(154, 119, 255, 0.3);
    }
    
    .nav-item.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 24px;
      background: var(--accent-purple);
      border-radius: 0 3px 3px 0;
    }
    
    .nav-item i {
      width: 20px;
      text-align: center;
      font-size: 16px;
    }
    
    .nav-item.active i {
      color: var(--accent-purple);
    }
    
    .nav-badge {
      margin-left: auto;
      background: var(--accent-pink);
      color: white;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 10px;
    }
    
    /* Sidebar Profile Card */
    .sidebar-profile {
      margin-top: auto;
      padding: 16px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .sidebar-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--gradient-cyan);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 16px;
      border: 2px solid rgba(28, 213, 169, 0.3);
    }
    
    .sidebar-info {
      flex: 1;
      min-width: 0;
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
       MAIN CONTENT AREA
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
      padding: 0 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--glass-border);
      background: rgba(15, 10, 30, 0.5);
      backdrop-filter: blur(10px);
    }
    
    .header-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 24px;
      font-weight: 600;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .header-search {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 20px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      min-width: 280px;
    }
    
    .header-search i {
      color: var(--text-muted);
    }
    
    .header-search input {
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-size: 14px;
      width: 100%;
    }
    
    .header-search input::placeholder {
      color: var(--text-muted);
    }
    
    .header-btn {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }
    
    .header-btn:hover {
      background: var(--glass-highlight);
      color: var(--text-primary);
    }
    
    .header-btn .badge {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 18px;
      height: 18px;
      background: var(--accent-pink);
      border-radius: 50%;
      font-size: 10px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    /* Content Area */
    .content {
      flex: 1;
      overflow-y: auto;
      padding: 32px;
    }
    
    /* ============================================
       CARDS
       ============================================ */
    .card {
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      padding: 24px;
      transition: all 0.3s ease;
    }
    
    .card:hover {
      border-color: rgba(154, 119, 255, 0.3);
      box-shadow: var(--shadow-glow);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .card-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 18px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .card-title i {
      color: var(--accent-purple);
    }
    
    .card-action {
      padding: 8px 16px;
      background: transparent;
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .card-action:hover {
      background: var(--glass-bg);
      color: var(--text-primary);
      border-color: var(--accent-purple);
    }
    
    /* ============================================
       STAT CARDS
       ============================================ */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      margin-bottom: 32px;
    }
    
    .stat-card {
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-xl);
      padding: 24px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      filter: blur(40px);
      opacity: 0.3;
    }
    
    .stat-card.purple::before { background: var(--accent-purple); }
    .stat-card.pink::before { background: var(--accent-pink); }
    .stat-card.cyan::before { background: var(--accent-cyan); }
    .stat-card.orange::before { background: var(--accent-orange); }
    
    .stat-card:hover {
      transform: translateY(-4px);
      border-color: rgba(154, 119, 255, 0.3);
      box-shadow: var(--shadow-glow);
    }
    
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
    
    .stat-card.purple .stat-icon { background: rgba(154, 119, 255, 0.2); color: var(--accent-purple); }
    .stat-card.pink .stat-icon { background: rgba(241, 91, 181, 0.2); color: var(--accent-pink); }
    .stat-card.cyan .stat-icon { background: rgba(28, 213, 169, 0.2); color: var(--accent-cyan); }
    .stat-card.orange .stat-icon { background: rgba(255, 159, 67, 0.2); color: var(--accent-orange); }
    
    .stat-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    
    .stat-label {
      color: var(--text-muted);
      font-size: 14px;
    }
    
    .stat-change {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      font-weight: 500;
      margin-top: 8px;
      padding: 4px 10px;
      border-radius: 20px;
    }
    
    .stat-change.up {
      background: rgba(28, 213, 169, 0.15);
      color: var(--accent-cyan);
    }
    
    .stat-change.down {
      background: rgba(255, 107, 107, 0.15);
      color: var(--accent-red);
    }
    
    /* ============================================
       UPLOAD ZONE
       ============================================ */
    .upload-zone {
      border: 2px dashed var(--glass-border);
      border-radius: var(--radius-xl);
      padding: 60px 40px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: var(--glass-bg);
      position: relative;
      overflow: hidden;
    }
    
    .upload-zone::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 50%, rgba(154, 119, 255, 0.1) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .upload-zone:hover, .upload-zone.drag-over {
      border-color: var(--accent-purple);
      background: rgba(154, 119, 255, 0.05);
    }
    
    .upload-zone:hover::before, .upload-zone.drag-over::before {
      opacity: 1;
    }
    
    .upload-zone.drag-over {
      border-style: solid;
      transform: scale(1.02);
      box-shadow: var(--shadow-glow);
    }
    
    .upload-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 24px;
      background: var(--gradient-purple);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      color: white;
      box-shadow: var(--shadow-glow);
      position: relative;
    }
    
    .upload-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .upload-desc {
      color: var(--text-muted);
      margin-bottom: 24px;
    }
    
    .upload-formats {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    
    .format-tag {
      padding: 8px 16px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .format-tag i {
      color: var(--accent-purple);
    }
    
    /* ============================================
       PROGRESS BAR
       ============================================ */
    .progress-container {
      padding: 32px;
    }
    
    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .progress-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 600;
    }
    
    .progress-spinner {
      width: 24px;
      height: 24px;
      border: 3px solid var(--glass-border);
      border-top-color: var(--accent-purple);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .progress-percent {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      color: var(--accent-purple);
    }
    
    .progress-bar {
      height: 8px;
      background: var(--glass-bg);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 24px;
    }
    
    .progress-fill {
      height: 100%;
      background: var(--gradient-purple);
      border-radius: 4px;
      transition: width 0.3s ease;
      box-shadow: var(--shadow-glow);
    }
    
    .progress-steps {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .progress-step {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      color: var(--text-muted);
    }
    
    .progress-step.complete { color: var(--accent-cyan); }
    .progress-step.active { color: var(--accent-purple); }
    
    .progress-step i {
      width: 20px;
      text-align: center;
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
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .form-label i {
      color: var(--accent-purple);
      font-size: 12px;
    }
    
    .form-input, .form-textarea, .form-select {
      padding: 14px 18px;
      background: var(--bg-tertiary);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      font-size: 14px;
      font-family: inherit;
      transition: all 0.2s ease;
    }
    
    .form-input:focus, .form-textarea:focus, .form-select:focus {
      outline: none;
      border-color: var(--accent-purple);
      box-shadow: 0 0 0 3px rgba(154, 119, 255, 0.1);
    }
    
    .form-input::placeholder, .form-textarea::placeholder {
      color: var(--text-muted);
    }
    
    .form-textarea {
      min-height: 100px;
      resize: vertical;
    }
    
    /* ============================================
       EXPERIENCE CARD
       ============================================ */
    .experience-entry {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
      padding: 24px;
      margin-bottom: 20px;
      position: relative;
    }
    
    .experience-entry::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--gradient-purple);
      border-radius: 3px 0 0 3px;
    }
    
    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    
    .experience-number {
      width: 36px;
      height: 36px;
      background: var(--gradient-purple);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      box-shadow: var(--shadow-glow);
    }
    
    .experience-actions {
      display: flex;
      gap: 8px;
    }
    
    .btn-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .btn-icon:hover {
      background: var(--glass-highlight);
      color: var(--text-primary);
    }
    
    .btn-icon.danger:hover {
      background: rgba(255, 107, 107, 0.15);
      color: var(--accent-red);
      border-color: var(--accent-red);
    }
    
    /* ============================================
       METRICS GRID
       ============================================ */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-top: 20px;
    }
    
    .metric-input {
      background: var(--bg-tertiary);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      padding: 16px;
      text-align: center;
      transition: all 0.2s ease;
    }
    
    .metric-input:hover {
      border-color: var(--accent-purple);
    }
    
    .metric-input input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      text-align: center;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: var(--accent-purple);
      margin-bottom: 4px;
    }
    
    .metric-input input::placeholder {
      color: var(--text-muted);
      font-size: 18px;
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
      gap: 10px;
      padding: 14px 28px;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      text-decoration: none;
    }
    
    .btn-primary {
      background: var(--gradient-purple);
      color: white;
      box-shadow: var(--shadow-glow);
    }
    
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 40px rgba(154, 119, 255, 0.4);
    }
    
    .btn-secondary {
      background: var(--glass-bg);
      color: var(--text-primary);
      border: 1px solid var(--glass-border);
    }
    
    .btn-secondary:hover {
      background: var(--glass-highlight);
      border-color: var(--accent-purple);
    }
    
    .btn-pink {
      background: var(--gradient-pink);
      color: white;
      box-shadow: var(--shadow-glow-pink);
    }
    
    .btn-cyan {
      background: var(--gradient-cyan);
      color: white;
      box-shadow: var(--shadow-glow-cyan);
    }
    
    .btn-add {
      width: 100%;
      padding: 16px;
      background: var(--glass-bg);
      border: 2px dashed var(--glass-border);
      border-radius: var(--radius-lg);
      color: var(--text-muted);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .btn-add:hover {
      border-color: var(--accent-purple);
      color: var(--text-primary);
      background: rgba(154, 119, 255, 0.05);
    }
    
    /* ============================================
       TIMELINE
       ============================================ */
    .timeline {
      position: relative;
      padding-left: 40px;
    }
    
    .timeline::before {
      content: '';
      position: absolute;
      left: 12px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(180deg, var(--accent-purple), var(--accent-pink), var(--accent-cyan));
    }
    
    .timeline-entry {
      position: relative;
      margin-bottom: 32px;
      padding: 24px;
      background: var(--bg-card);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-lg);
    }
    
    .timeline-entry::before {
      content: '';
      position: absolute;
      left: -34px;
      top: 28px;
      width: 16px;
      height: 16px;
      background: var(--accent-purple);
      border-radius: 50%;
      border: 3px solid var(--bg-primary);
      box-shadow: var(--shadow-glow);
    }
    
    .timeline-company {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .timeline-role {
      color: var(--accent-purple);
      font-weight: 500;
      margin-bottom: 8px;
    }
    
    .timeline-dates {
      display: inline-block;
      padding: 4px 12px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 16px;
    }
    
    .timeline-desc {
      color: var(--text-secondary);
      line-height: 1.7;
    }
    
    /* Preview Metrics */
    .preview-metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 20px;
    }
    
    .preview-metric {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: var(--radius-md);
      padding: 16px;
      text-align: center;
    }
    
    .preview-metric-value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 24px;
      font-weight: 700;
      background: var(--gradient-purple);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .preview-metric-label {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-top: 4px;
    }
    
    /* ============================================
       RESPONSIVE
       ============================================ */
    @media (max-width: 1200px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .preview-metrics {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 768px) {
      .sidebar {
        display: none;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .metrics-grid, .preview-metrics {
        grid-template-columns: 1fr 1fr;
      }
    }
    
    /* ============================================
       ANIMATIONS
       ============================================ */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .fade-in {
      animation: fadeIn 0.4s ease forwards;
    }
    
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    .slide-in {
      animation: slideIn 0.4s ease forwards;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    const { useState, useEffect, useRef } = React;
    
    // ============================================
    // REAL RESUME PARSER
    // ============================================
    const ResumeParser = {
      // Extract text from PDF using PDF.js
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
      
      // Extract text from DOCX using Mammoth
      async parseDOCX(file) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      },
      
      // Parse plain text
      async parseTXT(file) {
        return await file.text();
      },
      
      // Main extraction logic
      extractData(text) {
        const lines = text.split('\\n').map(l => l.trim()).filter(l => l);
        
        // Extract email
        const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/);
        const email = emailMatch ? emailMatch[0] : '';
        
        // Extract phone
        const phoneMatch = text.match(/(?:\\+?1[-.]?)?\\(?\\d{3}\\)?[-.]?\\d{3}[-.]?\\d{4}/);
        const phone = phoneMatch ? phoneMatch[0] : '';
        
        // Extract LinkedIn
        const linkedinMatch = text.match(/linkedin\\.com\\/in\\/[a-zA-Z0-9-]+/i);
        const linkedin = linkedinMatch ? linkedinMatch[0] : '';
        
        // Extract name (usually first line or after common headers)
        let name = '';
        for (const line of lines.slice(0, 5)) {
          if (line.length > 2 && line.length < 50 && !line.includes('@') && !line.includes('http')) {
            const words = line.split(' ').filter(w => w.length > 0);
            if (words.length >= 2 && words.length <= 4) {
              const isName = words.every(w => /^[A-Z][a-z]+$/.test(w) || /^[A-Z]+$/.test(w));
              if (isName || words.length === 2) {
                name = line;
                break;
              }
            }
          }
        }
        if (!name) name = lines[0] || '';
        
        // Extract experiences
        const experiences = this.extractExperiences(text, lines);
        
        // Extract skills
        const skills = this.extractSkills(text);
        
        // Extract education
        const education = this.extractEducation(text, lines);
        
        // Try to determine title from first experience or context
        let title = '';
        if (experiences.length > 0) {
          title = experiences[0].role;
        }
        
        return {
          basics: {
            name,
            title,
            tagline: '',
            email,
            phone,
            location: this.extractLocation(text),
            linkedin,
            website: ''
          },
          experience: experiences,
          skills,
          education,
          achievements: [],
          awards: [],
          reviews: [],
          payHistory: [],
          projects: [],
          photos: [],
          videos: []
        };
      },
      
      extractExperiences(text, lines) {
        const experiences = [];
        
        // Common job title patterns
        const titlePatterns = [
          /(?:senior|sr\\.?|junior|jr\\.?|lead|principal|staff|chief|head|director|vp|vice president|manager|engineer|developer|designer|analyst|consultant|specialist|coordinator|associate|assistant)/i
        ];
        
        // Date patterns
        const datePattern = /(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[\\s,]*\\d{4}|\\d{1,2}\\/\\d{4}|\\d{4}/gi;
        
        // Find sections that look like experience entries
        const expKeywords = ['experience', 'employment', 'work history', 'professional experience'];
        let inExperienceSection = false;
        let currentExp = null;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const lowerLine = line.toLowerCase();
          
          // Check if entering experience section
          if (expKeywords.some(kw => lowerLine.includes(kw))) {
            inExperienceSection = true;
            continue;
          }
          
          // Check if leaving experience section
          if (inExperienceSection && ['education', 'skills', 'certifications', 'projects'].some(kw => lowerLine.startsWith(kw))) {
            if (currentExp) experiences.push(currentExp);
            break;
          }
          
          if (!inExperienceSection) continue;
          
          // Look for company/role patterns
          const dates = line.match(datePattern);
          const hasTitle = titlePatterns.some(p => p.test(line));
          
          if (dates && dates.length >= 1) {
            // This line likely contains a new job entry
            if (currentExp) experiences.push(currentExp);
            
            // Extract dates
            const allDates = dates.map(d => d);
            const startDate = allDates[0] || '';
            const endDate = allDates.length > 1 ? allDates[1] : 'Present';
            
            // Try to extract company and role
            let cleanLine = line;
            dates.forEach(d => cleanLine = cleanLine.replace(d, ''));
            cleanLine = cleanLine.replace(/[-–—|,]/g, ' ').trim();
            
            const parts = cleanLine.split(/\\s{2,}/).filter(p => p.trim());
            
            currentExp = {
              id: Date.now() + i,
              company: parts[0] || 'Company',
              role: parts[1] || parts[0] || 'Role',
              startDate,
              endDate,
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
            };
          } else if (currentExp && line.length > 20) {
            // Add to description
            currentExp.description += (currentExp.description ? ' ' : '') + line;
          }
        }
        
        if (currentExp) experiences.push(currentExp);
        
        // If no experiences found, try alternative parsing
        if (experiences.length === 0) {
          // Look for any date ranges in the document
          const allDates = text.match(datePattern) || [];
          if (allDates.length >= 2) {
            experiences.push({
              id: Date.now(),
              company: 'Company Name',
              role: 'Your Role',
              startDate: allDates[0],
              endDate: allDates[1] || 'Present',
              description: 'Please add your job description here.',
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
            });
          }
        }
        
        return experiences;
      },
      
      extractSkills(text) {
        const skillsKeywords = ['skills', 'technologies', 'proficiencies', 'competencies', 'expertise'];
        const commonSkills = [
          'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'AWS', 'SQL', 'Git',
          'TypeScript', 'HTML', 'CSS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL',
          'Agile', 'Scrum', 'Project Management', 'Leadership', 'Communication',
          'Excel', 'PowerPoint', 'Salesforce', 'Tableau', 'Power BI', 'SAP'
        ];
        
        const foundSkills = [];
        commonSkills.forEach(skill => {
          if (text.toLowerCase().includes(skill.toLowerCase())) {
            foundSkills.push(skill);
          }
        });
        
        return foundSkills;
      },
      
      extractEducation(text, lines) {
        const education = [];
        const eduKeywords = ['education', 'academic', 'degree', 'university', 'college', 'bachelor', 'master', 'phd', 'mba'];
        
        let inEduSection = false;
        
        for (const line of lines) {
          const lowerLine = line.toLowerCase();
          
          if (eduKeywords.some(kw => lowerLine.includes(kw))) {
            inEduSection = true;
          }
          
          if (inEduSection && line.length > 10) {
            const degreeMatch = line.match(/(?:Bachelor|Master|PhD|MBA|B\\.S\\.|M\\.S\\.|B\\.A\\.|M\\.A\\.)[^,]*/i);
            if (degreeMatch) {
              education.push({
                degree: degreeMatch[0],
                school: line.replace(degreeMatch[0], '').trim()
              });
            }
          }
        }
        
        return education;
      },
      
      extractLocation(text) {
        // Common US city patterns
        const cityStatePattern = /([A-Z][a-z]+(?:\\s[A-Z][a-z]+)?),?\\s*([A-Z]{2})(?:\\s+\\d{5})?/;
        const match = text.match(cityStatePattern);
        return match ? match[0] : '';
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
        { label: 'Reading file...', status: 'pending' },
        { label: 'Extracting text content...', status: 'pending' },
        { label: 'Parsing resume structure...', status: 'pending' },
        { label: 'Identifying experience...', status: 'pending' },
        { label: 'Building profile...', status: 'pending' }
      ]);
      const [activeSection, setActiveSection] = useState('basics');
      const [rawText, setRawText] = useState('');
      
      // REAL file upload handler
      const handleFileUpload = async (file) => {
        setIsProcessing(true);
        setProgress(0);
        setView(VIEWS.UPLOAD);
        
        const steps = [...progressSteps];
        
        try {
          // Step 1: Reading file
          steps[0].status = 'active';
          setProgressSteps([...steps]);
          await new Promise(r => setTimeout(r, 300));
          
          let text = '';
          const fileType = file.name.split('.').pop().toLowerCase();
          
          // Step 2: Extract text based on file type
          steps[0].status = 'complete';
          steps[1].status = 'active';
          setProgressSteps([...steps]);
          setProgress(20);
          
          if (fileType === 'pdf') {
            text = await ResumeParser.parsePDF(file);
          } else if (fileType === 'docx') {
            text = await ResumeParser.parseDOCX(file);
          } else {
            text = await ResumeParser.parseTXT(file);
          }
          
          setRawText(text);
          console.log('Extracted text:', text.substring(0, 500));
          
          // Step 3: Parse structure
          steps[1].status = 'complete';
          steps[2].status = 'active';
          setProgressSteps([...steps]);
          setProgress(40);
          await new Promise(r => setTimeout(r, 300));
          
          // Step 4: Identify experience
          steps[2].status = 'complete';
          steps[3].status = 'active';
          setProgressSteps([...steps]);
          setProgress(60);
          await new Promise(r => setTimeout(r, 300));
          
          // Step 5: Build profile
          steps[3].status = 'complete';
          steps[4].status = 'active';
          setProgressSteps([...steps]);
          setProgress(80);
          
          const extractedData = ResumeParser.extractData(text);
          console.log('Extracted data:', extractedData);
          
          steps[4].status = 'complete';
          setProgressSteps([...steps]);
          setProgress(100);
          
          await new Promise(r => setTimeout(r, 500));
          
          setProfile(extractedData);
          setIsProcessing(false);
          setView(VIEWS.BUILDER);
          
        } catch (error) {
          console.error('Error parsing resume:', error);
          alert('Error parsing resume: ' + error.message);
          setIsProcessing(false);
          setView(VIEWS.DASHBOARD);
        }
      };
      
      return (
        <div className="app">
          {/* Sidebar */}
          <Sidebar 
            view={view} 
            setView={setView} 
            profile={profile}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
          
          {/* Main Content */}
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
        { id: 'achievements', icon: 'fa-trophy', label: 'Achievements' },
        { id: 'awards', icon: 'fa-award', label: 'Awards' },
        { id: 'reviews', icon: 'fa-star', label: 'Reviews' },
        { id: 'pay', icon: 'fa-dollar-sign', label: 'Pay History' },
        { id: 'media', icon: 'fa-image', label: 'Media' }
      ];
      
      return (
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-icon">⚡</div>
            <span className="logo-text">Webume</span>
          </div>
          
          <nav className="nav-section">
            <div className="nav-label">Main</div>
            <div className="nav-items">
              {mainNav.map(item => (
                <button
                  key={item.id}
                  className={"nav-item" + (view === item.id ? " active" : "")}
                  onClick={() => setView(item.id)}
                >
                  <i className={"fas " + item.icon}></i>
                  {item.label}
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
                    {item.label}
                  </button>
                ))}
                <button
                  className={"nav-item" + (view === VIEWS.PREVIEW ? " active" : "")}
                  onClick={() => setView(VIEWS.PREVIEW)}
                >
                  <i className="fas fa-eye"></i>
                  Preview
                  <span className="nav-badge">Live</span>
                </button>
              </div>
            </nav>
          )}
          
          {profile && (
            <div className="sidebar-profile">
              <div className="sidebar-avatar">
                {profile.basics.name ? profile.basics.name.split(' ').map(n => n[0]).join('').substring(0, 2) : '?'}
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
        { icon: 'fa-star', value: profile?.reviews?.length || 0, label: 'Reviews', change: '+3', up: true, color: 'cyan' },
        { icon: 'fa-chart-line', value: '94%', label: 'Profile Score', change: '+12%', up: true, color: 'orange' }
      ];
      
      return (
        <div className="fade-in">
          {/* Stats */}
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
          
          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <i className="fas fa-rocket"></i>
                Quick Actions
              </h2>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
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
            <div className="card" style={{ marginTop: '24px', textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
              <h3 style={{ marginBottom: '8px', fontFamily: 'Space Grotesk' }}>No Resume Uploaded</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                Upload your resume to get started. We'll extract all your information automatically.
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
                  Analyzing Resume...
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
          
          <div style={{ marginTop: '24px', padding: '16px', background: 'var(--glass-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-info-circle" style={{ color: 'var(--accent-cyan)' }}></i>
              Your resume is parsed locally in your browser. No data is sent to any server.
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
            <label className="form-label"><i className="fas fa-quote-left"></i> Tagline</label>
            <input 
              type="text"
              className="form-input"
              value={profile.basics.tagline}
              onChange={(e) => updateBasics('tagline', e.target.value)}
              placeholder="10+ years driving product innovation"
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
          <div style={{ marginTop: '24px' }}>
            <details>
              <summary style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '14px' }}>
                View extracted raw text
              </summary>
              <pre style={{ 
                marginTop: '12px', 
                padding: '16px', 
                background: 'var(--bg-tertiary)', 
                borderRadius: 'var(--radius-md)',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                maxHeight: '200px',
                overflow: 'auto',
                whiteSpace: 'pre-wrap'
              }}>
                {rawText}
              </pre>
            </details>
          </div>
        )}
      </div>
    );
    
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
                    placeholder="Describe your role and accomplishments..."
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
                    style={{ width: '100%' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--accent-cyan)' }}>Great Culture</span>
                    <span style={{ color: 'var(--accent-red)' }}>Toxic</span>
                  </div>
                </div>
              </div>
              
              {/* Day in Life */}
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-secondary)' }}>
                  <i className="fas fa-sun" style={{ color: 'var(--accent-orange)', marginRight: '8px' }}></i>
                  A Day in the Life
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {exp.dayInLife.map((item, dayIndex) => (
                    <div key={dayIndex} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ 
                        fontFamily: 'JetBrains Mono', 
                        fontSize: '12px', 
                        color: 'var(--accent-purple)',
                        width: '80px',
                        flexShrink: 0
                      }}>
                        {item.time}
                      </span>
                      <input 
                        type="text"
                        className="form-input"
                        value={item.activity}
                        onChange={(e) => updateDayInLife(index, dayIndex, e.target.value)}
                        placeholder="What do you typically do?"
                        style={{ padding: '10px 14px', fontSize: '13px' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Metrics */}
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-secondary)' }}>
                  <i className="fas fa-chart-line" style={{ color: 'var(--accent-cyan)', marginRight: '8px' }}></i>
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
                          color: 'var(--text-muted)'
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
          
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
              <i className="fas fa-camera" style={{ color: 'var(--accent-purple)', marginRight: '8px' }}></i>
              Photos
            </h3>
            <input type="file" ref={photoRef} onChange={handlePhotoUpload} accept="image/*" multiple style={{ display: 'none' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
              {photos.map(photo => (
                <div key={photo.id} style={{ 
                  aspectRatio: '1', 
                  borderRadius: 'var(--radius-lg)', 
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid var(--glass-border)'
                }}>
                  <img src={photo.url} alt={photo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button 
                    onClick={() => setPhotos(photos.filter(p => p.id !== photo.id))}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '28px',
                      height: '28px',
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
                  borderRadius: 'var(--radius-lg)',
                  border: '2px dashed var(--glass-border)',
                  background: 'var(--glass-bg)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  color: 'var(--text-muted)'
                }}
              >
                <i className="fas fa-plus" style={{ fontSize: '24px' }}></i>
                <span style={{ fontSize: '12px' }}>Add Photo</span>
              </button>
            </div>
          </div>
          
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
              <i className="fas fa-video" style={{ color: 'var(--accent-pink)', marginRight: '8px' }}></i>
              Videos
            </h3>
            <input type="file" ref={videoRef} onChange={handleVideoUpload} accept="video/*" multiple style={{ display: 'none' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {videos.map(video => (
                <div key={video.id} style={{ 
                  aspectRatio: '16/9', 
                  borderRadius: 'var(--radius-lg)', 
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
                      top: '8px',
                      right: '8px',
                      width: '28px',
                      height: '28px',
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
                  borderRadius: 'var(--radius-lg)',
                  border: '2px dashed var(--glass-border)',
                  background: 'var(--glass-bg)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  color: 'var(--text-muted)'
                }}
              >
                <i className="fas fa-plus" style={{ fontSize: '24px' }}></i>
                <span style={{ fontSize: '12px' }}>Add Video</span>
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
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: 'Space Grotesk', marginBottom: '4px' }}>Live Preview</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>This is how your profile will appear</p>
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
        
        {/* Profile Header */}
        <div className="card" style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 20px',
            borderRadius: '50%',
            background: 'var(--gradient-purple)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            fontWeight: '700',
            boxShadow: 'var(--shadow-glow)'
          }}>
            {profile.basics.name ? profile.basics.name.split(' ').map(n => n[0]).join('').substring(0, 2) : '?'}
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk', fontSize: '28px', marginBottom: '4px' }}>
            {profile.basics.name || 'Your Name'}
          </h2>
          <p style={{ color: 'var(--accent-purple)', fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
            {profile.basics.title || 'Your Title'}
          </p>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>
            {profile.basics.tagline || 'Your professional tagline'}
          </p>
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
                  <h3 className="timeline-company">{exp.company}</h3>
                  <p className="timeline-role">{exp.role}</p>
                  <span className="timeline-dates">{exp.startDate} - {exp.endDate}</span>
                  <p className="timeline-desc">{exp.description}</p>
                  
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
