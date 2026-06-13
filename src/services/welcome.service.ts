import {
  type GuildMember,
  type TextChannel,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { createFromConfig } from '../utils/embed-builder.js';
import { WELCOME_EMBED, VERIFICATION_EMBED } from '../config/embeds.config.js';
import { logger } from '../utils/logger.js';
import { sql } from '../database/connection.js';

export async function sendWelcomeDM(member: GuildMember): Promise<void> {
  try {
    const embed = createFromConfig({
      ...WELCOME_EMBED,
      description: WELCOME_EMBED.description
        .replace(/<#rules>/g, '#rules')
        .replace(/<#introductions>/g, '#introductions')
        .replace(/<#general>/g, '#general'),
    });

    await member.send({ embeds: [embed] });
    logger.info(`Welcome DM sent to ${member.user.tag}`);
  } catch {
    logger.warn(`Could not DM ${member.user.tag} (DMs disabled)`);
  }
}

export async function sendWelcomeChannel(
  member: GuildMember,
  channel: TextChannel
): Promise<void> {
  const embed = createFromConfig({
    title: '👋 New Member!',
    description: [
      `Welcome ${member} to **Strat AI**!`,
      '',
      `You are member **#${member.guild.memberCount}**`,
      '',
      'Head over to <#rules> to get started.',
    ].join('\n'),
    color: 0x6C5CE7,
  });

  await channel.send({ embeds: [embed] });
}

export async function assignUnverifiedRole(member: GuildMember): Promise<void> {
  const role = member.guild.roles.cache.find((r) => r.name === 'Unverified');
  if (role) {
    await member.roles.add(role, 'New member — awaiting verification');
    logger.info(`Assigned Unverified role to ${member.user.tag}`);
  }
}

export async function verifyMember(member: GuildMember): Promise<void> {
  const guild = member.guild;
  const unverifiedRole = guild.roles.cache.find((r) => r.name === 'Unverified');
  const memberRole = guild.roles.cache.find((r) => r.name === 'Member');

  if (unverifiedRole && member.roles.cache.has(unverifiedRole.id)) {
    await member.roles.remove(unverifiedRole, 'Verification complete');
  }

  if (memberRole) {
    await member.roles.add(memberRole, 'Verification complete');
  }

  try {
    await sql`
      INSERT INTO members (user_id, username, verified_at)
      VALUES (${member.id}, ${member.user.tag}, NOW())
      ON CONFLICT (user_id) DO UPDATE SET verified_at = EXCLUDED.verified_at
    `;
    logger.info(`Verified member in DB: ${member.user.tag}`);
  } catch (err: any) {
    logger.error(`Failed to verify member in database: ${err.message}`);
  }
}

export function buildVerificationButton(): ActionRowBuilder<ButtonBuilder> {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('verify_accept')
      .setLabel('I Accept the Rules — Verify Me')
      .setEmoji('✅')
      .setStyle(ButtonStyle.Success)
  );
}

export function buildVerificationEmbed() {
  return createFromConfig(VERIFICATION_EMBED);
}

export async function trackMemberJoin(member: GuildMember): Promise<void> {
  try {
    await sql`
      INSERT INTO members (user_id, username)
      VALUES (${member.id}, ${member.user.tag})
      ON CONFLICT (user_id) DO UPDATE SET username = EXCLUDED.username
    `;
  } catch (err: any) {
    logger.error(`Failed to track member join in database: ${err.message}`);
  }
}
