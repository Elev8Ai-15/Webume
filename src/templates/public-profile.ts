export function publicProfileTemplate(slug: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Loading Profile... | Webumé</title>
  <link rel="icon" type="image/png" href="/static/logo.png">
  <meta name="description" content="View professional profile on Webumé">
  <meta property="og:title" content="Professional Profile | Webumé">
  <meta property="og:description" content="View this professional profile created with Webumé">
  <meta property="og:type" content="profile">
  
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
  
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    :root {
      /* ============================================
         PREMIUM DEEP BLACK PALETTE
         High-shine reflective black - minimal color
         ============================================ */
      --accent: #18181b;            /* Dark charcoal */
      --accent-light: #27272a;      /* Lighter charcoal */
      --accent-dark: #09090b;       /* Near-black */
      --accent-glow: #a1a1aa;       /* Silver/chrome */
      --chrome: #a1a1aa;            /* Chrome/silver */
      --chrome-bright: #e4e4e7;     /* Bright chrome */
      --bg-dark: #030303;           /* Deep black */
      --bg-card: rgba(12,12,14,0.9);
      --border: rgba(255,255,255,0.06);
      --text: #e4e4e7;
      --text-muted: rgba(161,161,170,0.7);
      --text-dim: rgba(113,113,122,0.5);
      --surface-black: #030303;
      --surface-shine: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 40%, rgba(255,255,255,0.02) 100%);
    }
    
    html {
      scroll-behavior: smooth;
    }
    
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: var(--bg-dark);
      min-height: 100vh;
      color: var(--text);
      overflow-x: hidden;
    }
    
    /* Loading State */
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      flex-direction: column;
      gap: 24px;
      background: var(--bg-dark);
    }
    
    .loader-ring {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      position: relative;
    }
    
    .loader-ring::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 4px solid transparent;
      border-top-color: var(--accent);
      animation: spin 1s linear infinite;
    }
    
    .loader-ring::after {
      content: '';
      position: absolute;
      inset: 8px;
      border-radius: 50%;
      border: 4px solid transparent;
      border-top-color: var(--accent-light);
      animation: spin 0.8s linear infinite reverse;
    }
    
    @keyframes spin { to { transform: rotate(360deg); } }
    
    .loading-text {
      font-size: 14px;
      color: var(--text-muted);
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    
    /* Error State */
    .error-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: var(--bg-dark);
    }
    
    .error-card {
      text-align: center;
      padding: 60px 40px;
      background: var(--bg-card);
      border-radius: 32px;
      border: 1px solid var(--border);
      max-width: 500px;
    }
    
    .error-icon {
      font-size: 80px;
      margin-bottom: 24px;
      opacity: 0.6;
    }
    
    .error-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 16px;
      background: linear-gradient(135deg, var(--accent), var(--accent-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .error-message {
      color: var(--text-muted);
      margin-bottom: 32px;
      line-height: 1.6;
    }
    
    .cta-btn {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 16px 32px;
      background: linear-gradient(135deg, var(--accent), var(--accent-dark));
      color: var(--text);
      text-decoration: none;
      border-radius: 16px;
      font-weight: 600;
      font-size: 15px;
      transition: all 0.3s ease;
      box-shadow: 0 8px 32px rgba(30, 58, 95, 0.3);
    }
    
    .cta-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(30, 58, 95, 0.4);
    }
    
    /* ============================================
       IMMERSIVE PROFILE LAYOUT
       ============================================ */
    
    /* Animated Background */
    .profile-bg {
      position: fixed;
      inset: 0;
      z-index: 0;
      overflow: hidden;
      pointer-events: none;
    }
    
    .bg-gradient-1 {
      position: absolute;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(30, 58, 95, 0.15) 0%, transparent 70%);
      top: -200px;
      right: -200px;
      animation: float 20s ease-in-out infinite;
    }
    
    .bg-gradient-2 {
      position: absolute;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%);
      bottom: -150px;
      left: -150px;
      animation: float 25s ease-in-out infinite reverse;
    }
    
    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -30px) scale(1.05); }
      66% { transform: translate(-20px, 20px) scale(0.95); }
    }
    
    /* Main Profile Container */
    .profile-container {
      position: relative;
      z-index: 1;
      min-height: 100vh;
    }
    
    /* ============================================
       HERO SECTION
       ============================================ */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px 24px;
      position: relative;
    }
    
    .hero-content {
      max-width: 900px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .hero-photo-container {
      position: relative;
      margin-bottom: 40px;
    }
    
    .hero-photo {
      width: 220px;
      height: 220px;
      border-radius: 50%;
      object-fit: cover;
      border: 6px solid var(--accent);
      box-shadow: 
        0 0 0 10px rgba(30, 58, 95, 0.15),
        0 0 0 20px rgba(30, 58, 95, 0.08),
        0 30px 80px rgba(0, 0, 0, 0.5),
        0 0 120px rgba(30, 58, 95, 0.25);
      animation: heroPhotoIn 1s ease-out;
    }
    
    @keyframes heroPhotoIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    
    .photo-ring {
      position: absolute;
      inset: -20px;
      border-radius: 50%;
      border: 2px dashed rgba(30, 58, 95, 0.4);
      animation: photoRingSpin 20s linear infinite;
    }
    
    .photo-ring-2 {
      position: absolute;
      inset: -35px;
      border-radius: 50%;
      border: 1px solid rgba(30, 58, 95, 0.15);
      animation: photoRingSpin 30s linear infinite reverse;
    }
    
    @keyframes photoRingSpin {
      to { transform: rotate(360deg); }
    }
    
    .hero-photo-placeholder {
      width: 220px;
      height: 220px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent-dark));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 72px;
      font-weight: 800;
      color: white;
      box-shadow: 
        0 0 0 10px rgba(30, 58, 95, 0.15),
        0 30px 80px rgba(0, 0, 0, 0.5);
    }
    
    /* ============================================
       TRADITIONAL RESUME PREVIEW CARD
       ============================================ */
    .resume-preview-section {
      padding: 40px 24px 80px;
      display: flex;
      justify-content: center;
    }
    
    .resume-preview-container {
      max-width: 1100px;
      width: 100%;
      display: flex;
      gap: 40px;
      align-items: flex-start;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .resume-card {
      width: 380px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 
        0 25px 80px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.1);
      overflow: hidden;
      transform: perspective(1000px) rotateY(-5deg) rotateX(2deg);
      transition: transform 0.5s ease;
      flex-shrink: 0;
    }
    
    .resume-card:hover {
      transform: perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1.02);
    }
    
    .resume-card-header {
      background: linear-gradient(135deg, var(--accent), var(--accent-dark));
      padding: 24px;
      color: white;
      text-align: center;
    }
    
    .resume-card-photo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 3px solid white;
      object-fit: cover;
      margin-bottom: 12px;
    }
    
    .resume-card-photo-placeholder {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 3px solid white;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 700;
      margin: 0 auto 12px;
    }
    
    .resume-card-name {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    
    .resume-card-title {
      font-size: 12px;
      opacity: 0.9;
    }
    
    .resume-card-body {
      padding: 20px;
      color: #1a1a2e;
      font-size: 11px;
      line-height: 1.5;
    }
    
    .resume-card-section {
      margin-bottom: 16px;
    }
    
    .resume-card-section h4 {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--accent);
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 1px solid rgba(30, 58, 95, 0.2);
    }
    
    .resume-card-exp {
      margin-bottom: 10px;
    }
    
    .resume-card-exp strong {
      font-size: 11px;
      display: block;
    }
    
    .resume-card-exp span {
      color: #666;
      font-size: 10px;
    }
    
    .resume-card-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    
    .resume-card-skill {
      padding: 3px 8px;
      background: rgba(30, 58, 95, 0.1);
      border-radius: 4px;
      font-size: 9px;
      color: var(--accent);
    }
    
    .resume-info-panel {
      flex: 1;
      min-width: 300px;
      max-width: 500px;
    }
    
    .resume-info-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 16px;
      color: var(--text);
    }
    
    .resume-info-desc {
      font-size: 15px;
      color: var(--text-muted);
      line-height: 1.7;
      margin-bottom: 24px;
    }
    
    .resume-stats {
      display: flex;
      gap: 24px;
      margin-bottom: 24px;
    }
    
    .resume-stat {
      text-align: center;
    }
    
    .resume-stat-value {
      font-size: 32px;
      font-weight: 800;
      color: var(--accent);
    }
    
    .resume-stat-label {
      font-size: 11px;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .resume-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .resume-action-btn {
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      border: none;
    }
    
    .resume-action-btn.primary {
      background: linear-gradient(135deg, var(--accent), var(--accent-dark));
      color: white;
    }
    
    .resume-action-btn.secondary {
      background: var(--bg-card);
      border: 1px solid var(--border);
      color: var(--text);
    }
    
    .resume-action-btn:hover {
      transform: translateY(-2px);
    }
    
    .hero-name {
      font-family: 'Playfair Display', serif;
      font-size: clamp(36px, 8vw, 64px);
      font-weight: 700;
      margin-bottom: 16px;
      line-height: 1.1;
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }
    
    .hero-title {
      font-size: clamp(18px, 4vw, 24px);
      color: var(--accent-light);
      font-weight: 600;
      margin-bottom: 16px;
      animation: fadeInUp 0.8s ease-out 0.4s both;
    }
    
    .hero-tagline {
      font-size: 16px;
      color: var(--text-muted);
      max-width: 600px;
      line-height: 1.7;
      margin-bottom: 32px;
      animation: fadeInUp 0.8s ease-out 0.6s both;
    }
    
    @keyframes fadeInUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    .hero-contact {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 48px;
      animation: fadeInUp 0.8s ease-out 0.8s both;
    }
    
    .contact-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 100px;
      font-size: 13px;
      color: var(--text-muted);
      text-decoration: none;
      transition: all 0.3s ease;
    }
    
    .contact-chip:hover {
      background: rgba(30, 58, 95, 0.1);
      border-color: var(--accent);
      color: var(--text);
      transform: translateY(-2px);
    }
    
    .contact-chip i {
      color: var(--accent);
    }
    
    .scroll-indicator {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      animation: bounce 2s ease-in-out infinite;
      cursor: pointer;
    }
    
    .scroll-indicator span {
      font-size: 11px;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .scroll-arrow {
      width: 24px;
      height: 40px;
      border: 2px solid var(--border);
      border-radius: 12px;
      position: relative;
    }
    
    .scroll-arrow::after {
      content: '';
      position: absolute;
      width: 4px;
      height: 8px;
      background: var(--accent);
      border-radius: 2px;
      left: 50%;
      top: 8px;
      transform: translateX(-50%);
      animation: scrollDot 2s ease-in-out infinite;
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(10px); }
    }
    
    @keyframes scrollDot {
      0%, 100% { top: 8px; opacity: 1; }
      50% { top: 20px; opacity: 0.5; }
    }
    
    /* ============================================
       EXPERIENCE TIMELINE SECTION
       ============================================ */
    .timeline-section {
      padding: 80px 24px;
      position: relative;
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 60px;
    }
    
    .section-label {
      font-size: 12px;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 3px;
      margin-bottom: 16px;
    }
    
    .section-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(28px, 5vw, 40px);
      font-weight: 700;
      margin-bottom: 16px;
    }
    
    .section-subtitle {
      font-size: 15px;
      color: var(--text-muted);
      max-width: 500px;
      margin: 0 auto;
    }
    
    .timeline-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      gap: 40px;
    }
    
    .timeline-list {
      flex: 1;
      max-width: 600px;
    }
    
    .timeline-item {
      position: relative;
      padding: 28px;
      margin-bottom: 20px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .timeline-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: var(--border);
      border-radius: 4px 0 0 4px;
      transition: all 0.4s ease;
    }
    
    .timeline-item:hover,
    .timeline-item.active {
      background: rgba(30, 58, 95, 0.08);
      border-color: var(--accent);
      transform: translateX(8px);
      box-shadow: 0 10px 40px rgba(30, 58, 95, 0.15);
    }
    
    .timeline-item:hover::before,
    .timeline-item.active::before {
      background: linear-gradient(180deg, var(--accent), var(--accent-dark));
      width: 5px;
    }
    
    .timeline-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
    }
    
    .company-logo {
      width: 72px;
      height: 72px;
      border-radius: 18px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
      border: 3px solid var(--border);
      transition: all 0.4s ease;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
    
    .timeline-item:hover .company-logo,
    .timeline-item.active .company-logo {
      border-color: var(--accent);
      box-shadow: 0 8px 24px rgba(30, 58, 95, 0.25);
      transform: scale(1.05);
    }
    
    .company-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 10px;
    }
    
    .company-logo-placeholder {
      width: 72px;
      height: 72px;
      border-radius: 18px;
      background: linear-gradient(135deg, var(--accent), var(--accent-dark));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      font-weight: 700;
      color: white;
      box-shadow: 0 4px 16px rgba(30, 58, 95, 0.3);
    }
    
    .timeline-info h3 {
      font-size: 17px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    
    .timeline-company {
      font-size: 14px;
      color: var(--accent);
      font-weight: 600;
    }
    
    .timeline-meta {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: var(--text-dim);
      margin-top: 12px;
    }
    
    .timeline-meta span {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .view-details-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      padding: 6px 12px;
      background: var(--accent);
      border-radius: 8px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0;
      transform: translateX(10px);
      transition: all 0.3s ease;
    }
    
    .timeline-item:hover .view-details-badge,
    .timeline-item.active .view-details-badge {
      opacity: 1;
      transform: translateX(0);
    }
    
    /* ============================================
       DETAIL PANEL (Side Panel)
       ============================================ */
    .detail-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 550px;
      max-width: 90vw;
      height: 100vh;
      background: linear-gradient(180deg, #0f0f1a 0%, #0a0a12 100%);
      border-left: 1px solid var(--border);
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      overflow-y: auto;
      box-shadow: -20px 0 60px rgba(0, 0, 0, 0.5);
    }
    
    .detail-panel.open {
      transform: translateX(0);
    }
    
    .detail-panel::-webkit-scrollbar { width: 6px; }
    .detail-panel::-webkit-scrollbar-track { background: transparent; }
    .detail-panel::-webkit-scrollbar-thumb { 
      background: rgba(30, 58, 95, 0.3);
      border-radius: 3px;
    }
    
    .panel-header {
      position: sticky;
      top: 0;
      background: linear-gradient(180deg, rgba(15, 15, 26, 0.98) 0%, rgba(15, 15, 26, 0.9) 100%);
      backdrop-filter: blur(20px);
      padding: 24px;
      border-bottom: 1px solid var(--border);
      z-index: 10;
    }
    
    .panel-close {
      position: absolute;
      top: 24px;
      right: 24px;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      color: var(--text-muted);
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .panel-close:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: #EF4444;
      color: #EF4444;
    }
    
    .panel-company-header {
      display: flex;
      align-items: center;
      gap: 20px;
      padding-right: 50px;
    }
    
    .panel-logo {
      width: 72px;
      height: 72px;
      border-radius: 18px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border: 3px solid var(--accent);
      box-shadow: 0 8px 24px rgba(30, 58, 95, 0.2);
    }
    
    .panel-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 10px;
    }
    
    .panel-logo-placeholder {
      width: 72px;
      height: 72px;
      border-radius: 18px;
      background: linear-gradient(135deg, var(--accent), var(--accent-dark));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 700;
      color: white;
    }
    
    .panel-title-section h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    
    .panel-title-section .role {
      font-size: 15px;
      color: var(--accent-light);
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .panel-title-section .dates {
      font-size: 13px;
      color: var(--text-dim);
    }
    
    .panel-content {
      padding: 24px;
    }
    
    /* Detail Sections */
    .detail-section {
      margin-bottom: 32px;
    }
    
    .detail-section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border);
    }
    
    .detail-section-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: rgba(30, 58, 95, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent);
      font-size: 14px;
    }
    
    .detail-section-header h3 {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
    }
    
    .detail-section-content {
      font-size: 14px;
      line-height: 1.7;
      color: var(--text-muted);
    }
    
    .detail-section-content p {
      margin-bottom: 12px;
    }
    
    .detail-section-content ul {
      list-style: none;
      padding: 0;
    }
    
    .detail-section-content li {
      position: relative;
      padding-left: 20px;
      margin-bottom: 10px;
    }
    
    .detail-section-content li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 8px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent);
    }
    
    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    
    .metric-card {
      padding: 20px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      text-align: center;
    }
    
    .metric-value {
      font-size: 28px;
      font-weight: 800;
      color: var(--accent);
      margin-bottom: 4px;
    }
    
    .metric-label {
      font-size: 11px;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    /* Media Gallery */
    .media-gallery {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    
    .media-item {
      aspect-ratio: 16/10;
      border-radius: 12px;
      overflow: hidden;
      background: var(--bg-card);
      border: 1px solid var(--border);
    }
    
    .media-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .media-item:hover img {
      transform: scale(1.05);
    }
    
    /* Awards/Projects */
    .award-item, .project-item {
      padding: 16px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 14px;
      margin-bottom: 12px;
    }
    
    .award-item h4, .project-item h4 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .award-item h4 i {
      color: #F59E0B;
    }
    
    .project-item h4 i {
      color: var(--accent);
    }
    
    .award-item p, .project-item p {
      font-size: 13px;
      color: var(--text-dim);
      line-height: 1.5;
    }
    
    /* Panel Overlay */
    .panel-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.4s ease;
    }
    
    .panel-overlay.visible {
      opacity: 1;
      visibility: visible;
    }
    
    /* ============================================
       SKILLS & EDUCATION SECTIONS
       ============================================ */
    .skills-section, .education-section {
      padding: 60px 24px;
      max-width: 900px;
      margin: 0 auto;
    }
    
    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
    }
    
    .skill-chip {
      padding: 12px 24px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 100px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .skill-chip:hover {
      background: rgba(30, 58, 95, 0.15);
      border-color: var(--accent);
      transform: translateY(-2px);
    }
    
    .education-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }
    
    .education-card {
      padding: 28px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 20px;
      transition: all 0.3s ease;
    }
    
    .education-card:hover {
      border-color: var(--accent);
      transform: translateY(-4px);
    }
    
    .education-card h3 {
      font-size: 17px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .education-card p {
      font-size: 14px;
      color: var(--text-muted);
    }
    
    .education-card .year {
      display: inline-block;
      margin-top: 12px;
      padding: 6px 14px;
      background: rgba(30, 58, 95, 0.15);
      border-radius: 8px;
      font-size: 12px;
      color: var(--accent);
      font-weight: 600;
    }
    
    /* ============================================
       FOOTER
       ============================================ */
    .profile-footer {
      text-align: center;
      padding: 60px 24px;
      border-top: 1px solid var(--border);
    }
    
    .qr-section {
      margin-bottom: 32px;
    }
    
    .qr-code {
      width: 120px;
      height: 120px;
      border-radius: 16px;
      margin-bottom: 12px;
    }
    
    .qr-label {
      font-size: 12px;
      color: var(--text-dim);
    }
    
    .profile-views {
      font-size: 13px;
      color: var(--text-dim);
      margin-bottom: 24px;
    }
    
    .profile-views i {
      color: var(--accent);
      margin-right: 8px;
    }
    
    .powered-by {
      font-size: 12px;
      color: var(--text-dim);
      margin-top: 24px;
    }
    
    /* ============================================
       RESPONSIVE
       ============================================ */
    @media (max-width: 900px) {
      .timeline-container {
        flex-direction: column;
      }
      
      .timeline-list {
        max-width: 100%;
      }
      
      .detail-panel {
        width: 100%;
        max-width: 100%;
      }
    }
    
    @media (max-width: 600px) {
      .hero {
        padding: 40px 16px;
      }
      
      .hero-photo, .hero-photo-placeholder {
        width: 140px;
        height: 140px;
      }
      
      .hero-contact {
        flex-direction: column;
        align-items: center;
      }
      
      .metrics-grid {
        grid-template-columns: 1fr;
      }
      
      .panel-company-header {
        flex-direction: column;
        text-align: center;
      }
      
      .panel-title-section {
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div id="root">
    <div class="loading">
      <div class="loader-ring"></div>
      <p class="loading-text">Loading Profile</p>
    </div>
  </div>
  
  <script type="text/babel">
    const { useState, useEffect, useRef } = React;
    const SLUG = '${slug}';
    
    const PublicProfile = () => {
      const [profile, setProfile] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [qrCode, setQrCode] = useState(null);
      const [selectedExp, setSelectedExp] = useState(null);
      const [panelOpen, setPanelOpen] = useState(false);
      const timelineRef = useRef(null);
      
      useEffect(() => {
        fetch('/api/public/' + SLUG)
          .then(r => r.json())
          .then(data => {
            if (data.error) {
              setError(data.error);
            } else {
              setProfile(data);
              document.title = (data.profile?.basics?.name || data.name) + ' | Webumé';
              // Generate QR code
              if (window.QRCode) {
                QRCode.toDataURL(window.location.href, { width: 200, margin: 2 })
                  .then(url => setQrCode(url));
              }
            }
            setLoading(false);
          })
          .catch(e => {
            setError('Failed to load profile');
            setLoading(false);
          });
      }, []);
      
      const openPanel = (exp) => {
        setSelectedExp(exp);
        setPanelOpen(true);
        document.body.style.overflow = 'hidden';
      };
      
      const closePanel = () => {
        setPanelOpen(false);
        document.body.style.overflow = '';
      };
      
      // Hover timer for auto-open panel
      const hoverTimerRef = useRef(null);
      
      const handleExpHover = (exp) => {
        // Clear any existing timer
        if (hoverTimerRef.current) {
          clearTimeout(hoverTimerRef.current);
        }
        // Set timer to open panel after 400ms hover
        hoverTimerRef.current = setTimeout(() => {
          openPanel(exp);
        }, 400);
      };
      
      const handleExpLeave = () => {
        // Clear the timer if mouse leaves before 400ms
        if (hoverTimerRef.current) {
          clearTimeout(hoverTimerRef.current);
          hoverTimerRef.current = null;
        }
      };
      
      const copyProfileUrl = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Profile URL copied to clipboard!');
      };
      
      const shareProfile = () => {
        if (navigator.share) {
          navigator.share({
            title: basics.name + ' - Professional Profile',
            text: 'Check out my professional profile on Webumé',
            url: window.location.href
          });
        } else {
          copyProfileUrl();
        }
      };
      
      // Known company domain mappings for automatic logo lookup
      const KNOWN_DOMAINS = {
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
      const LOCAL_LOGOS = {
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
      
      const getLocalLogo = (companyName) => {
        if (!companyName) return null;
        const lowerName = companyName.toLowerCase().trim();
        if (LOCAL_LOGOS[lowerName]) return LOCAL_LOGOS[lowerName];
        for (const [key, path] of Object.entries(LOCAL_LOGOS)) {
          if (lowerName.includes(key) || key.includes(lowerName)) return path;
        }
        return null;
      };
      
      const getKnownDomain = (companyName, existingDomain) => {
        if (existingDomain) return existingDomain;
        if (!companyName) return null;
        const lowerName = companyName.toLowerCase().trim();
        if (KNOWN_DOMAINS[lowerName]) return KNOWN_DOMAINS[lowerName];
        for (const [key, domain] of Object.entries(KNOWN_DOMAINS)) {
          if (lowerName.includes(key) || key.includes(lowerName)) return domain;
        }
        return null;
      };
      
      const scrollToTimeline = () => {
        if (timelineRef.current) {
          timelineRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      };
      
      const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      };
      
      const getCompanyInitial = (company) => {
        if (!company) return '?';
        return company.charAt(0).toUpperCase();
      };
      
      if (loading) {
        return (
          <div className="loading">
            <div className="loader-ring"></div>
            <p className="loading-text">Loading Profile</p>
          </div>
        );
      }
      
      if (error) {
        return (
          <div className="error-container">
            <div className="error-card">
              <div className="error-icon">🔍</div>
              <h1 className="error-title">Not Found</h1>
              <p className="error-message">{error}</p>
              <a href="/" className="cta-btn">
                <i className="fas fa-rocket"></i>
                Create Your Own Webumé
              </a>
            </div>
          </div>
        );
      }
      
      const p = profile.profile || {};
      const basics = p.basics || {};
      const experience = p.experience || [];
      const skills = p.skills || [];
      const education = p.education || [];
      
      // Get accent color from template - Deep black with subtle tints
      const templateColors = {
        executive: '#18181b',     /* Charcoal */
        corporate: '#1c1c1e',     /* Dark gray */
        healthcare: '#151820',    /* Deep blue-gray */
        restaurant: '#1a1515',    /* Warm charcoal */
        trades: '#1a1816',        /* Warm dark */
        beauty: '#1a1518',        /* Rose charcoal */
        creative: '#18161a',      /* Purple charcoal */
        tech: '#151818',          /* Teal charcoal */
        nonprofit: '#151819',     /* Cool charcoal */
        minimal: '#171918'        /* Green charcoal */
      };
      const accent = templateColors[profile.selectedTemplate] || '#18181b';
      
      // Apply accent color to CSS variables
      useEffect(() => {
        document.documentElement.style.setProperty('--accent', accent);
      }, [accent]);
      
      return (
        <div className="profile-container">
          {/* Animated Background */}
          <div className="profile-bg">
            <div className="bg-gradient-1"></div>
            <div className="bg-gradient-2"></div>
          </div>
          
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-content">
              <div className="hero-photo-container">
                <div className="photo-ring"></div>
                <div className="photo-ring-2"></div>
                {profile.profilePhoto ? (
                  <img src={profile.profilePhoto} alt={basics.name} className="hero-photo" />
                ) : (
                  <div className="hero-photo-placeholder">{getInitials(basics.name)}</div>
                )}
              </div>
              
              <h1 className="hero-name">{basics.name || 'Professional'}</h1>
              <p className="hero-title">{basics.title || 'Career Professional'}</p>
              {basics.tagline && <p className="hero-tagline">{basics.tagline}</p>}
              {basics.summary && !basics.tagline && (
                <p className="hero-tagline">{basics.summary.substring(0, 200)}{basics.summary.length > 200 ? '...' : ''}</p>
              )}
              
              <div className="hero-contact">
                {basics.email && (
                  <a href={"mailto:" + basics.email} className="contact-chip">
                    <i className="fas fa-envelope"></i>
                    {basics.email}
                  </a>
                )}
                {basics.phone && (
                  <a href={"tel:" + basics.phone} className="contact-chip">
                    <i className="fas fa-phone"></i>
                    {basics.phone}
                  </a>
                )}
                {basics.location && (
                  <span className="contact-chip">
                    <i className="fas fa-map-marker-alt"></i>
                    {basics.location}
                  </span>
                )}
                {basics.linkedin && (
                  <a href={basics.linkedin.startsWith('http') ? basics.linkedin : 'https://' + basics.linkedin} target="_blank" className="contact-chip">
                    <i className="fab fa-linkedin"></i>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
            
            {experience.length > 0 && (
              <div className="scroll-indicator" onClick={scrollToTimeline}>
                <span>Explore Career</span>
                <div className="scroll-arrow"></div>
              </div>
            )}
          </section>
          
          {/* Traditional Resume Preview */}
          <section className="resume-preview-section">
            <div className="resume-preview-container">
              <div className="resume-card">
                <div className="resume-card-header">
                  {profile.profilePhoto ? (
                    <img src={profile.profilePhoto} alt={basics.name} className="resume-card-photo" />
                  ) : (
                    <div className="resume-card-photo-placeholder">{getInitials(basics.name)}</div>
                  )}
                  <div className="resume-card-name">{basics.name || 'Your Name'}</div>
                  <div className="resume-card-title">{basics.title || 'Professional Title'}</div>
                </div>
                <div className="resume-card-body">
                  {experience.length > 0 && (
                    <div className="resume-card-section">
                      <h4>Experience</h4>
                      {experience.slice(0, 3).map((exp, i) => (
                        <div key={i} className="resume-card-exp">
                          <strong>{exp.role}</strong>
                          <span>{exp.company} • {exp.startDate} - {exp.endDate || 'Present'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {skills.length > 0 && (
                    <div className="resume-card-section">
                      <h4>Skills</h4>
                      <div className="resume-card-skills">
                        {skills.slice(0, 8).map((skill, i) => (
                          <span key={i} className="resume-card-skill">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {education.length > 0 && (
                    <div className="resume-card-section">
                      <h4>Education</h4>
                      {education.slice(0, 2).map((edu, i) => (
                        <div key={i} className="resume-card-exp">
                          <strong>{edu.degree}</strong>
                          <span>{edu.school}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="resume-info-panel">
                <h2 className="resume-info-title">Your Digital Resume</h2>
                <p className="resume-info-desc">
                  This interactive profile showcases your professional journey in a modern, engaging format. 
                  Explore the career timeline below to discover detailed experiences, achievements, and more.
                </p>
                <div className="resume-stats">
                  <div className="resume-stat">
                    <div className="resume-stat-value">{experience.length}</div>
                    <div className="resume-stat-label">Experiences</div>
                  </div>
                  <div className="resume-stat">
                    <div className="resume-stat-value">{skills.length}</div>
                    <div className="resume-stat-label">Skills</div>
                  </div>
                  <div className="resume-stat">
                    <div className="resume-stat-value">{profile.views || 0}</div>
                    <div className="resume-stat-label">Views</div>
                  </div>
                </div>
                <div className="resume-actions">
                  <button className="resume-action-btn primary" onClick={shareProfile}>
                    <i className="fas fa-share-alt"></i>
                    Share Profile
                  </button>
                  <button className="resume-action-btn secondary" onClick={copyProfileUrl}>
                    <i className="fas fa-copy"></i>
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </section>
          
          {/* Experience Timeline */}
          {experience.length > 0 && (
            <section className="timeline-section" ref={timelineRef}>
              <div className="section-header">
                <p className="section-label">Career Journey</p>
                <h2 className="section-title">Professional Experience</h2>
                <p className="section-subtitle">Hover over any experience to explore the full story</p>
              </div>
              
              <div className="timeline-container">
                <div className="timeline-list">
                  {experience.map((exp, i) => {
                    // Try multiple logo sources: customLogo > logoUrl > local static > logo.dev API > fallback
                    // Use getKnownDomain to auto-resolve company names to domains
                    const localLogo = getLocalLogo(exp.company);
                    const domain = getKnownDomain(exp.company, exp.companyInfo?.domain);
                    const logoUrl = exp.customLogo || exp.logoUrl || localLogo || (domain ? 'https://img.logo.dev/' + domain + '?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ' : null);
                    const isActive = selectedExp?.id === exp.id || (selectedExp && !exp.id && selectedExp.company === exp.company && selectedExp.role === exp.role);
                    
                    return (
                      <div 
                        key={exp.id || i}
                        className={"timeline-item" + (isActive ? " active" : "")}
                        onClick={() => openPanel(exp)}
                        onMouseEnter={() => handleExpHover(exp)}
                        onMouseLeave={handleExpLeave}
                      >
                        <span className="view-details-badge">{isActive ? 'Viewing' : 'Hover for Details'}</span>
                        
                        <div className="timeline-header">
                          {logoUrl ? (
                            <div className="company-logo">
                              <img 
                                src={logoUrl} 
                                alt={exp.company}
                                onError={(e) => {
                                  // Fallback: try DuckDuckGo icons
                                  const ddgUrl = domain ? 'https://icons.duckduckgo.com/ip3/' + domain + '.ico' : null;
                                  if (ddgUrl && e.target.src !== ddgUrl) {
                                    e.target.src = ddgUrl;
                                  } else {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,' + accent + ',#0d1f33);border-radius:16px;color:white;font-weight:700;font-size:26px">' + getCompanyInitial(exp.company) + '</div>';
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className="company-logo-placeholder">{getCompanyInitial(exp.company)}</div>
                          )}
                          <div className="timeline-info">
                            <h3>{exp.role}</h3>
                            <p className="timeline-company">{exp.company}</p>
                          </div>
                        </div>
                        
                        <div className="timeline-meta">
                          <span><i className="far fa-calendar"></i>{exp.startDate} — {exp.endDate || 'Present'}</span>
                          {exp.companyInfo?.location && (
                            <span><i className="fas fa-map-marker-alt"></i>{exp.companyInfo.location}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
          
          {/* Skills Section */}
          {skills.length > 0 && (
            <section className="skills-section">
              <div className="section-header">
                <p className="section-label">Expertise</p>
                <h2 className="section-title">Skills & Capabilities</h2>
              </div>
              
              <div className="skills-grid">
                {skills.map((skill, i) => (
                  <span key={i} className="skill-chip">{skill}</span>
                ))}
              </div>
            </section>
          )}
          
          {/* Education Section */}
          {education.length > 0 && (
            <section className="education-section">
              <div className="section-header">
                <p className="section-label">Foundation</p>
                <h2 className="section-title">Education</h2>
              </div>
              
              <div className="education-cards">
                {education.map((edu, i) => (
                  <div key={i} className="education-card">
                    <h3>{edu.degree}</h3>
                    <p>{edu.school}</p>
                    {edu.year && <span className="year">{edu.year}</span>}
                    {edu.details && <p style={{ marginTop: '12px', fontSize: '13px' }}>{edu.details}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Footer */}
          <footer className="profile-footer">
            {qrCode && (
              <div className="qr-section">
                <img src={qrCode} alt="QR Code" className="qr-code" />
                <p className="qr-label">Scan to share this profile</p>
              </div>
            )}
            
            <p className="profile-views">
              <i className="fas fa-eye"></i>
              {profile.views || 0} profile views
            </p>
            
            <a href="/" className="cta-btn">
              <i className="fas fa-rocket"></i>
              Create Your Own Webumé
            </a>
            
            <div className="powered-by" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
              <img src="/static/logo.png" alt="Webumé" style={{ height: '28px', width: 'auto', opacity: 0.8 }} />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>The Digital Resume Revolution</span>
            </div>
          </footer>
          
          {/* Panel Overlay */}
          <div 
            className={"panel-overlay" + (panelOpen ? " visible" : "")}
            onClick={closePanel}
          ></div>
          
          {/* Detail Panel */}
          <div className={"detail-panel" + (panelOpen ? " open" : "")}>
            {selectedExp && (
              <>
                <div className="panel-header">
                  <button className="panel-close" onClick={closePanel}>
                    <i className="fas fa-times"></i>
                  </button>
                  
                  <div className="panel-company-header">
                    {(() => {
                      // Use getKnownDomain to auto-resolve company names to domains
                      const panelLocalLogo = getLocalLogo(selectedExp.company);
                      const panelDomain = getKnownDomain(selectedExp.company, selectedExp.companyInfo?.domain);
                      const panelLogoUrl = selectedExp.customLogo || selectedExp.logoUrl || panelLocalLogo || (panelDomain ? 'https://img.logo.dev/' + panelDomain + '?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ' : null);
                      
                      return panelLogoUrl ? (
                        <div className="panel-logo">
                          <img 
                            src={panelLogoUrl}
                            alt={selectedExp.company}
                            onError={(e) => {
                              const ddgUrl = panelDomain ? 'https://icons.duckduckgo.com/ip3/' + panelDomain + '.ico' : null;
                              if (ddgUrl && e.target.src !== ddgUrl) {
                                e.target.src = ddgUrl;
                              } else {
                                e.target.parentElement.innerHTML = '<div class="panel-logo-placeholder">' + getCompanyInitial(selectedExp.company) + '</div>';
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="panel-logo-placeholder">{getCompanyInitial(selectedExp.company)}</div>
                      );
                    })()}
                    
                    <div className="panel-title-section">
                      <h2>{selectedExp.company}</h2>
                      <p className="role">{selectedExp.role}</p>
                      <p className="dates">{selectedExp.startDate} — {selectedExp.endDate || 'Present'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="panel-content">
                  {/* Overview / Description */}
                  {selectedExp.description && (
                    <div className="detail-section">
                      <div className="detail-section-header">
                        <div className="detail-section-icon"><i className="fas fa-file-alt"></i></div>
                        <h3>Overview</h3>
                      </div>
                      <div className="detail-section-content">
                        <p>{selectedExp.description}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Metrics / Achievements */}
                  {selectedExp.metrics && selectedExp.metrics.length > 0 && (
                    <div className="detail-section">
                      <div className="detail-section-header">
                        <div className="detail-section-icon"><i className="fas fa-chart-line"></i></div>
                        <h3>Key Metrics</h3>
                      </div>
                      <div className="metrics-grid">
                        {selectedExp.metrics.map((metric, i) => (
                          <div key={i} className="metric-card">
                            <div className="metric-value">{metric.value}</div>
                            <div className="metric-label">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Responsibilities */}
                  {selectedExp.responsibilities && selectedExp.responsibilities.length > 0 && (
                    <div className="detail-section">
                      <div className="detail-section-header">
                        <div className="detail-section-icon"><i className="fas fa-tasks"></i></div>
                        <h3>Responsibilities</h3>
                      </div>
                      <div className="detail-section-content">
                        <ul>
                          {selectedExp.responsibilities.map((resp, i) => (
                            <li key={i}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {/* Victories / Accomplishments */}
                  {selectedExp.victories && selectedExp.victories.length > 0 && (
                    <div className="detail-section">
                      <div className="detail-section-header">
                        <div className="detail-section-icon"><i className="fas fa-trophy"></i></div>
                        <h3>Victories</h3>
                      </div>
                      <div className="detail-section-content">
                        <ul>
                          {selectedExp.victories.map((vic, i) => (
                            <li key={i}>{vic}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {/* Awards */}
                  {selectedExp.awards && selectedExp.awards.length > 0 && (
                    <div className="detail-section">
                      <div className="detail-section-header">
                        <div className="detail-section-icon"><i className="fas fa-award"></i></div>
                        <h3>Awards & Recognition</h3>
                      </div>
                      {selectedExp.awards.map((award, i) => (
                        <div key={i} className="award-item">
                          <h4><i className="fas fa-star"></i>{award.title || award}</h4>
                          {award.description && <p>{award.description}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Projects */}
                  {selectedExp.projects && selectedExp.projects.length > 0 && (
                    <div className="detail-section">
                      <div className="detail-section-header">
                        <div className="detail-section-icon"><i className="fas fa-project-diagram"></i></div>
                        <h3>Notable Projects</h3>
                      </div>
                      {selectedExp.projects.map((project, i) => (
                        <div key={i} className="project-item">
                          <h4><i className="fas fa-folder-open"></i>{project.name || project}</h4>
                          {project.description && <p>{project.description}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Media / Photos */}
                  {selectedExp.photos && selectedExp.photos.length > 0 && (
                    <div className="detail-section">
                      <div className="detail-section-header">
                        <div className="detail-section-icon"><i className="fas fa-images"></i></div>
                        <h3>Photos</h3>
                      </div>
                      <div className="media-gallery">
                        {selectedExp.photos.map((photo, i) => (
                          <div key={i} className="media-item">
                            <img src={photo.url || photo} alt={photo.caption || 'Work photo'} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Reviews / Testimonials */}
                  {selectedExp.reviews && selectedExp.reviews.length > 0 && (
                    <div className="detail-section">
                      <div className="detail-section-header">
                        <div className="detail-section-icon"><i className="fas fa-quote-left"></i></div>
                        <h3>Reviews & Testimonials</h3>
                      </div>
                      {selectedExp.reviews.map((review, i) => (
                        <div key={i} style={{ 
                          padding: '20px', 
                          background: 'var(--bg-card)', 
                          border: '1px solid var(--border)', 
                          borderRadius: '14px',
                          marginBottom: '12px',
                          fontStyle: 'italic',
                          color: 'var(--text-muted)'
                        }}>
                          "{review.text || review}"
                          {review.author && (
                            <p style={{ marginTop: '12px', fontStyle: 'normal', fontWeight: '600', color: 'var(--accent)' }}>
                              — {review.author}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Company Info */}
                  {selectedExp.companyInfo && (
                    <div className="detail-section">
                      <div className="detail-section-header">
                        <div className="detail-section-icon"><i className="fas fa-building"></i></div>
                        <h3>About {selectedExp.company}</h3>
                      </div>
                      <div className="detail-section-content">
                        {selectedExp.companyInfo.description && <p>{selectedExp.companyInfo.description}</p>}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
                          {selectedExp.companyInfo.industry && (
                            <span style={{ 
                              padding: '6px 14px', 
                              background: 'rgba(30, 58, 95,0.15)', 
                              borderRadius: '8px', 
                              fontSize: '12px' 
                            }}>
                              <i className="fas fa-industry" style={{ marginRight: '6px' }}></i>
                              {selectedExp.companyInfo.industry}
                            </span>
                          )}
                          {selectedExp.companyInfo.location && (
                            <span style={{ 
                              padding: '6px 14px', 
                              background: 'rgba(30, 58, 95,0.15)', 
                              borderRadius: '8px', 
                              fontSize: '12px' 
                            }}>
                              <i className="fas fa-map-marker-alt" style={{ marginRight: '6px' }}></i>
                              {selectedExp.companyInfo.location}
                            </span>
                          )}
                          {selectedExp.companyInfo.size && (
                            <span style={{ 
                              padding: '6px 14px', 
                              background: 'rgba(30, 58, 95,0.15)', 
                              borderRadius: '8px', 
                              fontSize: '12px' 
                            }}>
                              <i className="fas fa-users" style={{ marginRight: '6px' }}></i>
                              {selectedExp.companyInfo.size}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      );
    };
    
    ReactDOM.createRoot(document.getElementById('root')).render(<PublicProfile />);
  </script>
</body>
</html>`
}
