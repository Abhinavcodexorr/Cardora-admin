import { z } from "zod";

/**
 * Validated environment variables. Import `env` instead of reading
 * `process.env` directly so missing/invalid config fails fast at startup.
 * Server-only secrets belong in `serverSchema`; anything exposed to the
 * browser must be prefixed NEXT_PUBLIC_ and go in `clientSchema`.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
});

const merged = serverSchema.extend(clientSchema.shape);

const parsed = merged.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!parsed.success) {
  console.error("Invalid environment variables:", z.treeifyError(parsed.error));
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
