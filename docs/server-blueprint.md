# Strat AI — Discord Server Blueprint

**Market Intelligence. One Terminal.**
**Website:** https://stratai.live

---

## Server Architecture Overview

```
📢 INFORMATION (7 channels)
├── #welcome          — Welcome message and onboarding
├── #start-here       — Getting started guide
├── #rules            — Community rules + verification button
├── #announcements    — Official announcements
├── #changelog        — Product updates and patch notes
├── #roadmap          — Product roadmap
└── #faq              — Frequently asked questions

🌐 COMMUNITY (6 channels)
├── #general          — General discussion
├── #introductions    — Member introductions
├── #market-discussion — Market trends and analysis
├── #trading-setups   — Trading setups (30s slowmode)
├── #wins-and-lessons — Wins and lessons learned
└── #feature-requests — Feature suggestions (60s slowmode)

📈 MARKETS (6 channels)
├── #nifty            — Nifty 50 index
├── #banknifty        — Bank Nifty index
├── #stocks           — Individual stocks
├── #options          — Options trading
├── #crypto           — Cryptocurrency
└── #global-markets   — US, EU, Asia markets

🧠 STRAT AI (6 channels)
├── #deep-quant-analysis — Quantitative analysis
├── #market-intelligence — AI-driven intelligence
├── #ai-insights         — AI predictions
├── #beta-testing        — Beta features (Beta Tester+ only)
├── #product-feedback    — Product feedback (30s slowmode)
└── #bug-reports         — Bug reporting (30s slowmode)

🛠 SUPPORT (3 channels)
├── #help             — Community help
├── #account-support  — Account inquiries
└── #create-ticket    — Ticket panel (read-only)

🔒 INTERNAL (5 channels) — Staff only
├── #server-logs      — Server events
├── #member-logs      — Join/leave logs
├── #audit-logs       — Message edit/delete
├── #ticket-logs      — Ticket activity
└── #moderation-logs  — Mod actions

🔊 VOICE (4 channels)
├── Community Lounge
├── Market Discussion
├── Trading Floor     — 10 user limit
└── Team Meeting      — 15 user limit
```

**Total: 37 text channels, 4 voice channels, 7 categories**

---

## Role Hierarchy

| Position | Role | Color | Hoisted | Staff | Key Permissions |
|----------|------|-------|---------|-------|-----------------|
| 10 | Founder | #E74C3C | ✅ | ✅ | Administrator |
| 9 | Core Team | #E67E22 | ✅ | ✅ | ManageGuild, ManageChannels, ManageRoles, Ban, Kick |
| 8 | Developer | #3498DB | ✅ | ✅ | ManageChannels, ManageMessages, ViewAuditLog |
| 7 | Moderator | #2ECC71 | ✅ | ✅ | ManageMessages, Kick, Ban, ModerateMembers |
| 6 | Support | #1ABC9C | ✅ | ✅ | ManageMessages, ViewChannel |
| 5 | Beta Tester | #9B59B6 | ✅ | ❌ | ViewChannel, SendMessages, #beta-testing access |
| 4 | Verified User | #F1C40F | ❌ | ❌ | ViewChannel, SendMessages (all public) |
| 3 | Member | #95A5A6 | ❌ | ❌ | ViewChannel, SendMessages (limited) |
| 2 | Unverified | #636E72 | ❌ | ❌ | ViewChannel (info only), ReadHistory |
| 1 | Muted | #2C3E50 | ❌ | ❌ | ViewChannel, ReadHistory (no send/speak) |

---

## Verification Flow

```
User Joins Server
       │
       ▼
Assigned "Unverified" Role
       │
       ▼
Can view: #welcome, #start-here, #rules
       │
       ▼
Reads rules in #rules
       │
       ▼
Clicks "✅ I Accept the Rules — Verify Me"
       │
       ▼
Unverified role removed
Member role assigned
       │
       ▼
Full community access granted
```

---

## Ticket System

### Categories
1. 📋 **Account Support** — Account access, settings, login
2. 🐛 **Bug Report** — Technical issues and bugs
3. 💡 **Feature Request** — Feature suggestions
4. 💳 **Billing** — Subscription and payment
5. 🤝 **Partnership** — Collaboration proposals

### Flow
1. User clicks category button in #create-ticket
2. Private channel created under 🛠 SUPPORT
3. Only the user + staff can see/send
4. Staff notified automatically
5. `/ticket-close` to resolve → channel deleted after 10s

---

## Security Systems

| System | Detection | Action |
|--------|-----------|--------|
| Anti-Raid | 10+ joins in 10 seconds | Auto-kick + 5min lockdown |
| Anti-Spam | 5+ messages in 5 seconds | Delete + 5min timeout |
| Duplicate Detection | 3+ identical messages in 30s | Delete + timeout |
| Anti-Link | Non-whitelisted URLs | Delete + warning |
| Anti-Invite | Discord invite links | Delete + warning |
| Anti-Mention | 5+ user mentions | Delete + timeout |
| Anti-Scam | Known scam patterns (9 rules) | Delete + timeout |
| Suspicious Account | < 7 days old, no avatar | Flag to staff |

### Escalation Ladder
- **3 warnings** → Auto-mute (1 hour)
- **5 warnings** → Auto-kick
- **7 warnings** → Auto-ban

---

## Bot Commands

### Admin (Founder/Core Team)
| Command | Description |
|---------|-------------|
| `/deploy` | Deploy server infrastructure |
| `/setup-welcome` | Set up welcome system |
| `/setup-rules` | Set up rules + verification |
| `/setup-tickets` | Set up ticket panel |
| `/setup-automod` | Configure AutoMod rules |
| `/analytics [period]` | Generate analytics report |

### Moderation
| Command | Description |
|---------|-------------|
| `/warn <user> <reason>` | Issue warning (auto-escalates) |
| `/mute <user> <duration> <reason>` | Timeout user |
| `/kick <user> <reason>` | Kick user |
| `/ban <user> <reason>` | Ban user |
| `/infractions <user>` | View infraction history |

### Tickets
| Command | Description |
|---------|-------------|
| `/ticket-close` | Close current ticket |
| `/ticket-add <user>` | Add user to ticket |
| `/ticket-remove <user>` | Remove user from ticket |

### Utility
| Command | Description |
|---------|-------------|
| `/serverinfo` | Server statistics |
| `/userinfo [user]` | User information |
