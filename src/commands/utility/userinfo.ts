import { SlashCommandBuilder, type ChatInputCommandInteraction, type GuildMember } from 'discord.js';
import type { BotCommand } from '../../types/index.js';
import { createBrandedEmbed } from '../../utils/embed-builder.js';
import { BRAND_COLOR } from '../../config/server.config.js';
import { discordTimestamp } from '../../utils/time.js';

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Display user information')
    .addUserOption((opt) => opt.setName('user').setDescription('User to inspect').setRequired(false)),

  async execute(interaction: ChatInputCommandInteraction) {
    const target = (interaction.options.getMember('user') || interaction.member) as GuildMember;
    const user = target.user;

    const roles = target.roles.cache
      .filter((r) => r.name !== '@everyone')
      .sort((a, b) => b.position - a.position)
      .map((r) => `${r}`)
      .slice(0, 15)
      .join(', ') || 'None';

    const embed = createBrandedEmbed({
      title: `👤 ${user.tag}`,
      color: BRAND_COLOR,
    });

    if (user.avatarURL()) {
      embed.setThumbnail(user.avatarURL({ size: 256 })!);
    }

    embed.addFields(
      { name: '🆔 User ID', value: user.id, inline: true },
      { name: '📛 Nickname', value: target.nickname || 'None', inline: true },
      { name: '🤖 Bot', value: user.bot ? 'Yes' : 'No', inline: true },
      { name: '📅 Account Created', value: discordTimestamp(user.createdAt, 'F'), inline: true },
      { name: '📥 Joined Server', value: target.joinedAt ? discordTimestamp(target.joinedAt, 'F') : 'Unknown', inline: true },
      { name: '🎨 Top Role', value: `${target.roles.highest}`, inline: true },
      { name: `🎭 Roles (${target.roles.cache.size - 1})`, value: roles, inline: false },
    );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

export default command;
