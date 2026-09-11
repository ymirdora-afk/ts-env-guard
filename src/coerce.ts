/** Coerce raw string values into their declared types. */
export function coerceValue(raw: string, type: 'string' | 'number' | 'boolean'): string | number | boolean {
  switch (type) {
    case 'number': {
      const n = Number(raw);
      if (Number.isNaN(n)) throw new TypeError(`Cannot coerce "${raw}" to number`);
      return n;
    }
    case 'boolean':
      return raw === 'true' || raw === '1';
    default:
      return raw;
  }
}
