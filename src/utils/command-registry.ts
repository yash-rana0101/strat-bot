import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { logger } from './logger.js';
import type { BotCommand } from '../types/index.js';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function loadCommands(): Promise<BotCommand[]> {
  const commands: BotCommand[] = [];
  const commandsDir = join(__dirname, '..', 'commands');
  const categories = readdirSync(commandsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const category of categories) {
    const categoryDir = join(commandsDir, category);
    const files = readdirSync(categoryDir).filter((f) => (f.endsWith('.ts') || f.endsWith('.js')) && !f.endsWith('.d.ts'));

    for (const file of files) {
      const filePath = join(categoryDir, file);
      const mod = await import(`file://${filePath.replace(/\\/g, '/')}`);
      if (mod.default?.data) {
        commands.push(mod.default);
      }
    }
  }

  return commands;
}

export async function registerCommands(): Promise<void> {
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.CLIENT_ID;
  const guildId = process.env.GUILD_ID;

  if (!token || !clientId || !guildId) {
    logger.error('Missing DISCORD_TOKEN, CLIENT_ID, or GUILD_ID in .env');
    process.exit(1);
  }

  const rest = new REST({ version: '10' }).setToken(token);
  const commands = await loadCommands();
  const commandData = commands.map((cmd) => cmd.data.toJSON());

  logger.info(`Registering ${commandData.length} slash commands...`);

  await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    { body: commandData }
  );

  logger.info('Slash commands registered successfully');
}

/** Run directly to register commands */
const isMain = process.argv[1]?.replace(/\\/g, '/').includes('command-registry');
if (isMain) {
  registerCommands().catch((err) => {
    logger.error('Failed to register commands:', err);
    process.exit(1);
  });
}
