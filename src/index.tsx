import { Hono } from 'hono'

const app = new Hono()

// Main Webume Application
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Webume - Brad Powell | The Resume Killer</title>
  <meta name="description" content="30+ years of verified impact. Real results, not paragraphs. Evidence wins.">
  <meta property="og:title" content="Brad Powell - Webume">
  <meta property="og:description" content="Senior Operations Leader | 47% Revenue Growth | Verified by Colleagues">
  <meta property="og:type" content="profile">
  
  <!-- React 18 -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  
  <!-- Chart.js for interactive charts -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  
  <!-- html2canvas for PDF export -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <style>
    :root {
      --bg-primary: #0a0a0f;
      --bg-secondary: #12121a;
      --bg-card: #1a1a24;
      --bg-elevated: #22222e;
      --text-primary: #ffffff;
      --text-secondary: #a0a0b0;
      --text-muted: #6b6b7b;
      --accent-blue: #3b82f6;
      --accent-purple: #8b5cf6;
      --accent-green: #10b981;
      --accent-red: #ef4444;
      --accent-yellow: #f59e0b;
      --accent-gradient: linear-gradient(135deg, #3b82f6, #8b5cf6);
      --border-color: #2a2a3a;
      --shadow-lg: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --radius-xl: 24px;
    }
    
    .light-mode {
      --bg-primary: #f8fafc;
      --bg-secondary: #ffffff;
      --bg-card: #ffffff;
      --bg-elevated: #f1f5f9;
      --text-primary: #0f172a;
      --text-secondary: #475569;
      --text-muted: #94a3b8;
      --border-color: #e2e8f0;
    }
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    html { scroll-behavior: smooth; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
      overflow-x: hidden;
    }
    
    /* Scrollbar */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg-secondary); }
    ::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
    
    /* Typography */
    h1, h2, h3, h4, h5, h6 { font-family: 'Space Grotesk', sans-serif; font-weight: 700; }
    
    /* Container */
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    
    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: var(--radius-md);
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      text-decoration: none;
    }
    
    .btn-primary {
      background: var(--accent-gradient);
      color: white;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4); }
    
    .btn-secondary {
      background: var(--bg-elevated);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }
    .btn-secondary:hover { background: var(--border-color); }
    
    .btn-ghost {
      background: transparent;
      color: var(--text-secondary);
    }
    .btn-ghost:hover { color: var(--text-primary); background: var(--bg-elevated); }
    
    /* Cards */
    .card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 32px;
      transition: all 0.3s ease;
    }
    .card:hover { border-color: var(--accent-blue); box-shadow: var(--shadow-lg); }
    
    /* Badges */
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 50px;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .badge-success { background: rgba(16, 185, 129, 0.15); color: var(--accent-green); }
    .badge-warning { background: rgba(245, 158, 11, 0.15); color: var(--accent-yellow); }
    .badge-danger { background: rgba(239, 68, 68, 0.15); color: var(--accent-red); }
    .badge-info { background: rgba(59, 130, 246, 0.15); color: var(--accent-blue); }
    
    /* Metric Cards */
    .metric-card {
      background: var(--accent-gradient);
      color: white;
      padding: 16px 24px;
      border-radius: var(--radius-md);
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
      font-size: 1rem;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    }
    
    /* Navigation */
    .nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: rgba(10, 10, 15, 0.8);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-color);
      padding: 16px 0;
    }
    .light-mode .nav { background: rgba(248, 250, 252, 0.8); }
    
    .nav-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .nav-logo {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .nav-links { display: flex; gap: 8px; align-items: center; }
    
    .nav-link {
      padding: 8px 16px;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    .nav-link:hover { color: var(--text-primary); background: var(--bg-elevated); }
    .nav-link.active { color: var(--accent-blue); background: rgba(59, 130, 246, 0.1); }
    
    /* Hero Section */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      padding: 120px 0 80px;
      position: relative;
      overflow: hidden;
    }
    
    .hero::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
                  radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%);
      animation: pulse 15s ease-in-out infinite;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(5deg); }
    }
    
    .hero-content {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 64px;
      align-items: center;
    }
    
    .hero-text h1 {
      font-size: 4rem;
      line-height: 1.1;
      margin-bottom: 24px;
      background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .hero-tagline {
      font-size: 1.5rem;
      color: var(--text-secondary);
      margin-bottom: 16px;
      font-weight: 500;
    }
    
    .hero-subtitle {
      font-size: 1.1rem;
      color: var(--text-muted);
      margin-bottom: 32px;
      max-width: 500px;
    }
    
    .hero-metrics {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 40px;
    }
    
    .hero-video {
      position: relative;
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-color);
    }
    
    .hero-video iframe {
      width: 100%;
      aspect-ratio: 16/9;
      display: block;
    }
    
    .video-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 24px;
      background: linear-gradient(transparent, rgba(0,0,0,0.8));
      color: white;
    }
    
    /* Section Styles */
    .section {
      padding: 100px 0;
      position: relative;
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 64px;
    }
    
    .section-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: var(--bg-elevated);
      border-radius: 50px;
      font-size: 0.85rem;
      color: var(--accent-blue);
      font-weight: 600;
      margin-bottom: 16px;
    }
    
    .section-title {
      font-size: 3rem;
      margin-bottom: 16px;
    }
    
    .section-desc {
      font-size: 1.2rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
    }
    
    /* Timeline */
    .timeline { position: relative; }
    
    .timeline::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--border-color);
      transform: translateX(-50%);
    }
    
    .timeline-item {
      position: relative;
      margin-bottom: 64px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 64px;
      align-items: start;
    }
    
    .timeline-item:nth-child(even) .timeline-content { order: 2; }
    .timeline-item:nth-child(even) .timeline-media { order: 1; }
    
    .timeline-dot {
      position: absolute;
      left: 50%;
      top: 32px;
      width: 20px;
      height: 20px;
      background: var(--accent-gradient);
      border-radius: 50%;
      transform: translateX(-50%);
      box-shadow: 0 0 0 4px var(--bg-primary), 0 0 20px rgba(59, 130, 246, 0.5);
      z-index: 2;
    }
    
    .timeline-content .card { height: 100%; }
    
    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 12px;
    }
    
    .timeline-role {
      font-size: 1.5rem;
      margin-bottom: 4px;
    }
    
    .timeline-company {
      color: var(--accent-blue);
      font-size: 1.1rem;
      font-weight: 600;
    }
    
    .timeline-dates {
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    
    .timeline-narrative {
      color: var(--text-secondary);
      margin-bottom: 24px;
      line-height: 1.8;
    }
    
    .timeline-metrics {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 24px;
    }
    
    .timeline-media {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .media-item {
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: 1px solid var(--border-color);
    }
    
    .media-item iframe, .media-item img {
      width: 100%;
      display: block;
    }
    
    .chart-container {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 24px;
    }
    
    /* Validations */
    .validations { margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border-color); }
    
    .validations-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .validations-title {
      font-size: 1rem;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .validation-card {
      background: var(--bg-elevated);
      border-radius: var(--radius-md);
      padding: 20px;
      margin-bottom: 12px;
      display: flex;
      gap: 16px;
    }
    
    .validation-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--accent-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      flex-shrink: 0;
    }
    
    .validation-content { flex: 1; }
    
    .validation-quote {
      font-style: italic;
      color: var(--text-primary);
      margin-bottom: 12px;
      line-height: 1.7;
    }
    
    .validation-author {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .validation-name { font-weight: 600; }
    .validation-role { color: var(--text-muted); font-size: 0.9rem; }
    
    /* Truth Vault */
    .truth-vault-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
    }
    
    .company-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 24px;
      transition: all 0.3s ease;
    }
    
    .company-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
    
    .company-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }
    
    .company-name { font-size: 1.25rem; margin-bottom: 4px; }
    
    .company-score {
      font-size: 2rem;
      font-weight: 800;
      font-family: 'Space Grotesk', sans-serif;
    }
    
    .score-label { font-size: 0.8rem; color: var(--text-muted); }
    
    .toxicity-bar {
      height: 8px;
      background: var(--bg-elevated);
      border-radius: 4px;
      overflow: hidden;
      margin: 16px 0;
    }
    
    .toxicity-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.5s ease;
    }
    
    .company-comment {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin-bottom: 16px;
    }
    
    .company-meta {
      display: flex;
      justify-content: space-between;
      color: var(--text-muted);
      font-size: 0.85rem;
    }
    
    /* Leaderboard */
    .leaderboard {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      overflow: hidden;
      margin-top: 48px;
    }
    
    .leaderboard-header {
      padding: 24px;
      background: var(--bg-elevated);
      border-bottom: 1px solid var(--border-color);
    }
    
    .leaderboard-title {
      font-size: 1.25rem;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .leaderboard-tabs {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }
    
    .leaderboard-tab {
      padding: 8px 16px;
      border-radius: var(--radius-sm);
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .leaderboard-tab.active {
      background: var(--accent-blue);
      border-color: var(--accent-blue);
      color: white;
    }
    
    .leaderboard-list { padding: 16px; }
    
    .leaderboard-item {
      display: flex;
      align-items: center;
      padding: 16px;
      border-radius: var(--radius-md);
      transition: background 0.2s;
    }
    
    .leaderboard-item:hover { background: var(--bg-elevated); }
    
    .leaderboard-rank {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      margin-right: 16px;
    }
    
    .rank-1 { background: linear-gradient(135deg, #ffd700, #ffb700); color: #000; }
    .rank-2 { background: linear-gradient(135deg, #c0c0c0, #a0a0a0); color: #000; }
    .rank-3 { background: linear-gradient(135deg, #cd7f32, #a0522d); color: #fff; }
    .rank-default { background: var(--bg-elevated); color: var(--text-secondary); }
    
    .leaderboard-info { flex: 1; }
    .leaderboard-company { font-weight: 600; }
    .leaderboard-reports { font-size: 0.85rem; color: var(--text-muted); }
    
    .leaderboard-score {
      font-size: 1.5rem;
      font-weight: 700;
      font-family: 'Space Grotesk', sans-serif;
    }
    
    /* Hunter Agent Chat */
    .chat-trigger {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 64px;
      height: 64px;
      background: var(--accent-gradient);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 8px 32px rgba(59, 130, 246, 0.4);
      z-index: 1000;
      transition: all 0.3s ease;
      border: none;
      color: white;
      font-size: 24px;
    }
    
    .chat-trigger:hover { transform: scale(1.1); }
    .chat-trigger.active { border-radius: var(--radius-lg); }
    
    .chat-notification {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 16px;
      height: 16px;
      background: var(--accent-red);
      border-radius: 50%;
      animation: pulse-dot 2s infinite;
    }
    
    @keyframes pulse-dot {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.2); opacity: 0.8; }
    }
    
    .chat-window {
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 420px;
      height: 600px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
      display: flex;
      flex-direction: column;
      z-index: 1000;
      animation: slideUp 0.3s ease;
    }
    
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .chat-header {
      padding: 20px 24px;
      background: var(--accent-gradient);
      border-radius: var(--radius-xl) var(--radius-xl) 0 0;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .chat-avatar {
      width: 48px;
      height: 48px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    
    .chat-title { color: white; font-size: 1.1rem; font-weight: 600; }
    .chat-status { color: rgba(255,255,255,0.8); font-size: 0.85rem; display: flex; align-items: center; gap: 6px; }
    .chat-status::before { content: ''; width: 8px; height: 8px; background: #10b981; border-radius: 50%; }
    
    .chat-close {
      margin-left: auto;
      background: rgba(255,255,255,0.2);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .chat-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .chat-message {
      max-width: 85%;
      padding: 14px 18px;
      border-radius: var(--radius-lg);
      line-height: 1.5;
    }
    
    .chat-message.bot {
      background: var(--bg-elevated);
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    
    .chat-message.user {
      background: var(--accent-gradient);
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    
    .chat-message .highlight {
      background: rgba(59, 130, 246, 0.2);
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 600;
    }
    
    .chat-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
    
    .chat-action-btn {
      padding: 8px 14px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 50px;
      font-size: 0.85rem;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .chat-action-btn:hover { background: var(--accent-blue); color: white; border-color: var(--accent-blue); }
    
    .chat-input-area {
      padding: 16px 20px;
      border-top: 1px solid var(--border-color);
      display: flex;
      gap: 12px;
    }
    
    .chat-input {
      flex: 1;
      padding: 14px 18px;
      background: var(--bg-elevated);
      border: 1px solid var(--border-color);
      border-radius: 50px;
      color: var(--text-primary);
      font-size: 0.95rem;
      outline: none;
    }
    
    .chat-input:focus { border-color: var(--accent-blue); }
    
    .chat-send {
      width: 48px;
      height: 48px;
      background: var(--accent-gradient);
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }
    
    .chat-send:hover { transform: scale(1.05); }
    
    /* Dashboard Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(8px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    
    .modal {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-xl);
      width: 100%;
      max-width: 900px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .modal-header {
      padding: 24px;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .modal-title { font-size: 1.5rem; }
    
    .modal-close {
      width: 40px;
      height: 40px;
      background: var(--bg-elevated);
      border: none;
      border-radius: 50%;
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }
    
    .modal-body { padding: 24px; overflow-y: auto; flex: 1; }
    
    .modal-footer {
      padding: 16px 24px;
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    
    /* Forms */
    .form-group { margin-bottom: 20px; }
    
    .form-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      font-size: 0.95rem;
    }
    
    .form-input, .form-textarea {
      width: 100%;
      padding: 14px 18px;
      background: var(--bg-elevated);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s;
    }
    
    .form-input:focus, .form-textarea:focus { border-color: var(--accent-blue); }
    
    .form-textarea { min-height: 120px; resize: vertical; font-family: inherit; }
    
    /* Validation Form */
    .validation-form {
      background: var(--bg-elevated);
      border-radius: var(--radius-lg);
      padding: 24px;
      margin-top: 24px;
    }
    
    .validation-form-title {
      font-size: 1.1rem;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    /* Footer */
    .footer {
      padding: 64px 0 32px;
      border-top: 1px solid var(--border-color);
      text-align: center;
    }
    
    .footer-brand {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      background: var(--accent-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 16px;
    }
    
    .footer-tagline {
      color: var(--text-muted);
      margin-bottom: 24px;
    }
    
    .footer-links {
      display: flex;
      justify-content: center;
      gap: 24px;
      margin-bottom: 24px;
    }
    
    .footer-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    
    .footer-link:hover { color: var(--accent-blue); }
    
    .footer-copy { color: var(--text-muted); font-size: 0.9rem; }
    
    /* Responsive */
    @media (max-width: 1024px) {
      .hero-content { grid-template-columns: 1fr; text-align: center; }
      .hero-text h1 { font-size: 3rem; }
      .hero-subtitle { margin: 0 auto 32px; }
      .hero-metrics { justify-content: center; }
      .timeline::before { left: 20px; }
      .timeline-item { grid-template-columns: 1fr; padding-left: 48px; }
      .timeline-item:nth-child(even) .timeline-content { order: 1; }
      .timeline-item:nth-child(even) .timeline-media { order: 2; }
      .timeline-dot { left: 20px; }
    }
    
    @media (max-width: 768px) {
      .nav-links { display: none; }
      .hero-text h1 { font-size: 2.5rem; }
      .section-title { font-size: 2rem; }
      .chat-window { width: calc(100vw - 48px); right: 24px; left: 24px; height: 70vh; bottom: 96px; }
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect, useRef, useCallback } = React;

    // ============================================
    // DATA STORE - All profile data
    // ============================================
    const initialData = {
      profile: {
        name: 'Brad Powell',
        tagline: 'Real results, not paragraphs.',
        subtitle: '30+ years driving revenue growth. Every claim verified. Every metric proven.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        email: 'brad@webume.app',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/bradpowell',
        calendlyUrl: 'https://calendly.com/bradpowell/30min'
      },
      timeline: [
        {
          id: 1,
          role: 'Senior Operations Leader',
          company: 'Acme Corp',
          dates: '2015 – 2025',
          narrative: \`Led a complete organizational turnaround in a company on the verge of collapse. Inherited a demoralized team of 20 with outdated processes, zero visibility into operations, and bleeding revenue.

Within 18 months, I rebuilt everything from the ground up: implemented real-time analytics dashboards that gave leadership actual visibility for the first time, redesigned workflows that cut processing time by 40%, and created a culture of accountability that attracted top talent.

The team grew from 20 to 80 people — not through aggressive hiring, but because people wanted to work here. We became known as the turnaround team. The CFO called it "the most significant operational transformation in company history."

Key wins:
• Built custom dashboards that C-suite now uses daily for all strategic decisions
• Negotiated vendor contracts that saved \$2.3M annually
• Implemented agile methodologies across 6 departments
• Zero voluntary turnover in final 2 years\`,
          metrics: [
            { label: 'Revenue Growth', value: '+47%', icon: 'fa-chart-line' },
            { label: 'Cost Reduction', value: '-22%', icon: 'fa-piggy-bank' },
            { label: 'Team Efficiency', value: '+65%', icon: 'fa-rocket' },
            { label: 'Customer Satisfaction', value: '+35%', icon: 'fa-heart' }
          ],
          chartData: {
            labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
            revenue: [12, 14, 18, 24, 31, 38, 45, 52, 61, 71],
            costs: [10, 9.5, 9, 8.5, 8, 7.8, 7.5, 7.2, 7, 6.8]
          },
          media: [
            { type: 'video', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Project Walkthrough: The Acme Turnaround' }
          ]
        },
        {
          id: 2,
          role: 'Operations Manager',
          company: 'TechGiant Inc',
          dates: '2008 – 2015',
          narrative: \`Joined as employee #47 right after Series A. Left after IPO as the person who built the operational backbone that made it possible.

When I started, we were processing 500 orders a day with spreadsheets and prayer. By the time I left, we were handling 50,000 daily with 99.97% accuracy. The systems I built are still running today.

The secret wasn't just technology — it was understanding that operations is really about people. I hired and trained 200+ team members, many of whom are now directors and VPs across the industry. We created an operational playbook that became the template for three subsequent acquisitions.

During the IPO roadshow, the CEO specifically highlighted our operational efficiency as a key differentiator. That felt good.\`,
          metrics: [
            { label: 'Volume Scaled', value: '+10,000%', icon: 'fa-expand' },
            { label: 'Error Rate', value: '-90%', icon: 'fa-check-circle' },
            { label: 'Processing Time', value: '-60%', icon: 'fa-clock' },
            { label: 'Team Built', value: '200+', icon: 'fa-users' }
          ],
          chartData: {
            labels: ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015'],
            revenue: [2, 5, 12, 28, 52, 89, 134, 201],
            costs: [3, 4, 5, 6, 7, 8, 8.5, 9]
          },
          media: []
        },
        {
          id: 3,
          role: 'Process Engineer',
          company: 'StartupXYZ',
          dates: '2002 – 2008',
          narrative: \`First operations hire at a scrappy startup. Built everything from nothing — literally wrote the first process document on a napkin at a coffee shop.

This is where I learned that constraints breed creativity. With no budget, I automated processes using free tools and elbow grease. The SOPs I created here became industry templates — I still see variations of them used at companies today.

Most importantly, this is where I learned to mentor. The junior staff I trained here have gone on to lead teams at Google, Amazon, and Meta. That legacy matters more than any metric.\`,
          metrics: [
            { label: 'Process Efficiency', value: '+200%', icon: 'fa-cogs' },
            { label: 'Quality Score', value: '99.2%', icon: 'fa-star' },
            { label: 'Docs Created', value: '150+', icon: 'fa-file-alt' }
          ],
          chartData: null,
          media: []
        }
      ],
      validations: {
        1: [
          { id: 1, text: "Brad was instrumental in our turnaround. He didn't just optimize processes — he transformed how we think about operations. His dashboards gave us visibility we never had before.", name: 'Sarah Chen', role: 'VP of Engineering, Acme Corp', approved: true, date: '2024-11-15' },
          { id: 2, text: "Best leader I've ever worked under. Data-driven but never cold. Always had time for 1:1s despite running six departments. Made me a better professional.", name: 'Mike Rodriguez', role: 'Senior Analyst (Direct Report)', approved: true, date: '2024-10-22' },
          { id: 3, text: "Transformed our failing department into a profit center. The executive team was ready to shut us down before Brad stepped in. His vendor negotiations alone saved us millions.", name: 'Jennifer Walsh', role: 'CFO, Acme Corp', approved: true, date: '2024-09-30' }
        ],
        2: [
          { id: 4, text: "Brad built the operational systems that scaled with us through IPO. His foresight in system design saved us from what would have been catastrophic growing pains.", name: 'David Park', role: 'CTO, TechGiant Inc', approved: true, date: '2024-08-15' },
          { id: 5, text: "I learned more from Brad in 2 years than my entire MBA program. He's the reason I'm a director today.", name: 'Lisa Thompson', role: 'Director of Operations, Meta', approved: true, date: '2024-07-20' }
        ],
        3: [
          { id: 6, text: "Brad set the standard for operational excellence at our startup. The processes he built are still running 15 years later.", name: 'Tom Baker', role: 'Founder & CEO, StartupXYZ', approved: true, date: '2024-06-10' }
        ]
      },
      pendingValidations: [
        { id: 7, text: "Great mentor and colleague. Taught me everything about operations.", name: 'New Colleague', role: 'Unknown', jobId: 1, date: '2025-01-07' }
      ],
      truthVault: [
        { id: 1, company: 'Acme Corp', score: 7.2, reports: 47, trend: 'up', comment: 'High pressure but fair leadership. Good work-life balance initiatives recently. Transparent about challenges.', category: 'enterprise' },
        { id: 2, company: 'TechGiant Inc', score: 8.4, reports: 156, trend: 'stable', comment: 'Great culture, transparent communication, strong benefits. Engineering-first mindset can frustrate other departments.', category: 'tech' },
        { id: 3, company: 'BadCo Industries', score: 2.1, reports: 89, trend: 'down', comment: 'Toxic leadership, high turnover, broken promises. Multiple HR complaints ignored. Avoid.', category: 'enterprise' },
        { id: 4, company: 'GoodPlace Solutions', score: 9.1, reports: 34, trend: 'up', comment: 'Genuinely employee-first culture. Remote-friendly, mental health support, unlimited PTO that people actually use.', category: 'startup' },
        { id: 5, company: 'Mediocre Ltd', score: 5.3, reports: 23, trend: 'stable', comment: 'Not terrible, not great. Standard corporate environment. Gets the job done but no passion.', category: 'enterprise' },
        { id: 6, company: 'StartupXYZ', score: 6.8, reports: 12, trend: 'up', comment: 'Fast-paced and demanding, but rewarding if you like ownership. Early employees did very well.', category: 'startup' },
        { id: 7, company: 'NightmareCorp', score: 1.8, reports: 203, trend: 'down', comment: 'Worst company Ive ever worked for. Gaslighting management, impossible targets, disposable employees.', category: 'enterprise' },
        { id: 8, company: 'DreamTeam Co', score: 8.9, reports: 67, trend: 'up', comment: 'Amazing people, great mission, competitive pay. Hard to get in but worth it.', category: 'tech' }
      ]
    };

    // ============================================
    // MAIN APP COMPONENT
    // ============================================
    const App = () => {
      const [data, setData] = useState(initialData);
      const [darkMode, setDarkMode] = useState(true);
      const [chatOpen, setChatOpen] = useState(false);
      const [dashboardOpen, setDashboardOpen] = useState(false);
      const [validationFormOpen, setValidationFormOpen] = useState(null);
      const [activeSection, setActiveSection] = useState('all');
      const [leaderboardTab, setLeaderboardTab] = useState('best');

      // Load saved data
      useEffect(() => {
        const saved = localStorage.getItem('webumeData');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setData(prev => ({ ...prev, ...parsed }));
          } catch (e) {
            console.log('Using default data');
          }
        }
      }, []);

      // Save data changes
      useEffect(() => {
        localStorage.setItem('webumeData', JSON.stringify(data));
      }, [data]);

      // Handle dark mode
      useEffect(() => {
        document.body.classList.toggle('light-mode', !darkMode);
      }, [darkMode]);

      // Scroll to section
      const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id);
      };

      return (
        <div>
          {/* Navigation */}
          <Navigation 
            darkMode={darkMode} 
            setDarkMode={setDarkMode}
            onDashboard={() => setDashboardOpen(true)}
            scrollTo={scrollTo}
            activeSection={activeSection}
          />

          {/* Hero Section */}
          <HeroSection profile={data.profile} />

          {/* Timeline Section */}
          <TimelineSection 
            timeline={data.timeline}
            validations={data.validations}
            onValidationForm={setValidationFormOpen}
          />

          {/* Truth Vault Section */}
          <TruthVaultSection 
            truthVault={data.truthVault}
            leaderboardTab={leaderboardTab}
            setLeaderboardTab={setLeaderboardTab}
          />

          {/* Footer */}
          <Footer profile={data.profile} />

          {/* Hunter Agent Chat */}
          <HunterAgent 
            isOpen={chatOpen}
            onToggle={() => setChatOpen(!chatOpen)}
            profile={data.profile}
            timeline={data.timeline}
            truthVault={data.truthVault}
          />

          {/* Dashboard Modal */}
          {dashboardOpen && (
            <DashboardModal 
              data={data}
              setData={setData}
              onClose={() => setDashboardOpen(false)}
            />
          )}

          {/* Validation Form Modal */}
          {validationFormOpen && (
            <ValidationFormModal
              jobId={validationFormOpen}
              timeline={data.timeline}
              onSubmit={(validation) => {
                setData(prev => ({
                  ...prev,
                  pendingValidations: [...prev.pendingValidations, { ...validation, id: Date.now(), date: new Date().toISOString().split('T')[0] }]
                }));
                setValidationFormOpen(null);
              }}
              onClose={() => setValidationFormOpen(null)}
            />
          )}
        </div>
      );
    };

    // ============================================
    // NAVIGATION COMPONENT
    // ============================================
    const Navigation = ({ darkMode, setDarkMode, onDashboard, scrollTo, activeSection }) => {
      return (
        <nav className="nav">
          <div className="container nav-inner">
            <div className="nav-logo">Webume</div>
            <div className="nav-links">
              <a href="#hero" className={"nav-link" + (activeSection === 'hero' ? ' active' : '')} onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}>Home</a>
              <a href="#timeline" className={"nav-link" + (activeSection === 'timeline' ? ' active' : '')} onClick={(e) => { e.preventDefault(); scrollTo('timeline'); }}>Timeline</a>
              <a href="#truth-vault" className={"nav-link" + (activeSection === 'truth-vault' ? ' active' : '')} onClick={(e) => { e.preventDefault(); scrollTo('truth-vault'); }}>Truth Vault</a>
              <button className="btn btn-ghost" onClick={() => setDarkMode(!darkMode)}>
                <i className={"fas " + (darkMode ? "fa-sun" : "fa-moon")}></i>
              </button>
              <button className="btn btn-secondary" onClick={onDashboard}>
                <i className="fas fa-cog"></i> Dashboard
              </button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                <i className="fas fa-file-pdf"></i> Export PDF
              </button>
            </div>
          </div>
        </nav>
      );
    };

    // ============================================
    // HERO SECTION
    // ============================================
    const HeroSection = ({ profile }) => {
      return (
        <section className="hero" id="hero">
          <div className="container hero-content">
            <div className="hero-text">
              <h1>{profile.name}</h1>
              <p className="hero-tagline">{profile.tagline}</p>
              <p className="hero-subtitle">{profile.subtitle}</p>
              
              <div className="hero-metrics">
                <div className="metric-card">
                  <i className="fas fa-chart-line"></i>
                  <span>+47% Revenue</span>
                </div>
                <div className="metric-card">
                  <i className="fas fa-piggy-bank"></i>
                  <span>-22% Costs</span>
                </div>
                <div className="metric-card">
                  <i className="fas fa-users"></i>
                  <span>200+ Team Built</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href={profile.calendlyUrl} target="_blank" className="btn btn-primary">
                  <i className="fas fa-calendar"></i> Book a Call
                </a>
                <a href={"mailto:" + profile.email} className="btn btn-secondary">
                  <i className="fas fa-envelope"></i> Contact
                </a>
                <a href={"https://" + profile.linkedin} target="_blank" className="btn btn-ghost">
                  <i className="fab fa-linkedin"></i> LinkedIn
                </a>
              </div>
            </div>

            <div className="hero-video">
              <iframe 
                src={profile.videoUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="video-overlay">
                <strong>60-Second Intro</strong>
                <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '4px' }}>Who I am. What I deliver. No fluff.</p>
              </div>
            </div>
          </div>
        </section>
      );
    };

    // ============================================
    // TIMELINE SECTION
    // ============================================
    const TimelineSection = ({ timeline, validations, onValidationForm }) => {
      return (
        <section className="section" id="timeline" style={{ background: 'var(--bg-secondary)' }}>
          <div className="container">
            <div className="section-header">
              <div className="section-badge">
                <i className="fas fa-briefcase"></i> Career Timeline
              </div>
              <h2 className="section-title">Proof of Work</h2>
              <p className="section-desc">Full narratives, real metrics, verified by colleagues. No bullet-point lies.</p>
            </div>

            <div className="timeline">
              {timeline.map((job, index) => (
                <TimelineItem 
                  key={job.id}
                  job={job}
                  validations={validations[job.id] || []}
                  onValidationForm={onValidationForm}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      );
    };

    // ============================================
    // TIMELINE ITEM
    // ============================================
    const TimelineItem = ({ job, validations, onValidationForm, index }) => {
      const chartRef = useRef(null);
      const chartInstance = useRef(null);

      useEffect(() => {
        if (job.chartData && chartRef.current) {
          const ctx = chartRef.current.getContext('2d');
          
          if (chartInstance.current) {
            chartInstance.current.destroy();
          }

          chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
              labels: job.chartData.labels,
              datasets: [
                {
                  label: 'Revenue ($M)',
                  data: job.chartData.revenue,
                  borderColor: '#3b82f6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  fill: true,
                  tension: 0.4
                },
                {
                  label: 'Costs ($M)',
                  data: job.chartData.costs,
                  borderColor: '#ef4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
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
                  position: 'top',
                  labels: { color: '#a0a0b0' }
                }
              },
              scales: {
                x: { ticks: { color: '#6b6b7b' }, grid: { color: '#2a2a3a' } },
                y: { ticks: { color: '#6b6b7b' }, grid: { color: '#2a2a3a' } }
              }
            }
          });
        }

        return () => {
          if (chartInstance.current) {
            chartInstance.current.destroy();
          }
        };
      }, [job.chartData]);

      return (
        <div className="timeline-item">
          <div className="timeline-dot"></div>
          
          <div className="timeline-content">
            <div className="card">
              <div className="timeline-header">
                <div>
                  <h3 className="timeline-role">{job.role}</h3>
                  <div className="timeline-company">{job.company}</div>
                </div>
                <span className="timeline-dates">{job.dates}</span>
              </div>

              <div className="timeline-narrative">
                {job.narrative.split('\\n\\n').map((para, i) => (
                  <p key={i} style={{ marginBottom: '16px' }}>{para}</p>
                ))}
              </div>

              <div className="timeline-metrics">
                {job.metrics.map((metric, i) => (
                  <div key={i} className="metric-card" style={{ fontSize: '0.9rem', padding: '10px 16px' }}>
                    <i className={"fas " + metric.icon}></i>
                    <span>{metric.value} {metric.label}</span>
                  </div>
                ))}
              </div>

              {/* Validations */}
              <div className="validations">
                <div className="validations-header">
                  <h4 className="validations-title">
                    <i className="fas fa-user-check"></i>
                    Colleague Validations ({validations.length})
                  </h4>
                  <button className="btn btn-ghost" onClick={() => onValidationForm(job.id)}>
                    <i className="fas fa-plus"></i> Add Yours
                  </button>
                </div>

                {validations.filter(v => v.approved).map(validation => (
                  <div key={validation.id} className="validation-card">
                    <div className="validation-avatar">
                      {validation.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="validation-content">
                      <p className="validation-quote">"{validation.text}"</p>
                      <div className="validation-author">
                        <div>
                          <div className="validation-name">{validation.name}</div>
                          <div className="validation-role">{validation.role}</div>
                        </div>
                        <span className="badge badge-success">
                          <i className="fas fa-check-circle"></i> Verified Colleague
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="timeline-media">
            {job.chartData && (
              <div className="chart-container">
                <h4 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
                  <i className="fas fa-chart-area" style={{ marginRight: '8px' }}></i>
                  Performance Metrics
                </h4>
                <div style={{ height: '250px' }}>
                  <canvas ref={chartRef}></canvas>
                </div>
              </div>
            )}
            
            {job.media.map((item, i) => (
              <div key={i} className="media-item">
                {item.type === 'video' ? (
                  <iframe 
                    src={item.url}
                    height="200"
                    frameBorder="0"
                    allowFullScreen
                    title={item.title}
                  ></iframe>
                ) : (
                  <img src={item.url} alt={item.title} />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    };

    // ============================================
    // TRUTH VAULT SECTION
    // ============================================
    const TruthVaultSection = ({ truthVault, leaderboardTab, setLeaderboardTab }) => {
      const getScoreColor = (score) => {
        if (score >= 7) return 'var(--accent-green)';
        if (score >= 4) return 'var(--accent-yellow)';
        return 'var(--accent-red)';
      };

      const sortedCompanies = [...truthVault].sort((a, b) => 
        leaderboardTab === 'best' ? b.score - a.score : a.score - b.score
      );

      return (
        <section className="section" id="truth-vault">
          <div className="container">
            <div className="section-header">
              <div className="section-badge">
                <i className="fas fa-shield-alt"></i> Truth Vault
              </div>
              <h2 className="section-title">Company Transparency</h2>
              <p className="section-desc">Anonymous ratings from real employees. Exposing the good, the bad, and the toxic.</p>
            </div>

            <div className="truth-vault-grid">
              {truthVault.slice(0, 6).map(company => (
                <div key={company.id} className="company-card">
                  <div className="company-header">
                    <div>
                      <h3 className="company-name">{company.company}</h3>
                      <span className="badge badge-info">{company.category}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="company-score" style={{ color: getScoreColor(company.score) }}>
                        {company.score}
                      </div>
                      <div className="score-label">/10 Culture Score</div>
                    </div>
                  </div>

                  <div className="toxicity-bar">
                    <div 
                      className="toxicity-fill"
                      style={{ 
                        width: (company.score * 10) + '%',
                        background: getScoreColor(company.score)
                      }}
                    ></div>
                  </div>

                  <p className="company-comment">{company.comment}</p>

                  <div className="company-meta">
                    <span><i className="fas fa-users"></i> {company.reports} reports</span>
                    <span>
                      <i className={"fas fa-arrow-" + (company.trend === 'up' ? 'up' : company.trend === 'down' ? 'down' : 'right')} 
                         style={{ color: company.trend === 'up' ? 'var(--accent-green)' : company.trend === 'down' ? 'var(--accent-red)' : 'var(--text-muted)' }}></i>
                      {' '}{company.trend === 'up' ? 'Improving' : company.trend === 'down' ? 'Declining' : 'Stable'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Leaderboard */}
            <div className="leaderboard">
              <div className="leaderboard-header">
                <h3 className="leaderboard-title">
                  <i className="fas fa-trophy"></i>
                  Company Leaderboard
                </h3>
                <div className="leaderboard-tabs">
                  <button 
                    className={"leaderboard-tab" + (leaderboardTab === 'best' ? ' active' : '')}
                    onClick={() => setLeaderboardTab('best')}
                  >
                    <i className="fas fa-star"></i> Best Places
                  </button>
                  <button 
                    className={"leaderboard-tab" + (leaderboardTab === 'worst' ? ' active' : '')}
                    onClick={() => setLeaderboardTab('worst')}
                  >
                    <i className="fas fa-skull"></i> Wall of Shame
                  </button>
                </div>
              </div>
              <div className="leaderboard-list">
                {sortedCompanies.slice(0, 5).map((company, index) => (
                  <div key={company.id} className="leaderboard-item">
                    <div className={"leaderboard-rank " + (index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'rank-default')}>
                      {index + 1}
                    </div>
                    <div className="leaderboard-info">
                      <div className="leaderboard-company">{company.company}</div>
                      <div className="leaderboard-reports">{company.reports} anonymous reports</div>
                    </div>
                    <div className="leaderboard-score" style={{ color: getScoreColor(company.score) }}>
                      {company.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    };

    // ============================================
    // HUNTER AGENT (AI CHATBOT)
    // ============================================
    const HunterAgent = ({ isOpen, onToggle, profile, timeline, truthVault }) => {
      const [messages, setMessages] = useState([]);
      const [input, setInput] = useState('');
      const [isTyping, setIsTyping] = useState(false);
      const messagesEndRef = useRef(null);

      // Auto-scroll
      useEffect(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, [messages]);

      // Initial greeting
      useEffect(() => {
        if (isOpen && messages.length === 0) {
          setTimeout(() => {
            setMessages([{
              id: 1,
              type: 'bot',
              text: "Hey! I'm Brad's AI Headhunter. He drove **47% revenue growth** at Acme Corp and scaled TechGiant from Series A to IPO. What would you like to know?",
              actions: ['View Case Studies', 'Check Availability', 'Book a Call', 'Download Resume']
            }]);
          }, 500);
        }
      }, [isOpen]);

      const generateResponse = (userMessage) => {
        const lower = userMessage.toLowerCase();
        
        // Comprehensive response logic
        if (lower.includes('case study') || lower.includes('case studies') || lower.includes('proof') || lower.includes('evidence')) {
          return {
            text: "Absolutely! Brad's best case study is the **Acme Corp turnaround**:\\n\\n📈 **Revenue**: +47% over 3 years\\n💰 **Cost reduction**: $2.3M annual savings\\n👥 **Team growth**: 20 → 80 people\\n\\nHe inherited a failing department and turned it into a profit center. The CFO called it 'the most significant operational transformation in company history.' Scroll up to see the full story with charts!",
            actions: ['See Revenue Chart', 'Read Full Story', 'View Validations']
          };
        }
        
        if (lower.includes('salary') || lower.includes('compensation') || lower.includes('pay') || lower.includes('rate')) {
          return {
            text: "Brad targets **senior executive-level compensation**. He's flexible for the right opportunity, especially if there's:\\n\\n✓ Strong equity component\\n✓ High-impact role\\n✓ Culture match (Truth Vault score 7+)\\n\\nWhat's your range? I can tell you if it's in the ballpark.",
            actions: ['Share Budget Range', 'Discuss Equity', 'Book Compensation Call']
          };
        }
        
        if (lower.includes('available') || lower.includes('start') || lower.includes('when') || lower.includes('timeline')) {
          return {
            text: "Brad can start within **2-4 weeks** with standard notice. For the right role, he's open to discussing accelerated timelines.\\n\\nHe's currently evaluating 3 other opportunities, so I'd recommend moving quickly if there's mutual interest.",
            actions: ['Book Intro Call', 'Send Job Description', 'Check Calendar']
          };
        }
        
        if (lower.includes('remote') || lower.includes('location') || lower.includes('relocation') || lower.includes('hybrid')) {
          return {
            text: "Brad is **flexible on location**:\\n\\n🏠 Remote: Yes, with occasional travel\\n🏢 Hybrid: Preferred for leadership roles\\n📍 On-site: Open to relocating for exec positions\\n\\nCurrently based in San Francisco. Where's your team located?",
            actions: ['We\\'re Remote', 'Hybrid Setup', 'On-site Required']
          };
        }
        
        if (lower.includes('culture') || lower.includes('truth vault') || lower.includes('toxic') || lower.includes('company')) {
          const goodCompanies = truthVault.filter(c => c.score >= 7).map(c => c.company).join(', ');
          return {
            text: "Great question! Brad believes in **radical transparency**. Check out the Truth Vault above to see anonymous culture ratings.\\n\\n🌟 **Top-rated companies**: " + goodCompanies + "\\n\\nWhat's your company's culture score? Brad specifically avoids places scoring below 5.",
            actions: ['Rate Your Company', 'View Full Leaderboard', 'Discuss Culture']
          };
        }
        
        if (lower.includes('skill') || lower.includes('strength') || lower.includes('expert') || lower.includes('good at')) {
          return {
            text: "Brad's **superpowers**:\\n\\n🔧 **Process Optimization** - Turning chaos into systems\\n📊 **Data-Driven Leadership** - Dashboards that execs actually use\\n🚀 **Team Scaling** - Built 200+ person teams\\n💡 **Turnaround Specialist** - Fixing failing departments\\n\\nAll verified by former colleagues above. Which area matters most for your role?",
            actions: ['Process Focus', 'Leadership Focus', 'Scaling Focus']
          };
        }
        
        if (lower.includes('experience') || lower.includes('background') || lower.includes('history') || lower.includes('career')) {
          return {
            text: "**30+ years of operational excellence**:\\n\\n🏢 **Acme Corp** (2015-2025): Senior Ops Leader - 47% revenue growth\\n🚀 **TechGiant Inc** (2008-2015): Operations Manager - IPO success\\n💡 **StartupXYZ** (2002-2008): Process Engineer - Built from scratch\\n\\nEvery claim is verified with colleague testimonials. Want the deep dive on any role?",
            actions: ['Acme Deep Dive', 'TechGiant Story', 'Early Career']
          };
        }
        
        if (lower.includes('book') || lower.includes('call') || lower.includes('meet') || lower.includes('calendly') || lower.includes('schedule')) {
          return {
            text: "Perfect! Brad has 30-minute intro slots available this week. Click below to book directly:\\n\\n📅 **[Book on Calendly](" + profile.calendlyUrl + ")**\\n\\nOr if you prefer email: " + profile.email,
            actions: ['Book 30-Min Call', 'Send Email Instead', 'Request Different Time']
          };
        }
        
        if (lower.includes('pdf') || lower.includes('resume') || lower.includes('cv') || lower.includes('download') || lower.includes('export')) {
          return {
            text: "You can export Brad's full Webume as a PDF using the button in the navigation. But honestly? This web version has **way more proof** than any PDF could hold:\\n\\n✓ Interactive charts\\n✓ Video walkthroughs\\n✓ Verified testimonials\\n✓ Truth Vault data\\n\\nShare the link instead: **webume.app/bradpowell**",
            actions: ['Export PDF Anyway', 'Copy Share Link', 'Book Call Instead']
          };
        }
        
        // Default response
        return {
          text: "I'm here to sell Brad hard — because he's earned it. **47% revenue growth**, **200+ team members** trained, and every metric verified by colleagues.\\n\\nWhat specifically would help you make a decision?",
          actions: ['View Proof', 'Check Availability', 'Book a Call', 'Ask Another Question']
        };
      };

      const sendMessage = (text = input) => {
        if (!text.trim()) return;
        
        const userMessage = { id: Date.now(), type: 'user', text };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
          const response = generateResponse(text);
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'bot',
            ...response
          }]);
          setIsTyping(false);
        }, 800 + Math.random() * 700);
      };

      const handleAction = (action) => {
        sendMessage(action);
      };

      return (
        <>
          {/* Chat Trigger Button */}
          <button className={"chat-trigger" + (isOpen ? ' active' : '')} onClick={onToggle}>
            {!isOpen && <span className="chat-notification"></span>}
            <i className={"fas " + (isOpen ? "fa-times" : "fa-comments")}></i>
          </button>

          {/* Chat Window */}
          {isOpen && (
            <div className="chat-window">
              <div className="chat-header">
                <div className="chat-avatar">🤖</div>
                <div>
                  <div className="chat-title">Brad's AI Headhunter</div>
                  <div className="chat-status">Always online • Ready to sell</div>
                </div>
                <button className="chat-close" onClick={onToggle}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="chat-messages">
                {messages.map(msg => (
                  <div key={msg.id} className={"chat-message " + msg.type}>
                    <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>').replace(/\\\\n/g, '<br>') }} />
                    {msg.actions && (
                      <div className="chat-actions">
                        {msg.actions.map((action, i) => (
                          <button key={i} className="chat-action-btn" onClick={() => handleAction(action)}>
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="chat-message bot">
                    <em>Typing...</em>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-area">
                <input
                  className="chat-input"
                  type="text"
                  placeholder="Ask about Brad..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="chat-send" onClick={() => sendMessage()}>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          )}
        </>
      );
    };

    // ============================================
    // DASHBOARD MODAL
    // ============================================
    const DashboardModal = ({ data, setData, onClose }) => {
      const [activeTab, setActiveTab] = useState('pending');

      const approveValidation = (validation) => {
        const jobId = validation.jobId;
        setData(prev => ({
          ...prev,
          validations: {
            ...prev.validations,
            [jobId]: [...(prev.validations[jobId] || []), { ...validation, approved: true }]
          },
          pendingValidations: prev.pendingValidations.filter(v => v.id !== validation.id)
        }));
      };

      const rejectValidation = (id) => {
        setData(prev => ({
          ...prev,
          pendingValidations: prev.pendingValidations.filter(v => v.id !== id)
        }));
      };

      return (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <i className="fas fa-cog" style={{ marginRight: '12px' }}></i>
                Owner Dashboard
              </h2>
              <button className="modal-close" onClick={onClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={{ padding: '0 24px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className={"leaderboard-tab" + (activeTab === 'pending' ? ' active' : '')}
                  onClick={() => setActiveTab('pending')}
                  style={{ marginBottom: '-1px', borderBottom: activeTab === 'pending' ? '2px solid var(--accent-blue)' : 'none' }}
                >
                  Pending Validations ({data.pendingValidations.length})
                </button>
                <button 
                  className={"leaderboard-tab" + (activeTab === 'profile' ? ' active' : '')}
                  onClick={() => setActiveTab('profile')}
                  style={{ marginBottom: '-1px', borderBottom: activeTab === 'profile' ? '2px solid var(--accent-blue)' : 'none' }}
                >
                  Edit Profile
                </button>
                <button 
                  className={"leaderboard-tab" + (activeTab === 'stats' ? ' active' : '')}
                  onClick={() => setActiveTab('stats')}
                  style={{ marginBottom: '-1px', borderBottom: activeTab === 'stats' ? '2px solid var(--accent-blue)' : 'none' }}
                >
                  Stats
                </button>
              </div>
            </div>

            <div className="modal-body">
              {activeTab === 'pending' && (
                <div>
                  <h3 style={{ marginBottom: '16px' }}>Validation Queue</h3>
                  {data.pendingValidations.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
                      No pending validations to review
                    </p>
                  ) : (
                    data.pendingValidations.map(v => (
                      <div key={v.id} className="validation-card" style={{ background: 'var(--bg-card)' }}>
                        <div className="validation-content">
                          <p className="validation-quote">"{v.text}"</p>
                          <div className="validation-author">
                            <div>
                              <div className="validation-name">{v.name}</div>
                              <div className="validation-role">{v.role} • For Job ID: {v.jobId}</div>
                            </div>
                          </div>
                          <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                            <button className="btn btn-primary" onClick={() => approveValidation(v)}>
                              <i className="fas fa-check"></i> Approve
                            </button>
                            <button className="btn btn-secondary" onClick={() => rejectValidation(v.id)}>
                              <i className="fas fa-times"></i> Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input 
                      className="form-input" 
                      value={data.profile.name}
                      onChange={(e) => setData(prev => ({ ...prev, profile: { ...prev.profile, name: e.target.value } }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tagline</label>
                    <input 
                      className="form-input" 
                      value={data.profile.tagline}
                      onChange={(e) => setData(prev => ({ ...prev, profile: { ...prev.profile, tagline: e.target.value } }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subtitle</label>
                    <textarea 
                      className="form-textarea" 
                      value={data.profile.subtitle}
                      onChange={(e) => setData(prev => ({ ...prev, profile: { ...prev.profile, subtitle: e.target.value } }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Video URL</label>
                    <input 
                      className="form-input" 
                      value={data.profile.videoUrl}
                      onChange={(e) => setData(prev => ({ ...prev, profile: { ...prev.profile, videoUrl: e.target.value } }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Calendly URL</label>
                    <input 
                      className="form-input" 
                      value={data.profile.calendlyUrl}
                      onChange={(e) => setData(prev => ({ ...prev, profile: { ...prev.profile, calendlyUrl: e.target.value } }))}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'stats' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                  <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--accent-blue)' }}>
                      {Object.values(data.validations).flat().length}
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>Verified Validations</div>
                  </div>
                  <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--accent-green)' }}>
                      {data.timeline.length}
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>Career Entries</div>
                  </div>
                  <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--accent-purple)' }}>
                      {data.truthVault.length}
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>Companies Rated</div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Close</button>
              <button className="btn btn-primary" onClick={onClose}>
                <i className="fas fa-save"></i> Save Changes
              </button>
            </div>
          </div>
        </div>
      );
    };

    // ============================================
    // VALIDATION FORM MODAL
    // ============================================
    const ValidationFormModal = ({ jobId, timeline, onSubmit, onClose }) => {
      const [form, setForm] = useState({ text: '', name: '', role: '', jobId });
      const job = timeline.find(j => j.id === jobId);

      const handleSubmit = (e) => {
        e.preventDefault();
        if (form.text && form.name && form.role) {
          onSubmit(form);
        }
      };

      return (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <i className="fas fa-user-check" style={{ marginRight: '12px' }}></i>
                Add Validation
              </h2>
              <button className="modal-close" onClick={onClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
                  <strong>Validating for:</strong> {job?.role} at {job?.company}
                </div>

                <div className="form-group">
                  <label className="form-label">Your Validation *</label>
                  <textarea 
                    className="form-textarea"
                    placeholder="Share your experience working with Brad..."
                    value={form.text}
                    onChange={(e) => setForm(prev => ({ ...prev, text: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input 
                    className="form-input"
                    placeholder="John Smith"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Your Role/Title *</label>
                  <input 
                    className="form-input"
                    placeholder="Senior Engineer at Acme Corp"
                    value={form.role}
                    onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
                    required
                  />
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <i className="fas fa-info-circle"></i> Your validation will be reviewed before appearing publicly.
                </p>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-paper-plane"></i> Submit Validation
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    };

    // ============================================
    // FOOTER
    // ============================================
    const Footer = ({ profile }) => {
      return (
        <footer className="footer">
          <div className="container">
            <div className="footer-brand">Webume</div>
            <p className="footer-tagline">The résumé killer. Evidence wins.</p>
            <div className="footer-links">
              <a href={"mailto:" + profile.email} className="footer-link">
                <i className="fas fa-envelope"></i> Email
              </a>
              <a href={"https://" + profile.linkedin} target="_blank" className="footer-link">
                <i className="fab fa-linkedin"></i> LinkedIn
              </a>
              <a href={profile.calendlyUrl} target="_blank" className="footer-link">
                <i className="fas fa-calendar"></i> Book a Call
              </a>
            </div>
            <p className="footer-copy">
              © 2025 {profile.name}. All claims verified. Built once, updated forever.
            </p>
          </div>
        </footer>
      );
    };

    // ============================================
    // RENDER APP
    // ============================================
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`)
})

export default app
