type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_COLORS: Record<LogLevel, string> = {
  debug: '\x1b[90m',
  info: '\x1b[36m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
};

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

function getLogLevel(): LogLevel {
  return (process.env.LOG_LEVEL as LogLevel) || 'info';
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[getLogLevel()];
}

function formatTimestamp(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function log(level: LogLevel, message: string, ...args: unknown[]): void {
  if (!shouldLog(level)) return;

  const color = LOG_COLORS[level];
  const tag = level.toUpperCase().padEnd(5);
  const timestamp = formatTimestamp();

  console.log(
    `${BOLD}${color}[${timestamp}] [${tag}]${RESET} ${message}`,
    ...args
  );
}

export const logger = {
  debug: (msg: string, ...args: unknown[]) => log('debug', msg, ...args),
  info: (msg: string, ...args: unknown[]) => log('info', msg, ...args),
  warn: (msg: string, ...args: unknown[]) => log('warn', msg, ...args),
  error: (msg: string, ...args: unknown[]) => log('error', msg, ...args),
};
