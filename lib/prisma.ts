import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with error handling
function createPrismaClient() {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error'] : [],
      // Add configuration to prevent initialization errors
      ...(process.env.NODE_ENV === 'production' && {
        errorFormat: 'minimal',
      }),
    });
  } catch (error) {
    console.error('Failed to initialize Prisma client:', error);
    // Return a minimal client that won't crash the app
    return new PrismaClient();
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
