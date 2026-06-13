import { SlashCommandBuilder, PermissionFlagsBits, type ChatInputCommandInteraction, type GuildMember } from 'discord.js';
import type { BotCommand } from '../../types/index.js';
import { muteMember } from '../../services/moderation.service.js';
import { logModAction } from '../../services/logging.service.js';
import { trackEvent } from '../../services/analytics.service.js';
import { AnalyticsEventType } from '../../types/index.js';
import { canModerate } from '../../utils/permissions.js';
import { parseDuration, formatDuration } from '../../utils/time.js';
import { createSuccessEmbed, createErrorEmbed } from '../../utils/embed-builder.js';

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Timeout a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((opt) => opt.setName('user').setDescription('User to mute').setRequired(true))
    .addStringOption((opt) => opt.setName('duration').setDescription('Duration (e.g., 30m, 2h, 1d)').setRequired(true))
    .addStringOption((opt) => opt.setName('reason').setDescription('Reason for mute').setRequired(true)),
  requiredRoles: ['Founder', 'Core Team', 'Moderator'],

  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getMember('user') as GuildMember | null;
    const durationStr = interaction.options.getString('duration', true);
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

    const durationMs = parseDuration(durationStr);
    if (!durationMs) {
      await interaction.reply({ embeds: [createErrorEmbed('Error', 'Invalid duration. Use format: 30m, 2h, 1d, 1w')], ephemeral: true });
      return;
    }

    const id = await muteMember(target, actor, durationMs, reason);
    const description = `**${target.user.tag}** has been muted for **${formatDuration(durationMs)}**.\n**Reason:** ${reason}\n**Infraction ID:** #${id}`;

    await interaction.reply({ embeds: [createSuccessEmbed('Member Muted', description)] });
    await logModAction(interaction.guild!, 'Mute', actor.id, target.id, `${reason} (${formatDuration(durationMs)})`);
    trackEvent(AnalyticsEventType.InfractionIssued, target.id, undefined, { type: 'mute' });
  },
};

export default command;
