import { PermissionFlagsBits } from 'discord.js';

export interface PermissionOverwriteConfig {
  allow?: bigint[];
  deny?: bigint[];
}

export type PermissionMatrix = Record<string, Record<string, PermissionOverwriteConfig>>;

const VIEW = PermissionFlagsBits.ViewChannel;
const SEND = PermissionFlagsBits.SendMessages;
const READ = PermissionFlagsBits.ReadMessageHistory;
const REACT = PermissionFlagsBits.AddReactions;
const EMBED = PermissionFlagsBits.EmbedLinks;
const ATTACH = PermissionFlagsBits.AttachFiles;
const CONNECT = PermissionFlagsBits.Connect;
const SPEAK = PermissionFlagsBits.Speak;
const MANAGE_MSG = PermissionFlagsBits.ManageMessages;
const THREADS = PermissionFlagsBits.CreatePublicThreads;

const READONLY_MEMBER = { allow: [VIEW, READ, REACT], deny: [SEND] };
const FULL_ACCESS = { allow: [VIEW, SEND, READ, REACT, EMBED, ATTACH] };
const STAFF_ACCESS = { allow: [VIEW, SEND, READ, REACT, EMBED, ATTACH, MANAGE_MSG, THREADS] };
const NO_ACCESS = { deny: [VIEW] };
const VOICE_ACCESS = { allow: [VIEW, CONNECT, SPEAK] };

/** Category-level defaults. Channel-level overrides take precedence. */
export const CATEGORY_PERMISSIONS: PermissionMatrix = {
  '📢 INFORMATION': {
    '@everyone': NO_ACCESS,
    Unverified: { allow: [VIEW, READ], deny: [SEND] },
    Member: READONLY_MEMBER,
    'Verified User': READONLY_MEMBER,
    'Beta Tester': READONLY_MEMBER,
    Support: STAFF_ACCESS,
    Moderator: STAFF_ACCESS,
    Developer: STAFF_ACCESS,
    'Core Team': STAFF_ACCESS,
    Founder: STAFF_ACCESS,
  },
  '🌐 COMMUNITY': {
    '@everyone': NO_ACCESS,
    Unverified: NO_ACCESS,
    Member: FULL_ACCESS,
    'Verified User': FULL_ACCESS,
    'Beta Tester': FULL_ACCESS,
    Support: STAFF_ACCESS,
    Moderator: STAFF_ACCESS,
    Developer: STAFF_ACCESS,
    'Core Team': STAFF_ACCESS,
    Founder: STAFF_ACCESS,
  },
  '📈 MARKETS': {
    '@everyone': NO_ACCESS,
    Unverified: NO_ACCESS,
    Member: FULL_ACCESS,
    'Verified User': FULL_ACCESS,
    'Beta Tester': FULL_ACCESS,
    Support: STAFF_ACCESS,
    Moderator: STAFF_ACCESS,
    Developer: STAFF_ACCESS,
    'Core Team': STAFF_ACCESS,
    Founder: STAFF_ACCESS,
  },
  '🧠 STRAT AI': {
    '@everyone': NO_ACCESS,
    Unverified: NO_ACCESS,
    Member: { allow: [VIEW, READ, REACT], deny: [SEND] },
    'Verified User': FULL_ACCESS,
    'Beta Tester': FULL_ACCESS,
    Support: STAFF_ACCESS,
    Moderator: STAFF_ACCESS,
    Developer: STAFF_ACCESS,
    'Core Team': STAFF_ACCESS,
    Founder: STAFF_ACCESS,
  },
  '🛠 SUPPORT': {
    '@everyone': NO_ACCESS,
    Unverified: NO_ACCESS,
    Member: FULL_ACCESS,
    'Verified User': FULL_ACCESS,
    'Beta Tester': FULL_ACCESS,
    Support: STAFF_ACCESS,
    Moderator: STAFF_ACCESS,
    Developer: STAFF_ACCESS,
    'Core Team': STAFF_ACCESS,
    Founder: STAFF_ACCESS,
  },
  '🔒 INTERNAL': {
    '@everyone': NO_ACCESS,
    Unverified: NO_ACCESS,
    Member: NO_ACCESS,
    'Verified User': NO_ACCESS,
    'Beta Tester': NO_ACCESS,
    Support: STAFF_ACCESS,
    Moderator: STAFF_ACCESS,
    Developer: STAFF_ACCESS,
    'Core Team': STAFF_ACCESS,
    Founder: STAFF_ACCESS,
  },
  '🔊 VOICE': {
    '@everyone': NO_ACCESS,
    Unverified: NO_ACCESS,
    Member: VOICE_ACCESS,
    'Verified User': VOICE_ACCESS,
    'Beta Tester': VOICE_ACCESS,
    Support: { allow: [VIEW, CONNECT, SPEAK, PermissionFlagsBits.MoveMembers] },
    Moderator: { allow: [VIEW, CONNECT, SPEAK, PermissionFlagsBits.MoveMembers, PermissionFlagsBits.MuteMembers] },
    Developer: VOICE_ACCESS,
    'Core Team': { allow: [VIEW, CONNECT, SPEAK, PermissionFlagsBits.MoveMembers, PermissionFlagsBits.MuteMembers] },
    Founder: { allow: [VIEW, CONNECT, SPEAK, PermissionFlagsBits.MoveMembers, PermissionFlagsBits.MuteMembers] },
  },
};

/** Channel-specific overrides on top of category defaults */
export const CHANNEL_OVERRIDES: PermissionMatrix = {
  'create-ticket': {
    Member: { allow: [VIEW, READ, REACT], deny: [SEND] },
    'Verified User': { allow: [VIEW, READ, REACT], deny: [SEND] },
    'Beta Tester': { allow: [VIEW, READ, REACT], deny: [SEND] },
  },
  'beta-testing': {
    Member: NO_ACCESS,
    'Verified User': NO_ACCESS,
    'Beta Tester': FULL_ACCESS,
  },
};

/** Muted role overrides — applied to all non-internal categories */
export const MUTED_OVERRIDES: PermissionOverwriteConfig = {
  deny: [SEND, REACT, CONNECT, SPEAK, THREADS, PermissionFlagsBits.CreatePrivateThreads],
};
