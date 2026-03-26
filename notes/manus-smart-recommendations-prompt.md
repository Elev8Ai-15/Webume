# Manus Prompt — Upgrade Assessment Recommendations to AI-Powered

## Copy/paste this EXACTLY into Manus (on the elev8ai.org project)

---

## TASK: Replace the static recommendation engine with AI-powered personalized recommendations using the Gemini API

The current `recommendationEngine.ts` only returns generic "Custom AI Consultation" because the 4-question form doesn't collect enough data to match its hardcoded IF/ELSE rules. Fix this by using the GEMINI_API_KEY (already configured in secrets) to generate smart, personalized recommendations based on the user's actual answers, mapped to Elev8 AI's real services.

### STEP 1: Create a services knowledge base

Create file: `server/_core/servicesKnowledgeBase.ts`

```typescript
export const ELEV8_SERVICES = [
  {
    name: "AI Chatbot / Virtual Assistant",
    price: "$1,299 setup",
    description: "24/7 AI chatbot that answers customer questions, captures leads, and books appointments automatically.",
    idealFor: ["answering same questions", "customer service", "after-hours inquiries", "lead capture", "too many calls", "scheduling"],
    roi: "Capture 40%+ more leads, reduce support costs by 60%"
  },
  {
    name: "Victoria AI Voice Agent",
    price: "$1,299 setup",
    description: "AI-powered voice agent that answers phone calls, qualifies leads, and routes to the right person.",
    idealFor: ["missing calls", "phone volume", "after hours", "receptionist", "call handling", "voicemail"],
    roi: "Never miss a call again, capture 112+ after-hours leads in 3 months"
  },
  {
    name: "AI Landing Page",
    price: "$199",
    description: "High-converting landing page built with AI-optimized copy and design.",
    idealFor: ["need more leads", "marketing", "online presence", "conversions", "advertising"],
    roi: "2-3x higher conversion rates vs generic pages"
  },
  {
    name: "Full Business Website",
    price: "$399",
    description: "Modern, mobile-first business website with SEO, contact forms, and analytics.",
    idealFor: ["website outdated", "no website", "old website", "need online presence", "mobile friendly"],
    roi: "Professional online presence in 48 hours"
  },
  {
    name: "Social Ad Pack",
    price: "$99",
    description: "5 professionally designed social media ads ready to run on Facebook, Instagram, or TikTok.",
    idealFor: ["social media", "advertising", "brand awareness", "need customers", "marketing budget"],
    roi: "Professional ad creative at 1/10th agency cost"
  },
  {
    name: "Viral Video Short",
    price: "$29",
    description: "AI-generated short-form video for TikTok, Reels, or YouTube Shorts.",
    idealFor: ["video content", "social media", "tiktok", "reels", "content creation"],
    roi: "Engaging video content without expensive production"
  },
  {
    name: "Explainer Video (60s)",
    price: "$179",
    description: "Professional 60-second explainer video for your product or service.",
    idealFor: ["explain product", "video", "onboarding", "sales tool", "demo"],
    roi: "Increase understanding and conversions by 80%"
  },
  {
    name: "ADA Compliance Upgrade",
    price: "$500",
    description: "Full ADA & WCAG compliance audit, remediation, and ongoing monitoring via ADAShield.",
    idealFor: ["accessibility", "ada compliance", "lawsuit risk", "wcag", "disability", "legal compliance"],
    roi: "Avoid $50K-$150K ADA lawsuits, reach 26% more customers"
  },
  {
    name: "LockUp Security Scan",
    price: "Free tier available",
    description: "Enterprise-grade security audit for websites, APIs, repos, and smart contracts.",
    idealFor: ["security", "hacked", "data protection", "vulnerability", "breach", "compliance"],
    roi: "Identify critical vulnerabilities before hackers do"
  },
  {
    name: "Workflow Automation",
    price: "Custom quote",
    description: "AI-powered automation of repetitive business tasks — invoicing, scheduling, follow-ups, data entry.",
    idealFor: ["manual processes", "repetitive tasks", "automation", "efficiency", "time consuming", "paperwork", "invoicing", "scheduling", "follow-ups", "data entry"],
    roi: "Save 15-20 hours/week on manual tasks"
  }
];

export const COMPANY_INFO = {
  name: "Elev8 AI Solutions & Services",
  phone: "813.815.2382",
  website: "https://www.elev8ai.org",
  bookingUrl: "https://www.elev8ai.org/assessment",
  tagline: "AI consulting and automation for small businesses in Tampa Bay",
  differentiators: [
    "48-hour turnaround on most services",
    "No long-term contracts",
    "Free initial AI assessment",
    "Serving Tampa Bay locally + businesses nationwide remotely"
  ]
};
```

