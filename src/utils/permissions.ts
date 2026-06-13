import { type GuildMember, PermissionFlagsBits } from 'discord.js';
import { STAFF_ROLES } from '../config/roles.config.js';

export function isStaff(member: GuildMember): boolean {
  return STAFF_ROLES.some((role) => member.roles.cache.some((r) => r.name === role));
}

export function isAdmin(member: GuildMember): boolean {
  return member.permissions.has(PermissionFlagsBits.Administrator);
}

export function isModerator(member: GuildMember): boolean {
  return member.roles.cache.some((r) =>
    ['Founder', 'Core Team', 'Moderator'].includes(r.name)
  );
}

export function hasRole(member: GuildMember, roleName: string): boolean {
  return member.roles.cache.some((r) => r.name === roleName);
}

export function isHigherRole(actor: GuildMember, target: GuildMember): boolean {
  return actor.roles.highest.position > target.roles.highest.position;
}

export function canModerate(actor: GuildMember, target: GuildMember): boolean {
  if (!isStaff(actor)) return false;
  if (target.id === actor.id) return false;
  if (isAdmin(target)) return false;
  return isHigherRole(actor, target);
}

export function checkCommandPermission(
  member: GuildMember,
  requiredRoles?: string[]
): boolean {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  if (isAdmin(member)) return true;
  return requiredRoles.some((role) => hasRole(member, role));
}
