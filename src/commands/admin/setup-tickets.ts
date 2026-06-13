import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, type ChatInputCommandInteraction, type TextChannel } from 'discord.js';
import type { BotCommand } from '../../types/index.js';
import { createFromConfig, createSuccessEmbed, createErrorEmbed } from '../../utils/embed-builder.js';
import { TICKET_PANEL_EMBED } from '../../config/embeds.config.js';
import { buildTicketPanelButtons } from '../../services/ticket.service.js';

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('setup-tickets')
    .setDescription('Set up the ticket system in #create-ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  requiredRoles: ['Founder', 'Core Team'],

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) return;

    await interaction.deferReply({ ephemeral: true });

    const ticketChannel = guild.channels.cache.find(
      (c) => c.name === 'create-ticket' && c.type === ChannelType.GuildText
    ) as TextChannel | undefined;

    if (!ticketChannel) {
      const embed = createErrorEmbed('Channel Not Found', '#create-ticket does not exist. Run `/deploy` first.');
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const embed = createFromConfig(TICKET_PANEL_EMBED);
    const buttons = buildTicketPanelButtons();
    await ticketChannel.send({ embeds: [embed], components: buttons });

    const successEmbed = createSuccessEmbed(
      'Ticket System Setup Complete',
      'Ticket panel with 5 categories has been posted to #create-ticket.'
    );
    await interaction.editReply({ embeds: [successEmbed] });
  },
};

export default command;
