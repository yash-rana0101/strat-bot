import { SlashCommandBuilder, PermissionFlagsBits, type ChatInputCommandInteraction, type GuildMember } from 'discord.js';
import type { BotCommand } from '../../types/index.js';
import { banMember } from '../../services/moderation.service.js';
import { logModAction } from '../../services/logging.service.js';
import { trackEvent } from '../../services/analytics.service.js';
import { AnalyticsEventType } from '../../types/index.js';
import { canModerate } from '../../utils/permissions.js';
import { createSuccessEmbed, createErrorEmbed } from '../../utils/embed-builder.js';

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((opt) => opt.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason for ban').setRequired(true)),
  requiredRoles: ['Founder', 'Core Team', 'Moderator'],

  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getMember('user') as GuildMember | null;
    const reason = interaction.options.getString('reason', true);
    const actor = interaction.member as GuildMember;

    if (!target) {
      await interaction.reply({ embeds: [createErrorEmbed('Error', 'User not found.')], ephemeral: true });
      return;
    }

    if (!canModerate(actor, target)) {
      await interaction.reply({ embeds: [createErrorEmbed('Error', 'You cannot moderate this user.')], ephemeral: true });
      return;
    }

    const id = await banMember(target, actor, reason);
    const description = `**${target.user.tag}** has been banned.\n**Reason:** ${reason}\n**Infraction ID:** #${id}`;

    await interaction.reply({ embeds: [createSuccessEmbed('Member Banned', description)] });
    await logModAction(interaction.guild!, 'Ban', actor.id, target.id, reason);
    trackEvent(AnalyticsEventType.InfractionIssued, target.id, undefined, { type: 'ban' });
  },
};

export default command;
