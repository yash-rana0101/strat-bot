import { SlashCommandBuilder, PermissionFlagsBits, type ChatInputCommandInteraction, type GuildMember, type TextChannel } from 'discord.js';
import type { BotCommand } from '../../types/index.js';
import { closeTicket } from '../../services/ticket.service.js';
import { isStaff } from '../../utils/permissions.js';
import { createErrorEmbed } from '../../utils/embed-builder.js';
import { sql } from '../../database/connection.js';

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('ticket-close')
    .setDescription('Close the current ticket'),

  async execute(interaction: ChatInputCommandInteraction) {
    const channel = interaction.channel as TextChannel;
    const member = interaction.member as GuildMember;

    const [ticket] = await sql<Array<{ user_id: string }>>`
      SELECT user_id FROM tickets WHERE channel_id = ${channel.id} LIMIT 1
    `;

    if (!ticket) {
      await interaction.reply({ embeds: [createErrorEmbed('Error', 'This is not a ticket channel.')], ephemeral: true });
      return;
    }

    if (ticket.user_id !== member.id && !isStaff(member)) {
      await interaction.reply({ embeds: [createErrorEmbed('Error', 'Only the ticket creator or staff can close this ticket.')], ephemeral: true });
      return;
    }

    await interaction.reply({ content: '🔒 Closing ticket...' });
    await closeTicket(channel, member);
  },
};

export default command;
