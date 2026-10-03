import { z } from "zod";

const envSchema = z.object({
  NEWSAPI_KEY: z.string().optional().default(""),
  TMDB_API_KEY: z.string().optional().default(""),
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
  SOCIAL_MOCK_FAILURE_RATE: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : 0))
    .pipe(z.number().min(0).max(1))
    .default(0),
});

export const env = envSchema.parse({
  NEWSAPI_KEY: process.env.NEWSAPI_KEY,
  TMDB_API_KEY: process.env.TMDB_API_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  SOCIAL_MOCK_FAILURE_RATE: process.env.SOCIAL_MOCK_FAILURE_RATE,
});

export const isNewsDemoMode = !Boolean(env.NEWSAPI_KEY && env.NEWSAPI_KEY.trim() !== "");
export const isTmdbDemoMode = !Boolean(env.TMDB_API_KEY && env.TMDB_API_KEY.trim() !== "");
