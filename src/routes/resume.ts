import { Hono } from 'hono'
import type { AppEnv } from '../types'
import { getGeminiApiKey } from '../lib/helpers'

const resume = new Hono<AppEnv>()

// ATS Score Analysis
resume.post('/ats-score', async (c) => {
  try {
    const { profile } = await c.req.json()

    if (!profile) {
      return c.json({ error: 'Profile is required' }, 400)
    }

    const commonKeywords = [
      'leadership', 'management', 'strategy', 'analytics', 'communication',
      'project management', 'team', 'budget', 'revenue', 'growth',
      'development', 'implementation', 'optimization', 'collaboration',
      'stakeholder', 'presentation', 'reporting', 'analysis', 'planning'
    ]

    const profileText = JSON.stringify(profile).toLowerCase()
    const skills = profile.skills || []

    let score = 0
    const matches: string[] = []
    const missing: string[] = []

    commonKeywords.forEach(keyword => {
      if (profileText.includes(keyword.toLowerCase())) {
        score += 5
        matches.push(keyword)
      } else {
        missing.push(keyword)
      }
    })

    if (profile.basics?.name) score += 5
    if (profile.basics?.email) score += 5
    if (profile.basics?.phone) score += 3
    if (profile.basics?.summary && profile.basics.summary.length > 100) score += 10
    if (profile.experience?.length > 0) score += 15
    if (profile.experience?.length > 2) score += 5
    if (skills.length >= 5) score += 10
    if (skills.length >= 10) score += 5
    if (profile.education?.length > 0) score += 5
    if (profile.achievements?.length > 0) score += 5

    score = Math.min(100, score)

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
    })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Parse resume with AI
resume.post('/parse-resume', async (c) => {
  try {
    const { text } = await c.req.json()
    const apiKey = getGeminiApiKey(c)

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
- Use empty string "" for missing fields, NEVER null`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 8192 }
        })
      }
    )

    const data: any = await response.json()
    if (data.error) return c.json({ error: data.error.message }, 500)

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    if (!aiText) return c.json({ error: 'No response from AI' }, 500)

    try {
      let jsonStr = aiText
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/gi, '')
        .replace(/\n?```/gi, '')
        .trim()

      if (!jsonStr.startsWith('{')) {
        const match = jsonStr.match(/\{[\s\S]*\}/)
        if (match) jsonStr = match[0]
      }

      const parsed = JSON.parse(jsonStr)
      return c.json(parsed)
    } catch (_e) {
      try {
        const match = aiText.match(/\{[\s\S]*\}/)
        if (match) {
          return c.json(JSON.parse(match[0]))
        }
      } catch {}
      return c.json({ error: 'Parse failed', raw: aiText }, 500)
    }
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

export default resume
