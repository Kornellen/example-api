import { PrismaClient } from "@prisma/client";
import { EnvironmentManager } from "../env/EnvironmentManager";

const prismaGlobal = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = prismaGlobal.prisma ?? new PrismaClient();

if (EnvironmentManager.NODE_ENV !== "production") prismaGlobal.prisma = prisma;
