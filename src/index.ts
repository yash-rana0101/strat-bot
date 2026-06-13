import 'dotenv/config';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { BotClient } from './client.js';
import { registerCommands } from './utils/command-registry.js';
import { closeDatabase } from './database/connection.js';
import { clearChannelCache } from './services/logging.service.js';
import { logger } from './utils/logger.js';
import type { BotCommand, BotEvent } from './types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const client = new BotClient();

async function loadCommands(): Promise<void> {
  const commandsDir = join(__dirname, 'commands');
  const categories = readdirSync(commandsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const category of categories) {
    const categoryDir = join(commandsDir, category);
    const files = readdirSync(categoryDir).filter((f) => f.endsWith('.ts') || f.endsWith('.js'));

    for (const file of files) {
      const filePath = join(categoryDir, file);
      const mod = await import(`file://${filePath.replace(/\\/g, '/')}`);
      const command: BotCommand = mod.default;

      if (command?.data) {
        client.commands.set(command.data.name, command);
        logger.debug(`  Loaded command: /${command.data.name}`);
      }
    }
  }

  logger.info(`Loaded ${client.commands.size} commands`);
}

async function loadEvents(): Promise<void> {
  const eventsDir = join(__dirname, 'events');
  const files = readdirSync(eventsDir).filter((f) => f.endsWith('.ts') || f.endsWith('.js'));

  for (const file of files) {
    const filePath = join(eventsDir, file);
    const mod = await import(`file://${filePath.replace(/\\/g, '/')}`);
    const event: BotEvent = mod.default;

    if (event?.name) {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
      logger.debug(`  Loaded event: ${event.name}`);
    }
  }

  logger.info(`Loaded ${files.length} events`);
}

async function start(): Promise<void> {
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    logger.error('DISCORD_TOKEN is not set. Copy .env.example to .env and fill in your values.');
    process.exit(1);
  }

  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  logger.info('  Strat AI Discord Bot');
  logger.info('  Market Intelligence. One Terminal.');
  logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await loadCommands();
  await loadEvents();

  if (process.env.REGISTER_COMMANDS === 'true') {
    await registerCommands();
  }

  await client.login(token);
}

function shutdown(signal: string): void {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  clearChannelCache();
  closeDatabase();
  client.destroy();
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled rejection:', error);
});

start().catch((error) => {
  logger.error('Failed to start bot:', error);
  process.exit(1);
});
