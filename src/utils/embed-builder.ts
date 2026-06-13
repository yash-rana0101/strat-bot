import { EmbedBuilder, type ColorResolvable } from 'discord.js';
import { BRAND_COLOR, WEBSITE_URL } from '../config/server.config.js';
import type { EmbedConfig } from '../config/embeds.config.js';

export function createBrandedEmbed(overrides?: Partial<EmbedConfig>): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor((overrides?.color ?? BRAND_COLOR) as ColorResolvable)
    .setFooter({ text: overrides?.footer ?? `Strat AI • ${WEBSITE_URL}` })
    .setTimestamp();

  if (overrides?.title) embed.setTitle(overrides.title);
  if (overrides?.description) embed.setDescription(overrides.description);
  if (overrides?.thumbnail) embed.setThumbnail(overrides.thumbnail);

  if (overrides?.fields) {
    for (const field of overrides.fields) {
      embed.addFields({ name: field.name, value: field.value, inline: field.inline ?? false });
    }
  }

  return embed;
}

export function createFromConfig(config: EmbedConfig): EmbedBuilder {
  return createBrandedEmbed(config);
}

export function createSuccessEmbed(title: string, description: string): EmbedBuilder {
  return createBrandedEmbed({ title: `✅ ${title}`, description, color: 0x2ECC71 });
}

export function createErrorEmbed(title: string, description: string): EmbedBuilder {
  return createBrandedEmbed({ title: `❌ ${title}`, description, color: 0xE74C3C });
}

export function createWarningEmbed(title: string, description: string): EmbedBuilder {
  return createBrandedEmbed({ title: `⚠️ ${title}`, description, color: 0xF39C12 });
}

export function createInfoEmbed(title: string, description: string): EmbedBuilder {
  return createBrandedEmbed({ title: `ℹ️ ${title}`, description, color: 0x3498DB });
}

export function createLogEmbed(
  title: string,
  description: string,
  color: ColorResolvable,
  fields?: Array<{ name: string; value: string; inline?: boolean }>
): EmbedBuilder {
  const embed = createBrandedEmbed({ title, description, color });
  if (fields) {
    for (const f of fields) {
      embed.addFields({ name: f.name, value: f.value, inline: f.inline ?? true });
    }
  }
  return embed;
}
