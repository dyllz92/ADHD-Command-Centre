// prisma/prisma.config.ts

export default {
  // For SQLite, pass the connection URL directly to PrismaClient in your app code.
  // No adapter required for Prisma v7.
  databaseUrl: process.env.DATABASE_URL ?? "file:./dev.db",
};
