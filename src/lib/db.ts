import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }
  return globalForPrisma.prisma;
}

export const db: any = new Proxy({}, {
  get(_target, prop) {
    let client = getPrismaClient();
    if (prop in client) {
      return client[prop];
    }
    // If a new model (e.g. idea) is accessed that wasn't on the cached client, re-instantiate
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
    return globalForPrisma.prisma[prop];
  },
});
