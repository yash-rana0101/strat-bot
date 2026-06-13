# Strat AI — Deployment Checklist

## Prerequisites

- [ ] Node.js 20+ installed
- [ ] Discord account with server creation permission
- [ ] Discord Developer Portal access

---

## Step 1: Create Discord Application

1. Go to https://discord.com/developers/applications
2. Click "New Application" → Name: **Strat AI**
3. Go to **Bot** section:
   - Click "Add Bot"
   - Copy the **Bot Token**
   - Enable these Privileged Gateway Intents:
     - ✅ Presence Intent
     - ✅ Server Members Intent
     - ✅ Message Content Intent
4. Go to **OAuth2** → **URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Bot Permissions: `Administrator`
   - Copy the generated URL
5. Open the URL in browser → Select your server → Authorize
6. Go to **General Information** page:
   - Terms of Service URL: Paste `https://stratai.live/terms-of-service`
   - Privacy Policy URL: Paste `https://stratai.live/privacy-policy`
   - (Optional) Paste **Interactions Endpoint URL** and **Linked Roles Verification URL** if utilizing these services.

---

## Step 2: Create Discord Server

1. Create a new Discord server (blank template)
2. Name it: **Strat AI**
3. Copy the **Server ID** (enable Developer Mode in Settings → Advanced)
4. Copy the **Application/Client ID** from the Developer Portal

---

## Step 3: Configure Environment

```bash
cd d:\projects\discord-creator
copy .env.example .env
```

Edit `.env`:
```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_client_id
GUILD_ID=your_server_id

# Database Connection URL (Supabase direct postgres:// link)
DATABASE_URL=your_direct_postgres_url_here

LOG_LEVEL=info
BOT_STATUS=stratai.live | Market Intelligence

# Discord Application URLs
INTERACTIONS_ENDPOINT_URL=
LINKED_ROLES_VERIFICATION_URL=
TERMS_OF_SERVICE_URL=https://stratai.live/terms-of-service
PRIVACY_POLICY_URL=https://stratai.live/privacy-policy
```

---

## Step 4: Install and Build

```bash
npm install
npm run build
```

---

## Step 5: Register Commands

```bash
npm run deploy:commands
```

Verify: You should see "Registering X slash commands... Slash commands registered successfully"

---

## Step 6: Start the Bot

### Option A: Development Mode
```bash
npm run dev
```

### Option B: Production Mode
```bash
npm run build
npm start
```

### Option C: Docker
```bash
docker-compose up -d
```

---

## Step 7: Deploy Server Infrastructure

In your Discord server, run:

```
/deploy confirm:True
```

This creates:
- ✅ 10 roles with correct hierarchy
- ✅ 7 categories
- ✅ 37 text channels with permissions
- ✅ 4 voice channels

---

## Step 8: Set Up Systems

Run these commands in order:

```
/setup-rules
```
→ Posts rules + verification button to #rules

```
/setup-welcome
```
→ Posts welcome embed to #welcome

```
/setup-tickets
```
→ Posts ticket panel to #create-ticket

```
/setup-automod
```
→ Creates 4 AutoMod rules

---

## Step 9: Enable Community Mode (Manual)

1. Server Settings → Enable Community
2. Set Rules channel: #rules
3. Set Community Updates channel: #announcements
4. Complete safety setup

---

## Step 10: Final Verification

- [ ] Bot is online with "Watching stratai.live" status
- [ ] All categories and channels are visible
- [ ] Role hierarchy is correct (Founder at top)
- [ ] #rules has rules embed + verify button
- [ ] Clicking verify removes Unverified and adds Member role
- [ ] #welcome has welcome embed
- [ ] #create-ticket has ticket panel with 5 buttons
- [ ] Creating a ticket makes a private channel
- [ ] Closing a ticket deletes the channel
- [ ] New member join sends DM + welcome message
- [ ] Internal channels hidden from non-staff
- [ ] `/serverinfo` works
- [ ] `/userinfo` works
- [ ] `/analytics daily` works
- [ ] Spam is auto-detected and timed out
- [ ] Terms of Service and Privacy Policy URLs are configured in Discord Application General Information
- [ ] Interactions Endpoint and Linked Roles URLs are configured in Developer Portal (if applicable)

---

## Optional: Third-Party Bot Stack

While the Strat AI bot handles everything natively, you can add these for supplementary features:

| Bot | Purpose | Setup |
|-----|---------|-------|
| Carl-bot | Reaction roles, advanced embeds | https://carl.gg |
| Dyno | Backup moderation, auto-roles | https://dyno.gg |
| Discohook | Embed builder/previewer | https://discohook.org |
| GitHub Bot | Repository notifications | Discord Integrations |

---

## Maintenance

### Daily
- Monitor #moderation-logs for unusual activity
- Check #member-logs for suspicious joins
- Review open tickets

### Weekly
- Run `/analytics weekly` for community health check
- Review and adjust security thresholds if needed
- Clean up resolved tickets

### Monthly
- Run `/analytics monthly` for growth report
- Review AutoMod effectiveness
- Update rules/FAQ if needed
- Monitor database health and usage on Supabase dashboard
