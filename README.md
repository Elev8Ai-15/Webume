# Webume - Brad Powell

A modern, interactive web resume platform built with Hono and React.

## Project Overview
- **Name**: Webume
- **Goal**: Create a transparent, verifiable web resume with AI-powered chatbot
- **Features**: 
  - Career Timeline with verified metrics
  - Colleague Validations with verification badges
  - Truth Vault - Anonymous company culture ratings
  - AI Headhunter Chatbot
  - Dark/Light mode toggle
  - Section filtering (All, Timeline, Truth Vault)
  - Local storage persistence
  - Responsive mobile design

## URLs
- **Development**: https://3000-izyu2fpqppfan5ciwputt-2e1b9533.sandbox.novita.ai
- **Production**: (Deploy to get Cloudflare URL)

## Tech Stack
- **Backend**: Hono (Cloudflare Workers)
- **Frontend**: React 18 (via CDN with Babel)
- **UI**: Material UI 5 + Custom CSS
- **Build**: Vite + Wrangler
- **Deployment**: Cloudflare Pages

## Features

### Career Timeline
- Visual timeline with role details
- Verified metrics (Revenue +47%, Costs -22%, etc.)
- Embedded media (videos, charts)
- Colleague validations with verified badges

### Truth Vault
- Company culture transparency ratings
- Anonymous employee ratings (1-10 scale)
- Color-coded health indicators
- Toxicity level visualization

### AI Headhunter Chatbot
- Contextual responses about experience, skills, availability
- Salary/compensation inquiries
- Interview scheduling prompts
- Culture and Truth Vault questions

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start development server
npm run dev:sandbox

# Or use PM2
pm2 start ecosystem.config.cjs
```

## Deployment

```bash
# Build and deploy to Cloudflare Pages
npm run deploy:prod
```

## Project Structure
```
webapp/
├── src/
│   └── index.tsx          # Main Hono app with embedded React
├── public/static/         # Static assets
├── dist/                  # Build output
├── ecosystem.config.cjs   # PM2 configuration
├── wrangler.jsonc         # Cloudflare configuration
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies
```

## User Guide

1. **Browse the Timeline**: View Brad's career history with verified metrics
2. **Read Validations**: See verified colleague testimonials
3. **Check Truth Vault**: Review company culture ratings
4. **Chat with AI**: Click the chat bubble to ask questions
5. **Toggle Sections**: Use nav buttons to filter content
6. **Switch Theme**: Toggle between dark/light mode

## Deployment Status
- **Platform**: Cloudflare Pages
- **Status**: ✅ Development Active
- **Last Updated**: 2026-01-08
