import { Events, type Message, type PartialMessage } from 'discord.js';
import type { BotEvent } from '../types/index.js';
import { logMessageEdit } from '../services/logging.service.js';

const event: BotEvent = {
  name: Events.MessageUpdate,
  execute: async (
    oldMessage: Message | PartialMessage,
    newMessage: Message | PartialMessage
  ) => {
    if (!newMessage.guild || newMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    const authorId = newMessage.author?.id || 'unknown';
    const channelId = newMessage.channelId;
    const before = oldMessage.content || '';
    const after = newMessage.content || '';

    await logMessageEdit(newMessage.guild, authorId, channelId, before, after);
  },
};

export default event;
