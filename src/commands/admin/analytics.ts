import { SlashCommandBuilder, PermissionFlagsBits, type ChatInputCommandInteraction } from 'discord.js';
import type { BotCommand } from '../../types/index.js';
import { buildAnalyticsEmbed } from '../../services/analytics.service.js';

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('analytics')
    .setDescription('Generate server analytics report')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((opt) =>
      opt
        .setName('period')
        .setDescription('Report period')
        .setRequired(true)
        .addChoices(
          { name: 'Daily', value: 'daily' },
          { name: 'Weekly', value: 'weekly' },
          { name: 'Monthly', value: 'monthly' }
        )
    ),
  requiredRoles: ['Founder', 'Core Team', 'Moderator'],

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) return;

    const period = interaction.options.getString('period', true) as 'daily' | 'weekly' | 'monthly';

    await interaction.deferReply({ ephemeral: true });

    const embed = await buildAnalyticsEmbed(guild, period);
    await interaction.editReply({ embeds: [embed] });
  },
};

export default command;
