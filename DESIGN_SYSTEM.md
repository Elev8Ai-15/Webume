# Webume Design System: Glassmorphism UI Redesign Plan

## Executive Summary

This document outlines a comprehensive UI redesign plan for Webume, transforming it into a premium, futuristic glassmorphism-based professional profile platform. The redesign addresses identified gaps in the current implementation and establishes a data-driven, modern design system.

---

## 1. Research Analysis: Modern Glassmorphism Principles

### 1.1 What Makes Glassmorphism Premium & Futuristic

Based on analysis of industry-leading examples (Apple iOS/macOS, Windows 11 Fluent, Behance portfolios):

**Core Visual Characteristics:**
- **Backdrop Blur**: 10-40px (moderate intensity; avoid over-blurring)
- **Transparency**: 60-80% opacity with subtle tints (not fully transparent)
- **Layered Depth**: Multiple z-levels with soft shadows creating spatial hierarchy
- **Soft Borders**: 1px semi-transparent borders with rim highlights
- **Vibrant Backgrounds**: Rich gradients, mesh patterns, or colorful imagery behind glass

**Key Differentiators of Premium Glass UI:**
1. **Intentional Use**: Glass only on key interactive elements (nav, cards, modals)
2. **Environmental Design**: Background designed to support glass effects
3. **Consistent Light Direction**: Single light source creating coherent highlights
4. **High Contrast Text**: Readable typography despite transparency
5. **Subtle Motion**: Parallax, hover glows, smooth transitions

### 1.2 Current Webume UI Gaps Analysis

| Aspect | Current State | Target State |
|--------|--------------|--------------|
| Background | Static mesh gradient | Dynamic animated gradient with floating shapes |
| Glass Cards | Low opacity (3-6%), weak effect | Higher opacity (10-20%), visible blur |
| Blur Intensity | 20-40px (too uniform) | Variable 12-30px based on layer depth |
| Borders | Single color, flat | Gradient rim highlights, inner glow |
| Typography | Good foundation | Add text shadows, improve contrast |
| Color Depth | Limited palette | Rich multi-tone gradients |
| Motion | Basic keyframe animations | Physics-based micro-interactions |
| Visual Hierarchy | Flat sections | Clear z-layer stacking |

---

## 2. Design Token System

### 2.1 Color Tokens

```css
/* === VOID SCALE (Backgrounds) === */
--void-900: #030308;    /* Deepest black */
--void-800: #07070f;    /* App background */
--void-700: #0c0c18;    /* Section backgrounds */
--void-600: #12121f;    /* Card backgrounds */
--void-500: #1a1a2e;    /* Elevated surfaces */
--void-400: #24243d;    /* Hover states */

/* === GLASS TOKENS === */
--glass-bg-light: rgba(255, 255, 255, 0.08);
--glass-bg-medium: rgba(255, 255, 255, 0.12);
--glass-bg-heavy: rgba(255, 255, 255, 0.18);
--glass-bg-tinted: rgba(99, 102, 241, 0.08);

--glass-border-subtle: rgba(255, 255, 255, 0.06);
--glass-border-default: rgba(255, 255, 255, 0.12);
--glass-border-highlight: rgba(255, 255, 255, 0.20);
--glass-border-glow: rgba(99, 102, 241, 0.40);

/* === PRIMARY ACCENT SPECTRUM === */
--accent-indigo-500: #6366f1;  /* Primary */
--accent-indigo-400: #818cf8;
--accent-indigo-600: #4f46e5;

--accent-violet-500: #8b5cf6;  /* Secondary */
--accent-violet-400: #a78bfa;
--accent-violet-600: #7c3aed;

--accent-fuchsia-500: #d946ef; /* Tertiary */
--accent-fuchsia-400: #e879f9;

/* === SEMANTIC COLORS === */
--success: #10b981;
--success-glow: rgba(16, 185, 129, 0.25);

--warning: #f59e0b;
--warning-glow: rgba(245, 158, 11, 0.25);

--error: #ef4444;
--error-glow: rgba(239, 68, 68, 0.25);

--info: #06b6d4;
--info-glow: rgba(6, 182, 212, 0.25);

/* === TEXT HIERARCHY === */
--text-100: #ffffff;
--text-200: #f0f0f5;
--text-300: #d0d0dd;
--text-400: #9898a8;
--text-500: #6a6a7d;
--text-600: #4a4a5e;

/* === GRADIENT DEFINITIONS === */
--gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
--gradient-secondary: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%);
--gradient-dark: linear-gradient(180deg, #0c0c18 0%, #030308 100%);
--gradient-glow: radial-gradient(ellipse at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
--gradient-mesh: 
  radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.20) 0px, transparent 50%),
  radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
  radial-gradient(at 100% 100%, rgba(217, 70, 239, 0.10) 0px, transparent 50%),
  radial-gradient(at 0% 100%, rgba(6, 182, 212, 0.12) 0px, transparent 50%);
```

