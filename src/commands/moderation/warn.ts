import { SlashCommandBuilder, PermissionFlagsBits, type ChatInputCommandInteraction, type GuildMember } from 'discord.js';
import type { BotCommand } from '../../types/index.js';
import { warnMember } from '../../services/moderation.service.js';
import { logModAction } from '../../services/logging.service.js';
import { trackEvent } from '../../services/analytics.service.js';
import { AnalyticsEventType } from '../../types/index.js';
import { canModerate } from '../../utils/permissions.js';
import { createSuccessEmbed, createErrorEmbed } from '../../utils/embed-builder.js';

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Issue a warning to a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((opt) => opt.setName('user').setDescription('User to warn').setRequired(true))
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason for warning').setRequired(true)),
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

    const result = await warnMember(target, actor, reason);
    let description = `**${target.user.tag}** has been warned.\n**Reason:** ${reason}\n**Infraction ID:** #${result.infractionId}`;

    if (result.escalated) {
      description += `\n\n⚠️ **Auto-escalation:** ${result.escalationAction}`;
    }

    await interaction.reply({ embeds: [createSuccessEmbed('Warning Issued', description)] });
    await logModAction(interaction.guild!, 'Warning', actor.id, target.id, reason);
    trackEvent(AnalyticsEventType.InfractionIssued, target.id, undefined, { type: 'warning' });
  },
};

export default command;
