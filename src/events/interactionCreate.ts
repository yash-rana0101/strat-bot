import {
  Events,
  type Interaction,
  type ChatInputCommandInteraction,
  type ButtonInteraction,
  type GuildMember,
  type TextChannel,
} from 'discord.js';
import type { BotClient } from '../client.js';
import type { BotEvent } from '../types/index.js';
import { TicketCategory } from '../types/index.js';
import { checkCommandPermission } from '../utils/permissions.js';
import { createErrorEmbed } from '../utils/embed-builder.js';
import { createTicket, closeTicket } from '../services/ticket.service.js';
import { verifyMember } from '../services/welcome.service.js';
import { logTicketAction } from '../services/logging.service.js';
import { trackEvent } from '../services/analytics.service.js';
import { AnalyticsEventType } from '../types/index.js';
import { logger } from '../utils/logger.js';

async function handleCommand(interaction: ChatInputCommandInteraction, client: BotClient): Promise<void> {
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  const member = interaction.member as GuildMember;
  if (!checkCommandPermission(member, command.requiredRoles)) {
    const embed = createErrorEmbed('Permission Denied', 'You do not have permission to use this command.');
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  try {
    await command.execute(interaction, client);
    trackEvent(AnalyticsEventType.CommandUsed, member.id, interaction.channelId, { command: interaction.commandName });
  } catch (error) {
    logger.error(`Command error (${interaction.commandName}):`, error);
    const embed = createErrorEmbed('Error', 'An error occurred while executing this command.');
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ embeds: [embed], ephemeral: true });
    } else {
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
}

async function handleButton(interaction: ButtonInteraction, client: BotClient): Promise<void> {
  const { customId } = interaction;
  const member = interaction.member as GuildMember;
  const guild = interaction.guild;
  if (!guild) return;

  if (customId === 'verify_accept') {
    await interaction.deferReply({ ephemeral: true });
    await verifyMember(member);
    await interaction.editReply({ content: '✅ You have been verified! Welcome to Strat AI.' });
    return;
  }

  if (customId.startsWith('ticket_create_')) {
    const category = customId.replace('ticket_create_', '') as TicketCategory;
    await createTicket(guild, member, category, interaction);
    trackEvent(AnalyticsEventType.TicketCreated, member.id, undefined, { category });
    await logTicketAction(guild, 'Ticket Created', member.id, `${category}`);
    return;
  }

  if (customId === 'ticket_close') {
    const channel = interaction.channel as TextChannel;
    await interaction.reply({ content: '🔒 Closing ticket...', ephemeral: true });
    await closeTicket(channel, member);
    trackEvent(AnalyticsEventType.TicketClosed, member.id);
    await logTicketAction(guild, 'Ticket Closed', member.id, channel.name);
    return;
  }
}

const event: BotEvent = {
  name: Events.InteractionCreate,
  execute: async (interaction: Interaction) => {
    const client = interaction.client as BotClient;

    if (interaction.isChatInputCommand()) {
      await handleCommand(interaction, client);
    } else if (interaction.isButton()) {
      await handleButton(interaction, client);
    }
  },
};

export default event;