### 2.2 Typography Tokens

```css
/* === FONT FAMILIES === */
--font-display: 'Space Grotesk', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* === FONT SIZES (Fluid Scale) === */
--text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.8rem);
--text-sm: clamp(0.825rem, 0.8rem + 0.25vw, 0.9rem);
--text-base: clamp(0.95rem, 0.9rem + 0.25vw, 1rem);
--text-lg: clamp(1.1rem, 1rem + 0.5vw, 1.25rem);
--text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
--text-2xl: clamp(1.5rem, 1.25rem + 1.25vw, 2rem);
--text-3xl: clamp(2rem, 1.5rem + 2.5vw, 3rem);
--text-4xl: clamp(2.5rem, 2rem + 3vw, 4rem);
--text-5xl: clamp(3rem, 2.5rem + 4vw, 5rem);

/* === FONT WEIGHTS === */
--weight-light: 300;
--weight-normal: 400;
--weight-medium: 500;
--weight-semibold: 600;
--weight-bold: 700;
--weight-black: 900;

/* === LINE HEIGHTS === */
--leading-none: 1;
--leading-tight: 1.15;
--leading-snug: 1.3;
--leading-normal: 1.5;
--leading-relaxed: 1.65;
--leading-loose: 1.8;

/* === LETTER SPACING === */
--tracking-tighter: -0.03em;
--tracking-tight: -0.015em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
--tracking-wider: 0.05em;
--tracking-widest: 0.1em;
```

### 2.3 Spacing Tokens

```css
/* === SPACING SCALE === */
--space-0: 0;
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
--space-32: 128px;

/* === CONTAINER WIDTHS === */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;

/* === BORDER RADIUS === */
--radius-none: 0;
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 14px;
--radius-xl: 20px;
--radius-2xl: 28px;
--radius-3xl: 36px;
--radius-full: 9999px;
```

### 2.4 Effects & Shadows

```css
/* === BLUR INTENSITIES === */
--blur-none: 0;
--blur-sm: 4px;
--blur-md: 12px;
--blur-lg: 20px;
--blur-xl: 32px;
--blur-2xl: 48px;

/* === BOX SHADOWS === */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.25);
--shadow-md: 0 8px 24px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.35);
--shadow-xl: 0 24px 64px rgba(0, 0, 0, 0.4);
--shadow-glow-sm: 0 0 20px rgba(99, 102, 241, 0.2);
--shadow-glow-md: 0 0 40px rgba(99, 102, 241, 0.25);
--shadow-glow-lg: 0 0 60px rgba(99, 102, 241, 0.3);
--shadow-glow-accent: 0 4px 30px rgba(99, 102, 241, 0.4);

/* === GLASS SHADOW COMPOSITE === */
--shadow-glass: 
  0 8px 32px rgba(0, 0, 0, 0.3),
  inset 0 1px 0 rgba(255, 255, 255, 0.1);
```

---

## 3. Component Design Specifications

### 3.1 Glass Card Component

