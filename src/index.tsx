import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'

type Bindings = {
  USERS_KV: KVNamespace;
}

const app = new Hono<{ Bindings: Bindings }>()

const GEMINI_API_KEY = 'AIzaSyB9jQaRGkfj4Tyq5y5j45RiYAeb_H2e-2g';

// Simple hash function for passwords (use proper bcrypt in production)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'webume_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate session token
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Auth middleware to get current user
async function getCurrentUser(c: any): Promise<any> {
  const sessionToken = getCookie(c, 'webume_session');
  if (!sessionToken) return null;
  
  try {
    const session = await c.env.USERS_KV.get(`session:${sessionToken}`, 'json');
    if (!session) return null;
    
    const user = await c.env.USERS_KV.get(`user:${session.email}`, 'json');
    return user;
  } catch {
    return null;
  }
}

// Generate unique profile slug
function generateSlug(name: string): string {
  const base = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const random = Math.random().toString(36).substring(2, 6);
  return `${base}-${random}`;
}

// API: Register new user
app.post('/api/auth/register', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }
    
    // Check if user exists
    const existing = await c.env.USERS_KV.get(`user:${email.toLowerCase()}`);
    if (existing) {
      return c.json({ error: 'An account with this email already exists' }, 400);
    }
    
    // Create user with unique public profile slug
    const hashedPassword = await hashPassword(password);
    const slug = generateSlug(name);
    const user = {
      email: email.toLowerCase(),
      name,
      slug,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      profile: null,
      profilePhoto: null,
      selectedTemplate: 'executive',
      rawText: '',
      isPublic: false,
      profileViews: 0,
      lastViewedAt: null
    };
    
    await c.env.USERS_KV.put(`user:${email.toLowerCase()}`, JSON.stringify(user));
    // Also store slug mapping for public profiles
    await c.env.USERS_KV.put(`slug:${slug}`, email.toLowerCase());
    
    // Create session
    const token = generateToken();
    const session = { email: email.toLowerCase(), createdAt: new Date().toISOString() };
    await c.env.USERS_KV.put(`session:${token}`, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 }); // 30 days
    
    setCookie(c, 'webume_session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    });
    
    return c.json({ success: true, user: { email: user.email, name: user.name } });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// API: Login
app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }
    
    const user = await c.env.USERS_KV.get(`user:${email.toLowerCase()}`, 'json') as any;
    if (!user) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }
    
    const hashedPassword = await hashPassword(password);
    if (user.password !== hashedPassword) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }
    
    // Create session
    const token = generateToken();
    const session = { email: email.toLowerCase(), createdAt: new Date().toISOString() };
    await c.env.USERS_KV.put(`session:${token}`, JSON.stringify(session), { expirationTtl: 60 * 60 * 24 * 30 });
    
    setCookie(c, 'webume_session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    });
    
    return c.json({ 
      success: true, 
      user: { 
        email: user.email, 
        name: user.name,
        hasProfile: !!user.profile 
      } 
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// API: Logout
app.post('/api/auth/logout', async (c) => {
  const sessionToken = getCookie(c, 'webume_session');
  if (sessionToken) {
    await c.env.USERS_KV.delete(`session:${sessionToken}`);
  }
  deleteCookie(c, 'webume_session', { path: '/' });
  return c.json({ success: true });
});

// API: Get current user
app.get('/api/auth/me', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({ user: null });
  }
  return c.json({ 
    user: { 
      email: user.email, 
      name: user.name,
      hasProfile: !!user.profile
    } 
  });
});

// API: Save profile (requires auth)
app.post('/api/profile/save', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401);
  }
  
  try {
    const { profile, profilePhoto, selectedTemplate, rawText } = await c.req.json();
    
    user.profile = profile;
    user.profilePhoto = profilePhoto;
    user.selectedTemplate = selectedTemplate || user.selectedTemplate;
    user.rawText = rawText || user.rawText;
    user.updatedAt = new Date().toISOString();
    
    await c.env.USERS_KV.put(`user:${user.email}`, JSON.stringify(user));
    
    return c.json({ success: true, savedAt: user.updatedAt });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// API: Load profile (requires auth)
app.get('/api/profile/load', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401);
  }
  
  return c.json({
    profile: user.profile,
    profilePhoto: user.profilePhoto,
    selectedTemplate: user.selectedTemplate,
    rawText: user.rawText,
    slug: user.slug,
    isPublic: user.isPublic || false,
    profileViews: user.profileViews || 0
  });
});

// API: Toggle profile public/private
app.post('/api/profile/publish', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401);
  }
  
  const { isPublic } = await c.req.json();
  user.isPublic = isPublic;
  await c.env.USERS_KV.put(`user:${user.email}`, JSON.stringify(user));
  
  return c.json({ 
    success: true, 
    isPublic, 
    publicUrl: isPublic ? `/p/${user.slug}` : null 
  });
});

// API: Update profile slug (custom URL)
app.post('/api/profile/slug', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401);
  }
  
  const { slug } = await c.req.json();
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '').substring(0, 30);
  
  if (cleanSlug.length < 3) {
    return c.json({ error: 'Slug must be at least 3 characters' }, 400);
  }
  
  // Check if slug is taken
  const existing = await c.env.USERS_KV.get(`slug:${cleanSlug}`);
  if (existing && existing !== user.email) {
    return c.json({ error: 'This URL is already taken' }, 400);
  }
  
  // Remove old slug mapping
  if (user.slug) {
    await c.env.USERS_KV.delete(`slug:${user.slug}`);
  }
  
  // Set new slug
  user.slug = cleanSlug;
  await c.env.USERS_KV.put(`user:${user.email}`, JSON.stringify(user));
  await c.env.USERS_KV.put(`slug:${cleanSlug}`, user.email);
  
  return c.json({ success: true, slug: cleanSlug });
});

// API: Get public profile by slug (for viewing)
app.get('/api/public/:slug', async (c) => {
  const slug = c.req.param('slug');
  
  const email = await c.env.USERS_KV.get(`slug:${slug}`);
  if (!email) {
    return c.json({ error: 'Profile not found' }, 404);
  }
  
  const user = await c.env.USERS_KV.get(`user:${email}`, 'json') as any;
  if (!user || !user.isPublic) {
    return c.json({ error: 'Profile not found or private' }, 404);
  }
  
  // Increment view count
  user.profileViews = (user.profileViews || 0) + 1;
  user.lastViewedAt = new Date().toISOString();
  await c.env.USERS_KV.put(`user:${email}`, JSON.stringify(user));
  
  // Return public profile data (no sensitive info)
  return c.json({
    name: user.name,
    profile: user.profile,
    profilePhoto: user.profilePhoto,
    selectedTemplate: user.selectedTemplate,
    views: user.profileViews
  });
});

// API: ATS Score Analysis
app.post('/api/ats-score', async (c) => {
  try {
    const { profile, jobDescription } = await c.req.json();
    
    if (!profile) {
      return c.json({ error: 'Profile is required' }, 400);
    }
    
    // Extract keywords from job description or use common ATS keywords
    const commonKeywords = [
      'leadership', 'management', 'strategy', 'analytics', 'communication',
      'project management', 'team', 'budget', 'revenue', 'growth',
      'development', 'implementation', 'optimization', 'collaboration',
      'stakeholder', 'presentation', 'reporting', 'analysis', 'planning'
    ];
    
    const profileText = JSON.stringify(profile).toLowerCase();
    const skills = profile.skills || [];
    
    let score = 0;
    const matches = [];
    const missing = [];
    
    // Check for keyword matches
    commonKeywords.forEach(keyword => {
      if (profileText.includes(keyword.toLowerCase())) {
        score += 5;
        matches.push(keyword);
      } else {
        missing.push(keyword);
      }
    });
    
    // Bonus for completeness
    if (profile.basics?.name) score += 5;
    if (profile.basics?.email) score += 5;
    if (profile.basics?.phone) score += 3;
    if (profile.basics?.summary && profile.basics.summary.length > 100) score += 10;
    if (profile.experience?.length > 0) score += 15;
    if (profile.experience?.length > 2) score += 5;
    if (skills.length >= 5) score += 10;
    if (skills.length >= 10) score += 5;
    if (profile.education?.length > 0) score += 5;
    if (profile.achievements?.length > 0) score += 5;
    
    // Cap at 100
    score = Math.min(100, score);
    
    return c.json({
      score,
      grade: score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'D',
      matches: matches.slice(0, 10),
      suggestions: missing.slice(0, 5).map(k => `Consider adding "${k}" to your profile`),
      tips: [
        score < 70 ? 'Add more quantifiable achievements with numbers' : null,
        skills.length < 10 ? 'Add more relevant skills to improve matching' : null,
        !profile.basics?.summary ? 'Add a professional summary' : null,
        profile.experience?.length < 2 ? 'Add more work experience details' : null
      ].filter(Boolean)
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.post('/api/parse-resume', async (c) => {
  try {
    const { text } = await c.req.json();
    
    const prompt = `You are an elite career analyst, executive resume writer, and talent acquisition expert with 20+ years experience. Analyze this resume DEEPLY and extract MAXIMUM value to create a comprehensive, impressive professional profile.

RESUME TEXT TO ANALYZE:
${text}

YOUR MISSION - Create the most detailed, impactful profile possible:

## BASICS EXTRACTION
- Extract the person's full name, most recent/impressive job title
- Create a POWERFUL tagline (like "Visionary Tech Leader Who Scaled Teams 10x and Drove $50M Revenue")
- Write a compelling 3-4 sentence executive summary highlighting their unique value proposition
- Extract all contact info (email, phone, location, LinkedIn, website)

## EXPERIENCE ANALYSIS (This is CRITICAL - be extremely thorough)
For EACH position, provide:

1. **DESCRIPTION** (5-8 sentences minimum):
   - Opening sentence: Core role and scope of responsibility
   - Key projects led or contributed to (name specific initiatives if mentioned)
   - Technologies, methodologies, tools used daily
   - Cross-functional collaboration and stakeholder management
   - Leadership scope (direct reports, team size, budget if applicable)
   - Major wins and accomplishments in this role
   - How they advanced the company's mission or bottom line
   - Closing sentence: Career growth or recognition received

2. **RESPONSIBILITIES** (8-12 bullet points):
   - Be SPECIFIC to this role and industry
   - Start each with strong action verbs (Led, Architected, Spearheaded, Optimized, etc.)
   - Include scope/scale where possible (e.g., "Managed portfolio of 15+ enterprise clients")
   - Mix strategic and tactical duties
   
3. **DAY IN THE LIFE** (Create a realistic, detailed schedule):
   - 8:30 AM: Morning routine specific to this role
   - 9:30 AM: Core morning work activity
   - 11:00 AM: Meetings or collaboration time
   - 12:30 PM: Midday activity
   - 2:00 PM: Afternoon deep work
   - 4:00 PM: Late afternoon tasks
   - 5:30 PM: End of day wrap-up

4. **METRICS** (Generate 4 impressive metrics, estimate if not explicit):
   - Revenue/cost impact (e.g., "+$2.5M revenue", "-40% costs")
   - Scale/efficiency (e.g., "10x throughput", "200% growth")
   - Team/scope (e.g., "25 direct reports", "50+ stakeholders")
   - Quality/speed (e.g., "99.9% uptime", "3x faster delivery")

## SKILLS EXTRACTION
- Extract EVERY skill mentioned in the resume
- Add 10-15 related/inferred skills based on the roles
- Group logically: Technical, Leadership, Domain, Soft skills

## ACHIEVEMENTS
- Extract explicit achievements AND infer major wins from job descriptions
- Write each as a compelling mini-story with context and impact

## EDUCATION & CERTIFICATIONS
- Extract all degrees, schools, graduation years, honors
- List all professional certifications

RETURN THIS EXACT JSON STRUCTURE:
{
  "basics": {
    "name": "Full Name",
    "title": "Most Impressive Job Title",
    "tagline": "Powerful 1-line value proposition with specific achievements",
    "email": "email@domain.com",
    "phone": "phone number",
    "location": "City, State/Country",
    "linkedin": "linkedin URL",
    "website": "website URL",
    "summary": "3-4 sentence executive summary showcasing unique expertise and career trajectory"
  },
  "experience": [
    {
      "company": "Company Name",
      "companyInfo": {
        "website": "company website URL (e.g., https://google.com)",
        "domain": "company domain for logo lookup (e.g., google.com)",
        "industry": "Industry sector",
        "location": "Company HQ city, state/country",
        "size": "Company size (e.g., 10,000+ employees, Fortune 500)",
        "description": "1-2 sentence company description"
      },
      "role": "Job Title",
      "startDate": "Mon YYYY",
      "endDate": "Mon YYYY or Present",
      "description": "COMPREHENSIVE 5-8 sentence description covering responsibilities, projects, technologies, leadership, and achievements. Make it read like a polished executive resume.",
      "responsibilities": ["Action-verb duty 1 with scope", "Action-verb duty 2", "...", "8-12 total"],
      "dayInLife": [
        {"time": "8:30 AM", "activity": "Role-specific morning activity"},
        {"time": "9:30 AM", "activity": "Core work activity"},
        {"time": "11:00 AM", "activity": "Collaborative work"},
        {"time": "12:30 PM", "activity": "Midday task"},
        {"time": "2:00 PM", "activity": "Afternoon focus work"},
        {"time": "4:00 PM", "activity": "Late afternoon activity"},
        {"time": "5:30 PM", "activity": "Wrap-up activity"}
      ],
      "metrics": [
        {"value": "+XX%", "label": "Specific metric"},
        {"value": "$X.XM", "label": "Financial impact"},
        {"value": "XX", "label": "Scale metric"},
        {"value": "XX%", "label": "Improvement metric"}
      ]
    }
  ],
  "skills": ["Skill 1", "Skill 2", "... 15-25 total skills"],
  "achievements": [
    {"title": "Achievement Title", "description": "Compelling 2-3 sentence description with context and impact"}
  ],
  "education": [
    {"degree": "Degree", "school": "Institution", "year": "Year", "details": "Honors, GPA, relevant details"}
  ],
  "certifications": ["Cert 1", "Cert 2"]
}

## COMPANY INFO REQUIREMENTS
For each company, you MUST provide:
- Website URL (research or infer based on company name)
- Domain (clean domain for logo lookup, e.g., "google.com", "microsoft.com")
- Industry sector
- Location (headquarters)
- Company size estimate
- Brief company description

ABSOLUTE REQUIREMENTS:
- NEVER use generic descriptions - be SPECIFIC to this person's actual experience
- ALWAYS include concrete numbers, percentages, dollar amounts in metrics
- Write descriptions that would impress a Fortune 500 recruiter
- Generate realistic estimates for any metrics not explicitly stated
- Return ONLY valid JSON with no markdown formatting or code blocks
- Use empty string "" for missing fields, NEVER null`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 8192 }
        })
      }
    );

    const data = await response.json();
    if (data.error) return c.json({ error: data.error.message }, 500);
    
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!aiText) return c.json({ error: 'No response from AI' }, 500);
    
    try {
      // Remove markdown code blocks - handle various formats
      let jsonStr = aiText
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/gi, '')
        .replace(/\n?```/gi, '')
        .trim();
      
      // If still not starting with {, extract JSON object
      if (!jsonStr.startsWith('{')) {
        const match = jsonStr.match(/\{[\s\S]*\}/);
        if (match) jsonStr = match[0];
      }
      
      const parsed = JSON.parse(jsonStr);
      return c.json(parsed);
    } catch (e) {
      // Try one more extraction method
      try {
        const match = aiText.match(/\{[\s\S]*\}/);
        if (match) {
          return c.json(JSON.parse(match[0]));
        }
      } catch {}
      return c.json({ error: 'Parse failed', raw: aiText }, 500);
    }
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Public Profile View Page
app.get('/p/:slug', async (c) => {
  const slug = c.req.param('slug');
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
  
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: linear-gradient(135deg, #0a0a12 0%, #1a1a2e 50%, #0f0f1a 100%);
      min-height: 100vh;
      color: #fff;
    }
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      flex-direction: column;
      gap: 20px;
    }
    .spinner {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(139,92,246,0.2);
      border-top-color: #8B5CF6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error {
      text-align: center;
      padding: 60px 20px;
    }
    .error h1 { font-size: 72px; margin-bottom: 20px; }
    .error p { color: rgba(255,255,255,0.6); margin-bottom: 30px; }
    .error a {
      display: inline-block;
      padding: 14px 28px;
      background: linear-gradient(135deg, #8B5CF6, #EC4899);
      color: #fff;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div id="root">
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading profile...</p>
    </div>
  </div>
  
  <script type="text/babel">
    const { useState, useEffect } = React;
    const SLUG = '${slug}';
    
    const PublicProfile = () => {
      const [profile, setProfile] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [qrCode, setQrCode] = useState(null);
      
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
      
      if (loading) {
        return (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        );
      }
      
      if (error) {
        return (
          <div className="error">
            <h1>404</h1>
            <p>{error}</p>
            <a href="/">Create Your Own Webumé</a>
          </div>
        );
      }
      
      const p = profile.profile;
      const basics = p?.basics || {};
      const template = profile.selectedTemplate || 'executive';
      
      const colors = {
        executive: { accent: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)' },
        corporate: { accent: '#1E3A5F', gradient: 'linear-gradient(135deg, #1E3A5F, #D4AF37)' },
        healthcare: { accent: '#0EA5E9', gradient: 'linear-gradient(135deg, #0EA5E9, #14B8A6)' },
        restaurant: { accent: '#DC2626', gradient: 'linear-gradient(135deg, #DC2626, #F59E0B)' },
        trades: { accent: '#D97706', gradient: 'linear-gradient(135deg, #D97706, #78716C)' },
        beauty: { accent: '#EC4899', gradient: 'linear-gradient(135deg, #EC4899, #BE185D)' },
        creative: { accent: '#F472B6', gradient: 'linear-gradient(135deg, #F472B6, #A855F7)' },
        tech: { accent: '#06B6D4', gradient: 'linear-gradient(135deg, #06B6D4, #22D3EE)' },
        nonprofit: { accent: '#0891B2', gradient: 'linear-gradient(135deg, #0891B2, #059669)' },
        minimal: { accent: '#10B981', gradient: 'linear-gradient(135deg, #10B981, #34D399)' }
      };
      
      const style = colors[template] || colors.executive;
      
      return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
          {/* Header */}
          <header style={{ 
            background: 'rgba(255,255,255,0.03)', 
            borderRadius: '24px', 
            padding: '40px',
            marginBottom: '30px',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            gap: '30px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {profile.profilePhoto && (
              <img 
                src={profile.profilePhoto} 
                style={{ 
                  width: '140px', 
                  height: '140px', 
                  borderRadius: '20px',
                  objectFit: 'cover',
                  border: '4px solid ' + style.accent
                }}
                alt={basics.name}
              />
            )}
            <div style={{ flex: 1, minWidth: '250px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>{basics.name}</h1>
              <p style={{ fontSize: '18px', color: style.accent, fontWeight: '600', marginBottom: '8px' }}>{basics.title}</p>
              {basics.tagline && <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>{basics.tagline}</p>}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                {basics.email && <span><i className="fas fa-envelope" style={{ marginRight: '6px' }}></i>{basics.email}</span>}
                {basics.location && <span><i className="fas fa-map-marker-alt" style={{ marginRight: '6px' }}></i>{basics.location}</span>}
                {basics.linkedin && <a href={basics.linkedin.startsWith('http') ? basics.linkedin : 'https://' + basics.linkedin} target="_blank" style={{ color: '#0A66C2' }}><i className="fab fa-linkedin"></i> LinkedIn</a>}
              </div>
            </div>
            {qrCode && (
              <div style={{ textAlign: 'center' }}>
                <img src={qrCode} style={{ width: '100px', borderRadius: '8px' }} alt="QR Code" />
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>Scan to share</p>
              </div>
            )}
          </header>
          
          {/* Summary */}
          {basics.summary && (
            <section style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '28px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 style={{ fontSize: '14px', color: style.accent, marginBottom: '14px', fontWeight: '700' }}>
                <i className="fas fa-user" style={{ marginRight: '10px' }}></i>About
              </h2>
              <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'rgba(255,255,255,0.8)' }}>{basics.summary}</p>
            </section>
          )}
          
          {/* Experience */}
          {p?.experience?.length > 0 && (
            <section style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '28px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 style={{ fontSize: '14px', color: style.accent, marginBottom: '20px', fontWeight: '700' }}>
                <i className="fas fa-briefcase" style={{ marginRight: '10px' }}></i>Experience
              </h2>
              {p.experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: i < p.experience.length - 1 ? '28px' : 0, paddingBottom: i < p.experience.length - 1 ? '28px' : 0, borderBottom: i < p.experience.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
                    {exp.companyInfo?.domain && (
                      <img 
                        src={'https://logo.clearbit.com/' + exp.companyInfo.domain} 
                        style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff' }}
                        onError={(e) => e.target.style.display = 'none'}
                        alt=""
                      />
                    )}
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{exp.role}</h3>
                      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{exp.company} • {exp.startDate} - {exp.endDate}</p>
                    </div>
                  </div>
                  {exp.description && <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', marginTop: '12px' }}>{exp.description}</p>}
                  {exp.metrics?.length > 0 && (
                    <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
                      {exp.metrics.map((m, j) => (
                        <div key={j} style={{ background: style.accent + '15', padding: '10px 16px', borderRadius: '10px', textAlign: 'center' }}>
                          <div style={{ fontSize: '18px', fontWeight: '800', color: style.accent }}>{m.value}</div>
                          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>{m.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}
          
          {/* Skills */}
          {p?.skills?.length > 0 && (
            <section style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '28px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 style={{ fontSize: '14px', color: style.accent, marginBottom: '16px', fontWeight: '700' }}>
                <i className="fas fa-cogs" style={{ marginRight: '10px' }}></i>Skills
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {p.skills.map((skill, i) => (
                  <span key={i} style={{ 
                    padding: '8px 16px', 
                    background: style.accent + '20',
                    border: '1px solid ' + style.accent + '40',
                    borderRadius: '100px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>{skill}</span>
                ))}
              </div>
            </section>
          )}
          
          {/* Education */}
          {p?.education?.length > 0 && (
            <section style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '28px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 style={{ fontSize: '14px', color: style.accent, marginBottom: '16px', fontWeight: '700' }}>
                <i className="fas fa-graduation-cap" style={{ marginRight: '10px' }}></i>Education
              </h2>
              {p.education.map((edu, i) => (
                <div key={i} style={{ marginBottom: i < p.education.length - 1 ? '16px' : 0 }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600' }}>{edu.degree}</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{edu.school} {edu.year && '• ' + edu.year}</p>
                </div>
              ))}
            </section>
          )}
          
          {/* Footer */}
          <footer style={{ textAlign: 'center', marginTop: '40px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
              <i className="fas fa-eye" style={{ marginRight: '6px' }}></i>{profile.views || 0} profile views
            </p>
            <a href="/" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 28px',
              background: style.gradient,
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              <i className="fas fa-rocket"></i>
              Create Your Own Webumé
            </a>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '20px' }}>
              Powered by Webumé • The Digital Resume Revolution
            </p>
          </footer>
        </div>
      );
    };
    
    ReactDOM.render(<PublicProfile />, document.getElementById('root'));
  </script>
</body>
</html>`);
});

