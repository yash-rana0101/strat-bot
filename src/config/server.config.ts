import type { CategoryConfig } from '../types/index.js';

export const SERVER_NAME = 'Strat AI';
export const SERVER_DESCRIPTION = 'Market Intelligence. One Terminal.';
export const WEBSITE_URL = 'https://stratai.live';
export const BRAND_COLOR = 0x6C5CE7;

export const CATEGORIES: CategoryConfig[] = [
  {
    name: '📢 INFORMATION',
    emoji: '📢',
    position: 0,
    channels: [
      { name: 'welcome', topic: 'Welcome to Strat AI — Market Intelligence. One Terminal.', readonly: true, position: 0 },
      { name: 'start-here', topic: 'Get started with Strat AI and the community', readonly: true, position: 1 },
      { name: 'rules', topic: 'Community rules and guidelines — Read and accept to gain access', readonly: true, position: 2 },
      { name: 'announcements', topic: 'Official announcements from the Strat AI team', readonly: true, position: 3 },
      { name: 'changelog', topic: 'Product updates, new features, and patch notes', readonly: true, position: 4 },
      { name: 'roadmap', topic: 'Strat AI product roadmap and upcoming features', readonly: true, position: 5 },
      { name: 'faq', topic: 'Frequently asked questions about Strat AI', readonly: true, position: 6 },
    ],
  },
  {
    name: '🌐 COMMUNITY',
    emoji: '🌐',
    position: 1,
    channels: [
      { name: 'general', topic: 'General community discussion', position: 0 },
      { name: 'introductions', topic: 'Introduce yourself to the community', position: 1 },
      { name: 'market-discussion', topic: 'Discuss market trends, analysis, and strategies', position: 2 },
      { name: 'trading-setups', topic: 'Share and discuss trading setups', position: 3, slowmode: 30 },
      { name: 'wins-and-lessons', topic: 'Share your wins and lessons learned', position: 4 },
      { name: 'feature-requests', topic: 'Suggest features for Strat AI', position: 5, slowmode: 60 },
    ],
  },
  {
    name: '📈 MARKETS',
    emoji: '📈',
    position: 2,
    channels: [
      { name: 'nifty', topic: 'Nifty 50 index discussion and analysis', position: 0 },
      { name: 'banknifty', topic: 'Bank Nifty index discussion and analysis', position: 1 },
      { name: 'stocks', topic: 'Individual stock analysis and discussion', position: 2 },
      { name: 'options', topic: 'Options trading strategies and analysis', position: 3 },
      { name: 'crypto', topic: 'Cryptocurrency markets discussion', position: 4 },
      { name: 'global-markets', topic: 'Global market analysis — US, EU, Asia', position: 5 },
    ],
  },
  {
    name: '🧠 STRAT AI',
    emoji: '🧠',
    position: 3,
    channels: [
      { name: 'deep-quant-analysis', topic: 'Deep quantitative analysis powered by Strat AI', position: 0 },
      { name: 'market-intelligence', topic: 'AI-driven market intelligence and signals', position: 1 },
      { name: 'ai-insights', topic: 'AI-generated insights and predictions', position: 2 },
      { name: 'beta-testing', topic: 'Beta feature testing and feedback', position: 3 },
      { name: 'product-feedback', topic: 'Share your feedback on Strat AI products', position: 4, slowmode: 30 },
      { name: 'bug-reports', topic: 'Report bugs and issues with Strat AI', position: 5, slowmode: 30 },
    ],
  },
  {
    name: '🛠 SUPPORT',
    emoji: '🛠',
    position: 4,
    channels: [
      { name: 'help', topic: 'Get help from the community and support team', position: 0 },
      { name: 'account-support', topic: 'Account-related support and inquiries', position: 1 },
      { name: 'create-ticket', topic: 'Create a support ticket for personalized help', readonly: true, position: 2 },
    ],
  },
  {
    name: '🔒 INTERNAL',
    emoji: '🔒',
    position: 5,
    staffOnly: true,
    channels: [
      { name: 'server-logs', topic: 'Server event logs', staffOnly: true, position: 0 },
      { name: 'member-logs', topic: 'Member join/leave/update logs', staffOnly: true, position: 1 },
      { name: 'audit-logs', topic: 'Message edit/delete audit logs', staffOnly: true, position: 2 },
      { name: 'ticket-logs', topic: 'Ticket activity logs', staffOnly: true, position: 3 },
      { name: 'moderation-logs', topic: 'Moderation action logs', staffOnly: true, position: 4 },
    ],
  },
  {
    name: '🔊 VOICE',
    emoji: '🔊',
    position: 6,
    channels: [],
    voiceChannels: [
      { name: 'Community Lounge', position: 0 },
      { name: 'Market Discussion', position: 1 },
      { name: 'Trading Floor', userLimit: 10, position: 2 },
      { name: 'Team Meeting', userLimit: 15, position: 3 },
    ],
  },
];
