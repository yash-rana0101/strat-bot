import { Events, type GuildMember, type TextChannel, ChannelType } from 'discord.js';
import type { BotEvent } from '../types/index.js';
import { AnalyticsEventType } from '../types/index.js';
import { assignUnverifiedRole, sendWelcomeDM, sendWelcomeChannel, trackMemberJoin } from '../services/welcome.service.js';
import { checkRaid, checkSuspiciousAccount, isRaidLockdown } from '../services/security.service.js';
import { logMemberJoin, logSecurity } from '../services/logging.service.js';
import { trackEvent } from '../services/analytics.service.js';
import { logger } from '../utils/logger.js';

const event: BotEvent = {
  name: Events.GuildMemberAdd,
  execute: async (member: GuildMember) => {
    const { guild } = member;
    logger.info(`Member joined: ${member.user.tag} (${member.id})`);

    // Anti-raid check
    const isRaid = checkRaid(guild);
    if (isRaid) {
      await member.kick('Anti-raid: join rate exceeded threshold');
      await logSecurity(guild, 'Raid Protection', member.id, `Kicked during raid lockdown: ${member.user.tag}`);
      return;
    }

    if (isRaidLockdown()) {
      await member.kick('Anti-raid: server is in lockdown mode');
      await logSecurity(guild, 'Raid Lockdown', member.id, `Kicked during lockdown: ${member.user.tag}`);
      return;
    }

    // Suspicious account check
    const suspicion = checkSuspiciousAccount(member);
    if (suspicion.suspicious) {
      await logSecurity(guild, 'Suspicious Account', member.id, `Reasons: ${suspicion.reasons.join(', ')}`);
    }

    // Normal onboarding flow
    await assignUnverifiedRole(member);
    await trackMemberJoin(member);
    await sendWelcomeDM(member);

    const welcomeChannel = guild.channels.cache.find(
      (c) => c.name === 'welcome' && c.type === ChannelType.GuildText
    ) as TextChannel | undefined;

    if (welcomeChannel) {
      await sendWelcomeChannel(member, welcomeChannel);
    }

    await logMemberJoin(guild, member.id, member.user.tag);
    trackEvent(AnalyticsEventType.MemberJoin, member.id);
  },
};

export default event;
