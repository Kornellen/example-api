import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
