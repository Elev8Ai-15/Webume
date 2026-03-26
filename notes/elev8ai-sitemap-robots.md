# Elev8 AI - Sitemap & Robots.txt Files

Generated: 2026-03-15

---

## 1. sitemap.xml

Place this file at: `public/sitemap.xml` in your React project root.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Homepage -->
  <url>
    <loc>https://elev8ai.org/</loc>
    <lastmod>2026-03-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Core Pages -->
  <url>
    <loc>https://elev8ai.org/about</loc>
    <lastmod>2026-03-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://elev8ai.org/resources</loc>
    <lastmod>2026-03-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://elev8ai.org/faq</loc>
    <lastmod>2026-03-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://elev8ai.org/portfolio</loc>
    <lastmod>2026-03-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Lead Generation Pages -->
  <url>
    <loc>https://elev8ai.org/assessment</loc>
    <lastmod>2026-03-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://elev8ai.org/gemini</loc>
    <lastmod>2026-03-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Service Pages -->
  <url>
    <loc>https://elev8ai.org/services/3d-logo</loc>
    <lastmod>2026-03-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://elev8ai.org/services/ai-landing</loc>
    <lastmod>2026-03-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://elev8ai.org/services/viral-video</loc>
    <lastmod>2026-03-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Specialty Pages -->
  <url>
    <loc>https://elev8ai.org/nonprofit</loc>
    <lastmod>2026-03-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://elev8ai.org/local-service</loc>
    <lastmod>2026-03-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://elev8ai.org/ada-scanner</loc>
    <lastmod>2026-03-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Blog -->
  <url>
    <loc>https://elev8ai.org/blog</loc>
    <lastmod>2026-03-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Legal -->
  <url>
    <loc>https://elev8ai.org/privacy</loc>
    <lastmod>2026-03-15</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

</urlset>
```

---

## 2. robots.txt

Place this file at: `public/robots.txt` in your React project root.

```
# Robots.txt for elev8ai.org
# Last updated: 2026-03-15

User-agent: *
Allow: /

# Block admin routes
Disallow: /admin
Disallow: /admin/login
Disallow: /admin/analytics
Disallow: /admin/assessments
Disallow: /admin/orders
Disallow: /admin/nonprofits

# Block payment routes
Disallow: /checkout
Disallow: /payment-success
Disallow: /payment-cancel

# Sitemap
Sitemap: https://elev8ai.org/sitemap.xml
```

---

## 3. Integration Guide

### File Placement

Both files go in the `public/` folder of your React project:

```
your-react-project/
  public/
    sitemap.xml    <-- here
    robots.txt     <-- here
    index.html
    favicon.ico
```

Vercel automatically serves files from `public/` at the root of your domain. No extra config needed for static files -- `robots.txt` will be available at `https://elev8ai.org/robots.txt` and `sitemap.xml` at `https://elev8ai.org/sitemap.xml`.

### vercel.json Config (Optional but Recommended)

Since this is a React SPA with client-side routing, you likely already have a catch-all rewrite for `index.html`. Make sure `sitemap.xml` and `robots.txt` are served before the catch-all kicks in. Vercel handles this automatically for files in `public/`, but if you have a custom `vercel.json`, confirm this structure:

```json
{
  "rewrites": [
    { "source": "/((?!api|sitemap.xml|robots.txt).*)", "destination": "/index.html" }
  ]
}
```

If you do NOT have a `vercel.json` with rewrites, you do not need to create one. Vercel's default behavior will serve static files from `public/` correctly.

### Dynamic Sitemap for Blog Posts

The static sitemap above includes `/blog` but not individual `/blog/:slug` URLs. For dynamic blog posts, you have two options:

**Option A: API Route (Recommended)**

Create a serverless function at `api/sitemap.xml.ts` that fetches blog slugs from your database/CMS and generates the sitemap dynamically:

```typescript
// api/sitemap.xml.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Fetch blog posts from your data source (Supabase, CMS, etc.)
  const posts = await fetchBlogPosts(); // replace with your data fetch

  const staticRoutes = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/about', priority: '0.9', changefreq: 'monthly' },
    { loc: '/assessment', priority: '0.9', changefreq: 'monthly' },
    { loc: '/portfolio', priority: '0.8', changefreq: 'weekly' },
    { loc: '/blog', priority: '0.8', changefreq: 'daily' },
    { loc: '/services/3d-logo', priority: '0.8', changefreq: 'monthly' },
    { loc: '/services/ai-landing', priority: '0.8', changefreq: 'monthly' },
    { loc: '/services/viral-video', priority: '0.8', changefreq: 'monthly' },
    { loc: '/resources', priority: '0.7', changefreq: 'weekly' },
    { loc: '/gemini', priority: '0.7', changefreq: 'monthly' },
    { loc: '/nonprofit', priority: '0.7', changefreq: 'monthly' },
    { loc: '/local-service', priority: '0.7', changefreq: 'monthly' },
    { loc: '/ada-scanner', priority: '0.7', changefreq: 'monthly' },
    { loc: '/faq', priority: '0.6', changefreq: 'monthly' },
    { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
  ];

  const today = new Date().toISOString().split('T')[0];

  const urls = [
    ...staticRoutes.map(r => `
  <url>
    <loc>https://elev8ai.org${r.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`),
    ...posts.map((post: any) => `
  <url>
    <loc>https://elev8ai.org/blog/${post.slug}</loc>
    <lastmod>${post.updated_at || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).send(sitemap);
}
```

If you go with Option A, update `robots.txt` to point to the API route instead:

```
Sitemap: https://elev8ai.org/api/sitemap.xml
```

And update `vercel.json` to rewrite `/sitemap.xml` to the API:

```json
{
  "rewrites": [
    { "source": "/sitemap.xml", "destination": "/api/sitemap.xml" }
  ]
}
```

**Option B: Manual Updates**

Simply add new `<url>` entries to the static `sitemap.xml` whenever you publish a blog post. This works fine if you publish infrequently.

### Post-Deployment Checklist

1. Deploy the files and verify they load at:
   - `https://elev8ai.org/robots.txt`
   - `https://elev8ai.org/sitemap.xml`
2. Submit the sitemap in Google Search Console: **Sitemaps > Add a new sitemap > enter `sitemap.xml`**
3. Submit in Bing Webmaster Tools if you have an account there
4. Test with Google's Rich Results Test or URL Inspection tool to confirm pages are indexable