### STEP 2: Update the recommendation engine

Replace the logic in `server/_core/recommendationEngine.ts` (or wherever `generateRecommendations` is defined) with a Gemini API call:

```typescript
import { ELEV8_SERVICES, COMPANY_INFO } from './servicesKnowledgeBase';

export async function generateSmartRecommendations(userAnswers: {
  name: string;
  biggestHeadache: string;
  timeConsumingTask: string;
}): Promise<any[]> {
  const prompt = `You are a senior AI consultant for ${COMPANY_INFO.name}. A potential client just completed a quick assessment.

Their answers:
- Biggest business headache: "${userAnswers.biggestHeadache}"
- Most time-consuming task: "${userAnswers.timeConsumingTask}"

Based on their answers, recommend exactly 3 services from this catalog that would help them most:

${JSON.stringify(ELEV8_SERVICES.map(s => ({ name: s.name, price: s.price, description: s.description, idealFor: s.idealFor, roi: s.roi })), null, 2)}

Return ONLY valid JSON array with exactly 3 objects, each with these fields:
- solution: service name from catalog
- price: the price
- description: 2-3 sentence personalized explanation of WHY this service solves THEIR specific problem (reference their answers)
- estimatedROI: the ROI from catalog
- priority: 1, 2, or 3

No markdown. No explanation. Just the JSON array.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1000 }
        })
      }
    );
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('[Assessment] Gemini recommendation failed:', error);
    // Fallback: return top 3 keyword-matched services
    return ELEV8_SERVICES.slice(0, 3).map((s, i) => ({
      solution: s.name,
      price: s.price,
      description: s.description,
      estimatedROI: s.roi,
      priority: i + 1
    }));
  }
}
```

### STEP 3: Wire it into the assessment submission

In `server/routers/assessment.ts`, replace the call to the old `generateRecommendations()` function with `generateSmartRecommendations()`:

```typescript
import { generateSmartRecommendations } from '../_core/recommendationEngine';

// Inside the submit handler, replace the old recommendations call:
const recommendations = await generateSmartRecommendations({
  name: input.name,
  biggestHeadache: input.biggest_headache,
  timeConsumingTask: input.time_consuming_task,
});
```

### STEP 4: Update the email template

In `server/_core/emailTemplates.ts` (or wherever the assessment email HTML is built), update the recommendation section to show the personalized recommendations with prices:

For each recommendation, display:
- Service name (bold)
- Price
- Personalized description (the AI-generated "why this helps YOU" text)
- Expected ROI

Add a CTA button at the bottom: "Book Your Free Consultation" → link to https://www.elev8ai.org/assessment

### STEP 5: Update the on-page results

In the frontend Assessment results component (the "Assessment Complete!" page), display the 3 personalized recommendations with the same format — service name, price, personalized description, ROI.

### CRITICAL RULES
- Use the existing GEMINI_API_KEY from secrets — do NOT create new API keys
- Keep gemini-2.0-flash model (fast + cheap, ~$0.001 per assessment)
- Keep the fallback in case Gemini fails — never break the form
- Do NOT change the 4-question form structure
- Do NOT add new pages or routes
- Do NOT change the database schema — store recommendations as JSON string in existing field
- Temperature 0.3 for consistent, professional output
- maxOutputTokens 1000 to keep costs low
- Publish immediately after testing
- Test by submitting assessment with "I spend too much time answering the same customer questions" and verify it recommends the AI Chatbot

---
