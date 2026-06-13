import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, type ChatInputCommandInteraction, type TextChannel } from 'discord.js';
import type { BotCommand } from '../../types/index.js';
import { createFromConfig } from '../../utils/embed-builder.js';
import { WELCOME_EMBED } from '../../config/embeds.config.js';
import { createSuccessEmbed, createErrorEmbed } from '../../utils/embed-builder.js';

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('setup-welcome')
    .setDescription('Set up the welcome system in #welcome')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  requiredRoles: ['Founder', 'Core Team'],

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) return;

    await interaction.deferReply({ ephemeral: true });

    const welcomeChannel = guild.channels.cache.find(
      (c) => c.name === 'welcome' && c.type === ChannelType.GuildText
    ) as TextChannel | undefined;

    if (!welcomeChannel) {
      const embed = createErrorEmbed('Channel Not Found', '#welcome channel does not exist. Run `/deploy` first.');
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const embed = createFromConfig(WELCOME_EMBED);
    await welcomeChannel.send({ embeds: [embed] });

    const successEmbed = createSuccessEmbed('Welcome Setup Complete', 'Welcome embed has been posted to #welcome.');
    await interaction.editReply({ embeds: [successEmbed] });
  },
};

export default command;
