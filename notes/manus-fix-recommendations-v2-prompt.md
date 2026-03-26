# Manus Prompt — Fix Recommendation Engine (DETAILED — Follow Exactly)

## Copy/paste this EXACTLY into Manus (on the elev8ai.org project)

---

## TASK: Replace the static recommendation engine with Gemini AI-powered personalized recommendations

The current recommendation engine is broken. It returns only 1 generic recommendation with WRONG pricing ($5,000-$15,000 for a chatbot, $799/$1,499/$1,999 tiers). These prices are fabricated and do not match my actual service catalog. This must be fixed immediately — it makes my business look unprofessional and the pricing is misleading.

### WHAT IS WRONG RIGHT NOW (confirmed issues)

1. Only returns 1 recommendation — should return exactly 3
2. Setup Cost shows "$5,000 - $15,000" — MY actual chatbot price is $1,299
3. Pricing tiers show $799/$1,499/$1,999 — these are WRONG, made-up numbers
4. Recommendations are not personalized to what the user wrote
5. The old static recommendationEngine.ts is still being used instead of Gemini AI
6. The PDF report repeats the same generic text regardless of user answers

---

### STEP 1: Create this EXACT file — `server/_core/servicesKnowledgeBase.ts`

Create this file with my REAL services and REAL prices. Do NOT change these prices — they are correct:

```typescript
export const ELEV8_SERVICES = [
  {
    id: "chatbot",
    name: "AI Chatbot / Virtual Assistant",
    price: "$1,299 setup",
    monthlyFee: "Included",
    description: "24/7 AI chatbot that answers customer questions, captures leads, and books appointments automatically.",
    keywords: ["answering questions", "customer service", "after-hours", "lead capture", "too many calls", "scheduling", "chat", "support", "inquiries", "repetitive questions"],
    roi: "Capture 40%+ more leads, reduce support costs by 60%",
    timeSavings: "Save 15-20 hours/week on customer inquiries",
    implementationTime: "48 hours"
  },
  {
    id: "voice-agent",
    name: "Victoria AI Voice Agent",
    price: "$1,299 setup",
    monthlyFee: "Included",
    description: "AI-powered voice agent that answers phone calls 24/7, qualifies leads, and routes to the right person.",
    keywords: ["missing calls", "phone", "after hours", "receptionist", "voicemail", "call handling", "phone volume", "missed calls", "losing leads"],
    roi: "Never miss a call again — capture 112+ after-hours leads in 3 months",
    timeSavings: "Eliminate missed calls entirely",
    implementationTime: "48 hours"
  },
  {
    id: "landing-page",
    name: "AI Landing Page",
    price: "$199 one-time",
    monthlyFee: "None",
    description: "High-converting landing page built with AI-optimized copy and design to capture leads.",
    keywords: ["leads", "marketing", "online presence", "conversions", "advertising", "landing page", "website", "funnel"],
    roi: "2-3x higher conversion rates vs generic pages",
    timeSavings: "Launch in 48 hours instead of weeks",
    implementationTime: "48 hours"
  },
  {
    id: "full-website",
    name: "Full Business Website",
    price: "$399 one-time",
    monthlyFee: "None",
    description: "Modern, mobile-first business website with SEO, contact forms, and analytics built in.",
    keywords: ["website outdated", "no website", "old website", "need online presence", "mobile", "redesign", "professional website"],
    roi: "Professional online presence that converts visitors to customers",
    timeSavings: "Ready in 48 hours",
    implementationTime: "48 hours"
  },
  {
    id: "social-ad-pack",
    name: "Social Ad Pack",
    price: "$99 one-time",
    monthlyFee: "None",
    description: "5 professionally designed social media ads ready to run on Facebook, Instagram, or TikTok.",
    keywords: ["social media", "advertising", "ads", "brand awareness", "customers", "marketing", "facebook", "instagram", "tiktok"],
    roi: "Professional ad creative at 1/10th agency cost",
    timeSavings: "Ready in 24 hours",
    implementationTime: "24 hours"
  },
  {
    id: "viral-video",
    name: "Viral Video Short",
    price: "$29 one-time",
    monthlyFee: "None",
    description: "AI-generated short-form video for TikTok, Instagram Reels, or YouTube Shorts.",
    keywords: ["video", "content", "tiktok", "reels", "youtube", "social media content", "video marketing"],
    roi: "Engaging video content without expensive production",
    timeSavings: "Created in hours, not days",
    implementationTime: "24 hours"
  },
  {
    id: "explainer-video",
    name: "Explainer Video (60s)",
    price: "$179 one-time",
    monthlyFee: "None",
    description: "Professional 60-second explainer video for your product or service.",
    keywords: ["explain product", "demo", "onboarding", "sales tool", "explainer", "video production"],
    roi: "Increase understanding and conversions by 80%",
    timeSavings: "Delivered in 48 hours",
    implementationTime: "48 hours"
  },
  {
    id: "ada-compliance",
    name: "ADA Compliance Upgrade",
    price: "$500 one-time",
    monthlyFee: "None",
    description: "Full ADA & WCAG compliance audit, remediation, and ongoing monitoring via ADAShield.",
    keywords: ["accessibility", "ada", "compliance", "lawsuit", "wcag", "disability", "legal", "ada compliant"],
    roi: "Avoid $50K-$150K ADA lawsuits, reach 26% more customers",
    timeSavings: "Full audit and fix in 1 week",
    implementationTime: "1 week"
  },
  {
    id: "lockup-security",
    name: "LockUp Security Scan",
    price: "Free scan available",
    monthlyFee: "Plans from $29/mo",
    description: "Enterprise-grade security audit for websites, APIs, repos, and smart contracts. Powered by 28 OSS tools + 4 agentic LLMs.",
    keywords: ["security", "hacked", "data protection", "vulnerability", "breach", "compliance", "penetration test", "scan"],
    roi: "Identify critical vulnerabilities before hackers do",
    timeSavings: "Automated scan in minutes",
    implementationTime: "Instant"
  },
  {
    id: "workflow-automation",
    name: "Workflow Automation",
    price: "$1,299 setup",
    monthlyFee: "Included",
    description: "AI-powered automation of repetitive business tasks — invoicing, scheduling, follow-ups, data entry, email sequences.",
    keywords: ["manual processes", "repetitive", "automation", "efficiency", "time consuming", "paperwork", "invoicing", "scheduling", "follow-ups", "data entry", "manual work"],
    roi: "Save 15-20 hours/week on manual tasks",
    timeSavings: "Automate 80% of repetitive work",
    implementationTime: "1-2 weeks"
  }
];

export const COMPANY_INFO = {
  name: "Elev8 AI Solutions & Services",
  phone: "813.815.2382",
  website: "https://www.elev8ai.org",
  tagline: "AI consulting and automation for small businesses — Tampa Bay & nationwide",
  turnaround: "Most services delivered in 48 hours"
};
```

