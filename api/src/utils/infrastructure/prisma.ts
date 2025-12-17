import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { EnvironmentManager } from "../env/EnvironmentManager";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const adapter = new PrismaPg(pool);

const prismaGlobal = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = prismaGlobal.prisma ?? new PrismaClient({ adapter });

if (EnvironmentManager.NODE_ENV !== "production") prismaGlobal.prisma = prisma;
