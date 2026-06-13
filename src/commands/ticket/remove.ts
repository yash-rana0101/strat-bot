import { SlashCommandBuilder, PermissionFlagsBits, type ChatInputCommandInteraction, type GuildMember, type TextChannel } from 'discord.js';
import type { BotCommand } from '../../types/index.js';
import { removeUserFromTicket } from '../../services/ticket.service.js';
import { isStaff } from '../../utils/permissions.js';
import { createSuccessEmbed, createErrorEmbed } from '../../utils/embed-builder.js';
import { sql } from '../../database/connection.js';

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('ticket-remove')
    .setDescription('Remove a user from the current ticket')
    .addUserOption((opt) => opt.setName('user').setDescription('User to remove').setRequired(true)),
  requiredRoles: ['Founder', 'Core Team', 'Moderator', 'Support'],

  async execute(interaction: ChatInputCommandInteraction) {
    const channel = interaction.channel as TextChannel;
    const actor = interaction.member as GuildMember;

    const [ticket] = await sql<Array<{ id: string }>>`
      SELECT id FROM tickets WHERE channel_id = ${channel.id} LIMIT 1
    `;

    if (!ticket) {
      await interaction.reply({ embeds: [createErrorEmbed('Error', 'This is not a ticket channel.')], ephemeral: true });
      return;
    }

    if (!isStaff(actor)) {
      await interaction.reply({ embeds: [createErrorEmbed('Error', 'Only staff can remove users from tickets.')], ephemeral: true });
      return;
    }

    const target = interaction.options.getMember('user') as GuildMember | null;
    if (!target) {
      await interaction.reply({ embeds: [createErrorEmbed('Error', 'User not found.')], ephemeral: true });
      return;
    }

    await removeUserFromTicket(channel, target);
    await interaction.reply({ embeds: [createSuccessEmbed('User Removed', `${target} has been removed from this ticket.`)] });
  },
};

export default command;
