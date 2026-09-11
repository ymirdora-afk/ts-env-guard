import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

/** Load variables from a .env file into process.env. */
export function loadDotenv(path = '.env'): Map<string, string> {
  const resolved = resolve(path);
  const entries = new Map<string, string>();
  if (!existsSync(resolved)) return entries;
  const content = readFileSync(resolved, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '');
    entries.set(key, value);
    if (!(key in process.env)) process.env[key] = value;
  }
  return entries;
}
