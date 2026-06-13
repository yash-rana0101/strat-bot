import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import type { BotCommand } from '../../types/index.js';
import { createBrandedEmbed } from '../../utils/embed-builder.js';
import { BRAND_COLOR, WEBSITE_URL } from '../../config/server.config.js';

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Display server statistics'),

  async execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) return;

    const owner = await guild.fetchOwner();
    const textChannels = guild.channels.cache.filter((c) => c.type === 0).size;
    const voiceChannels = guild.channels.cache.filter((c) => c.type === 2).size;
    const categories = guild.channels.cache.filter((c) => c.type === 4).size;
    const roles = guild.roles.cache.size;
    const emojis = guild.emojis.cache.size;
    const boostLevel = guild.premiumTier;
    const boostCount = guild.premiumSubscriptionCount || 0;
    const created = `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`;

    const embed = createBrandedEmbed({
      title: `📊 ${guild.name}`,
      description: `**${WEBSITE_URL}** — Market Intelligence. One Terminal.`,
      color: BRAND_COLOR,
    });

    if (guild.iconURL()) {
      embed.setThumbnail(guild.iconURL({ size: 256 })!);
    }

    embed.addFields(
      { name: '👑 Owner', value: `${owner.user.tag}`, inline: true },
      { name: '📅 Created', value: created, inline: true },
      { name: '👥 Members', value: `${guild.memberCount}`, inline: true },
      { name: '💬 Text Channels', value: `${textChannels}`, inline: true },
      { name: '🔊 Voice Channels', value: `${voiceChannels}`, inline: true },
      { name: '📁 Categories', value: `${categories}`, inline: true },
      { name: '🎭 Roles', value: `${roles}`, inline: true },
      { name: '😀 Emojis', value: `${emojis}`, inline: true },
      { name: '🚀 Boost Level', value: `Tier ${boostLevel} (${boostCount} boosts)`, inline: true },
    );

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;
