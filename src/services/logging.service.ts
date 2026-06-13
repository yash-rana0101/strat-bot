import { type Guild, type TextChannel, ChannelType, type ColorResolvable } from 'discord.js';
import { LogChannel, type LogEntry } from '../types/index.js';
import { createLogEmbed } from '../utils/embed-builder.js';
import { logger } from '../utils/logger.js';
import { sql } from '../database/connection.js';

const channelCache = new Map<string, TextChannel>();

function getLogChannel(guild: Guild, logChannel: LogChannel): TextChannel | null {
  const cacheKey = `${guild.id}_${logChannel}`;
  const cached = channelCache.get(cacheKey);
  if (cached) return cached;

  const channel = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildText && c.name === logChannel
  ) as TextChannel | undefined;

  if (channel) {
    channelCache.set(cacheKey, channel);
  }

  return channel || null;
}

export async function sendLog(guild: Guild, entry: LogEntry): Promise<void> {
  const channel = getLogChannel(guild, entry.channel);
  if (!channel) {
    logger.warn(`Log channel ${entry.channel} not found`);
    return;
  }

  const embed = createLogEmbed(entry.title, entry.description, entry.color, entry.fields);

  if (entry.actorId) {
    embed.addFields({ name: 'Actor', value: `<@${entry.actorId}>`, inline: true });
  }
  if (entry.targetId) {
    embed.addFields({ name: 'Target', value: `<@${entry.targetId}>`, inline: true });
  }

  await channel.send({ embeds: [embed] }).catch((err) => {
    logger.error(`Failed to send log to ${entry.channel}:`, err);
  });
}

export async function logMemberJoin(guild: Guild, userId: string, tag: string): Promise<void> {
  await sendLog(guild, {
    channel: LogChannel.Member,
    title: '📥 Member Joined',
    description: `<@${userId}> (${tag})`,
    color: 0x2ECC71 as ColorResolvable,
    actorId: userId,
  });
  await persistAuditLog('member_join', null, userId, `${tag} joined the server`);
}

export async function logMemberLeave(guild: Guild, userId: string, tag: string): Promise<void> {
  await sendLog(guild, {
    channel: LogChannel.Member,
    title: '📤 Member Left',
    description: `${tag} (${userId})`,
    color: 0xE74C3C as ColorResolvable,
    targetId: userId,
  });
  await persistAuditLog('member_leave', null, userId, `${tag} left the server`);
}

export async function logModAction(
  guild: Guild,
  action: string,
  actorId: string,
  targetId: string,
  reason: string
): Promise<void> {
  await sendLog(guild, {
    channel: LogChannel.Moderation,
    title: `🔨 ${action}`,
    description: reason,
    color: 0xF39C12 as ColorResolvable,
    actorId,
    targetId,
    fields: [{ name: 'Action', value: action, inline: true }],
  });
  await persistAuditLog(`mod_${action.toLowerCase()}`, actorId, targetId, reason);
}

export async function logMessageDelete(
  guild: Guild,
  authorId: string,
  channelId: string,
  content: string
): Promise<void> {
  const truncated = content.length > 1000 ? content.slice(0, 1000) + '...' : content;
  await sendLog(guild, {
    channel: LogChannel.Audit,
    title: '🗑️ Message Deleted',
    description: truncated || '*[empty or embed]*',
    color: 0xE74C3C as ColorResolvable,
    actorId: authorId,
    fields: [{ name: 'Channel', value: `<#${channelId}>`, inline: true }],
  });
}

export async function logMessageEdit(
  guild: Guild,
  authorId: string,
  channelId: string,
  before: string,
  after: string
): Promise<void> {
  const truncBefore = before.length > 500 ? before.slice(0, 500) + '...' : before;
  const truncAfter = after.length > 500 ? after.slice(0, 500) + '...' : after;
  await sendLog(guild, {
    channel: LogChannel.Audit,
    title: '✏️ Message Edited',
    description: `**Before:**\n${truncBefore}\n\n**After:**\n${truncAfter}`,
    color: 0xF39C12 as ColorResolvable,
    actorId: authorId,
    fields: [{ name: 'Channel', value: `<#${channelId}>`, inline: true }],
  });
}

export async function logTicketAction(
  guild: Guild,
  action: string,
  actorId: string,
  ticketName: string
): Promise<void> {
  await sendLog(guild, {
    channel: LogChannel.Ticket,
    title: `🎫 ${action}`,
    description: `Ticket: ${ticketName}`,
    color: 0x3498DB as ColorResolvable,
    actorId,
  });
}

export async function logSecurity(
  guild: Guild,
  event: string,
  targetId: string,
  details: string
): Promise<void> {
  await sendLog(guild, {
    channel: LogChannel.Server,
    title: `🛡️ ${event}`,
    description: details,
    color: 0xE74C3C as ColorResolvable,
    targetId,
  });
  await persistAuditLog(`security_${event.toLowerCase()}`, null, targetId, details);
}

async function persistAuditLog(
  action: string,
  actorId: string | null,
  targetId: string,
  details: string
): Promise<void> {
  try {
    await sql`
      INSERT INTO audit_logs (action, actor_id, target_id, details)
      VALUES (${action}, ${actorId}, ${targetId}, ${details})
    `;
  } catch (err: any) {
    logger.error(`Failed to persist audit log: ${action} - ${err.message}`);
  }
}

export function clearChannelCache(): void {
  channelCache.clear();
}
