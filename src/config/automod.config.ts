import {
  AutoModerationRuleEventType,
  AutoModerationRuleTriggerType,
  AutoModerationActionType,
} from 'discord.js';
import type { AutoModRuleConfig } from '../types/index.js';

export const AUTOMOD_RULES: AutoModRuleConfig[] = [
  {
    name: 'Block Harmful Links',
    eventType: AutoModerationRuleEventType.MessageSend,
    triggerType: AutoModerationRuleTriggerType.Keyword,
    triggerMetadata: {
      regexPatterns: [
        'https?://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      ],
      allowList: [
        '*stratai.live*',
        '*discord.com*',
        '*discord.gg*',
        '*github.com*',
        '*tradingview.com*',
        '*nseindia.com*',
        '*bseindia.com*',
        '*moneycontrol.com*',
      ],
    },
    actions: [
      {
        type: AutoModerationActionType.BlockMessage,
        metadata: { customMessage: 'This link is not on our approved list. Contact a moderator if this was a mistake.' },
      },
      {
        type: AutoModerationActionType.SendAlertMessage,
      },
    ],
    exemptRoles: ['Founder', 'Core Team', 'Developer', 'Moderator', 'Support'],
    exemptChannels: [],
    enabled: true,
  },
  {
    name: 'Block Spam Content',
    eventType: AutoModerationRuleEventType.MessageSend,
    triggerType: AutoModerationRuleTriggerType.Spam,
    triggerMetadata: {},
    actions: [
      { type: AutoModerationActionType.BlockMessage },
    ],
    exemptRoles: ['Founder', 'Core Team', 'Developer', 'Moderator', 'Support'],
    exemptChannels: [],
    enabled: true,
  },
  {
    name: 'Block Mention Spam',
    eventType: AutoModerationRuleEventType.MessageSend,
    triggerType: AutoModerationRuleTriggerType.MentionSpam,
    triggerMetadata: {
      mentionTotalLimit: 5,
    },
    actions: [
      { type: AutoModerationActionType.BlockMessage },
      {
        type: AutoModerationActionType.Timeout,
        metadata: { durationSeconds: 600 },
      },
    ],
    exemptRoles: ['Founder', 'Core Team', 'Developer', 'Moderator', 'Support'],
    exemptChannels: [],
    enabled: true,
  },
  {
    name: 'Block Profanity and Slurs',
    eventType: AutoModerationRuleEventType.MessageSend,
    triggerType: AutoModerationRuleTriggerType.KeywordPreset,
    triggerMetadata: {
      presets: [1, 2, 3],
    },
    actions: [
      {
        type: AutoModerationActionType.BlockMessage,
        metadata: { customMessage: 'Your message was blocked for containing inappropriate content.' },
      },
    ],
    exemptRoles: ['Founder', 'Core Team'],
    exemptChannels: [],
    enabled: true,
  },
];
