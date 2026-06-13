# Strat AI — Security Policies

## Overview

Strat AI employs a multi-layer security architecture combining Discord native AutoMod, custom bot enforcement, and manual staff oversight.

---

## Anti-Raid Protection

### Detection
- **Join Rate Monitoring:** Tracks join timestamps per guild
- **Threshold:** 10+ joins within 10 seconds triggers lockdown
- **Account Age:** Flags accounts younger than 7 days

### Response
1. Lockdown mode activated (5 minutes)
2. All new joins during lockdown are auto-kicked
3. Security alert logged to #server-logs
4. Staff notification sent

### Recovery
- Lockdown lifts automatically after 5 minutes
- Staff can manually review kicked users
- False positive joins can be re-invited

---

## Anti-Spam Protection

### Detection
- **Rate Limit:** 5+ messages within 5 seconds per user
- **Duplicate Detection:** 3+ identical messages within 30 seconds
- **Applies to:** All non-staff members

### Response
1. Messages deleted
2. User timed out for 5 minutes
3. Logged to #moderation-logs

---

## Anti-Link Spam

### Whitelisted Domains
- stratai.live
- discord.com / discord.gg
- github.com
- tradingview.com
- nseindia.com
- bseindia.com
- moneycontrol.com

### Rules
- Non-whitelisted links are deleted with a 5-second warning
- Discord invite links are always blocked (except staff)
- Exempt channels: #trading-setups, #market-discussion

---

## Anti-Scam Protection

### Detected Patterns
1. "Free nitro" offers
2. "Steam gift" scams
3. "Claim your prize" phishing
4. "You have been selected" social engineering
5. Password/token/seed requests
6. "DM me for free" solicitation
7. "Airdrop + connect wallet" crypto scams
8. "Guaranteed profit" promises
9. "Double your money/crypto" schemes

### Response
- Message deleted immediately
- User timed out for 5 minutes
- Logged to #server-logs as security event

---

## Anti-Mention Spam

### Limits
- **User mentions:** 5 per message
- **Role mentions:** 2 per message

### Response
- Message deleted
- User timed out for 5 minutes

---

## Suspicious Account Detection

### Criteria
- Account age less than 7 days
- No avatar set

### Actions
- Flagged to staff in #server-logs
- Not auto-kicked (reduces false positives for legitimate new users)
- Staff reviews flagged accounts within 24 hours

---

## Discord Native AutoMod Rules

### 1. Block Harmful Links
- Regex-based URL detection
- Whitelisted domains bypass
- Staff exempt
- Alert sent to #moderation-logs

### 2. Block Spam Content
- Discord's built-in spam detection
- Auto-timeout: 5 minutes
- Staff exempt

### 3. Block Mention Spam
- 5+ mention limit per message
- Auto-timeout: 10 minutes
- Staff exempt

### 4. Block Profanity and Slurs
- All 3 Discord presets enabled (Profanity, Sexual Content, Slurs)
- Message blocked with custom message
- Founder/Core Team exempt

---

## Escalation Procedures

### Automated Escalation
| Warning Count | Action | Duration |
|--------------|--------|----------|
| 1-2 | Warning recorded | — |
| 3 | Auto-mute | 1 hour |
| 5 | Auto-kick | — |
| 7 | Auto-ban | Permanent |

### Manual Escalation
1. **Staff member identifies issue** → Uses appropriate moderation command
2. **Complex cases** → Escalate to Moderator → Core Team → Founder
3. **Emergency (raid/major breach)** → Any staff can lock channels; Founder/Core Team notified

---

## Incident Response

### Severity Levels
| Level | Description | Response Time |
|-------|-------------|---------------|
| P1 — Critical | Active raid, mass spam, data breach | Immediate |
| P2 — High | Targeted harassment, scam activity | < 30 minutes |
| P3 — Medium | Rule violations, spam | < 2 hours |
| P4 — Low | Minor disputes, off-topic | < 24 hours |

### Response Steps
1. **Contain:** Delete offending messages, timeout/kick user
2. **Document:** Log action in moderation channel
3. **Communicate:** Inform affected users if necessary
4. **Review:** Post-incident review for P1/P2 incidents
