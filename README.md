# ts-env-guard

A type-safe environment variable validator for Node.js applications. Validates env vars at startup and provides typed access.

## Installation

```bash
npm install ts-env-guard
```

## Quick Start

```typescript
import { createEnvGuard } from 'ts-env-guard';

const guard = createEnvGuard({
  PORT: { type: 'number', default: '3000' },
  HOST: { type: 'string', default: 'localhost' },
  DATABASE_URL: { type: 'string', required: true },
  ENABLE_DEBUG: { type: 'boolean', default: 'false' },
});

// Validate all variables at startup (throws if required variables are missing)
const env = guard.validate();

console.log(env.PORT);         // number: 3000
console.log(env.DATABASE_URL); // string: "postgres://..."
console.log(env.ENABLE_DEBUG); // boolean: false

// Individual typed access
const port = guard.get('PORT'); // number
```

## API Reference

### `createEnvGuard(schema, [source])`
Creates a typed environment variable accessor for the provided schema.
- `schema`: Record mapping variable names to their definitions (`{ type, required?, default? }`).
- `source`: Optional source object (defaults to `process.env`).
- Returns an accessor object with `get(key)`, `getAll()`, and `validate()` methods.

### `validate(schema, [source])`
Validates and parses environment variables against the schema. Throws `MissingEnvError` if a required variable is missing, or `InvalidEnvError` if a variable cannot be parsed.

### Schema Options
- `type`: `'string' | 'number' | 'boolean'` - Expected type of the variable.
- `required`: `boolean` (optional) - Throws `MissingEnvError` if not set and no default.
- `default`: `string` (optional) - Fallback value if variable is missing in environment.

### Error Classes
- `MissingEnvError`: Thrown when a required environment variable is missing.
- `InvalidEnvError`: Thrown when a variable cannot be coerced to the schema type.

## License

MIT
