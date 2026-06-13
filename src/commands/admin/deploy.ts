import { SlashCommandBuilder, PermissionFlagsBits, type ChatInputCommandInteraction } from 'discord.js';
import type { BotCommand } from '../../types/index.js';
import type { BotClient } from '../../client.js';
import { deployServer } from '../../services/deploy.service.js';
import { createSuccessEmbed, createErrorEmbed, createInfoEmbed } from '../../utils/embed-builder.js';

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('deploy')
    .setDescription('Deploy the complete Strat AI server infrastructure')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addBooleanOption((opt) =>
      opt.setName('confirm').setDescription('Confirm deployment').setRequired(true)
    ),
  requiredRoles: ['Founder', 'Core Team'],

  async execute(interaction: ChatInputCommandInteraction) {
    const confirm = interaction.options.getBoolean('confirm', true);
    if (!confirm) {
      const embed = createInfoEmbed('Deployment Cancelled', 'Set confirm to true to proceed.');
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const guild = interaction.guild;
    if (!guild) return;

    await interaction.deferReply({ ephemeral: true });

    try {
      await deployServer(guild);
      const embed = createSuccessEmbed(
        'Server Deployed',
        [
          'The Strat AI server infrastructure has been deployed successfully.',
          '',
          '**Next Steps:**',
          '• `/setup-welcome` — Set up welcome messages',
          '• `/setup-rules` — Set up rules and verification',
          '• `/setup-tickets` — Set up ticket system',
          '• `/setup-automod` — Set up AutoMod rules',
        ].join('\n')
      );
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      const embed = createErrorEmbed('Deployment Failed', `${error}`);
      await interaction.editReply({ embeds: [embed] });
    }
  },
};

export default command;
