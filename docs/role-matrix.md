# Strat AI — Role Matrix

## Role Permissions Detail

### Founder
- **Level:** Maximum
- **Permissions:** Full Administrator
- **Access:** All channels, all features, all settings
- **Responsibilities:** Server ownership, strategic decisions, final authority

### Core Team
- **Level:** Senior Management
- **Permissions:** ManageGuild, ManageChannels, ManageRoles, ManageMessages, BanMembers, KickMembers, MuteMembers, DeafenMembers, MoveMembers, ManageNicknames, ViewAuditLog, MentionEveryone, ManageEvents
- **Access:** All channels including internal
- **Responsibilities:** Server management, team coordination, escalated issues

### Developer
- **Level:** Technical Staff
- **Permissions:** ManageChannels, ManageMessages, ViewAuditLog
- **Access:** All channels including internal
- **Responsibilities:** Bot maintenance, technical infrastructure, bug triage

### Moderator
- **Level:** Community Management
- **Permissions:** ManageMessages, KickMembers, BanMembers, ManageNicknames, MuteMembers, MoveMembers, ViewAuditLog, ModerateMembers
- **Access:** All channels including internal
- **Responsibilities:** Community moderation, rule enforcement, ticket handling, member support

### Support
- **Level:** Support Staff
- **Permissions:** ManageMessages
- **Access:** All channels including internal
- **Responsibilities:** Ticket responses, member assistance, FAQ updates

### Beta Tester
- **Level:** Trusted Member
- **Permissions:** Standard member + #beta-testing access
- **Access:** All public channels + beta-testing
- **Responsibilities:** Testing new features, providing feedback

### Verified User
- **Level:** Standard Member
- **Permissions:** ViewChannel, SendMessages, EmbedLinks, AttachFiles, ReadMessageHistory, AddReactions, Connect, Speak
- **Access:** All public channels (can send in 🧠 STRAT AI)
- **Responsibilities:** Active community participation

### Member
- **Level:** Basic Member (post-verification)
- **Permissions:** ViewChannel, SendMessages, ReadMessageHistory, AddReactions, Connect, Speak
- **Access:** Community, Markets, Support channels (read-only in 🧠 STRAT AI)
- **Responsibilities:** Following rules, engaging positively

### Unverified
- **Level:** New Join (pre-verification)
- **Permissions:** ViewChannel, ReadMessageHistory
- **Access:** Information category only (#welcome, #start-here, #rules)
- **Responsibilities:** Reading and accepting rules

### Muted
- **Level:** Restricted
- **Permissions:** ViewChannel, ReadMessageHistory
- **Access:** Can view all assigned channels, cannot send/speak/react
- **Applied:** Automatically via moderation or manually by staff

---

## Role Assignment Matrix

| Trigger | Role Assigned | Role Removed |
|---------|--------------|--------------|
| User joins server | Unverified | — |
| User clicks verify button | Member | Unverified |
| Staff grants beta access | Beta Tester | — |
| Staff promotes to Verified | Verified User | — |
| User spams / warned 3x | Muted (auto) | — |
| Timeout expires | — | Muted (auto) |
