# 🛡️ Strat AI — Discord Server Ecosystem & Bot

> Market Intelligence. One Terminal.
> [stratai.live](https://stratai.live)

A production-ready, highly secure, and automated Discord community infrastructure powered by **Discord.js v14**, **TypeScript**, and **Supabase (PostgreSQL)**. 

This ecosystem auto-deploys a full server layout (7 categories, 37 channels, 10-tier role hierarchy, and precise permission matrices) and handles moderation, member onboarding, verification, tickets, native AutoMod, and analytics.

---

## 🌟 Key Features & Systems

| System | Description |
| :--- | :--- |
| **Server Architecture** | One-command layout deployment creating 7 categories, 41 channels, and 10 custom roles. |
| **Verification System** | Gate-keeping flow using an interactive rules button to filter bots (Unverified ➔ Member). |
| **Database System** | Direct connection pool using high-performance `postgres` client to cloud-hosted Supabase. |
| **Support Tickets** | 5-category support panel creating private channels for Account, Billing, Bugs, Features, and Partnerships. |
| **Native AutoMod** | Automatic rule deployments for link filters (with whitelist), spam protection, invites, and mention limits. |
| **Moderation Engine** | Escalating warning system (Warning ➔ Timeout ➔ Kick ➔ Ban) with full infraction logs. |
| **Community Analytics** | Tracks metrics (joins, messages, active channels) and builds daily/weekly/monthly health reports. |

---

## 📂 Project Structure

```text
discord-creator/
├── src/
│   ├── index.ts                     # Bot Entry point (graceful shutdowns)
│   ├── client.ts                    # Extended Discord Client with command routing
│   ├── config/                      # Server configuration system (embeds, security, channels, roles)
│   ├── database/                    # Direct Supabase PostgreSQL connection
│   ├── services/                    # 8 Core services (analytics, automod, deploy, ticket, moderation, welcome, logging)
│   ├── commands/                    # Slash Command routing (admin, moderation, tickets, utility)
│   ├── events/                      # Discord event handlers (ready, messages, joins, updates)
│   └── utils/                       # Shared modules (logger, permissions, embed builder)
├── docs/                            # Internal blueprints, matrix guides, and checklists
├── supabase_schema.sql              # Database setup script for Supabase SQL Editor
├── Dockerfile                       # Production multi-stage Docker build
├── docker-compose.yml               # Multi-container service configuration
└── .env.example                     # Environment template file
```

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js** 20 or higher.
* A **Discord Application** created on the [Developer Portal](https://discord.com/developers/applications).
* A **Supabase project** (you can create a free one at [supabase.com](https://supabase.com/)).

### 2. Database Initialization
1. Open [supabase_schema.sql](supabase_schema.sql) in your project root.
2. Copy the entire SQL content.
3. Open your **Supabase Dashboard** ➔ Select your Project ➔ **SQL Editor** ➔ **New Query**.
4. Paste the SQL script and click **Run** to generate the tables.

### 3. Configuration Setup
Create a `.env` file from the example:
```bash
copy .env.example .env
```
Open `.env` and fill in the values:
```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=1515375338446651452
GUILD_ID=your_target_server_id_here
DATABASE_URL=postgresql://postgres:...@your-supabase-db-url:5432/postgres
LOG_LEVEL=info
BOT_STATUS=stratai.live | Market Intelligence
```

### 4. Installation & Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Deploy the slash commands to Discord:
   ```bash
   npm run deploy:commands
   ```
3. Start the bot locally:
   ```bash
   npm run dev
   ```

---

## 🛠️ Discord Setup Commands
Once the bot is online, go into your server and run these commands to initialize the infrastructure:

* **`/deploy confirm:True`**: Creates the channels, categories, roles, and locks permissions.
* **`/setup-rules`**: Posts the rules embed and the verification button in `#rules`.
* **`/setup-welcome`**: Deploys the landing welcome panel in `#welcome`.
* **`/setup-tickets`**: Installs the 5-category support tickets panels in `#create-ticket`.
* **`/setup-automod`**: Deploys all four native AutoMod rules to your server.

---

## 📦 Deployment Options

### Option A: Railway (Recommended)
1. Push your code to a private GitHub repository.
2. Log into [Railway.app](https://railway.app/) and create a new project from your GitHub repository.
3. In Railway, go to the **Variables** tab on your service and add the environment variables from your `.env` file (`DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID`, `DATABASE_URL`, etc.).
4. Railway will automatically build and start the bot.

### Option B: Docker
Run the bot inside a lightweight container using Docker:
```bash
docker-compose up -d --build
```

### Option C: PM2 (Process Manager)
To run the bot in the background on your server with automatic crash restarts and log rotation:
1. Install PM2 globally on your system/server:
   ```bash
   npm install -g pm2
   ```
2. Build and start the bot:
   ```bash
   npm run start:pm2
   ```
3. Control the bot process:
   * **View live logs**: `npm run logs:pm2`
   * **Stop the bot**: `npm run stop:pm2`
   * **Restart the bot**: `pm2 restart strat-ai-bot`