```css
.glass-card {
  /* Base Glass */
  background: var(--glass-bg-medium);
  backdrop-filter: blur(var(--blur-lg));
  -webkit-backdrop-filter: blur(var(--blur-lg));
  
  /* Border with Rim Highlight */
  border: 1px solid var(--glass-border-default);
  border-top-color: var(--glass-border-highlight);
  
  /* Rounded Corners */
  border-radius: var(--radius-xl);
  
  /* Shadow Stack */
  box-shadow: var(--shadow-glass);
  
  /* Inner Highlight (pseudo-element) */
  position: relative;
  overflow: hidden;
}

.glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 0%,
    transparent 40%
  );
  pointer-events: none;
}

/* Hover State */
.glass-card:hover {
  background: var(--glass-bg-heavy);
  border-color: var(--glass-border-glow);
  box-shadow: 
    var(--shadow-glass),
    var(--shadow-glow-md);
  transform: translateY(-4px);
}
```

### 3.2 Navigation Bar

```css
.nav-glass {
  position: fixed;
  top: var(--space-4);
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - var(--space-8));
  max-width: var(--container-xl);
  
  background: rgba(12, 12, 24, 0.75);
  backdrop-filter: blur(var(--blur-xl)) saturate(180%);
  -webkit-backdrop-filter: blur(var(--blur-xl)) saturate(180%);
  
  border: 1px solid var(--glass-border-subtle);
  border-radius: var(--radius-2xl);
  
  padding: var(--space-3) var(--space-6);
  
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
```

### 3.3 Timeline Component

```css
.timeline-container {
  position: relative;
  padding-left: var(--space-16);
}

/* Glowing Timeline Line */
.timeline-line {
  position: absolute;
  left: var(--space-5);
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    180deg,
    var(--accent-indigo-500) 0%,
    var(--accent-violet-500) 50%,
    var(--accent-fuchsia-500) 100%
  );
  box-shadow: 0 0 12px var(--accent-indigo-500);
}

/* Timeline Node */
.timeline-node {
  position: absolute;
  left: calc(var(--space-5) - 8px);
  width: 18px;
  height: 18px;
  background: var(--void-800);
  border: 3px solid var(--accent-indigo-500);
  border-radius: var(--radius-full);
  box-shadow: 
    0 0 0 4px var(--void-800),
    0 0 20px rgba(99, 102, 241, 0.5);
}

.timeline-node.active {
  background: var(--accent-indigo-500);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 4px var(--void-800), 0 0 20px rgba(99, 102, 241, 0.5); }
  50% { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0.2), 0 0 30px rgba(99, 102, 241, 0.7); }
}

/* Timeline Entry Card */
.timeline-entry {
  margin-bottom: var(--space-8);
  padding: var(--space-6);
  background: var(--glass-bg-light);
  backdrop-filter: blur(var(--blur-md));
  border: 1px solid var(--glass-border-subtle);
  border-radius: var(--radius-xl);
  
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.timeline-entry:hover {
  background: var(--glass-bg-medium);
  border-color: var(--glass-border-glow);
  transform: translateX(8px);
}
```

### 3.4 Metric Badge/Chip

```css
.metric-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  
  background: var(--glass-bg-tinted);
  backdrop-filter: blur(var(--blur-sm));
  
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: var(--radius-full);
  
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--accent-indigo-400);
  
  box-shadow: 0 0 16px rgba(99, 102, 241, 0.15);
}

.metric-badge.success {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.3);
  color: var(--success);
}

.metric-badge.large {
  padding: var(--space-3) var(--space-5);
  font-size: var(--text-base);
}
```

### 3.5 Form Inputs

```css
.input-glass {
  width: 100%;
  padding: var(--space-4) var(--space-5);
  
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(var(--blur-sm));
  
  border: 1px solid var(--glass-border-subtle);
  border-radius: var(--radius-lg);
  
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--text-100);
  
  transition: all 0.25s ease;
}

.input-glass::placeholder {
  color: var(--text-500);
}

.input-glass:focus {
  outline: none;
  background: rgba(0, 0, 0, 0.4);
  border-color: var(--accent-indigo-500);
  box-shadow: 
    0 0 0 3px rgba(99, 102, 241, 0.15),
    var(--shadow-glow-sm);
}

.input-glass:hover:not(:focus) {
  border-color: var(--glass-border-default);
}
```

