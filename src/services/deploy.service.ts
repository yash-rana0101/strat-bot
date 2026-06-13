import {
  type Guild,
  type Role,
  ChannelType,
  OverwriteType,
  type GuildChannelCreateOptions,
  type OverwriteResolvable,
} from 'discord.js';
import { CATEGORIES } from '../config/server.config.js';
import { ROLES } from '../config/roles.config.js';
import {
  CATEGORY_PERMISSIONS,
  CHANNEL_OVERRIDES,
  MUTED_OVERRIDES,
} from '../config/permissions.config.js';
import { logger } from '../utils/logger.js';

export async function deployRoles(guild: Guild): Promise<Map<string, Role>> {
  const roleMap = new Map<string, Role>();
  logger.info('Deploying roles...');

  const sortedRoles = [...ROLES].sort((a, b) => a.position - b.position);

  for (const config of sortedRoles) {
    let role = guild.roles.cache.find((r) => r.name === config.name);

    if (!role) {
      role = await guild.roles.create({
        name: config.name,
        color: config.color,
        hoist: config.hoist,
        mentionable: config.mentionable,
        permissions: config.permissions,
        reason: 'Strat AI server deployment',
      });
      logger.info(`  Created role: ${config.name}`);
    } else {
      await role.edit({
        color: config.color,
        hoist: config.hoist,
        mentionable: config.mentionable,
        permissions: config.permissions,
      });
      logger.info(`  Updated role: ${config.name}`);
    }

    roleMap.set(config.name, role);
  }

  logger.info(`Deployed ${roleMap.size} roles`);
  return roleMap;
}

function buildOverwrites(
  guild: Guild,
  roleMap: Map<string, Role>,
  categoryName: string,
  channelName?: string
): OverwriteResolvable[] {
  const overwrites: OverwriteResolvable[] = [];
  const catPerms = CATEGORY_PERMISSIONS[categoryName] || {};
  const chanOverrides = channelName ? CHANNEL_OVERRIDES[channelName] || {} : {};

  for (const [roleName, perms] of Object.entries(catPerms)) {
    const merged = chanOverrides[roleName] || perms;
    const id = roleName === '@everyone' ? guild.id : roleMap.get(roleName)?.id;
    if (!id) continue;

    overwrites.push({
      id,
      type: roleName === '@everyone' ? OverwriteType.Role : OverwriteType.Role,
      allow: merged.allow || [],
      deny: merged.deny || [],
    });
  }

  const mutedRole = roleMap.get('Muted');
  if (mutedRole && categoryName !== '🔒 INTERNAL') {
    overwrites.push({
      id: mutedRole.id,
      type: OverwriteType.Role,
      allow: MUTED_OVERRIDES.allow || [],
      deny: MUTED_OVERRIDES.deny || [],
    });
  }

  return overwrites;
}

export async function deployChannels(
  guild: Guild,
  roleMap: Map<string, Role>
): Promise<void> {
  logger.info('Deploying categories and channels...');

  for (const category of CATEGORIES) {
    let cat = guild.channels.cache.find(
      (c) => c.name === category.name && c.type === ChannelType.GuildCategory
    );

    const catOverwrites = buildOverwrites(guild, roleMap, category.name);

    if (!cat) {
      cat = await guild.channels.create({
        name: category.name,
        type: ChannelType.GuildCategory,
        position: category.position,
        permissionOverwrites: catOverwrites,
        reason: 'Strat AI server deployment',
      });
      logger.info(`  Created category: ${category.name}`);
    }

    for (const channel of category.channels) {
      const existing = guild.channels.cache.find(
        (c) => c.name === channel.name && c.parentId === cat!.id
      );

      const channelOverwrites = buildOverwrites(guild, roleMap, category.name, channel.name);

      const opts: GuildChannelCreateOptions = {
        name: channel.name,
        type: ChannelType.GuildText,
        parent: cat.id,
        topic: channel.topic,
        rateLimitPerUser: channel.slowmode || 0,
        permissionOverwrites: channelOverwrites,
        reason: 'Strat AI server deployment',
      };

      if (!existing) {
        await guild.channels.create(opts);
        logger.info(`    Created channel: #${channel.name}`);
      } else {
        logger.info(`    Channel exists: #${channel.name}`);
      }
    }

    if (category.voiceChannels) {
      for (const vc of category.voiceChannels) {
        const existing = guild.channels.cache.find(
          (c) => c.name === vc.name && c.parentId === cat!.id
        );

        if (!existing) {
          await guild.channels.create({
            name: vc.name,
            type: ChannelType.GuildVoice,
            parent: cat.id,
            userLimit: vc.userLimit || 0,
            permissionOverwrites: catOverwrites,
            reason: 'Strat AI server deployment',
          });
          logger.info(`    Created voice: 🔊 ${vc.name}`);
        }
      }
    }
  }

  logger.info('Channel deployment complete');
}

export async function deployServer(guild: Guild): Promise<void> {
  logger.info('━━━ Starting Strat AI Server Deployment ━━━');
  const roleMap = await deployRoles(guild);
  await deployChannels(guild, roleMap);
  logger.info('━━━ Deployment Complete ━━━');
}