// PWA Manifest
app.get('/manifest.json', (c) => {
  return c.json({
    name: 'Webumé - Digital Resume',
    short_name: 'Webumé',
    description: 'Transform your resume into an immersive digital experience',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a12',
    theme_color: '#8B5CF6',
    orientation: 'portrait-primary',
    icons: [
      { src: '/static/logo.png', sizes: '192x192', type: 'image/png' },
      { src: '/static/logo.png', sizes: '512x512', type: 'image/png' }
    ],
    categories: ['business', 'productivity'],
    screenshots: [],
    shortcuts: [
      { name: 'Upload Resume', url: '/', icons: [{ src: '/static/logo.png', sizes: '96x96' }] }
    ]
  });
});

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Webumé | Your WebApp Resume</title>
  <link rel="icon" type="image/png" href="/static/logo.png">
  <link rel="apple-touch-icon" href="/static/logo.png">
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#8B5CF6">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="description" content="Transform your resume into an immersive digital experience">
  <meta property="og:title" content="Webumé - Digital Resume Revolution">
  <meta property="og:description" content="AI-powered digital profiles that get you hired">
  <meta property="og:type" content="website">
  
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
  <script>pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';</script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
  
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <style>
    :root {
      --purple-main: #8B5CF6;
      --purple-light: #A78BFA;
      --pink-main: #EC4899;
      --cyan-main: #06B6D4;
      --green-main: #10B981;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    html, body, #root {
      height: 100%;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow: hidden;
    }
    
    /* ===========================================================
       PREMIUM BACKGROUND - Glass Cards Image - CRYSTAL CLEAR
       The beautiful glass cards image as background - NO BLUR
       =========================================================== */
    .premium-bg {
      position: fixed;
      inset: 0;
      background: #0a0a12;
      overflow: hidden;
    }
    
    /* Background image - NO BLUR - crystal clear glass cards */
    .bg-image {
      position: absolute;
      inset: 0;
      background-image: url('/static/background.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      /* NO BLUR - show the beautiful glass cards clearly */
      filter: brightness(1) saturate(1.05);
      opacity: 1;
    }
    
    /* Minimal overlay - just a hint of darkness for text readability */
    .bg-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.25) 100%);
    }
    
    /* No noise overlay - keep it clean */
    .noise-overlay {
      display: none;
    }
    
    /* ===========================================================
       GLASSMORPHISM COMPONENTS
       Semi-transparent cards with blur effect
       =========================================================== */
    .glass {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 20px;
    }
    
    .glass-card {
      background: rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      box-shadow: 
        0 4px 16px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.06);
    }
    
    .glass-sidebar {
      background: rgba(15, 8, 24, 0.5);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      border-right: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .glass-input {
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 14px 18px;
      color: #fff;
      font-family: inherit;
      font-size: 14px;
      transition: all 0.25s ease;
      width: 100%;
    }
    
    .glass-input:focus {
      outline: none;
      border-color: var(--purple-main);
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
    }
    
    .glass-input::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
    
    /* ===========================================================
       LAYOUT - Dashboard Style with Sidebar
       =========================================================== */
    .app-container {
      position: relative;
      z-index: 1;
      display: flex;
      height: 100vh;
    }
    
    /* Sidebar */
    .sidebar {
      width: 280px;
      padding: 28px 20px;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }
    
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 12px;
      margin-bottom: 40px;
    }
    
    .logo-img {
      width: 180px;
      height: auto;
      filter: drop-shadow(0 8px 24px rgba(139, 92, 246, 0.4));
      transition: transform 0.3s ease, filter 0.3s ease;
    }
    
    .logo-img:hover {
      transform: scale(1.05);
      filter: drop-shadow(0 12px 32px rgba(139, 92, 246, 0.5));
    }
    
    .nav-group {
      margin-bottom: 28px;
    }
    
    .nav-label {
      font-size: 11px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.35);
      text-transform: uppercase;
      letter-spacing: 1.2px;
      padding: 0 16px;
      margin-bottom: 12px;
    }
    
    .nav-btn {
      display: flex;
      align-items: center;
      gap: 14px;
      width: 100%;
      padding: 13px 16px;
      border-radius: 14px;
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.55);
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }
    
    .nav-btn:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
    }
    
    .nav-btn.active {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(236, 72, 153, 0.15));
      color: #fff;
      border: 1px solid rgba(139, 92, 246, 0.3);
    }
    
    .nav-btn i {
      width: 20px;
      font-size: 15px;
    }
    
    .sidebar-footer {
      margin-top: auto;
      padding: 20px;
      background: rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 16px;
    }
    
    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
    }
    
    .stat-row:not(:last-child) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    .stat-name {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
    }
    
    .stat-num {
      font-size: 20px;
      font-weight: 700;
      color: var(--purple-light);
    }
    
    /* Main Content Area */
    .main {
      flex: 1;
      padding: 28px 32px;
      overflow-y: auto;
    }
    
    .main::-webkit-scrollbar { width: 6px; }
    .main::-webkit-scrollbar-track { background: transparent; }
    .main::-webkit-scrollbar-thumb { 
      background: rgba(139, 92, 246, 0.3); 
      border-radius: 3px;
    }
    .main::-webkit-scrollbar-thumb:hover {
      background: rgba(139, 92, 246, 0.5);
    }
    
    /* Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
    }
    
    .page-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 32px;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.5px;
    }
    
    .page-desc {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.45);
      margin-top: 6px;
    }
    
    /* ===========================================================
       STAT CARDS GRID
       =========================================================== */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 28px;
    }
    
    .stat-card {
      padding: 24px;
      position: relative;
      overflow: hidden;
    }
    
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--purple-main), var(--pink-main));
    }
    
    .stat-card.cyan::before {
      background: linear-gradient(90deg, var(--cyan-main), #22D3EE);
    }
    
    .stat-card.green::before {
      background: linear-gradient(90deg, var(--green-main), #34D399);
    }
    
    .stat-icon-wrap {
      width: 52px;
      height: 52px;
      background: rgba(139, 92, 246, 0.15);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 18px;
    }
    
    .stat-icon-wrap i {
      font-size: 22px;
      color: var(--purple-main);
    }
    
    .stat-card.cyan .stat-icon-wrap {
      background: rgba(6, 182, 212, 0.15);
    }
    
    .stat-card.cyan .stat-icon-wrap i {
      color: var(--cyan-main);
    }
    
    .stat-card.green .stat-icon-wrap {
      background: rgba(16, 185, 129, 0.15);
    }
    
    .stat-card.green .stat-icon-wrap i {
      color: var(--green-main);
    }
    
    .stat-card .value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 40px;
      font-weight: 700;
      color: #fff;
      line-height: 1;
      margin-bottom: 6px;
    }
    
    .stat-card .label {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.45);
      font-weight: 500;
    }
    
    /* ===========================================================
       UPLOAD ZONE
       =========================================================== */
    .upload-zone {
      padding: 60px 48px;
      text-align: center;
    }
    
    .dropzone {
      padding: 70px 50px;
      border: 2px dashed rgba(139, 92, 246, 0.4);
      border-radius: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(236, 72, 153, 0.03));
    }
    
    .dropzone:hover {
      border-color: var(--purple-main);
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.06));
      transform: translateY(-2px);
    }
    
    .dropzone.drag-active {
      border-color: var(--cyan-main);
      border-style: solid;
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.05));
    }
    
    .upload-logo {
      width: 280px;
      height: auto;
      margin: 0 auto 32px;
      filter: drop-shadow(0 20px 50px rgba(139, 92, 246, 0.5));
      animation: floatLogo 4s ease-in-out infinite;
    }
    
    @keyframes floatLogo {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-15px) scale(1.02); }
    }
    
    .upload-icon-wrap {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, var(--purple-main), var(--pink-main));
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 16px 40px rgba(139, 92, 246, 0.4);
    }
    
    .upload-icon-wrap i {
      font-size: 32px;
      color: #fff;
    }
    
    .upload-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 30px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 10px;
    }
    
    .upload-subtitle {
      font-size: 15px;
      color: rgba(255, 255, 255, 0.45);
      margin-bottom: 32px;
    }
    
    .format-pills {
      display: flex;
      justify-content: center;
      gap: 14px;
    }
    
    .format-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 22px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 100px;
      font-size: 13px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.7);
    }
    
    .format-pill i {
      color: var(--purple-main);
    }
    
    /* ===========================================================
       PROCESSING STATE
       =========================================================== */
    .processing-state {
      padding: 70px;
      text-align: center;
    }
    
    .ai-visual {
      width: 140px;
      height: 140px;
      margin: 0 auto 36px;
      position: relative;
    }
    
    .ai-core {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, var(--purple-main), var(--pink-main));
      border-radius: 50%;
      box-shadow: 0 0 60px rgba(139, 92, 246, 0.5);
      animation: pulsate 2s ease-in-out infinite;
    }
    
    @keyframes pulsate {
      0%, 100% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.1); }
    }
    
    .ai-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 2px solid var(--purple-main);
      border-radius: 50%;
      opacity: 0;
      animation: ringExpand 2s ease-out infinite;
    }
    
    .ai-ring:nth-child(2) { animation-delay: 0.6s; }
    .ai-ring:nth-child(3) { animation-delay: 1.2s; }
    
    @keyframes ringExpand {
      0% { width: 70px; height: 70px; opacity: 0.7; }
      100% { width: 140px; height: 140px; opacity: 0; }
    }
    
    .ai-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 24px;
      background: linear-gradient(135deg, var(--purple-main), var(--pink-main));
      border-radius: 100px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #fff;
      margin-bottom: 20px;
    }
    
    .ai-badge-dot {
      width: 7px;
      height: 7px;
      background: #fff;
      border-radius: 50%;
      animation: blinkDot 1s infinite;
    }
    
    @keyframes blinkDot {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    
    .processing-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 26px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 10px;
    }
    
    .processing-subtitle {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.45);
      margin-bottom: 36px;
    }
    
    .progress-percent {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 52px;
      font-weight: 700;
      color: var(--cyan-main);
      margin-bottom: 20px;
    }
    
    .progress-track {
      max-width: 420px;
      height: 6px;
      margin: 0 auto 32px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;
    }
    
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--purple-main), var(--cyan-main));
      border-radius: 3px;
      transition: width 0.3s ease;
    }
    
    .step-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 340px;
      margin: 0 auto;
    }
    
    .step-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.35);
    }
    
    .step-item.active {
      background: rgba(139, 92, 246, 0.12);
      border-color: rgba(139, 92, 246, 0.25);
      color: var(--purple-light);
    }
    
    .step-item.done {
      background: rgba(16, 185, 129, 0.1);
      border-color: rgba(16, 185, 129, 0.25);
      color: var(--green-main);
    }
    
    .step-item i {
      width: 18px;
    }
    
    /* ===========================================================
       FORM ELEMENTS
       =========================================================== */
    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }
    
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .form-field.full-width {
      grid-column: 1 / -1;
    }
    
    .form-label {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }
    
    .form-textarea {
      min-height: 110px;
      resize: vertical;
    }
    
    /* ===========================================================
       BUTTONS
       =========================================================== */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 28px;
      border-radius: 12px;
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.25s ease;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, var(--purple-main), var(--pink-main));
      color: #fff;
      box-shadow: 0 10px 30px rgba(139, 92, 246, 0.35);
    }
    
    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(139, 92, 246, 0.45);
    }
    
    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.12);
    }
    
    .btn-ghost {
      width: 100%;
      padding: 18px;
      background: transparent;
      border: 2px dashed rgba(255, 255, 255, 0.15);
      color: rgba(255, 255, 255, 0.45);
      border-radius: 14px;
    }
    
    .btn-ghost:hover {
      border-color: var(--purple-main);
      color: var(--purple-light);
    }
    
    .btn-icon {
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      font-size: 14px;
    }
    
    .btn-icon:hover {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.3);
      color: #EF4444;
    }
    
    /* ===========================================================
       EXPERIENCE CARDS
       =========================================================== */
    .exp-entry {
      padding: 26px;
      margin-bottom: 18px;
      border-left: 4px solid var(--purple-main);
    }
    
    .exp-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .exp-badge {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--purple-main), var(--pink-main));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 700;
      color: #fff;
    }
    
    /* Day in Life Section */
    .day-section {
      margin-top: 24px;
      padding: 20px;
      background: rgba(6, 182, 212, 0.06);
      border: 1px solid rgba(6, 182, 212, 0.15);
      border-radius: 14px;
    }
    
    .day-header {
      font-size: 13px;
      font-weight: 600;
      color: var(--cyan-main);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .day-entry {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 10px;
    }
    
    .day-time {
      width: 90px;
      font-size: 12px;
      font-weight: 600;
      color: var(--purple-light);
    }
    
    .day-input {
      flex: 1;
      padding: 10px 14px;
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #fff;
      font-size: 13px;
    }
    
    .day-input:focus {
      outline: none;
      border-color: var(--cyan-main);
    }
    
    /* Metrics Section */
    .metrics-section {
      margin-top: 24px;
    }
    
    .metrics-header {
      font-size: 13px;
      font-weight: 600;
      color: var(--green-main);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .metrics-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    
    .metric-box {
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 14px;
      text-align: center;
      transition: border-color 0.2s ease;
    }
    
    .metric-box:hover {
      border-color: var(--green-main);
    }
    
    .metric-box input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      text-align: center;
      color: #fff;
      font-family: inherit;
    }
    
    .metric-box input:first-child {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: var(--green-main);
      margin-bottom: 6px;
    }
    
    .metric-box input:last-child {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.45);
      letter-spacing: 0.5px;
    }
    
    /* ===========================================================
       SKILLS CHIPS
       =========================================================== */
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .skill-chip {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 18px;
      background: rgba(139, 92, 246, 0.15);
      border: 1px solid rgba(139, 92, 246, 0.25);
      border-radius: 100px;
      font-size: 13px;
      font-weight: 500;
      color: #E9D5FF;
    }
    
    .skill-chip button {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      padding: 0;
      font-size: 12px;
    }
    
    .skill-chip button:hover {
      color: #EF4444;
    }
    
    /* ===========================================================
       PREVIEW PAGE
       =========================================================== */
    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 28px;
      margin-bottom: 24px;
    }
    
    .profile-hero {
      padding: 50px;
      text-align: center;
      margin-bottom: 24px;
    }
    
    .profile-avatar {
      width: 110px;
      height: 110px;
      margin: 0 auto 24px;
      background: linear-gradient(135deg, var(--purple-main), var(--pink-main), var(--cyan-main));
      border-radius: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 40px;
      font-weight: 700;
      color: #fff;
      box-shadow: 0 20px 50px rgba(139, 92, 246, 0.35);
    }
    
    .profile-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 32px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 10px;
    }
    
    .profile-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--cyan-main);
      margin-bottom: 14px;
    }
    
    .profile-tagline {
      color: rgba(255, 255, 255, 0.55);
      max-width: 520px;
      margin: 0 auto;
      line-height: 1.7;
    }
    
    /* Timeline */
    .timeline-wrap {
      padding-left: 45px;
      position: relative;
    }
    
    .timeline-wrap::before {
      content: '';
      position: absolute;
      left: 16px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(180deg, var(--purple-main), var(--cyan-main), var(--pink-main));
    }
    
    .timeline-item {
      position: relative;
      margin-bottom: 26px;
      padding: 24px;
    }
    
    .timeline-item::before {
      content: '';
      position: absolute;
      left: -37px;
      top: 28px;
      width: 14px;
      height: 14px;
      background: var(--purple-main);
      border-radius: 50%;
      border: 4px solid #150b24;
      box-shadow: 0 0 20px var(--purple-main);
    }
    
    .timeline-company {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 6px;
    }
    
    .timeline-role {
      font-size: 15px;
      font-weight: 600;
      color: var(--cyan-main);
      margin-bottom: 14px;
    }
    
    .timeline-dates {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(139, 92, 246, 0.15);
      border: 1px solid rgba(139, 92, 246, 0.25);
      border-radius: 100px;
      font-size: 12px;
      font-weight: 600;
      color: var(--purple-light);
      margin-bottom: 14px;
    }
    
    .timeline-desc {
      color: rgba(255, 255, 255, 0.55);
      font-size: 14px;
      line-height: 1.7;
    }
    
    .timeline-metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 18px;
    }
    
    .timeline-metric {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 12px;
      padding: 14px;
      text-align: center;
    }
    
    .timeline-metric-val {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: var(--green-main);
    }
    
    .timeline-metric-label {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.45);
      margin-top: 4px;
    }
    
    /* ===========================================================
       RESPONSIVE
       =========================================================== */
    @media (max-width: 1100px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .metrics-row, .timeline-metrics { grid-template-columns: repeat(2, 1fr); }
    }
    
    @media (max-width: 800px) {
      .sidebar { display: none; }
      .stats-grid, .form-row { grid-template-columns: 1fr; }
    }
    
    /* Animation for floating save indicator */
    @keyframes slideIn {
      from { transform: translateX(100px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    /* Responsibilities editor styles */
    .resp-section {
      margin-top: 24px;
      padding: 20px;
      background: rgba(139, 92, 246, 0.06);
      border: 1px solid rgba(139, 92, 246, 0.15);
      border-radius: 14px;
    }
    
    .resp-header {
      font-size: 13px;
      font-weight: 600;
      color: var(--purple-light);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .resp-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 10px;
    }
    
    .resp-bullet {
      width: 24px;
      height: 24px;
      min-width: 24px;
      background: rgba(139, 92, 246, 0.2);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: var(--purple-light);
      margin-top: 8px;
    }
    
    .resp-input {
      flex: 1;
      padding: 10px 14px;
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #fff;
      font-size: 13px;
      line-height: 1.5;
    }
    
    .resp-input:focus {
      outline: none;
      border-color: var(--purple-main);
    }
    
    .resp-delete {
      width: 28px;
      height: 28px;
      min-width: 28px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 6px;
      color: rgba(239, 68, 68, 0.6);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      margin-top: 8px;
      transition: all 0.2s;
    }
    
    .resp-delete:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #EF4444;
    }
    
    .add-resp-btn {
      width: 100%;
      padding: 12px;
      margin-top: 12px;
      background: transparent;
      border: 2px dashed rgba(139, 92, 246, 0.3);
      border-radius: 8px;
      color: var(--purple-light);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .add-resp-btn:hover {
      border-color: var(--purple-main);
      background: rgba(139, 92, 246, 0.1);
    }
    
    /* Enhanced image quality rendering */
    img {
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      image-rendering: -webkit-optimize-contrast;
    }
    
    /* Video player improvements */
    video {
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }
    
    video::-webkit-media-controls {
      background: linear-gradient(transparent, rgba(0,0,0,0.7));
    }
    
    video::-webkit-media-controls-enclosure {
      padding: 0;
    }
    
    video::-webkit-media-controls-panel {
      padding: 0 8px 8px;
    }
  </style>
</head>
<body>
  <!-- Premium Background with Glass Cards Image -->
  <div class="premium-bg">
    <div class="bg-image"></div>
    <div class="bg-gradient"></div>
    <div class="noise-overlay"></div>
  </div>
  
  <div id="root"></div>
  
  <script type="text/babel">
    const { useState, useRef } = React;
    
    // File Parsers
    const FileParser = {
      async pdf(file) {
        const ab = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(x => x.str).join(' ') + '\\n';
        }
        return text;
      },
      async docx(file) {
        const ab = await file.arrayBuffer();
        return (await mammoth.extractRawText({ arrayBuffer: ab })).value;
      },
      async txt(file) {
        return await file.text();
      }
    };
    
    const VIEW = { AUTH: 0, UPLOAD: 1, BUILDER: 2, PREVIEW: 3 };
    
    // INDUSTRY-SPECIFIC TEMPLATES - 10 Premium Options
    const TEMPLATE_CATEGORIES = [
      { id: 'professional', name: 'Professional', icon: 'fa-briefcase' },
      { id: 'service', name: 'Service Industry', icon: 'fa-hands-helping' },
      { id: 'creative', name: 'Creative', icon: 'fa-palette' },
      { id: 'technical', name: 'Technical', icon: 'fa-code' }
    ];
    
    const TEMPLATES = [
      // Professional Category
      { 
        id: 'executive', 
        category: 'professional',
        name: 'Executive', 
        desc: 'Bold & authoritative for C-suite and senior leaders', 
        color: '#8B5CF6', 
        accent2: '#6D28D9',
        icon: 'fa-crown',
        gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9, #4C1D95)',
        industries: ['Finance', 'Consulting', 'Legal', 'Corporate']
      },
      { 
        id: 'corporate', 
        category: 'professional',
        name: 'Corporate', 
        desc: 'Professional navy & gold for business roles', 
        color: '#1E3A5F', 
        accent2: '#D4AF37',
        icon: 'fa-building',
        gradient: 'linear-gradient(135deg, #1E3A5F, #2C5282, #D4AF37)',
        industries: ['Banking', 'Insurance', 'Real Estate', 'Management']
      },
      { 
        id: 'nonprofit', 
        category: 'professional',
        name: 'Nonprofit', 
        desc: 'Trust-building blues & greens for mission-driven work', 
        color: '#0891B2', 
        accent2: '#059669',
        icon: 'fa-heart',
        gradient: 'linear-gradient(135deg, #0891B2, #0D9488, #059669)',
        industries: ['Charity', 'NGO', 'Social Work', 'Education']
      },
      
      // Service Industry Category
      { 
        id: 'healthcare', 
        category: 'service',
        name: 'Healthcare', 
        desc: 'Calming blues & teals for medical professionals', 
        color: '#0EA5E9', 
        accent2: '#14B8A6',
        icon: 'fa-heartbeat',
        gradient: 'linear-gradient(135deg, #0EA5E9, #06B6D4, #14B8A6)',
        industries: ['Medical', 'Nursing', 'Pharmacy', 'Dental']
      },
      { 
        id: 'restaurant', 
        category: 'service',
        name: 'Restaurant & Hospitality', 
        desc: 'Warm appetizing colors for food service', 
        color: '#DC2626', 
        accent2: '#EA580C',
        icon: 'fa-utensils',
        gradient: 'linear-gradient(135deg, #DC2626, #EA580C, #F59E0B)',
        industries: ['Chef', 'Server', 'Hotel', 'Catering']
      },
      { 
        id: 'trades', 
        category: 'service',
        name: 'Trades & Services', 
        desc: 'Strong earth tones for skilled trades', 
        color: '#D97706', 
        accent2: '#78716C',
        icon: 'fa-tools',
        gradient: 'linear-gradient(135deg, #D97706, #B45309, #78716C)',
        industries: ['Plumbing', 'Electric', 'HVAC', 'Construction']
      },
      { 
        id: 'beauty', 
        category: 'service',
        name: 'Beauty & Wellness', 
        desc: 'Elegant rose gold & soft tones for salons & spas', 
        color: '#EC4899', 
        accent2: '#BE185D',
        icon: 'fa-spa',
        gradient: 'linear-gradient(135deg, #EC4899, #DB2777, #BE185D)',
        industries: ['Hair Salon', 'Spa', 'Makeup', 'Fitness']
      },
      
      // Creative Category
      { 
        id: 'creative', 
        category: 'creative',
        name: 'Creative', 
        desc: 'Vibrant gradients for designers & artists', 
        color: '#F472B6', 
        accent2: '#A855F7',
        icon: 'fa-paint-brush',
        gradient: 'linear-gradient(135deg, #F472B6, #E879F9, #A855F7)',
        industries: ['Design', 'Art', 'Photography', 'Marketing']
      },
      
      // Technical Category
      { 
        id: 'tech', 
        category: 'technical',
        name: 'Tech Pioneer', 
        desc: 'Data-driven cyan & neon for engineers', 
        color: '#06B6D4', 
        accent2: '#22D3EE',
        icon: 'fa-microchip',
        gradient: 'linear-gradient(135deg, #06B6D4, #22D3EE, #67E8F9)',
        industries: ['Software', 'Data Science', 'DevOps', 'IT']
      },
      { 
        id: 'minimal', 
        category: 'technical',
        name: 'Minimal', 
        desc: 'Clean & elegant simplicity for any industry', 
        color: '#10B981', 
        accent2: '#34D399',
        icon: 'fa-feather',
        gradient: 'linear-gradient(135deg, #10B981, #34D399, #6EE7B7)',
        industries: ['General', 'Startup', 'Freelance', 'Academic']
      }
    ];
    
    // Storage keys
    const STORAGE_KEYS = {
      PROFILE: 'webume_profile',
      PHOTO: 'webume_photo',
      TEMPLATE: 'webume_template',
      RAW_TEXT: 'webume_rawtext',
      LAST_SAVED: 'webume_last_saved'
    };
    
    // Auth View Component
    const AuthView = ({ onLogin, authLoading, authError }) => {
      const [isLogin, setIsLogin] = useState(true);
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [name, setName] = useState('');
      const [error, setError] = useState('');
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!email || !password || (!isLogin && !name)) {
          setError('Please fill in all fields');
          return;
        }
        
        onLogin(isLogin, email, password, name);
      };
      
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass" style={{ 
            width: '100%', 
            maxWidth: '440px', 
            padding: '48px 40px',
            borderRadius: '28px'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, var(--purple-main), var(--pink-main))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 12px 40px rgba(139,92,246,0.4)'
              }}>
                <i className="fas fa-rocket" style={{ fontSize: '32px', color: '#fff' }}></i>
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                {isLogin ? 'Sign in to access your saved profiles' : 'Start building your digital profile'}
              </p>
            </div>
            
            {(error || authError) && (
              <div style={{
                padding: '14px 18px',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '12px',
                marginBottom: '20px',
                color: '#EF4444',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <i className="fas fa-exclamation-circle"></i>
                {error || authError}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                    <i className="fas fa-user" style={{ marginRight: '8px', color: 'var(--purple-main)' }}></i>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="glass-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Smith"
                    style={{ width: '100%', padding: '14px 16px', fontSize: '15px' }}
                  />
                </div>
              )}
              
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                  <i className="fas fa-envelope" style={{ marginRight: '8px', color: 'var(--purple-main)' }}></i>
                  Email Address
                </label>
                <input
                  type="email"
                  className="glass-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ width: '100%', padding: '14px 16px', fontSize: '15px' }}
                />
              </div>
              
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                  <i className="fas fa-lock" style={{ marginRight: '8px', color: 'var(--purple-main)' }}></i>
                  Password
                </label>
                <input
                  type="password"
                  className="glass-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '14px 16px', fontSize: '15px' }}
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={authLoading}
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  fontSize: '15px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                {authLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    <i className={isLogin ? 'fas fa-sign-in-alt' : 'fas fa-user-plus'}></i>
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </>
                )}
              </button>
            </form>
            
            <div style={{ marginTop: '28px', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--purple-light)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginLeft: '6px'
                  }}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
            
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>
                <i className="fas fa-shield-alt" style={{ marginRight: '6px' }}></i>
                Your data is securely stored and never shared
              </p>
            </div>
          </div>
        </div>
      );
    };
    
    const App = () => {
      const [view, setView] = useState(VIEW.AUTH);
      const [user, setUser] = useState(null);
      const [authLoading, setAuthLoading] = useState(true);
      const [authError, setAuthError] = useState('');
      const [profile, setProfile] = useState(null);
      const [loading, setLoading] = useState(false);
      const [progress, setProgress] = useState(0);
      const [activeTab, setTab] = useState('basics');
      const [rawText, setRawText] = useState('');
      const [selectedTemplate, setTemplate] = useState('executive');
      const [profilePhoto, setProfilePhoto] = useState(null);
      const [lastSaved, setLastSaved] = useState(null);
      const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'saved', 'error'
      const [slug, setSlug] = useState('');
      const [isPublic, setIsPublic] = useState(false);
      const [profileViews, setProfileViews] = useState(0);
      const [steps, setSteps] = useState([
        { text: 'Reading file', state: 'pending' },
        { text: 'Extracting text', state: 'pending' },
        { text: 'AI deep analysis', state: 'pending' },
        { text: 'Extracting experiences', state: 'pending' },
        { text: 'Generating descriptions', state: 'pending' },
        { text: 'Building rich profile', state: 'pending' }
      ]);
      
      // Check auth status on mount
      React.useEffect(() => {
        checkAuth();
      }, []);
      
      const checkAuth = async () => {
        try {
          const res = await fetch('/api/auth/me');
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            // Load profile from server
            await loadProfile();
            setView(VIEW.UPLOAD);
          } else {
            setView(VIEW.AUTH);
          }
        } catch (e) {
          console.error('Auth check failed:', e);
          setView(VIEW.AUTH);
        }
        setAuthLoading(false);
      };
      
      const loadProfile = async () => {
        try {
          const res = await fetch('/api/profile/load');
          const data = await res.json();
          if (data.profile) {
            setProfile(data.profile);
            setView(VIEW.BUILDER);
            console.log('✅ Loaded profile from server');
          }
          if (data.profilePhoto) setProfilePhoto(data.profilePhoto);
          if (data.selectedTemplate) setTemplate(data.selectedTemplate);
          if (data.rawText) setRawText(data.rawText);
          if (data.slug) setSlug(data.slug);
          if (data.isPublic !== undefined) setIsPublic(data.isPublic);
          if (data.profileViews) setProfileViews(data.profileViews);
        } catch (e) {
          console.error('Error loading profile:', e);
        }
      };
      
      const handleAuth = async (isLogin, email, password, name) => {
        setAuthLoading(true);
        setAuthError('');
        
        try {
          const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
          const body = isLogin ? { email, password } : { email, password, name };
          
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          
          const data = await res.json();
          
          if (data.error) {
            setAuthError(data.error);
            setAuthLoading(false);
            return;
          }
          
          setUser(data.user);
          if (data.user.hasProfile) {
            await loadProfile();
          } else {
            setView(VIEW.UPLOAD);
          }
        } catch (e) {
          setAuthError('Connection error. Please try again.');
        }
        setAuthLoading(false);
      };
      
      const handleLogout = async () => {
        if (confirm('Are you sure you want to sign out?')) {
          await fetch('/api/auth/logout', { method: 'POST' });
          setUser(null);
          setProfile(null);
          setProfilePhoto(null);
          setRawText('');
          setTemplate('executive');
          setView(VIEW.AUTH);
        }
      };
      
      // Auto-save profile to SERVER when it changes
      React.useEffect(() => {
        if (profile && user) {
          setSaveStatus('saving');
          
          const saveTimeout = setTimeout(async () => {
            try {
              const res = await fetch('/api/profile/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  profile,
                  profilePhoto,
                  selectedTemplate,
                  rawText
                })
              });
              
              const data = await res.json();
              if (data.success) {
                setLastSaved(new Date(data.savedAt));
                setSaveStatus('saved');
                console.log('✅ Auto-saved to server at', data.savedAt);
              } else {
                throw new Error(data.error);
              }
              setTimeout(() => setSaveStatus(''), 3000);
            } catch (e) {
              console.error('Error saving profile:', e);
              setSaveStatus('error');
              setTimeout(() => setSaveStatus(''), 5000);
            }
          }, 1000);
          return () => clearTimeout(saveTimeout);
        }
      }, [profile, profilePhoto, selectedTemplate]);
      
      // Manual save function
      const saveProgress = async () => {
        if (!profile) {
          alert('No profile to save yet. Upload a resume first.');
          return;
        }
        if (!user) {
          alert('Please sign in to save your profile.');
          return;
        }
        try {
          setSaveStatus('saving');
          const res = await fetch('/api/profile/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              profile,
              profilePhoto,
              selectedTemplate,
              rawText
            })
          });
          const data = await res.json();
          if (data.success) {
            setLastSaved(new Date(data.savedAt));
            setSaveStatus('saved');
            alert('✅ Profile saved to your account! You can access it from any device.');
          } else {
            throw new Error(data.error);
          }
        } catch (e) {
          setSaveStatus('error');
          alert('❌ Error saving profile: ' + e.message);
        }
      };
      
      // Clear saved data (server + local)
      const clearSavedData = async () => {
        if (confirm('Are you sure you want to clear ALL profile data? This cannot be undone.')) {
          try {
            await fetch('/api/profile/save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                profile: null,
                profilePhoto: null,
                selectedTemplate: 'executive',
                rawText: ''
              })
            });
          } catch (e) {}
          setProfile(null);
          setProfilePhoto(null);
          setRawText('');
          setTemplate('executive');
          setLastSaved(null);
          setView(VIEW.UPLOAD);
          alert('All profile data has been cleared.');
        }
      };
      
      // Format last saved time
      const formatLastSaved = (date) => {
        if (!date) return null;
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
        if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
        return date.toLocaleDateString();
      };
      
      const processFile = async (file) => {
        setLoading(true);
        setProgress(0);
        const st = [...steps];
        
        try {
          // Step 1: Reading file
          st[0].state = 'active';
          setSteps([...st]);
          await new Promise(r => setTimeout(r, 300));
          
          // Step 2: Extracting text
          st[0].state = 'done';
          st[1].state = 'active';
          setSteps([...st]);
          setProgress(15);
          
          const ext = file.name.split('.').pop().toLowerCase();
          let text = '';
          
          if (ext === 'pdf') text = await FileParser.pdf(file);
          else if (ext === 'docx' || ext === 'doc') text = await FileParser.docx(file);
          else text = await FileParser.txt(file);
          
          setRawText(text);
          
          // Step 3: AI analyzing
          st[1].state = 'done';
          st[2].state = 'active';
          setSteps([...st]);
          setProgress(30);
          
          let aiResult = null;
          try {
            const res = await fetch('/api/parse-resume', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text })
            });
            if (res.ok) aiResult = await res.json();
          } catch (e) {
            console.error('AI parsing error:', e);
          }
          
          // Step 4: Finding experiences
          st[2].state = 'done';
          st[3].state = 'active';
          setSteps([...st]);
          setProgress(55);
          await new Promise(r => setTimeout(r, 300));
          
          // Step 5: Generating insights
          st[3].state = 'done';
          st[4].state = 'active';
          setSteps([...st]);
          setProgress(75);
          await new Promise(r => setTimeout(r, 300));
          
          // Step 6: Building profile
          st[4].state = 'done';
          st[5].state = 'active';
          setSteps([...st]);
          setProgress(92);
          
          const finalProfile = buildProfile(aiResult, text);
          
          st[5].state = 'done';
          setSteps([...st]);
          setProgress(100);
          await new Promise(r => setTimeout(r, 400));
          
          setProfile(finalProfile);
          setLoading(false);
          setView(VIEW.BUILDER);
        } catch (err) {
          alert('Error processing file: ' + err.message);
          setLoading(false);
        }
      };
      
      // Helper to get company logo URL from Clearbit
      const getCompanyLogoUrl = (domain) => {
        if (!domain) return null;
        // Clean domain
        const cleanDomain = domain.replace(/^(https?:\\/\\/)?(www\\.)?/, '').split('/')[0];
        return \`https://logo.clearbit.com/\${cleanDomain}\`;
      };
      
      const buildProfile = (aiData, text) => {
        if (aiData && !aiData.error && aiData.basics) {
          return {
            basics: { 
              ...aiData.basics,
              summary: aiData.basics.summary || ''
            },
            experience: (aiData.experience || []).map((e, i) => {
              // Auto-generate logo URL from company domain
              const companyInfo = e.companyInfo || {};
              const domain = companyInfo.domain || '';
              const logoUrl = getCompanyLogoUrl(domain);
              
              return {
                id: Date.now() + i,
                ...e,
                companyInfo: {
                  website: companyInfo.website || '',
                  domain: domain,
                  industry: companyInfo.industry || '',
                  location: companyInfo.location || '',
                  size: companyInfo.size || '',
                  description: companyInfo.description || ''
                },
                logoUrl: logoUrl,
                customLogo: null, // For manual upload
                responsibilities: e.responsibilities || [],
                dayInLife: e.dayInLife || [
                  { time: '9:00 AM', activity: '' },
                  { time: '10:30 AM', activity: '' },
                  { time: '12:00 PM', activity: '' },
                  { time: '2:00 PM', activity: '' },
                  { time: '4:00 PM', activity: '' },
                  { time: '5:30 PM', activity: '' }
                ],
                metrics: e.metrics || [
                  { value: '', label: '' },
                  { value: '', label: '' },
                  { value: '', label: '' },
                  { value: '', label: '' }
                ]
              };
            }),
            skills: aiData.skills || [],
            achievements: (aiData.achievements || []).map((a, i) => ({
              id: Date.now() + i + 1000,
              ...a
            })),
            education: (aiData.education || []).map((e, i) => ({
              id: Date.now() + i + 2000,
              ...e
            })),
            certifications: aiData.certifications || [],
            awards: [],
            reviews: [],
            payHistory: [],
            projects: [],
            photos: [],
            videos: []
          };
        }
        
        // Fallback extraction
        const email = text.match(/[\\w.-]+@[\\w.-]+\\.\\w+/)?.[0] || '';
        const phone = text.match(/[\\+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4}/)?.[0] || '';
        const name = text.split('\\n').filter(l => l.trim())[0]?.trim() || '';
        
        return {
          basics: {
            name, title: '', tagline: '', email, phone,
            location: '', linkedin: '', website: '', summary: ''
          },
          experience: [],
          skills: [],
          achievements: [],
          education: [],
          certifications: [],
          awards: [],
          reviews: [],
          payHistory: [],
          projects: [],
          photos: [],
          videos: []
        };
      };
      
      const navItems = [
        { id: 'basics', icon: 'fa-user', label: 'Basic Info' },
        { id: 'experience', icon: 'fa-briefcase', label: 'Experience' },
        { id: 'skills', icon: 'fa-code', label: 'Skills' },
        { id: 'achievements', icon: 'fa-trophy', label: 'Achievements' },
        { id: 'education', icon: 'fa-graduation-cap', label: 'Education' },
        { id: 'awards', icon: 'fa-award', label: 'Awards' },
        { id: 'reviews', icon: 'fa-star', label: 'Reviews' },
        { id: 'pay', icon: 'fa-dollar-sign', label: 'Pay History' },
        { id: 'projects', icon: 'fa-folder', label: 'Projects' },
        { id: 'media', icon: 'fa-image', label: 'Media' },
        { id: 'templates', icon: 'fa-palette', label: 'Templates' }
      ];
      
      // Show loading state while checking auth
      if (authLoading && view === VIEW.AUTH) {
        return (
          <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, var(--purple-main), var(--pink-main))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 40px rgba(139,92,246,0.4)'
            }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: '#fff' }}></i>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Loading...</p>
          </div>
        );
      }
      
      // Show Auth view if not logged in
      if (view === VIEW.AUTH) {
        return <AuthView onLogin={handleAuth} authLoading={authLoading} authError={authError} />;
      }
      
      return (
        <div className="app-container">
          {/* FLOATING AUTO-SAVE INDICATOR - Always visible */}
          {saveStatus && (
            <div style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 9999,
              padding: '12px 20px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
              fontWeight: '600',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              animation: 'slideIn 0.3s ease',
              background: saveStatus === 'saving' 
                ? 'linear-gradient(135deg, rgba(6,182,212,0.9), rgba(139,92,246,0.9))' 
                : saveStatus === 'saved'
                ? 'linear-gradient(135deg, rgba(16,185,129,0.9), rgba(6,182,212,0.9))'
                : 'linear-gradient(135deg, rgba(239,68,68,0.9), rgba(236,72,153,0.9))',
              color: '#fff',
              backdropFilter: 'blur(10px)'
            }}>
              {saveStatus === 'saving' && (
                <>
                  <i className="fas fa-circle-notch fa-spin"></i>
                  Auto-saving...
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <i className="fas fa-check-circle"></i>
                  All changes saved!
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <i className="fas fa-exclamation-triangle"></i>
                  Save failed - click Save Now
                </>
              )}
            </div>
          )}
          
          {/* Sidebar */}
          <aside className="sidebar glass-sidebar">
            <div className="logo">
              <img src="/static/logo.png" alt="Webumé" className="logo-img" />
            </div>
            
            {/* User Info */}
            {user && (
              <div style={{
                padding: '16px',
                margin: '0 16px 16px',
                background: 'rgba(139,92,246,0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(139,92,246,0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, var(--purple-main), var(--pink-main))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#fff', fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.name}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Sign Out
                </button>
              </div>
            )}
            
            <div className="nav-group">
              <div className="nav-label">Profile Sections</div>
              {navItems.map(item => (
                <button
                  key={item.id}
                  className={'nav-btn' + (activeTab === item.id && view === VIEW.BUILDER ? ' active' : '')}
                  onClick={() => {
                    setTab(item.id);
                    if (view !== VIEW.BUILDER && profile) setView(VIEW.BUILDER);
                  }}
                >
                  <i className={'fas ' + item.icon}></i>
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="nav-group">
              <div className="nav-label">Actions</div>
              <button className="nav-btn" onClick={() => profile && setView(VIEW.PREVIEW)}>
                <i className="fas fa-eye"></i>
                Live Preview
              </button>
              <button className="nav-btn" onClick={() => setView(VIEW.UPLOAD)}>
                <i className="fas fa-upload"></i>
                Upload New
              </button>
            </div>
            
            {/* Save/Load Section */}
            <div className="nav-group">
              <div className="nav-label">Save Progress</div>
              <button 
                className="nav-btn" 
                onClick={saveProgress}
                style={{ background: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.3)' }}
              >
                <i className="fas fa-save" style={{ color: 'var(--green-main)' }}></i>
                <span style={{ color: 'var(--green-main)' }}>Save Now</span>
              </button>
              <button 
                className="nav-btn" 
                onClick={clearSavedData}
                style={{ opacity: 0.7 }}
              >
                <i className="fas fa-trash-alt"></i>
                Clear Saved Data
              </button>
              
              {/* Save Status */}
              {(lastSaved || saveStatus) && (
                <div style={{ 
                  padding: '10px 16px', 
                  fontSize: '11px',
                  color: saveStatus === 'error' ? '#EF4444' : 'rgba(255,255,255,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {saveStatus === 'saving' && (
                    <>
                      <i className="fas fa-spinner fa-spin" style={{ color: 'var(--cyan-main)' }}></i>
                      Saving...
                    </>
                  )}
                  {saveStatus === 'saved' && (
                    <>
                      <i className="fas fa-check-circle" style={{ color: 'var(--green-main)' }}></i>
                      Saved!
                    </>
                  )}
                  {saveStatus === 'error' && (
                    <>
                      <i className="fas fa-exclamation-circle"></i>
                      Save failed
                    </>
                  )}
                  {!saveStatus && lastSaved && (
                    <>
                      <i className="fas fa-clock"></i>
                      Last saved: {formatLastSaved(lastSaved)}
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="sidebar-footer">
              <div className="stat-row">
                <span className="stat-name">Experiences</span>
                <span className="stat-num">{profile?.experience?.length || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-name">Skills</span>
                <span className="stat-num">{profile?.skills?.length || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-name">Completeness</span>
                <span className="stat-num">{profile ? Math.min(100, Math.round((
                  (profile.basics?.name ? 10 : 0) +
                  (profile.basics?.title ? 10 : 0) +
                  (profile.basics?.tagline ? 10 : 0) +
                  (profile.basics?.email ? 5 : 0) +
                  (profile.experience?.length > 0 ? 25 : 0) +
                  (profile.skills?.length > 0 ? 20 : 0) +
                  (profile.achievements?.length > 0 ? 10 : 0) +
                  (profile.education?.length > 0 ? 10 : 0)
                ))) : 0}%</span>
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="main">
            {view === VIEW.UPLOAD && (
              <UploadView
                onUpload={processFile}
                loading={loading}
                progress={progress}
                steps={steps}
                hasSavedData={!!profile}
                savedName={profile?.basics?.name}
                onContinue={() => setView(VIEW.BUILDER)}
              />
            )}
            {view === VIEW.BUILDER && profile && (
              <BuilderView
                profile={profile}
                setProfile={setProfile}
                activeTab={activeTab}
                rawText={rawText}
                profilePhoto={profilePhoto}
                setProfilePhoto={setProfilePhoto}
                selectedTemplate={selectedTemplate}
                setTemplate={setTemplate}
              />
            )}
            {view === VIEW.PREVIEW && profile && (
              <PreviewView
                profile={profile}
                setView={setView}
                profilePhoto={profilePhoto}
                selectedTemplate={selectedTemplate}
                slug={slug}
                isPublic={isPublic}
                setIsPublic={setIsPublic}
                profileViews={profileViews}
              />
            )}
          </main>
        </div>
      );
    };
    
    // Upload View Component
    const UploadView = ({ onUpload, loading, progress, steps, hasSavedData, savedName, onContinue }) => {
      const [isDragging, setDragging] = useState(false);
      const fileInputRef = useRef(null);
      
      const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files[0]) {
          onUpload(e.dataTransfer.files[0]);
        }
      };
      
      if (loading) {
        return (
          <div className="glass-card upload-zone">
            <div className="processing-state">
              <div className="ai-visual">
                <div className="ai-core"></div>
                <div className="ai-ring"></div>
                <div className="ai-ring"></div>
                <div className="ai-ring"></div>
              </div>
              
              <div className="ai-badge">
                <div className="ai-badge-dot"></div>
                GEMINI AI
              </div>
              
              <h2 className="processing-title">Analyzing Your Resume</h2>
              <p className="processing-subtitle">Extracting career details and generating insights</p>
              
              <div className="progress-percent">{Math.round(progress)}%</div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: progress + '%' }}></div>
              </div>
              
              <div className="step-list">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className={'step-item' + (step.state === 'active' ? ' active' : step.state === 'done' ? ' done' : '')}
                  >
                    <i className={'fas ' + (step.state === 'done' ? 'fa-check' : step.state === 'active' ? 'fa-spinner fa-spin' : 'fa-circle')}></i>
                    {step.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      
      return (
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Upload Resume</h1>
              <p className="page-desc">Drop your resume to begin the AI-powered analysis</p>
            </div>
          </div>
          
          {/* Welcome Back Card - Show if there's saved data */}
          {hasSavedData && (
            <div className="glass-card" style={{ 
              padding: '24px 28px', 
              marginBottom: '24px',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.05))',
              border: '1px solid rgba(16,185,129,0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'rgba(16,185,129,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="fas fa-user-check" style={{ fontSize: '22px', color: 'var(--green-main)' }}></i>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                      Welcome back{savedName ? ', ' + savedName.split(' ')[0] : ''}!
                    </h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                      You have a saved profile. Continue where you left off or start fresh.
                    </p>
                  </div>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={onContinue}
                  style={{ background: 'linear-gradient(135deg, var(--green-main), var(--cyan-main))' }}
                >
                  <i className="fas fa-arrow-right"></i>
                  Continue Editing
                </button>
              </div>
            </div>
          )}
          
          <div className="glass-card upload-zone">
            <div
              className={'dropzone' + (isDragging ? ' drag-active' : '')}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])}
                accept=".pdf,.docx,.doc,.txt"
                style={{ display: 'none' }}
              />
              
              <img src="/static/logo.png" alt="Webumé" className="upload-logo" />
              
              <div className="upload-icon-wrap">
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              
              <h2 className="upload-title">Drop Your Resume Here</h2>
              <p className="upload-subtitle">Powered by Gemini AI • Instant Career Analysis</p>
              
              <div className="format-pills">
                <span className="format-pill"><i className="fas fa-file-pdf"></i> PDF</span>
                <span className="format-pill"><i className="fas fa-file-word"></i> DOCX</span>
                <span className="format-pill"><i className="fas fa-file-alt"></i> TXT</span>
              </div>
            </div>
          </div>
        </div>
      );
    };
    
    // Builder View Component
    const BuilderView = ({ profile, setProfile, activeTab, rawText, profilePhoto, setProfilePhoto, selectedTemplate, setTemplate }) => {
      const updateField = (key, value) => setProfile(p => ({ ...p, [key]: value }));
      const updateBasics = (key, value) => setProfile(p => ({ ...p, basics: { ...p.basics, [key]: value } }));
      
      return (
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">{activeTab === 'templates' ? 'Templates' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
              <p className="page-desc">{activeTab === 'templates' ? 'Choose your profile style' : 'Edit and customize your profile information'}</p>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="glass stat-card">
              <div className="stat-icon-wrap"><i className="fas fa-briefcase"></i></div>
              <div className="value">{profile.experience.length}</div>
              <div className="label">Experiences</div>
            </div>
            <div className="glass stat-card cyan">
              <div className="stat-icon-wrap"><i className="fas fa-code"></i></div>
              <div className="value">{profile.skills.length}</div>
              <div className="label">Skills</div>
            </div>
            <div className="glass stat-card green">
              <div className="stat-icon-wrap"><i className="fas fa-trophy"></i></div>
              <div className="value">{profile.achievements.length}</div>
              <div className="label">Achievements</div>
            </div>
          </div>
          
          {/* Content Card */}
          <div className="glass-card" style={{ padding: '28px' }}>
            {activeTab === 'basics' && (
              <BasicsEditor 
                profile={profile} 
                updateBasics={updateBasics} 
                rawText={rawText}
                profilePhoto={profilePhoto}
                setProfilePhoto={setProfilePhoto}
              />
            )}
            {activeTab === 'experience' && (
              <ExperienceEditor
                experiences={profile.experience}
                setExperiences={(e) => updateField('experience', e)}
              />
            )}
            {activeTab === 'skills' && (
              <SkillsEditor
                skills={profile.skills}
                setSkills={(s) => updateField('skills', s)}
              />
            )}
            {activeTab === 'achievements' && (
              <ListEditor
                title="Achievements"
                items={profile.achievements}
                setItems={(i) => updateField('achievements', i)}
                fields={[
                  { key: 'title', label: 'Title', placeholder: 'Achievement title' },
                  { key: 'description', label: 'Description', placeholder: 'Details', textarea: true }
                ]}
              />
            )}
            {activeTab === 'education' && (
              <ListEditor
                title="Education"
                items={profile.education || []}
                setItems={(i) => updateField('education', i)}
                fields={[
                  { key: 'degree', label: 'Degree', placeholder: 'Bachelor of Science in Computer Science' },
                  { key: 'school', label: 'School', placeholder: 'Stanford University' },
                  { key: 'year', label: 'Year', placeholder: '2020' },
                  { key: 'details', label: 'Details', placeholder: 'GPA, honors, relevant coursework' }
                ]}
              />
            )}
            {activeTab === 'awards' && (
              <ListEditor
                title="Awards"
                items={profile.awards}
                setItems={(i) => updateField('awards', i)}
                fields={[
                  { key: 'title', label: 'Award Name', placeholder: 'Award title' },
                  { key: 'org', label: 'Organization', placeholder: 'Issuing organization' },
                  { key: 'year', label: 'Year', placeholder: '2024' }
                ]}
              />
            )}
            {activeTab === 'reviews' && (
              <ListEditor
                title="Reviews"
                items={profile.reviews}
                setItems={(i) => updateField('reviews', i)}
                fields={[
                  { key: 'quote', label: 'Quote', placeholder: 'What they said', textarea: true },
                  { key: 'author', label: 'Author', placeholder: 'Name' },
                  { key: 'role', label: 'Role', placeholder: 'Title' }
                ]}
              />
            )}
            {activeTab === 'pay' && (
              <ListEditor
                title="Pay History"
                items={profile.payHistory}
                setItems={(i) => updateField('payHistory', i)}
                fields={[
                  { key: 'year', label: 'Year', placeholder: '2024' },
                  { key: 'base', label: 'Base Salary', placeholder: '$150,000' },
                  { key: 'bonus', label: 'Bonus', placeholder: '$30,000' },
                  { key: 'equity', label: 'Equity', placeholder: '$50,000' }
                ]}
              />
            )}
            {activeTab === 'projects' && (
              <ListEditor
                title="Projects"
                items={profile.projects}
                setItems={(i) => updateField('projects', i)}
                fields={[
                  { key: 'name', label: 'Project Name', placeholder: 'Project title' },
                  { key: 'description', label: 'Description', placeholder: 'What you built', textarea: true },
                  { key: 'url', label: 'URL', placeholder: 'https://...' },
                  { key: 'tech', label: 'Technologies', placeholder: 'React, Node, AWS' }
                ]}
              />
            )}
            {activeTab === 'media' && (
              <MediaEditor
                photos={profile.photos}
                videos={profile.videos}
                setPhotos={(p) => updateField('photos', p)}
                setVideos={(v) => updateField('videos', v)}
              />
            )}
            {activeTab === 'templates' && (
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                setTemplate={setTemplate}
              />
            )}
          </div>
        </div>
      );
    };
    
    // Basics Editor with Profile Photo Upload - ENHANCED with quality handling
    const BasicsEditor = ({ profile, updateBasics, rawText, profilePhoto, setProfilePhoto }) => {
      const photoInputRef = useRef(null);
      const [photoLoading, setPhotoLoading] = useState(false);
      
      const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setPhotoLoading(true);
        
        try {
          // Create high-quality image with proper handling
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              // Create canvas for optimal quality
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              // Target size for profile photos (high quality - preserve larger images)
              const maxSize = 1600;
              let width = img.width;
              let height = img.height;
              
              // Scale down if needed while maintaining aspect ratio
              if (width > height && width > maxSize) {
                height = (height * maxSize) / width;
                width = maxSize;
              } else if (height > maxSize) {
                width = (width * maxSize) / height;
                height = maxSize;
              }
              
              canvas.width = width;
              canvas.height = height;
              
              // Use high quality rendering
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(img, 0, 0, width, height);
              
              // Convert to high quality (0.95 quality, use PNG for best quality)
              const dataUrl = canvas.toDataURL('image/png', 0.95);
              setProfilePhoto(dataUrl);
              setPhotoLoading(false);
            };
            img.onerror = () => {
              // Fallback to original if processing fails
              setProfilePhoto(URL.createObjectURL(file));
              setPhotoLoading(false);
            };
            img.src = event.target.result;
          };
          reader.readAsDataURL(file);
        } catch (err) {
          console.error('Photo processing error:', err);
          setProfilePhoto(URL.createObjectURL(file));
          setPhotoLoading(false);
        }
      };
      
      return (
        <div>
          {/* Profile Photo Section - ENHANCED */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', marginBottom: '32px', padding: '24px', background: 'rgba(139,92,246,0.08)', borderRadius: '20px', border: '1px solid rgba(139,92,246,0.2)' }}>
            <input
              type="file"
              ref={photoInputRef}
              onChange={handlePhotoChange}
              accept="image/jpeg,image/png,image/webp,image/heic"
              hidden
            />
            <div
              onClick={() => !photoLoading && photoInputRef.current?.click()}
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '24px',
                background: profilePhoto ? '#1a1a2e' : 'linear-gradient(135deg, var(--purple-main), var(--pink-main))',
                border: profilePhoto ? '4px solid var(--purple-main)' : '3px dashed rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: photoLoading ? 'wait' : 'pointer',
                overflow: 'hidden',
                flexShrink: 0,
                transition: 'all 0.3s ease',
                boxShadow: profilePhoto ? '0 12px 40px rgba(139,92,246,0.35)' : '0 8px 32px rgba(139,92,246,0.25)',
                position: 'relative'
              }}
            >
              {photoLoading ? (
                <div style={{ textAlign: 'center', color: '#fff' }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }}></i>
                  <span style={{ fontSize: '11px', fontWeight: '600' }}>Processing...</span>
                </div>
              ) : profilePhoto ? (
                <img 
                  src={profilePhoto} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    imageRendering: '-webkit-optimize-contrast',
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                  }} 
                  alt="Profile"
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#fff' }}>
                  <i className="fas fa-camera" style={{ fontSize: '32px', marginBottom: '10px', display: 'block' }}></i>
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>Add Photo</span>
                </div>
              )}
              
              {/* Hover overlay */}
              {profilePhoto && !photoLoading && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  borderRadius: '20px'
                }} className="photo-hover-overlay">
                  <i className="fas fa-camera" style={{ color: '#fff', fontSize: '24px' }}></i>
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
                Profile Photo
                {profilePhoto && <i className="fas fa-check-circle" style={{ marginLeft: '10px', color: 'var(--green-main)', fontSize: '14px' }}></i>}
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '14px' }}>
                Upload a professional headshot (JPEG, PNG, WebP supported)
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ padding: '10px 20px', fontSize: '13px' }}
                  onClick={() => photoInputRef.current?.click()}
                  disabled={photoLoading}
                >
                  <i className={photoLoading ? 'fas fa-spinner fa-spin' : 'fas fa-upload'}></i> 
                  {photoLoading ? 'Processing...' : profilePhoto ? 'Change Photo' : 'Upload Photo'}
                </button>
                {profilePhoto && (
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '10px 20px', fontSize: '13px' }}
                    onClick={() => { setProfilePhoto(null); localStorage.removeItem(STORAGE_KEYS.PHOTO); }}
                  >
                    <i className="fas fa-trash"></i> Remove
                  </button>
                )}
              </div>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '10px' }}>
                <i className="fas fa-info-circle" style={{ marginRight: '6px' }}></i>
                High-quality images are automatically optimized for best display
              </p>
            </div>
          </div>
          
          <style>{\`
            .photo-hover-overlay:hover { opacity: 1 !important; }
          \`}</style>
          
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Full Name</label>
              <input
                className="glass-input"
                value={profile.basics.name}
                onChange={(e) => updateBasics('name', e.target.value)}
                placeholder="John Smith"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Job Title</label>
              <input
                className="glass-input"
                value={profile.basics.title}
                onChange={(e) => updateBasics('title', e.target.value)}
                placeholder="Senior Software Engineer"
              />
            </div>
            <div className="form-field full-width">
              <label className="form-label">Professional Tagline</label>
              <input
                className="glass-input"
                value={profile.basics.tagline}
                onChange={(e) => updateBasics('tagline', e.target.value)}
                placeholder="Building scalable systems that drive business growth"
              />
            </div>
            <div className="form-field full-width">
              <label className="form-label">Professional Summary</label>
              <textarea
                className="glass-input form-textarea"
                value={profile.basics.summary || ''}
                onChange={(e) => updateBasics('summary', e.target.value)}
                placeholder="A compelling 2-3 sentence summary of your professional background and expertise..."
              />
            </div>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input
                className="glass-input"
                value={profile.basics.email}
                onChange={(e) => updateBasics('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Phone</label>
              <input
                className="glass-input"
                value={profile.basics.phone}
                onChange={(e) => updateBasics('phone', e.target.value)}
                placeholder="+1 555 123 4567"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Location</label>
              <input
                className="glass-input"
                value={profile.basics.location}
                onChange={(e) => updateBasics('location', e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
            <div className="form-field">
              <label className="form-label">LinkedIn</label>
              <input
                className="glass-input"
                value={profile.basics.linkedin}
                onChange={(e) => updateBasics('linkedin', e.target.value)}
                placeholder="linkedin.com/in/johnsmith"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Website</label>
              <input
                className="glass-input"
                value={profile.basics.website || ''}
                onChange={(e) => updateBasics('website', e.target.value)}
                placeholder="yourwebsite.com"
              />
            </div>
          </div>
          
          {rawText && (
            <details style={{ marginTop: '28px' }}>
              <summary style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontWeight: '500' }}>
                <i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i>
                View Extracted Text
              </summary>
              <pre style={{
                marginTop: '14px',
                padding: '18px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '12px',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.4)',
                maxHeight: '180px',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>{rawText}</pre>
            </details>
          )}
        </div>
      );
    };
    
    // Experience Editor with Company Logo Support
    const ExperienceEditor = ({ experiences, setExperiences }) => {
      const [logoErrors, setLogoErrors] = useState({});
      const [showCompanyInfo, setShowCompanyInfo] = useState({});
      const logoInputRefs = useRef({});
      
      const addExperience = () => {
        setExperiences([...experiences, {
          id: Date.now(),
          company: '',
          companyInfo: {
            website: '',
            domain: '',
            industry: '',
            location: '',
            size: '',
            description: ''
          },
          logoUrl: null,
          customLogo: null,
          role: '',
          startDate: '',
          endDate: '',
          description: '',
          responsibilities: [],
          dayInLife: [
            { time: '9:00 AM', activity: '' },
            { time: '11:00 AM', activity: '' },
            { time: '1:00 PM', activity: '' },
            { time: '3:00 PM', activity: '' },
            { time: '5:00 PM', activity: '' }
          ],
          metrics: [
            { value: '', label: '' },
            { value: '', label: '' },
            { value: '', label: '' },
            { value: '', label: '' }
          ]
        }]);
      };
      
      const updateExperience = (idx, key, value) => {
        const updated = [...experiences];
        updated[idx] = { ...updated[idx], [key]: value };
        setExperiences(updated);
      };
      
      const updateCompanyInfo = (idx, key, value) => {
        const updated = [...experiences];
        updated[idx].companyInfo = { ...updated[idx].companyInfo, [key]: value };
        
        // Auto-update logo URL when domain changes
        if (key === 'domain' && value) {
          const cleanDomain = value.replace(/^(https?:\\/\\/)?(www\\.)?/, '').split('/')[0];
          updated[idx].logoUrl = \`https://logo.clearbit.com/\${cleanDomain}\`;
          // Clear any previous error
          setLogoErrors(prev => ({ ...prev, [idx]: false }));
        }
        
        setExperiences(updated);
      };
      
      const removeExperience = (idx) => {
        if (confirm('Are you sure you want to remove this experience? This action cannot be undone.')) {
          setExperiences(experiences.filter((_, i) => i !== idx));
        }
      };
      
      const updateMetric = (expIdx, metricIdx, key, value) => {
        const updated = [...experiences];
        updated[expIdx].metrics[metricIdx][key] = value;
        setExperiences(updated);
      };
      
      const updateDayActivity = (expIdx, dayIdx, value) => {
        const updated = [...experiences];
        updated[expIdx].dayInLife[dayIdx].activity = value;
        setExperiences(updated);
      };
      
      // Responsibility management functions
      const addResponsibility = (expIdx) => {
        const updated = [...experiences];
        if (!updated[expIdx].responsibilities) {
          updated[expIdx].responsibilities = [];
        }
        updated[expIdx].responsibilities.push('');
        setExperiences(updated);
      };
      
      const updateResponsibility = (expIdx, respIdx, value) => {
        const updated = [...experiences];
        updated[expIdx].responsibilities[respIdx] = value;
        setExperiences(updated);
      };
      
      const removeResponsibility = (expIdx, respIdx) => {
        const updated = [...experiences];
        updated[expIdx].responsibilities = updated[expIdx].responsibilities.filter((_, i) => i !== respIdx);
        setExperiences(updated);
      };
      
      const handleLogoUpload = (idx, e) => {
        const file = e.target.files[0];
        if (file) {
          if (confirm('Upload this logo for ' + (experiences[idx].company || 'this company') + '?')) {
            const url = URL.createObjectURL(file);
            const updated = [...experiences];
            updated[idx].customLogo = url;
            setExperiences(updated);
          }
        }
      };
      
      const handleLogoError = (idx) => {
        setLogoErrors(prev => ({ ...prev, [idx]: true }));
      };
      
      const clearCustomLogo = (idx) => {
        if (confirm('Remove custom logo and revert to auto-detected logo?')) {
          const updated = [...experiences];
          updated[idx].customLogo = null;
          setExperiences(updated);
        }
      };
      
      const toggleCompanyInfo = (idx) => {
        setShowCompanyInfo(prev => ({ ...prev, [idx]: !prev[idx] }));
      };
      
      // Get display logo - custom takes priority over auto
      const getDisplayLogo = (exp, idx) => {
        if (exp.customLogo) return exp.customLogo;
        if (exp.logoUrl && !logoErrors[idx]) return exp.logoUrl;
        return null;
      };
      
      return (
        <div>
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="glass exp-entry">
              <div className="exp-head">
                {/* Company Logo Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <input
                    type="file"
                    ref={el => logoInputRefs.current[idx] = el}
                    onChange={(e) => handleLogoUpload(idx, e)}
                    accept="image/*"
                    hidden
                  />
                  <div
                    onClick={() => logoInputRefs.current[idx]?.click()}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '14px',
                      background: getDisplayLogo(exp, idx) ? '#fff' : 'linear-gradient(135deg, var(--purple-main), var(--pink-main))',
                      border: '2px solid rgba(255,255,255,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      flexShrink: 0,
                      position: 'relative'
                    }}
                    title={getDisplayLogo(exp, idx) ? "Click to upload custom logo" : "Auto-detect or upload company logo"}
                  >
                    {getDisplayLogo(exp, idx) ? (
                      <img 
                        src={getDisplayLogo(exp, idx)} 
                        onError={() => handleLogoError(idx)}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} 
                      />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#fff' }}>
                        <i className="fas fa-building" style={{ fontSize: '20px' }}></i>
                      </div>
                    )}
                    {/* Upload overlay */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      borderRadius: '12px'
                    }} className="logo-upload-overlay">
                      <i className="fas fa-camera" style={{ color: '#fff', fontSize: '16px' }}></i>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                      {exp.company || 'New Experience'}
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                      {exp.role || 'Role'} • {exp.startDate || 'Start'} - {exp.endDate || 'End'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {exp.customLogo && (
                    <button 
                      className="btn-icon" 
                      onClick={() => clearCustomLogo(idx)}
                      title="Remove custom logo"
                      style={{ background: 'rgba(236,72,153,0.15)', borderColor: 'rgba(236,72,153,0.3)' }}
                    >
                      <i className="fas fa-image" style={{ color: 'var(--pink-main)' }}></i>
                    </button>
                  )}
                  <button 
                    className="btn-icon" 
                    onClick={() => toggleCompanyInfo(idx)}
                    title="Company details"
                    style={{ 
                      background: showCompanyInfo[idx] ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.05)',
                      borderColor: showCompanyInfo[idx] ? 'var(--cyan-main)' : 'rgba(255,255,255,0.1)'
                    }}
                  >
                    <i className="fas fa-info-circle" style={{ color: showCompanyInfo[idx] ? 'var(--cyan-main)' : 'rgba(255,255,255,0.5)' }}></i>
                  </button>
                  <button className="btn-icon" onClick={() => removeExperience(idx)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              {/* Company Info Section - Expandable */}
              {showCompanyInfo[idx] && (
                <div style={{ 
                  margin: '20px 0', 
                  padding: '20px', 
                  background: 'rgba(6,182,212,0.08)', 
                  borderRadius: '14px',
                  border: '1px solid rgba(6,182,212,0.2)'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--cyan-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-building"></i>
                    Company Information
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '400', marginLeft: 'auto' }}>
                      Auto-generated • Edit if needed
                    </span>
                  </div>
                  <div className="form-row">
                    <div className="form-field">
                      <label className="form-label">Domain (for logo)</label>
                      <input
                        className="glass-input"
                        value={exp.companyInfo?.domain || ''}
                        onChange={(e) => updateCompanyInfo(idx, 'domain', e.target.value)}
                        placeholder="google.com"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Website</label>
                      <input
                        className="glass-input"
                        value={exp.companyInfo?.website || ''}
                        onChange={(e) => updateCompanyInfo(idx, 'website', e.target.value)}
                        placeholder="https://company.com"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Industry</label>
                      <input
                        className="glass-input"
                        value={exp.companyInfo?.industry || ''}
                        onChange={(e) => updateCompanyInfo(idx, 'industry', e.target.value)}
                        placeholder="Technology, Finance, etc."
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Location</label>
                      <input
                        className="glass-input"
                        value={exp.companyInfo?.location || ''}
                        onChange={(e) => updateCompanyInfo(idx, 'location', e.target.value)}
                        placeholder="San Francisco, CA"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Company Size</label>
                      <input
                        className="glass-input"
                        value={exp.companyInfo?.size || ''}
                        onChange={(e) => updateCompanyInfo(idx, 'size', e.target.value)}
                        placeholder="1000+ employees"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Description</label>
                      <input
                        className="glass-input"
                        value={exp.companyInfo?.description || ''}
                        onChange={(e) => updateCompanyInfo(idx, 'description', e.target.value)}
                        placeholder="Brief company description"
                      />
                    </div>
                  </div>
                  {(logoErrors[idx] && !exp.customLogo) && (
                    <div style={{ 
                      marginTop: '12px', 
                      padding: '10px 14px', 
                      background: 'rgba(239,68,68,0.1)', 
                      border: '1px solid rgba(239,68,68,0.2)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#EF4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <i className="fas fa-exclamation-triangle"></i>
                      Logo not found for this domain. Please upload a custom logo.
                    </div>
                  )}
                </div>
              )}
              
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Company</label>
                  <input
                    className="glass-input"
                    value={exp.company}
                    onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                    placeholder="Company name"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Role</label>
                  <input
                    className="glass-input"
                    value={exp.role}
                    onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                    placeholder="Job title"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Start Date</label>
                  <input
                    className="glass-input"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                    placeholder="Jan 2020"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">End Date</label>
                  <input
                    className="glass-input"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                    placeholder="Present"
                  />
                </div>
                <div className="form-field full-width">
                  <label className="form-label">Description</label>
                  <textarea
                    className="glass-input form-textarea"
                    value={exp.description}
                    onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                    placeholder="Describe your role and responsibilities..."
                    style={{ minHeight: '120px' }}
                  />
                </div>
              </div>
              
              {/* KEY RESPONSIBILITIES - Editable List */}
              <div className="resp-section">
                <div className="resp-header">
                  <i className="fas fa-tasks"></i>
                  Key Responsibilities
                  <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '400' }}>
                    {(exp.responsibilities || []).length} items
                  </span>
                </div>
                
                {(exp.responsibilities || []).map((resp, respIdx) => (
                  <div key={respIdx} className="resp-item">
                    <div className="resp-bullet">{respIdx + 1}</div>
                    <input
                      className="resp-input"
                      value={resp}
                      onChange={(e) => updateResponsibility(idx, respIdx, e.target.value)}
                      placeholder="Led a team of 5 engineers to deliver..."
                    />
                    <button 
                      className="resp-delete"
                      onClick={() => removeResponsibility(idx, respIdx)}
                      title="Remove this responsibility"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
                
                <button className="add-resp-btn" onClick={() => addResponsibility(idx)}>
                  <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
                  Add Responsibility
                </button>
              </div>
              
              {/* Day in Life */}
              <div className="day-section">
                <div className="day-header">
                  <i className="fas fa-sun"></i>
                  Day in the Life
                </div>
                {(exp.dayInLife || []).map((day, dayIdx) => (
                  <div key={dayIdx} className="day-entry">
                    <span className="day-time">{day.time}</span>
                    <input
                      className="day-input"
                      value={day.activity}
                      onChange={(e) => updateDayActivity(idx, dayIdx, e.target.value)}
                      placeholder="What you do at this time..."
                    />
                  </div>
                ))}
              </div>
              
              {/* Metrics */}
              <div className="metrics-section">
                <div className="metrics-header">
                  <i className="fas fa-chart-line"></i>
                  Impact Metrics
                </div>
                <div className="metrics-row">
                  {(exp.metrics || []).map((metric, metricIdx) => (
                    <div key={metricIdx} className="metric-box">
                      <input
                        value={metric.value}
                        onChange={(e) => updateMetric(idx, metricIdx, 'value', e.target.value)}
                        placeholder="+40%"
                      />
                      <input
                        value={metric.label}
                        onChange={(e) => updateMetric(idx, metricIdx, 'label', e.target.value)}
                        placeholder="METRIC"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          <button className="btn-ghost" onClick={addExperience}>
            <i className="fas fa-plus"></i> Add Experience
          </button>
          
          <style>{\`
            .exp-entry:hover .logo-upload-overlay {
              opacity: 1 !important;
            }
          \`}</style>
        </div>
      );
    };
    
    // Skills Editor
    const SkillsEditor = ({ skills, setSkills }) => {
      const [inputValue, setInputValue] = useState('');
      
      const addSkill = () => {
        if (inputValue.trim()) {
          setSkills([...skills, inputValue.trim()]);
          setInputValue('');
        }
      };
      
      return (
        <div>
          <div style={{ display: 'flex', gap: '14px', marginBottom: '24px' }}>
            <input
              className="glass-input"
              style={{ flex: 1 }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              placeholder="Type a skill and press Enter..."
            />
            <button className="btn btn-primary" onClick={addSkill}>
              <i className="fas fa-plus"></i>
            </button>
          </div>
          
          <div className="skills-list">
            {skills.map((skill, idx) => (
              <div key={idx} className="skill-chip">
                {skill}
                <button onClick={() => setSkills(skills.filter((_, i) => i !== idx))}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    };
    
    // Generic List Editor
    const ListEditor = ({ title, items, setItems, fields }) => {
      const addItem = () => {
        const newItem = { id: Date.now() };
        fields.forEach(f => newItem[f.key] = '');
        setItems([...items, newItem]);
      };
      
      const updateItem = (idx, key, value) => {
        const updated = [...items];
        updated[idx] = { ...updated[idx], [key]: value };
        setItems(updated);
      };
      
      const removeItem = (idx) => {
        setItems(items.filter((_, i) => i !== idx));
      };
      
      return (
        <div>
          {items.map((item, idx) => (
            <div key={item.id} className="glass exp-entry">
              <div className="exp-head">
                <div className="exp-badge">{idx + 1}</div>
                <button className="btn-icon" onClick={() => removeItem(idx)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              
              <div className="form-row">
                {fields.map(field => (
                  <div key={field.key} className={'form-field' + (field.textarea ? ' full-width' : '')}>
                    <label className="form-label">{field.label}</label>
                    {field.textarea ? (
                      <textarea
                        className="glass-input form-textarea"
                        value={item[field.key] || ''}
                        onChange={(e) => updateItem(idx, field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <input
                        className="glass-input"
                        value={item[field.key] || ''}
                        onChange={(e) => updateItem(idx, field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <button className="btn-ghost" onClick={addItem}>
            <i className="fas fa-plus"></i> Add {title.replace(/s$/, '')}
          </button>
        </div>
      );
    };
    
    // Template Selector Component - Enhanced with Industry Categories
    const TemplateSelector = ({ selectedTemplate, setTemplate }) => {
      const [activeCategory, setActiveCategory] = useState('all');
      
      const filteredTemplates = activeCategory === 'all' 
        ? TEMPLATES 
        : TEMPLATES.filter(t => t.category === activeCategory);
      
      return (
        <div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '20px' }}>
            Choose a template designed for your industry. Your data is preserved when switching.
          </p>
          
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveCategory('all')}
              style={{
                padding: '10px 18px',
                borderRadius: '100px',
                border: activeCategory === 'all' ? '2px solid var(--purple-main)' : '2px solid rgba(255,255,255,0.1)',
                background: activeCategory === 'all' ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)',
                color: activeCategory === 'all' ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <i className="fas fa-th" style={{ marginRight: '8px' }}></i>
              All Templates
            </button>
            {TEMPLATE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '100px',
                  border: activeCategory === cat.id ? '2px solid var(--purple-main)' : '2px solid rgba(255,255,255,0.1)',
                  background: activeCategory === cat.id ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)',
                  color: activeCategory === cat.id ? '#fff' : 'rgba(255,255,255,0.5)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <i className={'fas ' + cat.icon} style={{ marginRight: '8px' }}></i>
                {cat.name}
              </button>
            ))}
          </div>
          
          {/* Templates Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                onClick={() => setTemplate(template.id)}
                style={{
                  padding: '24px',
                  borderRadius: '20px',
                  background: selectedTemplate === template.id 
                    ? 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.08))'
                    : 'rgba(255,255,255,0.03)',
                  border: selectedTemplate === template.id 
                    ? '2px solid ' + template.color
                    : '2px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Gradient header bar */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: template.gradient
                }} />
                
                {/* Template Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: template.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    color: '#fff',
                    boxShadow: '0 8px 24px ' + template.color + '40'
                  }}>
                    <i className={'fas ' + template.icon}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                      {template.name}
                    </h3>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.4' }}>
                      {template.desc}
                    </p>
                  </div>
                </div>
                
                {/* Industry Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                  {template.industries.map((ind, i) => (
                    <span key={i} style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.06)',
                      fontSize: '10px',
                      fontWeight: '500',
                      color: 'rgba(255,255,255,0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px'
                    }}>
                      {ind}
                    </span>
                  ))}
                </div>
                
                {/* Mini Preview */}
                <div style={{
                  padding: '14px',
                  background: 'rgba(0,0,0,0.25)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: template.gradient
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ width: '60%', height: '7px', background: 'rgba(255,255,255,0.25)', borderRadius: '4px', marginBottom: '4px' }} />
                      <div style={{ width: '40%', height: '5px', background: template.color + '50', borderRadius: '3px' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                    {[1,2,3].map(i => (
                      <div key={i} style={{ 
                        flex: 1, 
                        height: '20px', 
                        background: i === 1 ? template.color + '30' : 'rgba(255,255,255,0.08)', 
                        borderRadius: '4px' 
                      }} />
                    ))}
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', marginBottom: '6px' }} />
                  <div style={{ width: '70%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }} />
                </div>
                
                {/* Selected checkmark */}
                {selectedTemplate === template.id && (
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: template.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '11px',
                    boxShadow: '0 4px 12px ' + template.color + '50'
                  }}>
                    <i className="fas fa-check"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Template count */}
          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
            Showing {filteredTemplates.length} of {TEMPLATES.length} templates
          </p>
        </div>
      );
    };
    
    // Media Editor - ENHANCED with proper video playback and image quality
    const MediaEditor = ({ photos, videos, setPhotos, setVideos }) => {
      const photoInputRef = useRef(null);
      const videoInputRef = useRef(null);
      const [expandedVideo, setExpandedVideo] = useState(null);
      const [expandedPhoto, setExpandedPhoto] = useState(null);
      
      const handlePhotoUpload = async (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = await Promise.all(files.map(async (file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxSize = 1200;
                let width = img.width;
                let height = img.height;
                
                if (width > height && width > maxSize) {
                  height = (height * maxSize) / width;
                  width = maxSize;
                } else if (height > maxSize) {
                  width = (width * maxSize) / height;
                  height = maxSize;
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);
                
                resolve({
                  id: Date.now() + Math.random(),
                  url: canvas.toDataURL('image/jpeg', 0.9),
                  name: file.name
                });
              };
              img.onerror = () => {
                resolve({
                  id: Date.now() + Math.random(),
                  url: URL.createObjectURL(file),
                  name: file.name
                });
              };
              img.src = event.target.result;
            };
            reader.readAsDataURL(file);
          });
        }));
        setPhotos([...photos, ...newPhotos]);
      };
      
      const handleVideoUpload = (e) => {
        const files = Array.from(e.target.files);
        const newVideos = files.map(f => ({
          id: Date.now() + Math.random(),
          url: URL.createObjectURL(f),
          name: f.name,
          type: f.type
        }));
        setVideos([...videos, ...newVideos]);
      };
      
      return (
        <div>
          {/* Expanded Photo Modal */}
          {expandedPhoto && (
            <div 
              onClick={() => setExpandedPhoto(null)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.9)',
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                cursor: 'zoom-out'
              }}
            >
              <img 
                src={expandedPhoto.url} 
                style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} 
                alt="Expanded"
              />
              <button
                onClick={() => setExpandedPhoto(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
          
          {/* Expanded Video Modal */}
          {expandedVideo && (
            <div 
              onClick={(e) => e.target === e.currentTarget && setExpandedVideo(null)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.95)',
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px'
              }}
            >
              <video 
                src={expandedVideo.url} 
                controls 
                autoPlay
                playsInline
                style={{ 
                  maxWidth: '90vw', 
                  maxHeight: '85vh', 
                  borderRadius: '12px', 
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  objectFit: 'contain',
                  background: '#000'
                }}
              />
              <button
                onClick={() => setExpandedVideo(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
        
          <h3 style={{ fontSize: '14px', color: 'var(--cyan-main)', marginBottom: '18px', fontWeight: '600' }}>
            <i className="fas fa-camera" style={{ marginRight: '10px' }}></i>
            Photos
            <span style={{ marginLeft: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '400' }}>
              ({photos.length} uploaded)
            </span>
          </h3>
          
          <input
            type="file"
            ref={photoInputRef}
            onChange={handlePhotoUpload}
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            hidden
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '14px', marginBottom: '36px' }}>
            {photos.map(photo => (
              <div 
                key={photo.id} 
                style={{
                  aspectRatio: '1',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '2px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => setExpandedPhoto(photo)}
              >
                <img 
                  src={photo.url} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'high-quality' }} 
                  alt={photo.name || 'Photo'}
                />
                {/* Hover overlay with zoom icon */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.7))',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  padding: '10px',
                  opacity: 0,
                  transition: 'opacity 0.2s'
                }} className="media-hover">
                  <i className="fas fa-search-plus" style={{ color: '#fff', fontSize: '18px' }}></i>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setPhotos(photos.filter(p => p.id !== photo.id)); }}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(239,68,68,0.9)',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '12px',
                    opacity: 0,
                    transition: 'opacity 0.2s'
                  }}
                  className="delete-btn"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
            
            <button
              onClick={() => photoInputRef.current?.click()}
              style={{
                aspectRatio: '1',
                borderRadius: '14px',
                border: '2px dashed rgba(6,182,212,0.4)',
                background: 'rgba(6,182,212,0.05)',
                cursor: 'pointer',
                color: 'var(--cyan-main)',
                fontSize: '18px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <i className="fas fa-plus"></i>
              <span style={{ fontSize: '11px', fontWeight: '600' }}>Add Photo</span>
            </button>
          </div>
          
          <h3 style={{ fontSize: '14px', color: 'var(--pink-main)', marginBottom: '18px', fontWeight: '600' }}>
            <i className="fas fa-video" style={{ marginRight: '10px' }}></i>
            Videos
            <span style={{ marginLeft: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '400' }}>
              ({videos.length} uploaded)
            </span>
          </h3>
          
          <input
            type="file"
            ref={videoInputRef}
            onChange={handleVideoUpload}
            accept="video/mp4,video/webm,video/mov,video/quicktime"
            multiple
            hidden
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {videos.map(video => (
              <div 
                key={video.id} 
                style={{
                  borderRadius: '14px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '2px solid rgba(255,255,255,0.1)',
                  background: '#0a0a12'
                }}
              >
                {/* Video with controls - Fixed playback */}
                <video 
                  src={video.url} 
                  controls
                  preload="auto"
                  playsInline
                  style={{ 
                    width: '100%', 
                    minHeight: '180px',
                    maxHeight: '300px',
                    objectFit: 'contain',
                    background: '#000',
                    display: 'block'
                  }}
                  onClick={(e) => e.target.paused ? e.target.play() : e.target.pause()}
                />
                
                {/* Video info bar */}
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-film"></i>
                    {video.name || 'Video'}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setExpandedVideo(video)}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        background: 'rgba(236,72,153,0.2)',
                        border: 'none',
                        color: 'var(--pink-main)',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      title="Full screen"
                    >
                      <i className="fas fa-expand"></i>
                    </button>
                    <button
                      onClick={() => setVideos(videos.filter(v => v.id !== video.id))}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        background: 'rgba(239,68,68,0.2)',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => videoInputRef.current?.click()}
              style={{
                aspectRatio: '16/9',
                borderRadius: '14px',
                border: '2px dashed rgba(236,72,153,0.4)',
                background: 'rgba(236,72,153,0.05)',
                cursor: 'pointer',
                color: 'var(--pink-main)',
                fontSize: '18px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.2s'
              }}
            >
              <i className="fas fa-plus"></i>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>Add Video</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>MP4, WebM, MOV</span>
            </button>
          </div>
          
          <style>{\`
            .media-hover:hover, div:hover > .media-hover { opacity: 1 !important; }
            div:hover > .delete-btn { opacity: 1 !important; }
          \`}</style>
        </div>
      );
    };
    
    // Preview View with Template Support - ENHANCED for all 10 templates
    const PreviewView = ({ profile, setView, profilePhoto, selectedTemplate, slug, isPublic, setIsPublic, profileViews }) => {
      const template = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];
      const [showPublishModal, setShowPublishModal] = useState(false);
      const [publishing, setPublishing] = useState(false);
      const [qrCode, setQrCode] = useState(null);
      const [atsScore, setAtsScore] = useState(null);
      const [showAtsModal, setShowAtsModal] = useState(false);
      
      const publicUrl = window.location.origin + '/p/' + slug;
      
      // Generate QR code when modal opens
      useEffect(() => {
        if (showPublishModal && window.QRCode && slug) {
          QRCode.toDataURL(publicUrl, { width: 200, margin: 2 })
            .then(url => setQrCode(url))
            .catch(() => {});
        }
      }, [showPublishModal, slug]);
      
      const handlePublish = async () => {
        setPublishing(true);
        try {
          const res = await fetch('/api/profile/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isPublic: !isPublic })
          });
          const data = await res.json();
          if (data.success) {
            setIsPublic(!isPublic);
          }
        } catch (e) {
          alert('Failed to update publish status');
        }
        setPublishing(false);
      };
      
      const copyLink = () => {
        navigator.clipboard.writeText(publicUrl);
        alert('Link copied to clipboard!');
      };
      
      const shareProfile = (platform) => {
        const text = encodeURIComponent(profile.basics?.name + ' - Professional Profile');
        const url = encodeURIComponent(publicUrl);
        const links = {
          linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + url,
          twitter: 'https://twitter.com/intent/tweet?text=' + text + '&url=' + url,
          email: 'mailto:?subject=' + text + '&body=Check out my professional profile: ' + publicUrl
        };
        window.open(links[platform], '_blank');
      };
      
      const checkAtsScore = async () => {
        setShowAtsModal(true);
        try {
          const res = await fetch('/api/ats-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile })
          });
          const data = await res.json();
          setAtsScore(data);
        } catch (e) {
          setAtsScore({ error: 'Failed to analyze profile' });
        }
      };
      
      // Use template's own gradient and color
      const styles = {
        accent: template.color,
        gradient: template.gradient,
        cardBg: template.color + '12',
        border: template.color + '30'
      };
      
      return (
        <div>
          {/* Publish Modal */}
          {showPublishModal && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }} onClick={() => setShowPublishModal(false)}>
              <div onClick={e => e.stopPropagation()} style={{
                background: 'linear-gradient(135deg, #1a1a2e, #0f0f1a)',
                borderRadius: '24px',
                padding: '36px',
                maxWidth: '500px',
                width: '100%',
                border: '1px solid rgba(139,92,246,0.3)'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#fff' }}>
                  <i className="fas fa-share-alt" style={{ marginRight: '12px', color: 'var(--purple-main)' }}></i>
                  Share Your Profile
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '28px' }}>
                  Make your profile public and share it with recruiters
                </p>
                
                {/* Public Toggle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px',
                  background: isPublic ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                  borderRadius: '14px',
                  marginBottom: '24px',
                  border: '1px solid ' + (isPublic ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)')
                }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                      {isPublic ? '🌐 Profile is Public' : '🔒 Profile is Private'}
                    </h4>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                      {isPublic ? 'Anyone with the link can view' : 'Only you can see your profile'}
                    </p>
                  </div>
                  <button
                    onClick={handlePublish}
                    disabled={publishing}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      background: isPublic ? 'rgba(239,68,68,0.2)' : 'var(--green-main)',
                      color: isPublic ? '#EF4444' : '#fff',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    {publishing ? '...' : isPublic ? 'Make Private' : 'Publish'}
                  </button>
                </div>
                
                {/* URL and QR */}
                {isPublic && (
                  <>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', display: 'block' }}>
                        Your Public URL
                      </label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                          value={publicUrl}
                          readOnly
                          style={{
                            flex: 1,
                            padding: '14px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '10px',
                            color: '#fff',
                            fontSize: '13px'
                          }}
                        />
                        <button onClick={copyLink} style={{
                          padding: '14px 20px',
                          background: 'var(--purple-main)',
                          border: 'none',
                          borderRadius: '10px',
                          color: '#fff',
                          cursor: 'pointer'
                        }}>
                          <i className="fas fa-copy"></i>
                        </button>
                      </div>
                    </div>
                    
                    {/* QR Code */}
                    {qrCode && (
                      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <img src={qrCode} style={{ borderRadius: '12px', background: '#fff', padding: '10px' }} alt="QR Code" />
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>Scan to view profile</p>
                      </div>
                    )}
                    
                    {/* Social Share */}
                    <div>
                      <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', display: 'block' }}>
                        Share on
                      </label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => shareProfile('linkedin')} style={{
                          flex: 1,
                          padding: '14px',
                          background: '#0A66C2',
                          border: 'none',
                          borderRadius: '10px',
                          color: '#fff',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                          <i className="fab fa-linkedin" style={{ marginRight: '8px' }}></i>LinkedIn
                        </button>
                        <button onClick={() => shareProfile('twitter')} style={{
                          flex: 1,
                          padding: '14px',
                          background: '#1DA1F2',
                          border: 'none',
                          borderRadius: '10px',
                          color: '#fff',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                          <i className="fab fa-twitter" style={{ marginRight: '8px' }}></i>Twitter
                        </button>
                        <button onClick={() => shareProfile('email')} style={{
                          flex: 1,
                          padding: '14px',
                          background: 'rgba(255,255,255,0.1)',
                          border: 'none',
                          borderRadius: '10px',
                          color: '#fff',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                          <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>Email
                        </button>
                      </div>
                    </div>
                  </>
                )}
                
                {/* View Stats */}
                {isPublic && profileViews > 0 && (
                  <div style={{ marginTop: '20px', textAlign: 'center', padding: '14px', background: 'rgba(139,92,246,0.1)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--purple-main)' }}>{profileViews}</span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginLeft: '8px' }}>profile views</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* ATS Score Modal */}
          {showAtsModal && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }} onClick={() => setShowAtsModal(false)}>
              <div onClick={e => e.stopPropagation()} style={{
                background: 'linear-gradient(135deg, #1a1a2e, #0f0f1a)',
                borderRadius: '24px',
                padding: '36px',
                maxWidth: '500px',
                width: '100%',
                border: '1px solid rgba(6,182,212,0.3)'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#fff' }}>
                  <i className="fas fa-chart-line" style={{ marginRight: '12px', color: 'var(--cyan-main)' }}></i>
                  ATS Compatibility Score
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '28px' }}>
                  See how well your profile matches ATS requirements
                </p>
                
                {!atsScore ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: 'var(--cyan-main)' }}></i>
                    <p style={{ marginTop: '16px', color: 'rgba(255,255,255,0.5)' }}>Analyzing your profile...</p>
                  </div>
                ) : atsScore.error ? (
                  <p style={{ color: '#EF4444' }}>{atsScore.error}</p>
                ) : (
                  <>
                    {/* Score Circle */}
                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                      <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'conic-gradient(var(--cyan-main) ' + (atsScore.score * 3.6) + 'deg, rgba(255,255,255,0.1) 0deg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto'
                      }}>
                        <div style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          background: '#1a1a2e',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column'
                        }}>
                          <span style={{ fontSize: '32px', fontWeight: '800', color: 'var(--cyan-main)' }}>{atsScore.score}</span>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>/ 100</span>
                        </div>
                      </div>
                      <p style={{ marginTop: '12px', fontSize: '18px', fontWeight: '700', color: atsScore.score >= 80 ? 'var(--green-main)' : atsScore.score >= 60 ? '#F59E0B' : '#EF4444' }}>
                        Grade: {atsScore.grade}
                      </p>
                    </div>
                    
                    {/* Keywords Found */}
                    {atsScore.matches?.length > 0 && (
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '13px', color: 'var(--green-main)', marginBottom: '10px' }}>
                          <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>Keywords Found
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {atsScore.matches.map((k, i) => (
                            <span key={i} style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.15)', borderRadius: '6px', fontSize: '12px', color: 'var(--green-main)' }}>{k}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Suggestions */}
                    {atsScore.tips?.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: '13px', color: '#F59E0B', marginBottom: '10px' }}>
                          <i className="fas fa-lightbulb" style={{ marginRight: '8px' }}></i>Suggestions
                        </h4>
                        <ul style={{ paddingLeft: '20px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: '1.8' }}>
                          {atsScore.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
          
          <div className="glass preview-header">
            <div>
              <h1 className="page-title">Live Preview</h1>
              <p className="page-desc">
                <span style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '4px 12px',
                  background: styles.accent + '20',
                  borderRadius: '100px',
                  fontSize: '12px',
                  color: styles.accent,
                  fontWeight: '600'
                }}>
                  <i className={'fas ' + template.icon}></i>
                  {template.name} Template
                </span>
                {isPublic && (
                  <span style={{ 
                    marginLeft: '10px',
                    padding: '4px 12px',
                    background: 'rgba(16,185,129,0.2)',
                    borderRadius: '100px',
                    fontSize: '12px',
                    color: 'var(--green-main)',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-globe" style={{ marginRight: '6px' }}></i>Public
                  </span>
                )}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={checkAtsScore}>
                <i className="fas fa-chart-line"></i> ATS Score
              </button>
              <button className="btn btn-secondary" onClick={() => setView(VIEW.BUILDER)}>
                <i className="fas fa-edit"></i> Edit
              </button>
              <button className="btn btn-primary" style={{ background: styles.gradient }} onClick={() => setShowPublishModal(true)}>
                <i className="fas fa-share"></i> {isPublic ? 'Share' : 'Publish'}
              </button>
            </div>
          </div>
          
          {/* Profile Hero with Photo Support */}
          <div className="glass-card profile-hero" style={{ borderTop: '4px solid ' + styles.accent }}>
            {profilePhoto ? (
              <div style={{
                width: '130px',
                height: '130px',
                margin: '0 auto 24px',
                borderRadius: '32px',
                overflow: 'hidden',
                border: '4px solid ' + styles.accent,
                boxShadow: '0 20px 50px ' + styles.accent + '40'
              }}>
                <img src={profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div className="profile-avatar" style={{ background: styles.gradient }}>
                {profile.basics.name
                  ? profile.basics.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                  : '?'}
              </div>
            )}
            <h1 className="profile-name">{profile.basics.name || 'Your Name'}</h1>
            <p className="profile-title" style={{ color: styles.accent }}>{profile.basics.title || 'Your Title'}</p>
            <p className="profile-tagline">{profile.basics.tagline || 'Your professional tagline'}</p>
            
            {profile.basics.summary && (
              <p style={{ 
                color: 'rgba(255,255,255,0.6)', 
                maxWidth: '600px', 
                margin: '18px auto 0', 
                fontSize: '14px',
                lineHeight: '1.8',
                fontStyle: 'italic'
              }}>
                "{profile.basics.summary}"
              </p>
            )}
            
            {/* Contact Info */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', justifyContent: 'center', marginTop: '28px' }}>
              {profile.basics.email && (
                <a href={'mailto:' + profile.basics.email} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '13px', textDecoration: 'none' }}>
                  <i className="fas fa-envelope" style={{ color: styles.accent }}></i>
                  {profile.basics.email}
                </a>
              )}
              {profile.basics.phone && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                  <i className="fas fa-phone" style={{ color: styles.accent }}></i>
                  {profile.basics.phone}
                </span>
              )}
              {profile.basics.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                  <i className="fas fa-map-marker-alt" style={{ color: styles.accent }}></i>
                  {profile.basics.location}
                </span>
              )}
              {profile.basics.linkedin && (
                <a href={'https://' + profile.basics.linkedin.replace(/^https?:\\/\\//, '')} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '13px', textDecoration: 'none' }}>
                  <i className="fab fa-linkedin" style={{ color: styles.accent }}></i>
                  LinkedIn
                </a>
              )}
            </div>
            
            {profile.skills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '28px' }}>
                {profile.skills.slice(0, 10).map((skill, idx) => (
                  <span key={idx} style={{
                    padding: '8px 16px',
                    background: styles.accent + '15',
                    border: '1px solid ' + styles.accent + '30',
                    borderRadius: '100px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: styles.accent
                  }}>{skill}</span>
                ))}
                {profile.skills.length > 10 && (
                  <span style={{
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '100px',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.4)'
                  }}>+{profile.skills.length - 10} more</span>
                )}
              </div>
            )}
          </div>
          
          {/* Career Timeline */}
          {profile.experience.length > 0 && (
            <div className="glass-card" style={{ padding: '28px', marginTop: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '28px', color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                <i className="fas fa-briefcase" style={{ marginRight: '14px', color: styles.accent }}></i>
                Career Timeline
              </h2>
              
              <div className="timeline-wrap" style={{ '--timeline-color': styles.accent }}>
                {profile.experience.map((exp, idx) => {
                  const displayLogo = exp.customLogo || exp.logoUrl;
                  return (
                  <div key={exp.id} className="glass timeline-item">
                    {/* Company Header with Logo */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                      {displayLogo && (
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '12px',
                          background: '#fff',
                          border: '2px solid rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}>
                          <img 
                            src={displayLogo} 
                            onError={(e) => e.target.style.display = 'none'}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} 
                          />
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <h3 className="timeline-company" style={{ marginBottom: '4px' }}>{exp.company || 'Company'}</h3>
                        <p className="timeline-role" style={{ color: styles.accent, marginBottom: '8px' }}>{exp.role || 'Role'}</p>
                        <span className="timeline-dates" style={{ background: styles.accent + '15', borderColor: styles.accent + '30', color: styles.accent }}>
                          {exp.startDate || 'Start'} — {exp.endDate || 'End'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Company Info Badge */}
                    {exp.companyInfo && (exp.companyInfo.industry || exp.companyInfo.location) && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                        {exp.companyInfo.industry && (
                          <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                            <i className="fas fa-industry" style={{ marginRight: '6px' }}></i>{exp.companyInfo.industry}
                          </span>
                        )}
                        {exp.companyInfo.location && (
                          <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                            <i className="fas fa-map-marker-alt" style={{ marginRight: '6px' }}></i>{exp.companyInfo.location}
                          </span>
                        )}
                        {exp.companyInfo.size && (
                          <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                            <i className="fas fa-users" style={{ marginRight: '6px' }}></i>{exp.companyInfo.size}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <p className="timeline-desc">{exp.description || 'Description of your role and achievements'}</p>
                    
                    {/* Responsibilities */}
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <div style={{ marginTop: '18px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '600', color: styles.accent, marginBottom: '12px' }}>
                          <i className="fas fa-tasks" style={{ marginRight: '8px' }}></i>
                          Key Responsibilities
                        </h4>
                        <ul style={{ paddingLeft: '20px', color: 'rgba(255,255,255,0.55)', fontSize: '13px', lineHeight: '1.8' }}>
                          {exp.responsibilities.slice(0, 6).map((resp, ridx) => (
                            <li key={ridx} style={{ marginBottom: '6px' }}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Day in Life */}
                    {exp.dayInLife && exp.dayInLife.some(d => d.activity) && (
                      <div style={{ marginTop: '18px', padding: '16px', background: styles.accent + '08', borderRadius: '12px', border: '1px solid ' + styles.accent + '15' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '600', color: styles.accent, marginBottom: '14px' }}>
                          <i className="fas fa-sun" style={{ marginRight: '8px' }}></i>
                          A Day in This Role
                        </h4>
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {exp.dayInLife.filter(d => d.activity).map((day, didx) => (
                            <div key={didx} style={{ display: 'flex', gap: '14px', fontSize: '12px' }}>
                              <span style={{ color: styles.accent, fontWeight: '600', width: '70px', flexShrink: 0 }}>{day.time}</span>
                              <span style={{ color: 'rgba(255,255,255,0.55)' }}>{day.activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {exp.metrics?.some(m => m.value) && (
                      <div className="timeline-metrics">
                        {exp.metrics.filter(m => m.value).map((metric, midx) => (
                          <div key={midx} className="timeline-metric" style={{ background: styles.accent + '10', borderColor: styles.accent + '20' }}>
                            <div className="timeline-metric-val" style={{ color: styles.accent }}>{metric.value}</div>
                            <div className="timeline-metric-label">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Education Section */}
          {profile.education && profile.education.length > 0 && (
            <div className="glass-card" style={{ padding: '28px', marginTop: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '28px', color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                <i className="fas fa-graduation-cap" style={{ marginRight: '14px', color: styles.accent }}></i>
                Education
              </h2>
              <div style={{ display: 'grid', gap: '18px' }}>
                {profile.education.map((edu, idx) => (
                  <div key={edu.id || idx} style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '14px', borderLeft: '4px solid ' + styles.accent }}>
                    <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>{edu.degree || 'Degree'}</h3>
                    <p style={{ fontSize: '14px', color: styles.accent, marginBottom: '8px' }}>{edu.school || 'School'} • {edu.year || 'Year'}</p>
                    {edu.details && <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{edu.details}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Achievements Section */}
          {profile.achievements && profile.achievements.length > 0 && (
            <div className="glass-card" style={{ padding: '28px', marginTop: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '28px', color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                <i className="fas fa-trophy" style={{ marginRight: '14px', color: styles.accent }}></i>
                Achievements
              </h2>
              <div style={{ display: 'grid', gap: '18px' }}>
                {profile.achievements.map((ach, idx) => (
                  <div key={ach.id || idx} style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '14px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
                      <i className="fas fa-star" style={{ marginRight: '10px', color: styles.accent, fontSize: '14px' }}></i>
                      {ach.title || 'Achievement'}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.7' }}>{ach.description || 'Description'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    };
    
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>`)
})

export default app
