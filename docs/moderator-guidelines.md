# Strat AI — Moderator Guidelines

## Your Role

As a moderator, you are the face of the Strat AI community. Your primary responsibilities are:

1. **Enforce community rules** fairly and consistently
2. **Support members** with questions and issues
3. **Maintain a professional atmosphere** suitable for a SaaS product community
4. **Handle tickets** and escalate when needed
5. **Document everything** — all actions are logged

---

## Moderation Commands

### Warnings
```
/warn <user> <reason>
```
- Issue for first-time or minor violations
- Warnings accumulate and auto-escalate:
  - 3 warnings → automatic 1-hour mute
  - 5 warnings → automatic kick
  - 7 warnings → automatic ban
- **Always provide a clear, specific reason**

### Muting
```
/mute <user> <duration> <reason>
```
- Duration formats: `30m`, `2h`, `1d`, `1w`
- Use for: repeated minor violations, heated arguments, cooldown periods
- Maximum recommended: 1 week

### Kicking
```
/kick <user> <reason>
```
- Use for: persistent rule breaking after warnings, disruptive behavior
- The user can rejoin — use when a ban is too severe

### Banning
```
/ban <user> <reason>
```
- Use for: severe violations, scams, harassment, repeated offenses after kick
- Deletes 24 hours of messages automatically
- **Requires documented justification**

### Checking History
```
/infractions <user>
```
- Always check before escalating
- Review past warnings, mutes, kicks

---

## When to Use Each Action

| Situation | Action | Example |
|-----------|--------|---------|
| First-time off-topic | Verbal reminder (message) | "Please keep this in #general" |
| Minor rule break | `/warn` | Mild language, minor spam |
| Repeated minor breaks | `/mute 30m` | Continued off-topic after warning |
| Heated argument | `/mute 1h` both parties | Flame war in #market-discussion |
| Link spam / self-promo | `/warn` + delete messages | Posting referral links |
| Harassment | `/mute 1d` or `/kick` | Targeting another member |
| Scam / phishing | `/ban` immediately | Fake giveaway, token theft |
| NSFW content | `/ban` immediately | Posted explicit content |
| Raid participant | Bot handles auto-kick | — |

---

## Ticket Handling

### Priority Order
1. 💳 Billing — Revenue impact, handle within 2 hours
2. 📋 Account Support — User access, handle within 4 hours
3. 🐛 Bug Report — Product quality, handle within 24 hours
4. 💡 Feature Request — Community voice, handle within 48 hours
5. 🤝 Partnership — Business development, handle within 48 hours

### Best Practices
- Respond to tickets within 1 hour (acknowledge)
- Use the ticket for all communication (not DMs)
- Escalate to Core Team for billing/partnership decisions
- Close tickets with a clear resolution summary
- Use `/ticket-add` to bring in relevant staff

---

## Communication Guidelines

### Do
- Be professional and courteous
- Give clear, specific warnings with rule references
- Use DMs sparingly and only for sensitive matters
- Acknowledge the member's perspective before enforcing rules
- Document all actions with detailed reasons

### Don't
- Don't argue with members publicly
- Don't use moderation tools out of frustration
- Don't discuss moderation actions in public channels
- Don't reverse another moderator's decision without discussion
- Don't use @everyone or @here unless absolutely necessary

---

## Escalation Path

```
You (Moderator)
    │
    ├── Can handle: Warnings, mutes, kicks, basic tickets
    │
    ▼
Core Team
    │
    ├── Escalate: Bans, billing disputes, partnership tickets
    │
    ▼
Founder
    │
    └── Escalate: Policy changes, appeals, critical decisions
```

---

## Daily Checklist

- [ ] Review #moderation-logs for overnight activity
- [ ] Check open tickets and respond to pending ones
- [ ] Review #member-logs for suspicious joins
- [ ] Browse community channels for rule violations
- [ ] Check #audit-logs for unusual message deletions
