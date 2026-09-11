/** Common environment presets for quick setup. */
export const presets = {
  database: {
    DATABASE_URL: { type: 'string' as const, required: true },
    DATABASE_POOL_SIZE: { type: 'number' as const, default: '10' },
    DATABASE_SSL: { type: 'boolean' as const, default: 'true' },
  },
  redis: {
    REDIS_URL: { type: 'string' as const, required: true },
    REDIS_TTL: { type: 'number' as const, default: '3600' },
  },
  server: {
    PORT: { type: 'number' as const, default: '3000' },
    HOST: { type: 'string' as const, default: '0.0.0.0' },
    NODE_ENV: { type: 'string' as const, default: 'production' },
  },
} as const;
