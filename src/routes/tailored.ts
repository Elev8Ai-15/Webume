import { Hono } from 'hono'
import type { AppEnv } from '../types'
import { getCurrentUser } from '../lib/auth'
import { auditLog } from '../lib/security'
import { isPremiumUser, getGeminiApiKey } from '../lib/helpers'

const tailored = new Hono<AppEnv>()

// Get user's tailored resumes
tailored.get('/tailored-resumes', async (c) => {
  const user = await getCurrentUser(c)
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401)
  }

  const tailoredResumes = user.tailoredResumes || []
  return c.json({ resumes: tailoredResumes })
})

// Save a tailored resume
tailored.post('/tailored-resumes/save', async (c) => {
  const user = await getCurrentUser(c)
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401)
  }

  if (!isPremiumUser(user)) {
    return c.json({
      error: 'Premium feature',
      message: 'AI Resume Tailoring requires a Pro or Enterprise subscription',
      upgradeUrl: '/pricing'
    }, 403)
  }

  try {
    const { tailoredResume } = await c.req.json()

    if (!tailoredResume || !tailoredResume.jobTitle || !tailoredResume.company) {
      return c.json({ error: 'Invalid tailored resume data' }, 400)
    }

    if (!user.tailoredResumes) {
      user.tailoredResumes = []
    }

    const newResume = {
      id: Date.now(),
      ...tailoredResume,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (user.tailoredResumes.length >= 50) {
      user.tailoredResumes = user.tailoredResumes.slice(-49)
    }

    user.tailoredResumes.push(newResume)

    await c.env.USERS_KV.put(`user:${user.email.toLowerCase()}`, JSON.stringify(user))
    await auditLog(c, 'TAILORED_RESUME_SAVED', user.email, { jobTitle: tailoredResume.jobTitle, company: tailoredResume.company })

    return c.json({ success: true, resume: newResume })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Delete a tailored resume
tailored.delete('/tailored-resumes/:id', async (c) => {
  const user = await getCurrentUser(c)
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401)
  }

  const id = parseInt(c.req.param('id'))

  if (!user.tailoredResumes) {
    return c.json({ error: 'No tailored resumes found' }, 404)
  }

  user.tailoredResumes = user.tailoredResumes.filter((r: any) => r.id !== id)
  await c.env.USERS_KV.put(`user:${user.email.toLowerCase()}`, JSON.stringify(user))

  return c.json({ success: true })
})

// AI Resume Tailor - Generate tailored resume for specific job
tailored.post('/tailor-resume', async (c) => {
  const user = await getCurrentUser(c)
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401)
  }

  if (!isPremiumUser(user)) {
    return c.json({
      error: 'Premium feature',
      message: 'AI Resume Tailoring requires a Pro or Enterprise subscription. Upgrade now to create unlimited tailored resumes for every job application!',
      upgradeUrl: '/pricing',
      plans: {
        pro: { price: '$9.99/mo', features: ['Unlimited Tailored Resumes', 'All 10 Templates', 'PDF Export'] },
        enterprise: { price: '$29.99/mo', features: ['Everything in Pro', 'Team Management', 'API Access'] }
      }
    }, 403)
  }

  try {
    const { jobDescription, jobTitle, company, jobUrl } = await c.req.json()
    const apiKey = getGeminiApiKey(c)

    if (!jobDescription) {
      return c.json({ error: 'Job description is required' }, 400)
    }

    if (!user.profile) {
      return c.json({ error: 'Please complete your master profile first before tailoring resumes' }, 400)
    }

    const masterProfile = user.profile

    const prompt = `You are an elite executive resume writer, career strategist, and ATS optimization expert. Your task is to create a PERFECTLY TAILORED resume that maximizes this candidate's chances of getting an interview.

## THE TARGET JOB
Job Title: ${jobTitle || 'Not specified'}
Company: ${company || 'Not specified'}
Job Description:
${jobDescription}

## THE CANDIDATE'S MASTER PROFILE
${JSON.stringify(masterProfile, null, 2)}

## YOUR MISSION
Create a tailored version of this candidate's resume that:

1. **KEYWORD OPTIMIZATION** (Critical for ATS):
   - Extract ALL keywords, skills, and requirements from the job description
   - Naturally incorporate these keywords throughout the resume
   - Match the exact terminology used in the job posting
   - Include both hard skills and soft skills mentioned

2. **EXPERIENCE REFRAMING**:
   - Reorder and prioritize experiences most relevant to this role
   - Rewrite bullet points to emphasize transferable skills
   - Add context that connects past work to this job's requirements
   - Quantify achievements where possible (%, $, numbers)

3. **SUMMARY CUSTOMIZATION**:
   - Write a new professional summary specifically targeting this role
   - Lead with the most relevant qualifications
   - Include 2-3 key achievements that match job requirements
   - Use power words that resonate with this industry

4. **SKILLS PRIORITIZATION**:
   - Reorder skills to put most relevant ones first
   - Add any skills from job description that candidate has but didn't list
   - Group skills by category if helpful

5. **MATCH ANALYSIS**:
   - Calculate a match score (0-100) based on keyword and requirement overlap
   - List the top 10 matching keywords/skills
   - Identify any gaps or areas to address in cover letter

Return a JSON object with this structure:
{
  "tailoredProfile": {
    "basics": {
      "name": "...",
      "title": "Tailored title matching job",
      "tagline": "Compelling tagline for this specific role",
      "summary": "3-4 sentence summary targeting this job",
      "email": "...",
      "phone": "...",
      "location": "..."
    },
    "experience": [
      {
        "company": "...",
        "role": "...",
        "startDate": "...",
        "endDate": "...",
        "description": "Rewritten to emphasize relevance",
        "highlights": ["Achievement 1 with metrics", "Achievement 2", "..."],
        "relevanceScore": 85
      }
    ],
    "skills": ["Most relevant skill", "Second most relevant", "..."],
    "education": [...],
    "certifications": [...]
  },
  "matchAnalysis": {
    "overallScore": 85,
    "matchedKeywords": ["keyword1", "keyword2", "..."],
    "missingKeywords": ["keyword they want but candidate lacks"],
    "strengths": ["Top strength for this role", "..."],
    "suggestions": ["Consider mentioning X in interview", "..."]
  },
  "coverLetterHints": [
    "Address the X requirement by discussing...",
    "Emphasize your experience with Y...",
    "..."
  ],
  "interviewTips": [
    "Be prepared to discuss your experience with...",
    "Have specific examples ready for...",
    "..."
  ]
}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          }
        })
      }
    )

    const data: any = await response.json()
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!aiText) {
      return c.json({ error: 'AI failed to generate tailored resume' }, 500)
    }

    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0])

        result.metadata = {
          jobTitle: jobTitle || 'Unknown Position',
          company: company || 'Unknown Company',
          jobUrl: jobUrl || null,
          createdAt: new Date().toISOString(),
          originalJobDescription: jobDescription.substring(0, 500) + '...'
        }

        await auditLog(c, 'RESUME_TAILORED', user.email, {
          jobTitle: result.metadata.jobTitle,
          company: result.metadata.company,
          matchScore: result.matchAnalysis?.overallScore
        })

        return c.json(result)
      }
    } catch (_parseError) {
      return c.json({
        error: 'Failed to parse AI response',
        raw: aiText
      }, 500)
    }

    return c.json({ error: 'Invalid AI response format' }, 500)

  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

export default tailored
