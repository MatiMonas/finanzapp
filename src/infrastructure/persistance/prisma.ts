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
  initializeRoles(prismaClient);

  return prismaClient;
}

export async function initializeRoles(prisma: PrismaClient) {
  const roles = ['ADMIN', 'USER', 'TEST'];

  await Promise.all(
    roles.map((role) =>
      prisma.roles.upsert({
        where: { id: role === 'ADMIN' ? 1 : role === 'USER' ? 2 : 3 },
        update: {}, // no actualiza nada si ya existe
        create: {
          name: role,
        },
      })
    )
  );
}
