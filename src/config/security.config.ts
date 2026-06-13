export interface SecurityConfig {
  antiRaid: AntiRaidConfig;
  antiSpam: AntiSpamConfig;
  antiLink: AntiLinkConfig;
  antiMention: AntiMentionConfig;
  suspiciousAccount: SuspiciousAccountConfig;
  escalation: EscalationConfig;
}

export interface AntiRaidConfig {
  enabled: boolean;
  joinThreshold: number;
  joinWindowMs: number;
  lockdownDurationMs: number;
  minAccountAgeMs: number;
}

export interface AntiSpamConfig {
  enabled: boolean;
  maxMessages: number;
  windowMs: number;
  duplicateThreshold: number;
  duplicateWindowMs: number;
  timeoutDurationMs: number;
}

export interface AntiLinkConfig {
  enabled: boolean;
  whitelistedDomains: string[];
  blockInvites: boolean;
  blockAllLinks: boolean;
  exemptChannels: string[];
}

export interface AntiMentionConfig {
  enabled: boolean;
  maxMentions: number;
  maxRoleMentions: number;
  timeoutDurationMs: number;
}

export interface SuspiciousAccountConfig {
  enabled: boolean;
  minAccountAgeDays: number;
  noAvatarAction: 'flag' | 'kick' | 'none';
  newAccountAction: 'flag' | 'kick' | 'restrict';
}

export interface EscalationConfig {
  warnsBeforeMute: number;
  muteDurationMs: number;
  warnsBeforeKick: number;
  warnsBeforeBan: number;
}

export const SECURITY_CONFIG: SecurityConfig = {
  antiRaid: {
    enabled: true,
    joinThreshold: 10,
    joinWindowMs: 10_000,
    lockdownDurationMs: 300_000,
    minAccountAgeMs: 86_400_000,
  },
  antiSpam: {
    enabled: true,
    maxMessages: 5,
    windowMs: 5_000,
    duplicateThreshold: 3,
    duplicateWindowMs: 30_000,
    timeoutDurationMs: 300_000,
  },
  antiLink: {
    enabled: true,
    whitelistedDomains: [
      'stratai.live',
      'discord.com',
      'discord.gg',
      'github.com',
      'tradingview.com',
      'nseindia.com',
      'bseindia.com',
      'moneycontrol.com',
    ],
    blockInvites: true,
    blockAllLinks: false,
    exemptChannels: ['trading-setups', 'market-discussion'],
  },
  antiMention: {
    enabled: true,
    maxMentions: 5,
    maxRoleMentions: 2,
    timeoutDurationMs: 300_000,
  },
  suspiciousAccount: {
    enabled: true,
    minAccountAgeDays: 7,
    noAvatarAction: 'flag',
    newAccountAction: 'restrict',
  },
  escalation: {
    warnsBeforeMute: 3,
    muteDurationMs: 3_600_000,
    warnsBeforeKick: 5,
    warnsBeforeBan: 7,
  },
};
