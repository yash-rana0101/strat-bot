import { Events, type Message, type PartialMessage } from 'discord.js';
import type { BotEvent } from '../types/index.js';
import { logMessageDelete } from '../services/logging.service.js';

const event: BotEvent = {
  name: Events.MessageDelete,
  execute: async (message: Message | PartialMessage) => {
    if (!message.guild || message.author?.bot) return;

    const content = message.content || '';
    const authorId = message.author?.id || 'unknown';
    const channelId = message.channelId;

    await logMessageDelete(message.guild, authorId, channelId, content);
  },
};

export default event;
