# Manus Prompt — Fix Assessment Email Notifications

## Copy/paste this EXACTLY into Manus (on the elev8ai.org project)

---

## TASK: Fix assessment form completion emails not being received

The assessment form saves to DB but the completion email to the owner (powellb.elev8ai@gmail.com) never arrives. The "started" notification works fine — only the completion email fails. Root cause: the frontend 4-question form sends different field names than what the backend `sendAssessmentReport()` expects, causing undefined values that break the email.

### THE PROBLEM (do NOT re-investigate — this is confirmed)

File: `server/routers/assessment.ts`

The submit handler at ~line 89 calls `sendAssessmentReport()` with fields like:
- `input.companyName` — but the frontend form does NOT collect company name
- `input.industry` — not collected
- `input.responses.q2_primary_bottleneck` — frontend sends as `biggest_headache`
- `input.responses.q3_time_consuming_task` — frontend sends as `time_consuming_task`

These undefined values cause `sendAssessmentReport()` in `server/_core/email.ts` to either crash silently or produce a broken email.

### EXACTLY WHAT TO FIX

**Step 1:** In `server/routers/assessment.ts`, update the submit procedure's input schema to match what the frontend ACTUALLY sends:
- `name` (string, required)
- `email` (string, required)
- `biggest_headache` (string, required)
- `time_consuming_task` (string, required)
- `phone` (string, optional)

**Step 2:** Update the DB insert to map these fields:
- `contactName` = input.name
- `contactEmail` = input.email
- `companyName` = "Not provided"
- `industry` = "Not provided"
- `responses` = JSON.stringify({ biggest_headache: input.biggest_headache, time_consuming_task: input.time_consuming_task })

**Step 3:** Update the `sendAssessmentReport()` call (~line 89) to pass the mapped values so no field is undefined:
```
const emailSent = await sendAssessmentReport({
  companyName: input.name + "'s Business",
  contactName: input.name,
  contactEmail: input.email,
  contactPhone: input.phone || '',
  industry: 'Not specified',
  responses: {
    biggestBottleneck: input.biggest_headache,
    biggestHeadache: input.time_consuming_task,
    budget: 'Not specified',
    aiGoal: 'Not specified',
  },
  recommendations,
});
```

**Step 4:** In `server/_core/email.ts`, add null-safety to the `sendAssessmentReport` function — wrap undefined values with `|| 'Not provided'` so the email template never shows "undefined".

**Step 5:** Also update the `sendAssessmentNotifications()` SMS call (~line 114) with the same mapped field names.

### CRITICAL RULES
- Do NOT change the frontend form — keep it as 4 questions
- Do NOT change the database schema
- Do NOT change the email template structure — just ensure no undefined values reach it
- Do NOT add new features or refactor unrelated code
- After fixing, publish immediately
- Test by submitting the assessment form and confirming the email arrives at powellb.elev8ai@gmail.com

### ALSO FIX (while you're in there)
- Update the LockUp link on the homepage from whatever it currently points to → `https://lockup-security.vercel.app/`
- Search all files for the old LockUp URL and replace every occurrence

### VERIFY
1. Submit test assessment with name "Test Fix" and email "powellb.elev8ai@gmail.com"
2. Confirm email arrives
3. Check DB that the entry saved correctly
4. Confirm LockUp link on homepage goes to https://lockup-security.vercel.app/

---
