import { type Guild, type GuildMember, type Message } from 'discord.js';
import { SECURITY_CONFIG } from '../config/security.config.js';
import { logger } from '../utils/logger.js';
import { isStaff } from '../utils/permissions.js';
import { isAccountTooNew } from '../utils/time.js';

const joinTracker = new Map<string, number[]>();
const messageTracker = new Map<string, Array<{ content: string; timestamp: number }>>();
let raidLockdown = false;

export function checkRaid(guild: Guild): boolean {
  const config = SECURITY_CONFIG.antiRaid;
  if (!config.enabled) return false;

  const guildId = guild.id;
  const now = Date.now();
  const joins = joinTracker.get(guildId) || [];
  const recent = joins.filter((t) => now - t < config.joinWindowMs);
  recent.push(now);
  joinTracker.set(guildId, recent);

  if (recent.length >= config.joinThreshold) {
    raidLockdown = true;
    logger.warn(`RAID DETECTED: ${recent.length} joins in ${config.joinWindowMs}ms`);

    setTimeout(() => {
      raidLockdown = false;
      joinTracker.delete(guildId);
      logger.info('Raid lockdown lifted');
    }, config.lockdownDurationMs);

    return true;
  }

  return false;
}

export function isRaidLockdown(): boolean {
  return raidLockdown;
}

export function checkSuspiciousAccount(member: GuildMember): {
  suspicious: boolean;
  reasons: string[];
} {
  const config = SECURITY_CONFIG.suspiciousAccount;
  if (!config.enabled) return { suspicious: false, reasons: [] };

  const reasons: string[] = [];
  const minAge = config.minAccountAgeDays * 86_400_000;

  if (isAccountTooNew(member.user.createdAt, minAge)) {
    reasons.push(`Account younger than ${config.minAccountAgeDays} days`);
  }

  if (!member.user.avatar && config.noAvatarAction !== 'none') {
    reasons.push('No avatar set');
  }

  return { suspicious: reasons.length > 0, reasons };
}

export function checkSpam(message: Message): {
  isSpam: boolean;
  reason: string;
} {
  const config = SECURITY_CONFIG.antiSpam;
  if (!config.enabled) return { isSpam: false, reason: '' };
  if (!message.member || isStaff(message.member)) return { isSpam: false, reason: '' };

  const userId = message.author.id;
  const now = Date.now();
  const history = messageTracker.get(userId) || [];

  history.push({ content: message.content, timestamp: now });

  const recentMessages = history.filter((m) => now - m.timestamp < config.windowMs);
  messageTracker.set(userId, recentMessages);

  if (recentMessages.length >= config.maxMessages) {
    return { isSpam: true, reason: `Rate limit: ${recentMessages.length} messages in ${config.windowMs}ms` };
  }

  const recentDupes = history.filter((m) => now - m.timestamp < config.duplicateWindowMs);
  const dupeCount = recentDupes.filter((m) => m.content === message.content).length;

  if (dupeCount >= config.duplicateThreshold) {
    return { isSpam: true, reason: `Duplicate messages: ${dupeCount} identical messages` };
  }

  return { isSpam: false, reason: '' };
}

export function checkLinks(message: Message): {
  hasBlockedLinks: boolean;
  reason: string;
} {
  const config = SECURITY_CONFIG.antiLink;
  if (!config.enabled) return { hasBlockedLinks: false, reason: '' };
  if (!message.member || isStaff(message.member)) return { hasBlockedLinks: false, reason: '' };

  const channelName = 'name' in message.channel ? (message.channel as { name: string }).name : '';
  if (config.exemptChannels.includes(channelName)) return { hasBlockedLinks: false, reason: '' };

  const invitePattern = /discord\.gg\/[a-zA-Z0-9]+|discordapp\.com\/invite\/[a-zA-Z0-9]+/i;
  if (config.blockInvites && invitePattern.test(message.content)) {
    return { hasBlockedLinks: true, reason: 'Discord invite link detected' };
  }

  const urlPattern = /https?:\/\/([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;
  const matches = [...message.content.matchAll(urlPattern)];

  for (const match of matches) {
    const domain = match[1].toLowerCase();
    const isWhitelisted = config.whitelistedDomains.some(
      (wd) => domain === wd || domain.endsWith(`.${wd}`)
    );
    if (!isWhitelisted) {
      return { hasBlockedLinks: true, reason: `Blocked domain: ${domain}` };
    }
  }

  return { hasBlockedLinks: false, reason: '' };
}

export function checkMentionSpam(message: Message): {
  isMentionSpam: boolean;
  reason: string;
} {
  const config = SECURITY_CONFIG.antiMention;
  if (!config.enabled) return { isMentionSpam: false, reason: '' };
  if (!message.member || isStaff(message.member)) return { isMentionSpam: false, reason: '' };

  if (message.mentions.users.size >= config.maxMentions) {
    return { isMentionSpam: true, reason: `${message.mentions.users.size} user mentions` };
  }

  if (message.mentions.roles.size >= config.maxRoleMentions) {
    return { isMentionSpam: true, reason: `${message.mentions.roles.size} role mentions` };
  }

  return { isMentionSpam: false, reason: '' };
}

export function checkScam(message: Message): {
  isScam: boolean;
  reason: string;
} {
  if (!message.member || isStaff(message.member)) return { isScam: false, reason: '' };

  const scamPatterns = [
    /free\s+nitro/i,
    /steam\s+gift/i,
    /claim\s+your\s+prize/i,
    /you\s+have\s+been\s+selected/i,
    /send\s+me\s+your\s+(password|token|seed)/i,
    /dm\s+me\s+for\s+free/i,
    /airdrop.*connect\s+wallet/i,
    /guaranteed\s+profit/i,
    /double\s+your\s+(money|crypto|bitcoin)/i,
  ];

  for (const pattern of scamPatterns) {
    if (pattern.test(message.content)) {
      return { isScam: true, reason: `Scam pattern matched: ${pattern.source}` };
    }
  }

  return { isScam: false, reason: '' };
}

/** Clean up stale tracking data every 5 minutes */
export function startSecurityCleanup(): void {
  setInterval(() => {
    const now = Date.now();
    for (const [userId, history] of messageTracker) {
      const active = history.filter((m) => now - m.timestamp < 60_000);
      if (active.length === 0) {
        messageTracker.delete(userId);
      } else {
        messageTracker.set(userId, active);
      }
    }
  }, 300_000);
}
