const TIME_UNITS: Record<string, number> = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
  w: 604_800_000,
};

export function parseDuration(input: string): number | null {
  const match = input.match(/^(\d+)\s*(s|m|h|d|w)$/i);
  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const multiplier = TIME_UNITS[unit];

  return multiplier ? value * multiplier : null;
}

export function formatDuration(ms: number): string {
  if (ms < 60_000) return `${Math.round(ms / 1_000)}s`;
  if (ms < 3_600_000) return `${Math.round(ms / 60_000)}m`;
  if (ms < 86_400_000) return `${Math.round(ms / 3_600_000)}h`;
  return `${Math.round(ms / 86_400_000)}d`;
}

export function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();

  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export function discordTimestamp(date: Date, style: 'R' | 'F' | 'D' | 'T' | 'f' | 'd' | 't' = 'R'): string {
  return `<t:${Math.floor(date.getTime() / 1_000)}:${style}>`;
}

export function getAccountAge(createdAt: Date): number {
  return Date.now() - createdAt.getTime();
}

export function isAccountTooNew(createdAt: Date, minAgeMs: number): boolean {
  return getAccountAge(createdAt) < minAgeMs;
}
