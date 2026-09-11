import { MissingEnvError, InvalidEnvError } from './errors.js';

export type EnvType = 'string' | 'number' | 'boolean';

export interface EnvFieldDefinition {
  type: EnvType;
  required?: boolean;
  default?: string;
}

export type EnvSchema = Record<string, EnvFieldDefinition>;

export type ResolvedValue<F extends EnvFieldDefinition> = F['type'] extends 'number'
  ? number
  : F['type'] extends 'boolean'
    ? boolean
    : string;

export type InferEnv<T extends EnvSchema> = {
  readonly [K in keyof T]: T[K] extends { required: true }
    ? ResolvedValue<T[K]>
    : T[K] extends { default: string }
      ? ResolvedValue<T[K]>
      : ResolvedValue<T[K]> | undefined;
};

export interface EnvGuard<T extends EnvSchema> {
  get<K extends keyof T>(key: K): InferEnv<T>[K];
  getAll(): InferEnv<T>;
  validate(): InferEnv<T>;
}

function parseValue(key: string, def: EnvFieldDefinition, rawValue: string | undefined): unknown {
  const value = rawValue !== undefined && rawValue !== '' ? rawValue : def.default;
  if (value === undefined || (def.required && value === '')) {
    if (def.required) throw new MissingEnvError(key);
    return undefined;
  }
  if (def.type === 'number') {
    const parsed = Number(value);
    if (Number.isNaN(parsed) || value.trim() === '') throw new InvalidEnvError(key, 'number', value);
    return parsed;
  }
  if (def.type === 'boolean') {
    const val = value.trim().toLowerCase();
    if (val === 'true' || val === '1') return true;
    if (val === 'false' || val === '0') return false;
    throw new InvalidEnvError(key, 'boolean', value);
  }
  return value;
}

export function validate<T extends EnvSchema>(
  schema: T,
  source: Record<string, string | undefined> = process.env
): InferEnv<T> {
  const parsed: Record<string, unknown> = {};
  for (const [key, field] of Object.entries(schema)) {
    parsed[key] = parseValue(key, field, source[key]);
  }
  return parsed as InferEnv<T>;
}

export function createEnvGuard<const T extends EnvSchema>(
  schema: T,
  source: Record<string, string | undefined> = process.env
): EnvGuard<T> {
  return {
    get: <K extends keyof T>(key: K): InferEnv<T>[K] => {
      const field = schema[key];
      if (!field) throw new Error(`Variable "${String(key)}" is not defined in schema`);
      return parseValue(String(key), field, source[String(key)]) as InferEnv<T>[K];
    },
    getAll: (): InferEnv<T> => validate(schema, source),
    validate: (): InferEnv<T> => validate(schema, source),
  };
}

export { MissingEnvError, InvalidEnvError } from './errors.js';
