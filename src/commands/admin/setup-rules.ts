import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, type ChatInputCommandInteraction, type TextChannel } from 'discord.js';
import type { BotCommand } from '../../types/index.js';
import { createFromConfig, createSuccessEmbed, createErrorEmbed } from '../../utils/embed-builder.js';
import { RULES_EMBED } from '../../config/embeds.config.js';
import { buildVerificationEmbed, buildVerificationButton } from '../../services/welcome.service.js';

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('setup-rules')
    .setDescription('Set up the rules and verification system in #rules')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  requiredRoles: ['Founder', 'Core Team'],

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) return;

    await interaction.deferReply({ ephemeral: true });

    const rulesChannel = guild.channels.cache.find(
      (c) => c.name === 'rules' && c.type === ChannelType.GuildText
    ) as TextChannel | undefined;

    if (!rulesChannel) {
      const embed = createErrorEmbed('Channel Not Found', '#rules channel does not exist. Run `/deploy` first.');
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const rulesEmbed = createFromConfig(RULES_EMBED);
    await rulesChannel.send({ embeds: [rulesEmbed] });

    const verifyEmbed = buildVerificationEmbed();
    const verifyButton = buildVerificationButton();
    await rulesChannel.send({ embeds: [verifyEmbed], components: [verifyButton] });

    const successEmbed = createSuccessEmbed(
      'Rules Setup Complete',
      'Rules embed and verification button have been posted to #rules.'
    );
    await interaction.editReply({ embeds: [successEmbed] });
  },
};

export default command;
