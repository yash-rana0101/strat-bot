import { Events, type Message } from 'discord.js';
import type { BotEvent } from '../types/index.js';
import { AnalyticsEventType } from '../types/index.js';
import { checkSpam, checkLinks, checkMentionSpam, checkScam } from '../services/security.service.js';
import { logSecurity } from '../services/logging.service.js';
import { trackEvent } from '../services/analytics.service.js';
import { SECURITY_CONFIG } from '../config/security.config.js';
import { logger } from '../utils/logger.js';

const event: BotEvent = {
  name: Events.MessageCreate,
  execute: async (message: Message) => {
    if (message.author.bot || !message.guild || !message.member) return;

    // Security checks
    const scamResult = checkScam(message);
    if (scamResult.isScam) {
      await message.delete().catch(() => {});
      await message.member.timeout(SECURITY_CONFIG.antiSpam.timeoutDurationMs, scamResult.reason);
      await logSecurity(message.guild, 'Scam Detected', message.author.id, scamResult.reason);
      logger.warn(`Scam detected from ${message.author.tag}: ${scamResult.reason}`);
      return;
    }

    const spamResult = checkSpam(message);
    if (spamResult.isSpam) {
      await message.delete().catch(() => {});
      await message.member.timeout(SECURITY_CONFIG.antiSpam.timeoutDurationMs, spamResult.reason);
      await logSecurity(message.guild, 'Spam Detected', message.author.id, spamResult.reason);
      logger.warn(`Spam detected from ${message.author.tag}: ${spamResult.reason}`);
      return;
    }

    const linkResult = checkLinks(message);
    if (linkResult.hasBlockedLinks) {
      await message.delete().catch(() => {});
      await message.reply({
        content: '⚠️ Your message contained a link that is not on our approved list.',
      }).then((msg) => setTimeout(() => msg.delete().catch(() => {}), 5000));
      await logSecurity(message.guild, 'Blocked Link', message.author.id, linkResult.reason);
      return;
    }

    const mentionResult = checkMentionSpam(message);
    if (mentionResult.isMentionSpam) {
      await message.delete().catch(() => {});
      await message.member.timeout(SECURITY_CONFIG.antiMention.timeoutDurationMs, mentionResult.reason);
      await logSecurity(message.guild, 'Mention Spam', message.author.id, mentionResult.reason);
      return;
    }

    // Analytics tracking
    trackEvent(AnalyticsEventType.MessageSent, message.author.id, message.channelId);
  },
};

export default event;
