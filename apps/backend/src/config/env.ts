import {z} from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive(),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  APPWRITE_API_KEY: z.string().min(1),
  APPWRITE_API_ENDPOINT: z.string().min(1),
  APPWRITE_PROJECT_ID: z.string().min(1),
  APPWRITE_IMAGE_BUCKET_ID: z.string().min(1),
});
export const env = envSchema.parse({
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  APPWRITE_API_KEY: process.env.APPWRITE_API_KEY,
  APPWRITE_API_ENDPOINT: process.env.APPWRITE_API_ENDPOINT,
  APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
  APPWRITE_IMAGE_BUCKET_ID: process.env.APPWRITE_IMAGE_BUCKET_ID
});
