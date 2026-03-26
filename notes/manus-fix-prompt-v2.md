# Manus Fix Prompt v2 — Paste This EXACTLY Into Manus
## Date: March 24, 2026
## IMPORTANT: Use Manus 1.6 Lite if possible to save credits!

---

## PASTE BELOW THIS LINE:

CRITICAL: Be token-efficient. No explanations needed — just fix, test, publish. Skip reading code you already analyzed in the previous task. Use your knowledge recall from task CoEjvWgP63WaKcSkkd2002.

## TASK: Finish the 5 remaining fixes from your last audit (task stopped at step 2/7)

You already fixed:
- Victoria chatbot field mapping (answer indices)
- saveConversationLog function alignment
- Added notifyOwner() to assessment.ts and leads.ts
- All 260 tests passed

## NOW DO THESE 5 THINGS ONLY:

### 1. Fix Victoria chatbot — save contact info to leads table
- After chatbot colletes name/email/phone, INSERT a row into the leads table
- Use the existing leads router pattern
- Make sure userName and userEmail fields are populated from correct QUESTIONS indices

### 2. Add notifyOwner() call to Victoria chatbot completion
- When a chatbot conversation completes with contact info, call notifyOwner()
- Include name, email, phone, and conversation summary in the notification

### 3. Fix broken Calendly embed on /assessment page
- The Calendly iframe shows "404 Page not found"
- Either fix the Calendly URL or remove the broken embed entirely
- If removing, keep the "Ready to Talk?" section text but remove the iframe

### 4. Fix /admin route — currently returns 404
- The admin dashboard at /admin is broken
- Restore it or check if the route was accidentally removed

### 5. Update LockUp link on the homepage
- The LockUp product/service link on the landing page currently points to the old build URL
- Change it to: https://lockup-security.vercel.app/
- Check ALL pages for any other references to the old LockUp URL and update those too

### 6. PUBLISH all changes to production, then test these things on the LIVE site:
- Submit the assessment form with test data — verify it saves
- Open Victoria chatbot, complete a full conversation — verify contact info saves
- Check /admin loads

## RULES TO SAVE CREDITS:
- Do NOT re-read files you already read in the previous task — use knowledge recall
- Do NOT write explanations or summaries — just fix and move on
- Do NOT create new files or reports — just code changes
- Do NOT run the full test suite again unless a change breaks something
- Publish ONCE at the end after all fixes, not after each change
- Skip browsing/screenshots unless absolutely necessary for verification
- If a fix requires more than 10 lines of code, you're overcomplicating it

---

## END OF PROMPT
