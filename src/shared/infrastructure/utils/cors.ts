export function parseCorsOrigins(raw?: string): string | string[] {
  if (!raw || raw.trim() === '*') return '*';

  const origins = raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return origins.length > 0 ? origins : '*';
}
