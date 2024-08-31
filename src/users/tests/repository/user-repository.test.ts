import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { IUserRepository } from 'users/repository/IUserRepository';
import UserRepository from 'users/repository/user-repository';
import { TESTING_DATABASE_PARAMS } from 'utils/constants';
import { cleanDatabase } from 'utils/db/cleanDatabase';

jest.mock('utils/env.ts', () => TESTING_DATABASE_PARAMS);

const prisma = new PrismaClient();
let userRepository: IUserRepository;

describe('UserRepository', () => {
  beforeAll(async () => {
    execSync('npx prisma db push');
    userRepository = new UserRepository(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    await cleanDatabase();
  });
  test('findUserByEmail should return a user when the user exists', async () => {
    // Preparar datos de prueba
    await prisma.users.create({
      data: {
        email: 'test@example.com',
        password: 'securepassword',
        role: 'user',
      },
    });

    const user = await userRepository.findUserByEmail('test@example.com');

    expect(user).not.toBeNull();
    expect(user?.email).toBe('test@example.com');
    expect(user?.role).toBe('user');
  });

  // Puedes añadir más pruebas aquí.
});
