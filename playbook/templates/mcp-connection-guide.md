# MCP Connection Guide -- Elev8 AI Agent Swarm Service

Step-by-step guide for connecting MCP (Model Context Protocol) servers during client deployments. Follow this for every new client setup.

**Rule: Test each MCP immediately after connection. If one fails, document the error and move on -- do not block the entire deployment.**

---

## General Rules

- All MCP configs go in Claude Code settings (Settings > MCP Servers), never in plaintext files
- Use OAuth tokens or app passwords only -- NEVER raw passwords
- Document which MCPs are connected in the client's `CLAUDE.md` under a `## Connected Tools` section
- After all MCPs are connected, do a final round of verification tests

---

## 1. Gmail MCP

### What It Enables
- Read and search emails
- Draft and send emails (with user confirmation)
- List labels and threads

### Prerequisites
- Client's Gmail account
- OAuth token or Google App Password configured
- Gmail API enabled in Google Cloud Console (if using OAuth)

### Setup Steps

1. **Create credentials**
   - Option A (OAuth): Set up OAuth 2.0 credentials in Google Cloud Console > APIs & Services > Credentials. Enable the Gmail API. Generate a refresh token.
   - Option B (App Password): Client goes to Google Account > Security > 2-Step Verification > App Passwords. Generate an app password for "Mail."

2. **Add to Claude Code MCP config**
   - Open Claude Code settings
   - Add the Gmail MCP server with the OAuth token or app password
   - Set scopes: `gmail.readonly`, `gmail.compose`, `gmail.send` (adjust per client needs)

3. **Configure account targeting**
   - Confirm the correct email address is connected (not a secondary account)
   - Set the `from` address if the client uses aliases

### Verification Test

Run this prompt after connection:
```
Search my last 5 emails
```
**Expected result:** Returns 5 recent emails with subject, sender, and date. Confirm the emails match the correct account.

### Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| "Token expired" or "Invalid credentials" | OAuth token expired | Re-authenticate and generate a new refresh token |
| Wrong emails showing up | Connected to wrong Google account | Remove the MCP, re-add with correct account credentials |
| "Permission denied" or 403 error | Gmail API not enabled or insufficient scopes | Enable Gmail API in Cloud Console; check OAuth scopes include `gmail.readonly` |
| "Rate limit exceeded" | Too many requests in short period | Wait 60 seconds, retry. For high-volume clients, request quota increase in Cloud Console |

---

## 2. Google Calendar MCP

### What It Enables
- View upcoming events and schedules
- Create and update calendar events
- Find free/busy times
- RSVP to invitations

### Prerequisites
- Client's Google account with Calendar access
- OAuth token with calendar scopes
- Google Calendar API enabled in Google Cloud Console

### Setup Steps

1. **Create credentials**
   - Use the same Google Cloud project as Gmail (if applicable)
   - Enable the Google Calendar API
   - OAuth scopes needed: `calendar.readonly`, `calendar.events` (for read-write)

