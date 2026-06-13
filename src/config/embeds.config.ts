import { type ColorResolvable } from 'discord.js';
import { BRAND_COLOR, WEBSITE_URL } from './server.config.js';

export interface EmbedConfig {
  title: string;
  description: string;
  color: ColorResolvable;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  footer?: string;
  thumbnail?: string;
}

const FOOTER = `Strat AI • ${WEBSITE_URL}`;
const ACCENT = BRAND_COLOR;

export const WELCOME_EMBED: EmbedConfig = {
  title: '🚀 Welcome to Strat AI',
  description: [
    '**Market Intelligence. One Terminal.**',
    '',
    'Welcome to the official Strat AI community — where traders, analysts, and AI converge.',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    '**Getting Started:**',
    '',
    '📜 Read the rules in <#rules>',
    '✅ Accept the rules to gain full access',
    '👋 Introduce yourself in <#introductions>',
    '💬 Join the conversation in <#general>',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    '**What You\'ll Find Here:**',
    '',
    '📈 Real-time market discussions',
    '🧠 AI-powered market intelligence',
    '🛠 Product feedback and beta access',
    '🎓 Trading setups and analysis',
    '💡 Feature requests and roadmap visibility',
  ].join('\n'),
  color: ACCENT,
  footer: FOOTER,
};

export const RULES_EMBED: EmbedConfig = {
  title: '📜 Community Rules',
  description: [
    'By participating in the Strat AI community, you agree to follow these rules.',
    'Violations may result in warnings, mutes, kicks, or bans.',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  ].join('\n'),
  color: ACCENT,
  fields: [
    { name: '1️⃣ Respect Everyone', value: 'Treat all members with respect. No harassment, hate speech, discrimination, or personal attacks.', inline: false },
    { name: '2️⃣ No Spam or Self-Promotion', value: 'No unsolicited advertisements, referral links, or spam. Keep content relevant to the channel.', inline: false },
    { name: '3️⃣ No Financial Advice', value: 'Discussions are for educational purposes only. Do not provide or solicit financial advice. Trade at your own risk.', inline: false },
    { name: '4️⃣ Stay On Topic', value: 'Use the appropriate channels for your discussions. Off-topic content will be moved or removed.', inline: false },
    { name: '5️⃣ No NSFW Content', value: 'This is a professional community. No NSFW, violent, or disturbing content.', inline: false },
    { name: '6️⃣ Protect Privacy', value: 'Do not share personal information — yours or anyone else\'s. No doxxing.', inline: false },
    { name: '7️⃣ No Scams or Fraud', value: 'Any attempt to scam, phish, or defraud members will result in an immediate ban.', inline: false },
    { name: '8️⃣ Follow Discord ToS', value: 'Abide by Discord\'s Terms of Service and Community Guidelines at all times.', inline: false },
    { name: '9️⃣ Listen to Staff', value: 'Staff decisions are final. If you have concerns, open a ticket in #create-ticket.', inline: false },
    { name: '🔟 Have Fun', value: 'This is a community of like-minded traders and tech enthusiasts. Enjoy the journey!', inline: false },
  ],
  footer: FOOTER,
};

export const TICKET_PANEL_EMBED: EmbedConfig = {
  title: '🎫 Strat AI Support',
  description: [
    'Need help? Select a category below to create a private support ticket.',
    '',
    'A staff member will respond as soon as possible.',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    '**📋 Account Support** — Account access, settings, login issues',
    '**🐛 Bug Report** — Report a bug or technical issue',
    '**💡 Feature Request** — Suggest a new feature or improvement',
    '**💳 Billing** — Subscription, payment, or billing inquiries',
    '**🤝 Partnership** — Partnership and collaboration proposals',
  ].join('\n'),
  color: ACCENT,
  footer: FOOTER,
};

export const VERIFICATION_EMBED: EmbedConfig = {
  title: '✅ Verify Your Account',
  description: [
    'To access the full Strat AI community, please verify your account.',
    '',
    'Click the **Verify** button below after reading the rules.',
    '',
    'This helps us keep the community safe and spam-free.',
  ].join('\n'),
  color: 0x2ECC71,
  footer: FOOTER,
};

export const FAQ_EMBED: EmbedConfig = {
  title: '❓ Frequently Asked Questions',
  description: 'Find answers to common questions about Strat AI.',
  color: ACCENT,
  fields: [
    { name: 'What is Strat AI?', value: 'Strat AI is a market intelligence platform that provides AI-powered trading insights, analysis, and tools — all in one terminal.', inline: false },
    { name: 'How do I get beta access?', value: 'Beta access is granted to active community members. Stay engaged, provide feedback, and you may be selected for early access.', inline: false },
    { name: 'How do I report a bug?', value: 'Use the #create-ticket channel to open a Bug Report ticket, or post in #bug-reports.', inline: false },
    { name: 'How do I request a feature?', value: 'Post in #feature-requests or open a Feature Request ticket in #create-ticket.', inline: false },
    { name: 'Where can I learn more?', value: `Visit our website at ${WEBSITE_URL} for full documentation and product information.`, inline: false },
  ],
  footer: FOOTER,
};
