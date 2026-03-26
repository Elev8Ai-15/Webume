# SINGLE MANUS PROMPT — Copy & Paste This Entire Block
## Integrates: Calendly, Auth Guards, Terms of Service, Sitemap, Robots.txt, Blog Posts

---

**PASTE THE FOLLOWING INTO MANUS:**

---

I need you to add 6 features to my elev8ai.org website in one pass. Here are the exact files to create and changes to make. Do all of them before deploying.

## TASK 1: Calendly Booking — Add to Assessment Page

Create `client/components/CalendlyEmbed.tsx`:

```tsx
import { useEffect } from 'react';

export function CalendlyEmbed() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-2xl font-bold text-center mb-4 text-white">
        Ready to Talk? Book Your Free AI Consultation
      </h2>
      <p className="text-center text-gray-400 mb-8">
        30 minutes. No sales pitch. Just a real conversation about what AI can do for your business.
      </p>
      <div
        className="calendly-inline-widget"
        data-url="https://calendly.com/bradgpowell1123/free-ai-consultation?hide_gdpr_banner=1&primary_color=6366f1"
        style={{ minWidth: '320px', height: '700px' }}
      />
    </div>
  );
}
```

Then import and add `<CalendlyEmbed />` at the bottom of the Assessment page component, after the assessment form/results section.

Also add the Calendly CSS to the `<head>` of `index.html`:
```html
<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
```

## TASK 2: Admin Route Auth Guards

Create `client/components/PrivateRoute.tsx`:

```tsx
import { type ReactNode } from "react";
import { Redirect } from "wouter";
import { trpc } from "../lib/trpc";

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { data: user, isLoading, isError } = trpc.auth.me.useQuery();

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }} role="status">
        <div style={{ width: 40, height: 40, border: "4px solid #e5e7eb", borderTop: "4px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (isError || !user) {
    return <Redirect to="/admin/login" replace />;
  }

  return <>{children}</>;
}
```

In `App.tsx`, add `import { PrivateRoute } from "./components/PrivateRoute";` and wrap all admin routes EXCEPT `/admin/login` with `<PrivateRoute>`:

```tsx
<Route path="/admin/login"><AdminLogin /></Route>

<Route path="/admin/analytics">
  <PrivateRoute><AdminAnalytics /></PrivateRoute>
</Route>
<Route path="/admin/assessments">
  <PrivateRoute><AdminAssessments /></PrivateRoute>
</Route>
<Route path="/admin/orders">
  <PrivateRoute><AdminOrders /></PrivateRoute>
</Route>
<Route path="/admin/nonprofits">
  <PrivateRoute><AdminNonprofits /></PrivateRoute>
</Route>
```

Also verify the auth router has a `me` query. If it doesn't exist, add to `server/routers/auth.ts`:
```ts
me: publicProcedure.query((opts) => opts.ctx.user ?? null),
```

## TASK 3: Terms of Service Page

Create `client/pages/TermsOfService.tsx` — a full Terms of Service page with these 15 sections: Acceptance of Terms, Description of Services, Account Registration, Payment Terms (Stripe, refund policy), Intellectual Property, User Responsibilities, AI-Generated Content Disclaimer, Limitation of Liability, Indemnification, Privacy, Termination, Governing Law (Florida, Pasco County), Dispute Resolution (binding arbitration), Modifications, Contact (powellb.elev8ai@gmail.com, New Port Richey FL). Include a table of contents with anchor links. Use the existing site styling (dark theme with Tailwind). The company name is "Elev8 AI Solutions & Services" and the website is elev8ai.org.

Add a route in App.tsx: `<Route path="/terms"><TermsOfService /></Route>`

Add a "Terms of Service" link in the site footer next to the Privacy Policy link.

## TASK 4: Sitemap & Robots.txt

Create `public/sitemap.xml` with all public routes (homepage priority 1.0, /about and /assessment at 0.9, service pages at 0.8, /blog at 0.8, /resources and specialty pages at 0.7, /faq at 0.6, /privacy and /terms at 0.3). Include the /terms page. Set lastmod to 2026-03-15.

Create `public/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/login
Disallow: /admin/analytics
Disallow: /admin/assessments
Disallow: /admin/orders
Disallow: /admin/nonprofits
Disallow: /checkout
Disallow: /payment-success
Disallow: /payment-cancel
Sitemap: https://elev8ai.org/sitemap.xml
```

Make sure the Vercel rewrite rules don't catch sitemap.xml and robots.txt — they should be served as static files.

## TASK 5: Blog System + 3 Blog Posts

Create a simple blog system with these routes:
- `/blog` — Blog index page listing all posts with title, date, excerpt, and "Read more" link
- `/blog/:slug` — Individual blog post page

The blog can use a static array of blog post objects (no database needed for now). Each post object should have: slug, title, metaDescription, date, content (as JSX/markdown).

Create 3 blog posts:

**Post 1:** slug: "why-i-built-elev8-ai-solutions", title: "Why I Built Elev8 AI Solutions", date: "2026-03-15". Content: Founder story about the gap between $10K agency proposals and DIY tools that take 40 hours. Brad's 25+ years of experience, works directly with owners, delivers in 48 hours, takes 3 clients/month. CTA: free AI readiness assessment at elev8ai.org.

**Post 2:** slug: "5-ways-ai-saving-small-businesses-20-hours-per-week", title: "5 Ways AI Is Helping Tampa Bay Small Businesses Save 20+ Hours Per Week", date: "2026-03-15". Content: AI adoption hit 55% in 2025. The 5 ways: 1) Content & Marketing on Autopilot, 2) 24/7 Customer Service chatbots, 3) Operations & Admin Automation, 4) Pro-Level Design & Visuals, 5) Instant Business Insights. CTA: free AI Starter Kit + assessment.

**Post 3:** slug: "ai-is-more-than-chatbots-what-businesses-are-missing", title: "AI Is More Than Chatbots — Here's What Most Businesses Are Missing", date: "2026-03-15". Content: Deep analytics, brand development, focused marketing optimization, operational improvements. AI doesn't replace teams — it makes them more effective. CTA: free AI readiness assessment.

Each blog post should include author bio at the bottom: "Brad Powell is the founder of Elev8 AI Solutions & Services, based in New Port Richey, Florida. 25+ years of business experience."

Style the blog to match the existing dark theme. Add a "Blog" link in the site navigation.

## TASK 6: Add /terms to sitemap

Make sure the Terms of Service page URL is included in the sitemap.xml.

## IMPORTANT NOTES:
- Match the existing dark theme and styling throughout
- Import paths should match the existing project structure (check whether imports use `@/`, `../`, or `./`)
- The project uses wouter for routing, tRPC for API, and Tailwind CSS for styling
- Deploy after all changes are made
- Do NOT create any new database tables — blog posts can be a static array for now
