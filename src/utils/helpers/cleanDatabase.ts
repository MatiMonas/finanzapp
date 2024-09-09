import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const cleanDatabase = async () => {
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 0`;
  await prisma.$executeRaw`TRUNCATE TABLE monthly_wages`;
  await prisma.$executeRaw`TRUNCATE TABLE budgets_configuration`;
  await prisma.$executeRaw`TRUNCATE TABLE budgets`;
  await prisma.$executeRaw`TRUNCATE TABLE expenses`;
  await prisma.$executeRaw`TRUNCATE TABLE investments`;
  await prisma.$executeRaw`TRUNCATE TABLE debts`;
  await prisma.$executeRaw`TRUNCATE TABLE credit_cards`;
  await prisma.$executeRaw`TRUNCATE TABLE roles`;
  await prisma.$executeRaw`TRUNCATE TABLE users`;
  await prisma.$executeRaw`TRUNCATE TABLE user_roles`;
  await prisma.$executeRaw`SET FOREIGN_KEY_CHECKS = 1`;
};
