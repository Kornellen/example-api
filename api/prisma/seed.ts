import { PrismaClient } from "@app/db/models";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";


const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({adapter});

async function seed() {
  await prisma.loginmethod.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Social Media",
      description: "Login via social media",
    },
  });

  await prisma.loginmethod.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Login/Password",
      description: "Login with password and login",
    },
  });
}

seed()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
