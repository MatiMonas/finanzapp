import { PrismaClient } from '@prisma/client';
import env from 'utils/env';
export default function getClient() {

  const prismaClient = new PrismaClient({
    datasources: {
      db: {
        url: env.DATABASE_URL,
      },
    },
  });
  prismaClient.$connect();
  return prismaClient;
}
