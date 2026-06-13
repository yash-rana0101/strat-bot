import { type Guild } from 'discord.js';
import { AUTOMOD_RULES } from '../config/automod.config.js';
import { logger } from '../utils/logger.js';

export async function setupAutoModRules(guild: Guild): Promise<void> {
  logger.info('Setting up AutoMod rules...');

  const existingRules = await guild.autoModerationRules.fetch();

  for (const ruleConfig of AUTOMOD_RULES) {
    const existing = existingRules.find((r) => r.name === ruleConfig.name);

    const exemptRoleIds = guild.roles.cache
      .filter((r) => ruleConfig.exemptRoles.includes(r.name))
      .map((r) => r.id);

    const exemptChannelIds = guild.channels.cache
      .filter((c) => ruleConfig.exemptChannels.includes(c.name))
      .map((c) => c.id);

    const alertChannel = guild.channels.cache.find((c) => c.name === 'moderation-logs');

    const actions = ruleConfig.actions.map((action) => {
      const base: Record<string, unknown> = { type: action.type };

      if (action.type === 2 && alertChannel) {
        base.metadata = { channel: alertChannel.id };
      } else if (action.metadata) {
        base.metadata = action.metadata;
      }

      return base;
    }) as Array<{ type: number; metadata?: Record<string, unknown> }>;

    if (existing) {
      await existing.edit({
        triggerMetadata: ruleConfig.triggerMetadata,
        actions,
        exemptRoles: exemptRoleIds,
        exemptChannels: exemptChannelIds,
        enabled: ruleConfig.enabled,
      });
      logger.info(`  Updated AutoMod rule: ${ruleConfig.name}`);
    } else {
      await guild.autoModerationRules.create({
        name: ruleConfig.name,
        eventType: ruleConfig.eventType,
        triggerType: ruleConfig.triggerType,
        triggerMetadata: ruleConfig.triggerMetadata,
        actions,
        exemptRoles: exemptRoleIds,
        exemptChannels: exemptChannelIds,
        enabled: ruleConfig.enabled,
        reason: 'Strat AI AutoMod setup',
      });
      logger.info(`  Created AutoMod rule: ${ruleConfig.name}`);
    }
  }

  logger.info(`AutoMod setup complete (${AUTOMOD_RULES.length} rules)`);
}
