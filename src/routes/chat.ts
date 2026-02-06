import { Hono } from 'hono'
import type { AppEnv } from '../types'
import { getCurrentUser } from '../lib/auth'
import { getGeminiApiKey } from '../lib/helpers'
import { WEBUME_KNOWLEDGEBASE } from './knowledgebase'

const chat = new Hono<AppEnv>()

chat.post('/chat', async (c) => {
  const user = await getCurrentUser(c)

  try {
    const { message, context, profile, conversationHistory } = await c.req.json()

    if (!message?.trim()) {
      return c.json({ error: 'Message is required' }, 400)
    }

    let historyContext = ''
    if (conversationHistory && conversationHistory.length > 0) {
      historyContext = '\n\nRECENT CONVERSATION (use this to understand references like "option 2", "the second one", etc.):\n'
      const recentMessages = conversationHistory.slice(-6)
      recentMessages.forEach((msg: { role: string; content: string }) => {
        historyContext += (msg.role === 'user' ? 'User: ' : 'Assistant: ') + msg.content + '\n'
      })
    }

    let userContext = ''
    if (user) {
      userContext += 'User is logged in as: ' + user.name + ' (' + user.email + ')\n'
      userContext += 'Subscription: ' + (user.subscription?.planId || 'free') + '\n'
    } else {
      userContext += 'User is not logged in.\n'
    }

    if (context?.view) {
      const viewNames: Record<number, string> = { 0: 'Login/Register', 1: 'Upload Resume', 2: 'Profile Builder', 3: 'Preview', 4: 'AI Tailor' }
      userContext += 'Current page: ' + (viewNames[context.view] || 'Unknown') + '\n'
    }

    if (profile) {
      userContext += '\nUser Profile Summary:\n'
      if (profile.basics?.name) userContext += '- Name: ' + profile.basics.name + '\n'
      if (profile.basics?.title) userContext += '- Title: ' + profile.basics.title + '\n'
      if (profile.experience?.length) userContext += '- Experiences: ' + profile.experience.length + ' jobs\n'
      if (profile.skills?.length) userContext += '- Skills: ' + profile.skills.length + ' skills\n'
      if (profile.achievements?.length) userContext += '- Achievements: ' + profile.achievements.length + '\n'
      if (profile.education?.length) userContext += '- Education: ' + profile.education.length + ' entries\n'
    }

    const systemPrompt = 'You are WebUME Assistant, a proactive AI that helps users build their digital resume profile. You take ACTION immediately without asking for confirmation.\n\n' +
      'CRITICAL RULES:\n' +
      '1. When user asks to add/change/update ANYTHING in their profile, DO IT IMMEDIATELY with an action block\n' +
      '2. DO NOT ask for confirmation - just do it and tell them what you did\n' +
      '3. If user says "add my tagline" or "update my title" - CREATE appropriate content for them based on their profile\n' +
      '4. If user references "option 1", "option 2", "the second one", etc. from a previous message, use that content\n' +
      '5. Be creative and write professional content when user asks you to "add" or "create" something\n' +
      '6. Keep responses SHORT - just confirm what you did\n\n' +
      'ACTION FORMAT - Always include this JSON block when making changes:\n' +
      '```action\n{"type": "edit_profile", "section": "basics|experience|skills|achievements|education|awards", "action": "update|add|delete", "data": {...}}\n```\n\n' +
      'SECTION FIELDS:\n' +
      '- basics: name, title, tagline, summary, contact.email, contact.phone, contact.location, contact.linkedin\n' +
      '- skills: name, category (Technical/Soft/Language/Tool), level\n' +
      '- achievements: title, description\n' +
      '- education: degree, school, year, details\n' +
      '- experience: employer, title, startDate, endDate, description, responsibilities[]\n\n' +
      'EXAMPLES OF IMMEDIATE ACTION:\n' +
      'User: "Add a tagline for me" → You CREATE a professional tagline based on their profile and add it\n' +
      'User: "Add option 2" → You use the content from option 2 you previously mentioned\n' +
      'User: "Update my summary" → You WRITE a new professional summary and add it\n' +
      'User: "Add React to my skills" → You add React as a Technical skill immediately\n\n' +
      'NEVER SAY: "Would you like me to...", "Should I...", "Do you want me to..."\n' +
      'ALWAYS SAY: "Done!", "I have added...", "Updated your..."\n\n' +
      'KNOWLEDGE BASE:\n' + WEBUME_KNOWLEDGEBASE + '\n\n' +
      'CURRENT USER CONTEXT:\n' + userContext + historyContext

    const apiKey = getGeminiApiKey(c)

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt + '\n\nUser message: ' + message }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024
          }
        })
      }
    )

    const data: any = await response.json()
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    const actionMatch = aiText.match(/```action\n([\s\S]*?)```/)
    let action = null
    let textResponse = aiText

    if (actionMatch) {
      try {
        action = JSON.parse(actionMatch[1])
        textResponse = aiText.replace(/```action[\s\S]*?```/g, '').trim()
      } catch (_e) {
        // Invalid JSON, ignore action
      }
    }

    return c.json({
      response: textResponse,
      action
    })

  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

export default chat