### 3.6 Chat/Agent Window

```css
.chat-window {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  width: 380px;
  max-height: 560px;
  
  background: rgba(12, 12, 24, 0.85);
  backdrop-filter: blur(var(--blur-2xl)) saturate(150%);
  
  border: 1px solid var(--glass-border-default);
  border-radius: var(--radius-2xl);
  
  box-shadow: 
    0 24px 80px rgba(0, 0, 0, 0.5),
    0 0 60px rgba(99, 102, 241, 0.1);
    
  overflow: hidden;
}

.chat-header {
  padding: var(--space-4) var(--space-5);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.06) 0%,
    transparent 100%
  );
  border-bottom: 1px solid var(--glass-border-subtle);
}

.chat-messages {
  padding: var(--space-4);
  max-height: 400px;
  overflow-y: auto;
}

.chat-bubble {
  max-width: 85%;
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-3);
  
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border-subtle);
  border-radius: var(--radius-lg);
  border-bottom-left-radius: var(--radius-sm);
  
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}

.chat-bubble.user {
  margin-left: auto;
  background: var(--gradient-primary);
  border: none;
  border-bottom-left-radius: var(--radius-lg);
  border-bottom-right-radius: var(--radius-sm);
  color: white;
}
```

### 3.7 Truth Vault Rating Bar

```css
.rating-bar-container {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.rating-bar-track {
  flex: 1;
  height: 8px;
  background: var(--void-500);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
}

.rating-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

/* Toxicity Gradient (1=green, 10=red) */
.rating-bar-fill[data-rating="1"],
.rating-bar-fill[data-rating="2"],
.rating-bar-fill[data-rating="3"] {
  background: linear-gradient(90deg, #10b981, #34d399);
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.5);
}

.rating-bar-fill[data-rating="4"],
.rating-bar-fill[data-rating="5"] {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.5);
}

.rating-bar-fill[data-rating="6"],
.rating-bar-fill[data-rating="7"] {
  background: linear-gradient(90deg, #f97316, #fb923c);
  box-shadow: 0 0 12px rgba(249, 115, 22, 0.5);
}

.rating-bar-fill[data-rating="8"],
.rating-bar-fill[data-rating="9"],
.rating-bar-fill[data-rating="10"] {
  background: linear-gradient(90deg, #ef4444, #f87171);
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.5);
}

.rating-value {
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  min-width: 40px;
  text-align: right;
}
```

---

## 4. Motion & Animation System

### 4.1 Timing Functions

```css
/* === EASING CURVES === */
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.16, 1, 0.3, 1);  /* Primary */
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

/* === DURATIONS === */
--duration-instant: 50ms;
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-slower: 800ms;
```

### 4.2 Keyframe Animations

```css
/* Fade & Scale In */
@keyframes fadeScaleIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Glow Pulse */
@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(99, 102, 241, 0.5);
  }
}

/* Float */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Shimmer (for loading states) */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Background Mesh Movement */
@keyframes meshFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.6;
  }
  33% {
    transform: translate(2%, -2%) scale(1.02);
    opacity: 0.7;
  }
  66% {
    transform: translate(-1%, 1%) scale(0.98);
    opacity: 0.5;
  }
}

/* Orb Drift */
@keyframes orbDrift {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    filter: blur(80px);
  }
  25% {
    transform: translate(30px, -20px) scale(1.05);
    filter: blur(90px);
  }
  50% {
    transform: translate(-20px, 30px) scale(0.95);
    filter: blur(70px);
  }
  75% {
    transform: translate(10px, 10px) scale(1.02);
    filter: blur(85px);
  }
}
```

### 4.3 Micro-interactions

