import { SlashCommandBuilder, PermissionFlagsBits, type ChatInputCommandInteraction } from 'discord.js';
import type { BotCommand } from '../../types/index.js';
import { getInfractions } from '../../services/moderation.service.js';
import { createBrandedEmbed, createInfoEmbed } from '../../utils/embed-builder.js';
import { BRAND_COLOR } from '../../config/server.config.js';

const command: BotCommand = {
  data: new SlashCommandBuilder()
    .setName('infractions')
    .setDescription('View infraction history for a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((opt) => opt.setName('user').setDescription('User to check').setRequired(true)),
  requiredRoles: ['Founder', 'Core Team', 'Moderator', 'Support'],

  async execute(interaction: ChatInputCommandInteraction) {
    const target = interaction.options.getUser('user', true);
    const infractions = await getInfractions(target.id);

    if (infractions.length === 0) {
      const embed = createInfoEmbed('No Infractions', `**${target.tag}** has a clean record.`);
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const list = infractions.slice(0, 15).map((inf) => {
      const status = inf.active ? '🔴' : '⚪';
      const date = new Date(inf.created_at).toLocaleDateString();
      return `${status} **#${inf.id}** | ${inf.type.toUpperCase()} | ${date}\n└ ${inf.reason} (by <@${inf.moderator_id}>)`;
    });

    const embed = createBrandedEmbed({
      title: `📋 Infractions — ${target.tag}`,
      description: list.join('\n\n'),
      color: BRAND_COLOR,
    });

    embed.addFields({
      name: 'Summary',
      value: `Total: **${infractions.length}** | Active: **${infractions.filter((i) => i.active).length}**`,
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

export default command;