### STEP 2: Replace the recommendation logic in `server/_core/recommendationEngine.ts`

Delete ALL existing recommendation logic in this file. Replace the ENTIRE file with this:

```typescript
import { ELEV8_SERVICES, COMPANY_INFO } from './servicesKnowledgeBase';

export interface Recommendation {
  solution: string;
  price: string;
  description: string;
  estimatedROI: string;
  timeSavings: string;
  setupCost: string;
  implementationTimeline: string;
  riskLevel: string;
  expectedOutcome: string;
  priority: number;
}

export async function generateRecommendations(userAnswers: {
  biggestHeadache?: string;
  timeConsumingTask?: string;
  name?: string;
}): Promise<Recommendation[]> {
  const headache = userAnswers.biggestHeadache || '';
  const task = userAnswers.timeConsumingTask || '';
  const combined = `${headache} ${task}`.toLowerCase();

  // Try Gemini AI first
  try {
    if (process.env.GEMINI_API_KEY) {
      const aiRecs = await getGeminiRecommendations(combined, userAnswers.name || 'there');
      if (aiRecs && aiRecs.length >= 3) {
        return aiRecs;
      }
    }
  } catch (err) {
    console.error('[Recommendations] Gemini failed, using keyword fallback:', err);
  }

  // Fallback: keyword matching
  return getKeywordRecommendations(combined);
}

async function getGeminiRecommendations(userInput: string, userName: string): Promise<Recommendation[]> {
  const serviceList = ELEV8_SERVICES.map(s =>
    `- ${s.name} (${s.price}): ${s.description} | ROI: ${s.roi} | Time Savings: ${s.timeSavings} | Delivery: ${s.implementationTime}`
  ).join('\n');

  const prompt = `You are a senior AI consultant for ${COMPANY_INFO.name}. A potential client named ${userName} just described their business challenges:

"${userInput}"

From this service catalog, pick the 3 services that BEST solve their specific problems:

${serviceList}

For each recommendation, write a 2-sentence "description" that:
1. Directly references what the client said (their specific pain point)
2. Explains how this specific service solves THEIR problem

Return ONLY a valid JSON array with exactly 3 objects. Each object must have exactly these fields:
{
  "solution": "exact service name from catalog",
  "price": "exact price from catalog",
  "description": "your personalized 2-sentence explanation",
  "estimatedROI": "ROI from catalog",
  "timeSavings": "time savings from catalog",
  "setupCost": "exact price from catalog",
  "implementationTimeline": "delivery time from catalog",
  "riskLevel": "Low",
  "expectedOutcome": "one sentence expected result",
  "priority": 1 or 2 or 3
}

CRITICAL: Use the EXACT prices from the catalog. Do NOT invent prices. Do NOT say "$5,000" or "$15,000". My chatbot is $1,299, my landing page is $199, my website is $399. Use those exact numbers.

