import { type GuildMember, type Guild } from 'discord.js';
import { sql } from '../database/connection.js';
import { InfractionType } from '../types/index.js';
import { SECURITY_CONFIG } from '../config/security.config.js';
import { logger } from '../utils/logger.js';
import { formatDuration } from '../utils/time.js';

export async function addInfraction(
  userId: string,
  moderatorId: string,
  type: InfractionType,
  reason: string,
  duration?: number
): Promise<number> {
  const expiresAt = duration
    ? new Date(Date.now() + duration).toISOString()
    : null;

  try {
    const [result] = await sql<Array<{ id: string }>>`
      INSERT INTO infractions (user_id, moderator_id, type, reason, duration, expires_at)
      VALUES (${userId}, ${moderatorId}, ${type}, ${reason}, ${duration || null}, ${expiresAt})
      RETURNING id
    `;
    return parseInt(result?.id || '0', 10);
  } catch (err: any) {
    logger.error(`Failed to add infraction to database: ${err.message}`);
    return 0;
  }
}

export async function getInfractions(userId: string): Promise<Array<{
  id: number;
  type: string;
  reason: string;
  moderator_id: string;
  created_at: string;
  active: number;
}>> {
  try {
    const rows = await sql`
      SELECT id, type, reason, moderator_id, created_at, active
      FROM infractions
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    return rows as any;
  } catch (err: any) {
    logger.error(`Failed to get infractions from database: ${err.message}`);
    return [];
  }
}

export async function getActiveWarnings(userId: string): Promise<number> {
  try {
    const [row] = await sql<Array<{ count: string }>>`
      SELECT COUNT(*) as count
      FROM infractions
      WHERE user_id = ${userId} AND type = 'warning' AND active = 1
    `;
    return parseInt(row?.count || '0', 10);
  } catch (err: any) {
    logger.error(`Failed to get active warnings count: ${err.message}`);
    return 0;
  }
}

export async function warnMember(
  member: GuildMember,
  moderator: GuildMember,
  reason: string
): Promise<{ infractionId: number; escalated: boolean; escalationAction?: string }> {
  const id = await addInfraction(member.id, moderator.id, InfractionType.Warning, reason);
  const warnings = await getActiveWarnings(member.id);
  const esc = SECURITY_CONFIG.escalation;

  let escalated = false;
  let escalationAction: string | undefined;

  if (warnings >= esc.warnsBeforeBan) {
    await member.ban({ reason: `Auto-ban: ${warnings} warnings. Last: ${reason}` });
    escalated = true;
    escalationAction = 'ban';
  } else if (warnings >= esc.warnsBeforeKick) {
    await member.kick(`Auto-kick: ${warnings} warnings. Last: ${reason}`);
    escalated = true;
    escalationAction = 'kick';
  } else if (warnings >= esc.warnsBeforeMute) {
    await member.timeout(esc.muteDurationMs, `Auto-mute: ${warnings} warnings. Last: ${reason}`);
    await addInfraction(
      member.id,
      moderator.id,
      InfractionType.Timeout,
      `Auto-escalation: ${warnings} warnings`,
      esc.muteDurationMs
    );
    escalated = true;
    escalationAction = `mute (${formatDuration(esc.muteDurationMs)})`;
  }

  logger.info(`Warning #${warnings} issued to ${member.user.tag} by ${moderator.user.tag}: ${reason}`);
  return { infractionId: id, escalated, escalationAction };
}

export async function muteMember(
  member: GuildMember,
  moderator: GuildMember,
  durationMs: number,
  reason: string
): Promise<number> {
  await member.timeout(durationMs, reason);
  const id = await addInfraction(member.id, moderator.id, InfractionType.Mute, reason, durationMs);
  logger.info(`Muted ${member.user.tag} for ${formatDuration(durationMs)} by ${moderator.user.tag}: ${reason}`);
  return id;
}

export async function kickMember(
  member: GuildMember,
  moderator: GuildMember,
  reason: string
): Promise<number> {
  const id = await addInfraction(member.id, moderator.id, InfractionType.Kick, reason);
  await member.kick(reason);
  logger.info(`Kicked ${member.user.tag} by ${moderator.user.tag}: ${reason}`);
  return id;
}

export async function banMember(
  member: GuildMember,
  moderator: GuildMember,
  reason: string
): Promise<number> {
  const id = await addInfraction(member.id, moderator.id, InfractionType.Ban, reason);
  await member.ban({ reason, deleteMessageSeconds: 86400 });
  logger.info(`Banned ${member.user.tag} by ${moderator.user.tag}: ${reason}`);
  return id;
}
