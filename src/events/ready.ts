import { ActivityType, Events } from 'discord.js';
import type { BotClient } from '../client.js';
import type { BotEvent } from '../types/index.js';
import { startSecurityCleanup } from '../services/security.service.js';
import { logger } from '../utils/logger.js';

const event: BotEvent = {
  name: Events.ClientReady,
  once: true,
  execute: async (client: BotClient) => {
    if (!client.user) return;

    logger.info(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    logger.info(`  Strat AI Bot Online`);
    logger.info(`  User: ${client.user.tag}`);
    logger.info(`  Guilds: ${client.guilds.cache.size}`);
    logger.info(`  Commands: ${client.commands.size}`);
    logger.info(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    client.user.setPresence({
      status: 'online',
      activities: [
        {
          name: process.env.BOT_STATUS || 'stratai.live | Market Intelligence',
          type: ActivityType.Watching,
        },
      ],
    });

    startSecurityCleanup();

    logger.info('All systems initialized');
  },
};

export default event;