```css
/* Button Hover Glow */
.btn-primary {
  transition: 
    transform var(--duration-fast) var(--ease-spring),
    box-shadow var(--duration-normal) var(--ease-out);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 10px 40px rgba(99, 102, 241, 0.4),
    0 0 0 1px rgba(99, 102, 241, 0.5);
}

.btn-primary:active {
  transform: translateY(-1px);
  transition-duration: var(--duration-instant);
}

/* Card Lift */
.glass-card {
  transition: 
    transform var(--duration-normal) var(--ease-spring),
    box-shadow var(--duration-normal) var(--ease-out),
    border-color var(--duration-fast) var(--ease-in-out);
}

/* Link Underline Reveal */
.link-animated {
  position: relative;
}

.link-animated::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--gradient-primary);
  transition: width var(--duration-normal) var(--ease-spring);
}

.link-animated:hover::after {
  width: 100%;
}
```

---

## 5. Accessibility Requirements

### 5.1 Contrast Ratios

| Element | Minimum Ratio | Target Colors |
|---------|---------------|---------------|
| Body Text | 4.5:1 | --text-200 on --void-700 |
| Large Text | 3:1 | --text-300 on --void-600 |
| Interactive | 3:1 | --accent-indigo-400 on --void-800 |
| Focus Ring | 3:1 | --accent-indigo-500 |

### 5.2 Focus States

```css
/* Visible Focus Ring */
:focus-visible {
  outline: 2px solid var(--accent-indigo-500);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}

/* Focus Within for Glass Cards */
.glass-card:focus-within {
  border-color: var(--accent-indigo-500);
  box-shadow: 
    var(--shadow-glass),
    0 0 0 3px rgba(99, 102, 241, 0.2);
}
```

### 5.3 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .orb { display: none; }
  .bg-mesh { animation: none; }
}
```

### 5.4 Backdrop-Filter Fallbacks

```css
/* Feature Detection Fallback */
@supports not (backdrop-filter: blur(10px)) {
  .glass-card {
    background: rgba(18, 18, 31, 0.95);
  }
  
  .nav-glass {
    background: rgba(12, 12, 24, 0.98);
  }
  
  .chat-window {
    background: rgba(12, 12, 24, 0.98);
  }
}
```

---

## 6. Responsive Design System

### 6.1 Breakpoints

```css
/* Mobile First Breakpoints */
--bp-sm: 640px;   /* Small tablets */
--bp-md: 768px;   /* Tablets */
--bp-lg: 1024px;  /* Small laptops */
--bp-xl: 1280px;  /* Desktops */
--bp-2xl: 1536px; /* Large screens */
```

### 6.2 Mobile Adaptations

```css
/* Mobile Navigation */
@media (max-width: 768px) {
  .nav-glass {
    width: calc(100% - var(--space-4));
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-xl);
  }
  
  .nav-links {
    display: none; /* Hamburger menu trigger */
  }
  
  .mobile-menu {
    position: fixed;
    inset: 0;
    background: rgba(3, 3, 8, 0.98);
    backdrop-filter: blur(var(--blur-2xl));
    padding: var(--space-20) var(--space-6);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    z-index: 9999;
  }
}

/* Mobile Timeline */
@media (max-width: 768px) {
  .timeline-container {
    padding-left: var(--space-8);
  }
  
  .timeline-line {
    left: var(--space-2);
  }
  
  .timeline-node {
    left: calc(var(--space-2) - 6px);
    width: 14px;
    height: 14px;
  }
}

/* Mobile Chat */
@media (max-width: 640px) {
  .chat-window {
    position: fixed;
    inset: 0;
    width: 100%;
    max-height: none;
    border-radius: 0;
    z-index: 10000;
  }
}
```

---

## 7. Technical Implementation Notes

### 7.1 CSS Variable Architecture

```css
/* Root-level theme configuration */
:root {
  color-scheme: dark;
  /* All tokens defined here */
}

