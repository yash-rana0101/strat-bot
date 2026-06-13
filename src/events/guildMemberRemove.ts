import { Events, type GuildMember } from 'discord.js';
import type { BotEvent } from '../types/index.js';
import { AnalyticsEventType } from '../types/index.js';
import { logMemberLeave } from '../services/logging.service.js';
import { trackEvent } from '../services/analytics.service.js';
import { logger } from '../utils/logger.js';

const event: BotEvent = {
  name: Events.GuildMemberRemove,
  execute: async (member: GuildMember) => {
    logger.info(`Member left: ${member.user.tag} (${member.id})`);

    await logMemberLeave(member.guild, member.id, member.user.tag);
    trackEvent(AnalyticsEventType.MemberLeave, member.id);
  },
};

export default event;
