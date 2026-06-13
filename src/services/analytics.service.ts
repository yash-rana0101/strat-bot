import { type Guild, EmbedBuilder } from 'discord.js';
import { sql } from '../database/connection.js';
import { AnalyticsEventType } from '../types/index.js';
import { BRAND_COLOR } from '../config/server.config.js';
import { logger } from '../utils/logger.js';

export async function trackEvent(
  type: AnalyticsEventType,
  userId?: string,
  channelId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    await sql`
      INSERT INTO analytics_events (type, user_id, channel_id, metadata)
      VALUES (${type}, ${userId || null}, ${channelId || null}, ${metadata ? JSON.stringify(metadata) : null})
    `;
  } catch (err: any) {
    logger.error(`Failed to track analytics event: ${err.message}`);
  }
}

interface PeriodStats {
  memberJoins: number;
  memberLeaves: number;
  messagesSent: number;
  ticketsCreated: number;
  ticketsClosed: number;
  infractionsIssued: number;
  topChannels: Array<{ channel_id: string; count: number }>;
  topUsers: Array<{ user_id: string; count: number }>;
}

function getDateRange(period: 'daily' | 'weekly' | 'monthly'): string {
  const offsets = { daily: 1, weekly: 7, monthly: 30 };
  const d = new Date();
  d.setDate(d.getDate() - offsets[period]);
  return d.toISOString();
}

export async function getStats(period: 'daily' | 'weekly' | 'monthly'): Promise<PeriodStats> {
  const since = getDateRange(period);

  const getCount = async (type: string): Promise<number> => {
    try {
      const [row] = await sql<Array<{ count: string }>>`
        SELECT COUNT(*) as count FROM analytics_events
        WHERE type = ${type} AND created_at >= ${since}
      `;
      return parseInt(row?.count || '0', 10);
    } catch (err: any) {
      logger.error(`Failed to get count for ${type}: ${err.message}`);
      return 0;
    }
  };

  const [joins, leaves, messages, ticketsCreated, ticketsClosed, infractions] = await Promise.all([
    getCount(AnalyticsEventType.MemberJoin),
    getCount(AnalyticsEventType.MemberLeave),
    getCount(AnalyticsEventType.MessageSent),
    getCount(AnalyticsEventType.TicketCreated),
    getCount(AnalyticsEventType.TicketClosed),
    getCount(AnalyticsEventType.InfractionIssued),
  ]);

  let topChannels: Array<{ channel_id: string; count: number }> = [];
  let topUsers: Array<{ user_id: string; count: number }> = [];

  try {
    const channelRows = await sql`
      SELECT channel_id, COUNT(*) as count FROM analytics_events
      WHERE type = 'message_sent' AND created_at >= ${since} AND channel_id IS NOT NULL
      GROUP BY channel_id ORDER BY count DESC LIMIT 5
    `;
    topChannels = channelRows.map((r: any) => ({
      channel_id: r.channel_id,
      count: parseInt(r.count, 10),
    }));

    const userRows = await sql`
      SELECT user_id, COUNT(*) as count FROM analytics_events
      WHERE type = 'message_sent' AND created_at >= ${since} AND user_id IS NOT NULL
      GROUP BY user_id ORDER BY count DESC LIMIT 5
    `;
    topUsers = userRows.map((r: any) => ({
      user_id: r.user_id,
      count: parseInt(r.count, 10),
    }));
  } catch (err: any) {
    logger.error(`Failed to fetch top active lists: ${err.message}`);
  }

  return {
    memberJoins: joins,
    memberLeaves: leaves,
    messagesSent: messages,
    ticketsCreated: ticketsCreated,
    ticketsClosed: ticketsClosed,
    infractionsIssued: infractions,
    topChannels,
    topUsers,
  };
}

export async function buildAnalyticsEmbed(
  guild: Guild,
  period: 'daily' | 'weekly' | 'monthly'
): Promise<EmbedBuilder> {
  const stats = await getStats(period);
  const netGrowth = stats.memberJoins - stats.memberLeaves;
  const growthEmoji = netGrowth >= 0 ? '📈' : '📉';

  const topChannelsList = stats.topChannels.length > 0
    ? stats.topChannels.map((c, i) => `${i + 1}. <#${c.channel_id}> — ${c.count} msgs`).join('\n')
    : 'No data';

  const topUsersList = stats.topUsers.length > 0
    ? stats.topUsers.map((u, i) => `${i + 1}. <@${u.user_id}> — ${u.count} msgs`).join('\n')
    : 'No data';

  return new EmbedBuilder()
    .setTitle(`📊 ${period.charAt(0).toUpperCase() + period.slice(1)} Analytics Report`)
    .setColor(BRAND_COLOR)
    .addFields(
      { name: '👥 Members Joined', value: String(stats.memberJoins), inline: true },
      { name: '👋 Members Left', value: String(stats.memberLeaves), inline: true },
      { name: `${growthEmoji} Net Growth`, value: String(netGrowth), inline: true },
      { name: '💬 Messages Sent', value: String(stats.messagesSent), inline: true },
      { name: '🎫 Tickets Created', value: String(stats.ticketsCreated), inline: true },
      { name: '🔨 Infractions', value: String(stats.infractionsIssued), inline: true },
      { name: '🔥 Top Channels', value: topChannelsList, inline: false },
      { name: '⭐ Top Contributors', value: topUsersList, inline: false },
    )
    .setFooter({ text: `${guild.name} • Total Members: ${guild.memberCount}` })
    .setTimestamp();
}
