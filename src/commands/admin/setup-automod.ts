import { SlashCommandBuilder, PermissionFlagsBits, type ChatInputCommandInteraction } from 'discord.js';
import type { BotCommand } from '../../types/index.js';
import { setupAutoModRules } from '../../services/automod.service.js';
import { createSuccessEmbed, createErrorEmbed } from '../../utils/embed-builder.js';

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('setup-automod')
    .setDescription('Set up Discord AutoMod rules')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  requiredRoles: ['Founder', 'Core Team'],

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) return;

    await interaction.deferReply({ ephemeral: true });

    try {
      await setupAutoModRules(guild);
      const embed = createSuccessEmbed(
        'AutoMod Setup Complete',
        [
          'The following AutoMod rules have been configured:',
          '',
          '• **Block Harmful Links** — Non-whitelisted URLs blocked',
          '• **Block Spam Content** — Automated spam detection',
          '• **Block Mention Spam** — 5+ mention limit',
          '• **Block Profanity and Slurs** — All presets enabled',
        ].join('\n')
      );
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      const embed = createErrorEmbed('AutoMod Setup Failed', `${error}`);
      await interaction.editReply({ embeds: [embed] });
    }
  },
};

export default command;
