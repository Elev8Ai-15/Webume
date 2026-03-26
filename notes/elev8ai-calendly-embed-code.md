# Calendly Integration for Elev8 AI - Assessment Page

## Your Calendly URLs
- **Landing page:** https://calendly.com/bradgpowell1123
- **Direct booking link:** https://calendly.com/bradgpowell1123/free-ai-consultation

## Event Details
- **Name:** Free AI Consultation
- **Duration:** 30 minutes
- **Location:** Google Meet (auto-generated link)
- **Availability:** Weekdays, 9am - 5pm ET
- **Host:** Brad Powell

---

## Option 1: Inline Embed (Recommended for Assessment Page)

Add this to your Assessment page component after the assessment form/results:

```tsx
// CalendlyEmbed.tsx component
import { useEffect } from 'react';

export function CalendlyEmbed() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-2xl font-bold text-center mb-4">
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

## Option 2: Popup Button (For CTAs throughout the site)

```tsx
// CalendlyButton.tsx component
export function CalendlyButton({ text = "Book Free Consultation" }: { text?: string }) {
  const openCalendly = () => {
    // @ts-ignore - Calendly is loaded via script
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/bradgpowell1123/free-ai-consultation?hide_gdpr_banner=1&primary_color=6366f1'
      });
    }
  };

  return (
    <button
      onClick={openCalendly}
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
    >
      {text}
    </button>
  );
}
```

**Note:** For popup mode, add the Calendly CSS to your index.html `<head>`:
```html
<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">
<script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
```

## Option 3: Simple Link (Fallback)

```tsx
<a
  href="https://calendly.com/bradgpowell1123/free-ai-consultation"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg inline-block transition-colors"
>
  Book Free Consultation
</a>
```

---

## Where to Add Calendly on the Site

1. **Assessment Page** - Inline embed after assessment results (primary placement)
2. **Homepage Hero** - Popup button as secondary CTA
3. **Services Page** - Popup button in CTA sections
4. **Contact Section** - Inline embed or link
5. **Industry Landing Pages** - Popup button in each CTA section
6. **Navigation** - "Book a Call" button in header

## Integration in Manus

To add to the Manus codebase:
1. Create `client/components/CalendlyEmbed.tsx` with the inline widget component
2. Create `client/components/CalendlyButton.tsx` with the popup button component
3. Import `CalendlyEmbed` into the Assessment page component
4. Add Calendly widget CSS/JS to `index.html` head for popup support
5. Add `CalendlyButton` to hero sections and CTAs across the site
