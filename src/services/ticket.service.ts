import {
  type Guild,
  type GuildMember,
  type TextChannel,
  ChannelType,
  OverwriteType,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ButtonInteraction,
} from 'discord.js';
import { sql } from '../database/connection.js';
import { TicketCategory, TicketStatus } from '../types/index.js';
import { createBrandedEmbed, createSuccessEmbed } from '../utils/embed-builder.js';
import { STAFF_ROLES } from '../config/roles.config.js';
import { logger } from '../utils/logger.js';

const TICKET_LABELS: Record<TicketCategory, { label: string; emoji: string }> = {
  [TicketCategory.AccountSupport]: { label: 'Account Support', emoji: '📋' },
  [TicketCategory.BugReport]: { label: 'Bug Report', emoji: '🐛' },
  [TicketCategory.FeatureRequest]: { label: 'Feature Request', emoji: '💡' },
  [TicketCategory.Billing]: { label: 'Billing', emoji: '💳' },
  [TicketCategory.Partnership]: { label: 'Partnership', emoji: '🤝' },
};

export function buildTicketPanelButtons(): ActionRowBuilder<ButtonBuilder>[] {
  const buttons = Object.entries(TICKET_LABELS).map(([key, val]) =>
    new ButtonBuilder()
      .setCustomId(`ticket_create_${key}`)
      .setLabel(val.label)
      .setEmoji(val.emoji)
      .setStyle(ButtonStyle.Secondary)
  );

  const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons.slice(0, 3));
  const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons.slice(3));
  return [row1, row2];
}

export async function createTicket(
  guild: Guild,
  member: GuildMember,
  category: TicketCategory,
  interaction: ButtonInteraction
): Promise<void> {
  await interaction.deferReply({ ephemeral: true });

  const [existing] = await sql<Array<{ id: string }>>`
    SELECT id FROM tickets
    WHERE user_id = ${member.id} AND status IN ('open', 'in_progress')
    LIMIT 1
  `;

  if (existing) {
    await interaction.editReply({ content: 'You already have an open ticket.' });
    return;
  }

  const [row] = await sql<Array<{ c: string }>>`
    SELECT COUNT(*) as c FROM tickets
  `;
  const ticketCount = parseInt(row?.c || '0', 10);
  const ticketName = `ticket-${String(ticketCount + 1).padStart(4, '0')}`;
  const info = TICKET_LABELS[category];

  const staffRoleIds = guild.roles.cache
    .filter((r) => STAFF_ROLES.includes(r.name))
    .map((r) => r.id);

  const overwrites = [
    { id: guild.id, type: OverwriteType.Role, deny: [PermissionFlagsBits.ViewChannel] },
    { id: member.id, type: OverwriteType.Member, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
    ...staffRoleIds.map((id) => ({
      id,
      type: OverwriteType.Role as const,
      allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages],
    })),
  ];

  const supportCategory = guild.channels.cache.find(
    (c) => c.name === '🛠 SUPPORT' && c.type === ChannelType.GuildCategory
  );

  const channel = await guild.channels.create({
    name: ticketName,
    type: ChannelType.GuildText,
    parent: supportCategory?.id,
    permissionOverwrites: overwrites,
    topic: `${info.emoji} ${info.label} | ${member.user.tag}`,
    reason: `Ticket created by ${member.user.tag}`,
  });

  try {
    await sql`
      INSERT INTO tickets (channel_id, user_id, category, subject)
      VALUES (${channel.id}, ${member.id}, ${category}, ${info.label})
    `;
  } catch (err: any) {
    logger.error(`Failed to insert ticket into DB: ${err.message}`);
  }

  const embed = createBrandedEmbed({
    title: `${info.emoji} ${info.label}`,
    description: [
      `**Created by:** ${member}`,
      `**Category:** ${info.label}`,
      `**Ticket:** ${ticketName}`,
      '',
      'Please describe your issue and a staff member will assist you shortly.',
    ].join('\n'),
    color: 0x6C5CE7,
  });

  const closeBtn = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('ticket_close')
      .setLabel('Close Ticket')
      .setEmoji('🔒')
      .setStyle(ButtonStyle.Danger)
  );

  await channel.send({ embeds: [embed], components: [closeBtn] });
  await interaction.editReply({ content: `Ticket created: ${channel}` });

  logger.info(`Ticket ${ticketName} created by ${member.user.tag} [${category}]`);
}

export async function closeTicket(
  channel: TextChannel,
  closedBy: GuildMember
): Promise<void> {
  const [ticket] = await sql<Array<{ id: string; user_id: string }>>`
    SELECT id, user_id FROM tickets WHERE channel_id = ${channel.id} LIMIT 1
  `;

  if (!ticket) return;

  try {
    await sql`
      UPDATE tickets
      SET status = ${TicketStatus.Closed}, closed_at = NOW(), closed_by = ${closedBy.id}
      WHERE id = ${ticket.id}
    `;
  } catch (err: any) {
    logger.error(`Failed to close ticket in DB: ${err.message}`);
  }

  const embed = createSuccessEmbed(
    'Ticket Closed',
    `This ticket was closed by ${closedBy}.\nThis channel will be deleted in 10 seconds.`
  );

  await channel.send({ embeds: [embed] });
  setTimeout(() => channel.delete('Ticket closed').catch(() => {}), 10_000);

  logger.info(`Ticket closed by ${closedBy.user.tag} in ${channel.name}`);
}

export async function addUserToTicket(
  channel: TextChannel,
  member: GuildMember
): Promise<void> {
  await channel.permissionOverwrites.edit(member.id, {
    ViewChannel: true,
    SendMessages: true,
    ReadMessageHistory: true,
  });
}

export async function removeUserFromTicket(
  channel: TextChannel,
  member: GuildMember
): Promise<void> {
  await channel.permissionOverwrites.delete(member.id);
}