Return ONLY the JSON array. No markdown. No backticks. No explanation.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1500 }
      })
    }
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
  const parsed = JSON.parse(cleaned);

  // Validate: ensure prices match catalog
  return parsed.map((rec: any, i: number) => {
    const catalogMatch = ELEV8_SERVICES.find(s => s.name === rec.solution);
    return {
      solution: rec.solution || 'AI Consultation',
      price: catalogMatch?.price || rec.price || 'Contact for quote',
      description: rec.description || '',
      estimatedROI: catalogMatch?.roi || rec.estimatedROI || '',
      timeSavings: catalogMatch?.timeSavings || rec.timeSavings || '',
      setupCost: catalogMatch?.price || rec.setupCost || 'Contact for quote',
      implementationTimeline: catalogMatch?.implementationTime || rec.implementationTimeline || '48 hours',
      riskLevel: 'Low',
      expectedOutcome: rec.expectedOutcome || catalogMatch?.roi || '',
      priority: i + 1
    };
  });
}

function getKeywordRecommendations(combined: string): Recommendation[] {
  // Score each service by keyword matches
  const scored = ELEV8_SERVICES.map(service => {
    let score = 0;
    service.keywords.forEach(keyword => {
      if (combined.includes(keyword.toLowerCase())) {
        score += 1;
      }
    });
    return { service, score };
  });

  // Sort by score descending, take top 3
  scored.sort((a, b) => b.score - a.score);
  const top3 = scored.slice(0, 3);

  // If no matches at all, return chatbot + workflow + landing page as defaults
  if (top3[0].score === 0) {
    const defaults = ['chatbot', 'workflow-automation', 'landing-page'];
    const defaultServices = defaults.map(id => ELEV8_SERVICES.find(s => s.id === id)!);
    return defaultServices.map((s, i) => ({
      solution: s.name,
      price: s.price,
      description: s.description,
      estimatedROI: s.roi,
      timeSavings: s.timeSavings,
      setupCost: s.price,
      implementationTimeline: s.implementationTime,
      riskLevel: 'Low',
      expectedOutcome: s.roi,
      priority: i + 1
    }));
  }

  return top3.map(({ service }, i) => ({
    solution: service.name,
    price: service.price,
    description: service.description,
    estimatedROI: service.roi,
    timeSavings: service.timeSavings,
    setupCost: service.price,
    implementationTimeline: service.implementationTime,
    riskLevel: 'Low',
    expectedOutcome: service.roi,
    priority: i + 1
  }));
}
```

### STEP 3: Update the assessment router to pass user answers

In `server/routers/assessment.ts`, find where `generateRecommendations` is called and update it to pass the user's answers:

```typescript
const recommendations = await generateRecommendations({
  biggestHeadache: input.biggest_headache || input.responses?.q2_primary_bottleneck || '',
  timeConsumingTask: input.time_consuming_task || input.responses?.q3_time_consuming_task || '',
  name: input.name || input.contactName || '',
});
```

Make sure the `generateRecommendations` import points to `'../_core/recommendationEngine'`.

### STEP 4: Remove the fake pricing tiers from the email template

In the email template (check `server/_core/emailTemplates.ts` and `server/_core/email.ts`), find and DELETE the section that shows the fake "Our Pricing Plans" with Starter $799 / Growth $1,499 / Premium $1,999. Those prices are WRONG.

Replace that section with a simple CTA:

```html
<div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
  <h3 style="color: #dc2626; margin-bottom: 10px;">Ready to Get Started?</h3>
  <p style="color: #666; margin-bottom: 15px;">Schedule a free 30-minute consultation to discuss your personalized AI strategy.</p>
  <a href="https://www.elev8ai.org" style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">Book Free Consultation</a>
  <p style="color: #999; margin-top: 10px; font-size: 12px;">📞 813.815.2382 | Mon-Fri 8AM-5PM ET</p>
</div>
```

### STEP 5: Update the on-page results to show all 3 recommendations

In the frontend Assessment results component (the "Assessment Complete!" page), make sure it loops through ALL recommendations and displays each one — not just the first. Each card should show:
- Service name
- Price (from the recommendation object's `setupCost` field)
- Description
- Implementation timeline
- Expected ROI

### CRITICAL RULES — READ THESE

- Use ONLY the prices from `servicesKnowledgeBase.ts` — do NOT invent prices
- The chatbot costs $1,299 — NOT $5,000, NOT $15,000
- Do NOT add pricing tiers like Starter/Growth/Premium — those don't exist
- Return exactly 3 recommendations always
- The Gemini call should use model `gemini-2.0-flash` — it's fast and cheap
- Keep temperature at 0.3 — we want consistent, professional results
- Always include the keyword fallback in case Gemini API fails
- Do NOT change the frontend form questions
- Do NOT change the database schema
- Do NOT create new routes or pages
- Publish immediately after changes

### VERIFY (do all of these before marking complete)

1. Submit assessment with: "I keep missing customer calls after hours" + "Answering the same questions over and over"
2. Verify the results page shows EXACTLY 3 recommendations
3. Verify the #1 recommendation is Victoria AI Voice Agent or AI Chatbot at $1,299
4. Verify NO recommendation shows prices above $1,299
5. Verify the pricing tiers section ($799/$1,499/$1,999) is GONE from the email
6. Verify the PDF attachment contains all 3 recommendations with correct prices
7. Verify the description text references the user's actual answers (not generic text)

---
