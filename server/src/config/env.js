import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 4000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || '',
  clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY || '',
  clerkSecretKey: process.env.CLERK_SECRET_KEY || '',
};