/* Light mode override (if needed) */
:root[data-theme="light"] {
  --void-900: #f8f9fa;
  --void-800: #ffffff;
  --text-100: #111827;
  /* ... inverse tokens */
}
```

### 7.2 Performance Considerations

1. **Limit blur elements**: Max 3-5 simultaneous backdrop-filter elements
2. **GPU acceleration**: Use `transform: translateZ(0)` on animated glass elements
3. **Will-change**: Apply sparingly to frequently animated elements
4. **Lazy load orbs**: Hide decorative orbs below the fold until scroll
5. **Reduce blur on mobile**: Use `--blur-md` instead of `--blur-xl` on touch devices

### 7.3 Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| backdrop-filter | 76+ | 103+ | 9+ | 17+ |
| CSS Variables | 49+ | 31+ | 9.1+ | 15+ |
| clamp() | 79+ | 75+ | 13.1+ | 79+ |
| @supports | 28+ | 22+ | 9+ | 12+ |

---

## 8. Component Inventory Checklist

### 8.1 Core Components
- [ ] Glass Card (standard, elevated, tinted)
- [ ] Navigation Bar (desktop, mobile, hamburger)
- [ ] Button Set (primary, secondary, ghost, icon)
- [ ] Input Fields (text, textarea, select, file upload)
- [ ] Badge/Chip (metric, status, tag)

### 8.2 Feature Components
- [ ] Timeline Entry
- [ ] Experience Card
- [ ] Validation Card (colleague endorsement)
- [ ] Truth Vault Entry (company rating)
- [ ] Metric Display (large number + label)
- [ ] Progress Bar (animated fill)
- [ ] Chart Container (Chart.js wrapper)

### 8.3 Layout Components
- [ ] Section Header (badge + title + description)
- [ ] Content Container (max-width wrapper)
- [ ] Grid System (responsive columns)
- [ ] Sidebar Navigation
- [ ] Footer

### 8.4 Interactive Components
- [ ] Chat Window (Hunter Agent)
- [ ] Modal/Dialog
- [ ] Dropdown Menu
- [ ] Toast/Notification
- [ ] Tooltip
- [ ] File Upload Zone

### 8.5 Decorative Elements
- [ ] Floating Orbs
- [ ] Background Mesh
- [ ] Grid Overlay
- [ ] Gradient Text
- [ ] Glow Effects

---

## 9. Data Preservation Requirements

All redesign must maintain these key data points from the original payload:

### Profile Data
- **Name**: Brad Powell
- **Title**: Senior Ops Leader
- **Video URL**: https://www.youtube.com/embed/dQw4w9WgXcQ
- **Chart URL**: https://via.placeholder.com/800x400?text=Revenue+Growth+Chart

### Timeline Data
| Company | Role | Period | Metrics |
|---------|------|--------|---------|
| Acme Corp | Senior Ops Leader | 2015-2025 | Revenue +47%, Costs -22%, Team efficiency +65% |
| TechGiant Inc | Operations Manager | 2008-2015 | Volume +1000%, Error rate -90% |

### Truth Vault Data
| Company | Toxicity Score |
|---------|---------------|
| Acme | 3 |
| TechGiant | 8 |
| GoodPlace | 9 |

### External Assets
- Fonts: https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap
- React 18, ReactDOM 18, Babel, MUI 5, MUI Icons 5 (unpkg CDN)

---

## 10. Deliverables Summary

1. **Moodboard**: Visual references captured from research
2. **Design Tokens**: Complete CSS variable system (Section 2)
3. **Component Specifications**: CSS patterns for all UI elements (Section 3)
4. **Motion System**: Animations and transitions (Section 4)
5. **Accessibility Guide**: Contrast, focus, reduced motion (Section 5)
6. **Responsive Rules**: Breakpoints and mobile adaptations (Section 6)
7. **Implementation Notes**: Technical considerations (Section 7)
8. **Component Inventory**: Checklist of all needed components (Section 8)

---

*Document Version: 1.0*  
*Created: 2026-01-08*  
*Status: Ready for Implementation*