2. **Add to Claude Code MCP config**
   - Open Claude Code settings
   - Add the Google Calendar MCP server with OAuth credentials
   - Specify the target calendar ID (usually the client's primary email)

3. **Select the correct calendar**
   - List all calendars after connection to confirm which is primary
   - If the client uses shared/team calendars, note which ones to include
   - Set default calendar for event creation

### Verification Test

Run this prompt after connection:
```
What's on my calendar today?
```
**Expected result:** Returns today's events with times, titles, and locations. If the calendar is empty, try "What's on my calendar this week?" instead.

### Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Shows wrong calendar | Default calendar ID incorrect | List all calendars, update config to use the correct calendar ID |
| "Cannot create events" | Read-only permissions | Update OAuth scopes to include `calendar.events` (not just `calendar.readonly`) |
| Events missing | Shared calendar not included | Add shared calendar IDs to the MCP config |
| Timezone mismatch | Calendar timezone differs from client timezone | Set timezone explicitly in the MCP config to match client's local timezone |

---

## 3. Google Drive MCP

### What It Enables
- Search files and folders
- Read document contents
- Organize and move files
- Access shared drives

### Prerequisites
- Client's Google account with Drive access
- OAuth token with Drive scopes
- Google Drive API enabled in Google Cloud Console

### Setup Steps

1. **Create credentials**
   - Use the same Google Cloud project as Gmail/Calendar
   - Enable the Google Drive API
   - OAuth scopes needed: `drive.readonly` (minimum) or `drive.file` (for read-write)

2. **Add to Claude Code MCP config**
   - Open Claude Code settings
   - Add the Google Drive MCP server with OAuth credentials

3. **Configure drive scope**
   - Determine if client needs personal drive, shared drives, or both
   - If shared drives: enable `supportsAllDrives` in the MCP config
   - Note any folders the client wants excluded from search

### Verification Test

Run this prompt after connection:
```
Find my most recent document
```
**Expected result:** Returns the most recently modified file with name, type, and last modified date. Confirm it matches a real file the client recognizes.

### Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| "No files found" | Searching personal drive but files are in shared drive | Enable shared drive support in MCP config |
| "Permission denied" on a file | File owned by another user, not shared | Client needs to share the file/folder with the connected account |
| Can read but not modify files | `drive.readonly` scope | Update to `drive.file` or `drive` scope for write access |
| Slow search results | Large drive with many files | Add folder ID filters to narrow the search scope |

---

## 4. Stripe MCP (Optional)

### What It Enables
- List customers, invoices, and subscriptions
- View payment history and balances
- Create payment links and products
- Manage refunds and disputes

### Prerequisites
- Client has a Stripe account
- API key from Stripe Dashboard
- **IMPORTANT: Confirm with client before connecting live mode. Start with test mode if unsure.**

### Setup Steps

1. **Get API key from Stripe**
   - Client logs into Stripe Dashboard > Developers > API Keys
   - For initial setup: use the **Restricted Key** (not the Secret Key)
   - Create a restricted key with only the permissions needed:
     - Customers: Read
     - Invoices: Read
     - Products: Read
     - Payment Links: Read + Write (if client wants to create links)
   - Copy the key (starts with `rk_live_` or `rk_test_`)

2. **Decide: Test mode vs Live mode**
   - **Test mode first**: Use `rk_test_` key for initial setup and verification
   - **Live mode**: Only switch after client explicitly confirms and signs off
   - Document which mode is active in the client's `CLAUDE.md`

3. **Add to Claude Code MCP config**
   - Open Claude Code settings
   - Add the Stripe MCP server with the restricted API key
   - Note the mode (test/live) in the config comments

### Verification Test

Run this prompt after connection:
```
List my recent invoices
```
**Expected result:** Returns recent invoices with customer name, amount, status, and date. In test mode, this may return test data or an empty list -- that is expected.

### Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Empty results in live mode | Restricted key missing read permissions | Check key permissions in Stripe Dashboard > Developers > API Keys |
| "Invalid API key" | Key copied incorrectly or revoked | Re-copy the key from Stripe Dashboard; check for trailing spaces |
| Test data showing in live context | Using `rk_test_` key instead of `rk_live_` | Switch to live key (with client confirmation) |
| "Permission denied" on create actions | Restricted key is read-only | Update key permissions to include write access for needed resources |

**WARNING:** Live mode Stripe access can process real payments and refunds. Always confirm with the client before connecting live mode, and document their approval.

---

## 5. Notion MCP (Optional)

### What It Enables
- Search pages and databases
- Create and update pages
- Read database entries
- Add comments to pages

### Prerequisites
- Client has a Notion workspace
- Internal integration token created
- Pages/databases shared with the integration

### Setup Steps

1. **Create Notion integration**
   - Client goes to https://www.notion.so/my-integrations
   - Click "New integration"
   - Name it something clear: "Elev8 AI Assistant"
   - Select the client's workspace
   - Set capabilities: Read content, Update content, Insert content
   - Copy the integration token (starts with `ntn_`)

2. **Share pages with the integration**
   - This is the step most people miss
   - Client must go to each top-level page or database they want accessible
   - Click "..." menu > "Connections" > Add the "Elev8 AI Assistant" integration
   - Child pages inherit access from parent pages

3. **Add to Claude Code MCP config**
   - Open Claude Code settings
   - Add the Notion MCP server with the integration token

### Verification Test

Run this prompt after connection:
```
Search my Notion workspace
```
**Expected result:** Returns a list of accessible pages and databases. If empty, the most likely issue is that pages have not been shared with the integration (see step 2).

### Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| "No results" on search | Pages not shared with integration | Client must add the integration connection to each top-level page |
| "Unauthorized" or 401 error | Invalid or expired token | Generate a new integration token at notion.so/my-integrations |
| Can read but not edit | Integration capabilities set to read-only | Update integration settings to include Update and Insert content |
| Missing database entries | Database not shared with integration | Share the database (not just the parent page) with the integration |

---

## Post-Connection Checklist

After connecting all MCPs for a client, complete this checklist:

- [ ] Each connected MCP passed its verification test
- [ ] Failed MCPs documented with error details (to revisit later)
- [ ] Client's `CLAUDE.md` updated with a `## Connected Tools` section listing:
  - Which MCPs are active
  - Which mode (test/live for Stripe)
  - Any known limitations or excluded scopes
- [ ] All credentials stored in Claude Code settings (not in plaintext anywhere)
- [ ] Client informed which tools are connected and what they can do

### Example CLAUDE.md Entry

```markdown
## Connected Tools
- Gmail MCP: Read/search/draft (powellb.elev8ai@gmail.com)
- Google Calendar MCP: Read/write (primary calendar)
- Google Drive MCP: Read-only (personal drive)
- Stripe MCP: Read-only, LIVE mode (confirmed 2026-03-26)
- Notion MCP: Read/write (shared workspace pages only)
```

---

*Last updated: 2026-03-26 | Elev8 AI Solutions & Services*
