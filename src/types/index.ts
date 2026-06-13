import {
  type ChatInputCommandInteraction,
  type SlashCommandBuilder,
  type SlashCommandSubcommandsOnlyBuilder,
  type SlashCommandOptionsOnlyBuilder,
  type PermissionResolvable,
  type ColorResolvable,
} from 'discord.js';

import type { BotClient } from '../client.js';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Command Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface BotCommand {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  requiredRoles?: string[];
  cooldown?: number;
  execute: (interaction: ChatInputCommandInteraction, client: BotClient) => Promise<void>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Event Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface BotEvent {
  name: string;
  once?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: (...args: any[]) => Promise<void> | void;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Server Architecture Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface CategoryConfig {
  name: string;
  emoji: string;
  position: number;
  channels: ChannelConfig[];
  voiceChannels?: VoiceChannelConfig[];
  staffOnly?: boolean;
}

export interface ChannelConfig {
  name: string;
  topic: string;
  slowmode?: number;
  readonly?: boolean;
  staffOnly?: boolean;
  position: number;
}

export interface VoiceChannelConfig {
  name: string;
  userLimit?: number;
  position: number;
}

export interface RoleConfig {
  name: string;
  color: ColorResolvable;
  position: number;
  hoist: boolean;
  mentionable: boolean;
  permissions: PermissionResolvable[];
  isStaff?: boolean;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Permission Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface ChannelPermissionOverwrite {
  roleOrUserId: string;
  roleName: string;
  allow: PermissionResolvable[];
  deny: PermissionResolvable[];
}

export interface ChannelPermissionConfig {
  channelName: string;
  overwrites: ChannelPermissionOverwrite[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Ticket Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export enum TicketCategory {
  AccountSupport = 'account_support',
  BugReport = 'bug_report',
  FeatureRequest = 'feature_request',
  Billing = 'billing',
  Partnership = 'partnership',
}

export enum TicketStatus {
  Open = 'open',
  InProgress = 'in_progress',
  AwaitingResponse = 'awaiting_response',
  Resolved = 'resolved',
  Closed = 'closed',
}

export interface TicketData {
  id: number;
  channelId: string;
  userId: string;
  category: TicketCategory;
  status: TicketStatus;
  subject: string;
  createdAt: string;
  closedAt: string | null;
  closedBy: string | null;
  claimedBy: string | null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Security Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export enum SecurityAction {
  Warn = 'warn',
  Mute = 'mute',
  Kick = 'kick',
  Ban = 'ban',
  Timeout = 'timeout',
  Delete = 'delete',
  Lock = 'lock',
}

export interface SecurityEvent {
  type: string;
  userId: string;
  action: SecurityAction;
  reason: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Logging Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export enum LogChannel {
  Server = 'server-logs',
  Member = 'member-logs',
  Audit = 'audit-logs',
  Ticket = 'ticket-logs',
  Moderation = 'moderation-logs',
}

export interface LogEntry {
  channel: LogChannel;
  title: string;
  description: string;
  color: ColorResolvable;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  actorId?: string;
  targetId?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Analytics Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export enum AnalyticsEventType {
  MemberJoin = 'member_join',
  MemberLeave = 'member_leave',
  MessageSent = 'message_sent',
  TicketCreated = 'ticket_created',
  TicketClosed = 'ticket_closed',
  InfractionIssued = 'infraction_issued',
  CommandUsed = 'command_used',
}

export interface AnalyticsEvent {
  type: AnalyticsEventType;
  userId?: string;
  channelId?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Moderation Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export enum InfractionType {
  Warning = 'warning',
  Mute = 'mute',
  Kick = 'kick',
  Ban = 'ban',
  Timeout = 'timeout',
}

export interface InfractionData {
  id: number;
  userId: string;
  moderatorId: string;
  type: InfractionType;
  reason: string;
  duration?: number;
  createdAt: string;
  expiresAt?: string;
  active: boolean;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Automod Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface AutoModRuleConfig {
  name: string;
  eventType: number;
  triggerType: number;
  triggerMetadata: Record<string, unknown>;
  actions: Array<{ type: number; metadata?: Record<string, unknown> }>;
  exemptRoles: string[];
  exemptChannels: string[];
  enabled: boolean;
}
