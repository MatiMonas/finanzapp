import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { DatabaseError } from 'errors';
import { IUserRepository } from 'users/repository/IUserRepository';
import UserRepository from 'users/repository/user-repository';
import { PostUserParams } from 'users/types';
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

  describe('findUserByEmail', () => {
    test('OK - Returns a user when the user exists', async () => {
      const userData: PostUserParams = {
        email: 'test@example.com',
        password: 'securepassword',
        role: 'user',
      };

      await userRepository.create(userData);

      const user = await userRepository.findUserByEmail('test@example.com');

      expect(user).not.toBeNull();
      expect(user?.email).toBe('test@example.com');
      expect(user?.role).toBe('user');
    });

    test('OK - Returns null when the user does not exists', async () => {
      const user = await userRepository.findUserByEmail('test@example.com');
      expect(user).toBe(null);
    });

    test('Error - Handles Prisma client error', async () => {
      jest
        .spyOn(prisma.users, 'findUnique')
        .mockRejectedValueOnce(new Error('Prisma client error'));

      try {
        await userRepository.findUserByEmail('test@example.com');
      } catch (error: any) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.statusCode).toBe(500);
        expect(error.cause).not.toBe(null);
        expect(error.message).toBe('Unable to find user by email');
      }
    });
  });

  describe('createUser', () => {
    test('OK - Creates user', async () => {
      const userData: PostUserParams = {
        email: 'test@example.com',
        password: 'securepassword',
        role: 'user',
      };

      const newUser = await userRepository.create(userData);

      expect(newUser).toBe(true);
    });

    test('ERROR - Handles Prisma client error', async () => {
      jest
        .spyOn(prisma.users, 'create')
        .mockRejectedValueOnce(new Error('Prisma client error'));

      const userData: PostUserParams = {
        email: 'test@example.com',
        password: 'securepassword',
        role: 'user',
      };

      try {
        await userRepository.create(userData);
      } catch (error: any) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.statusCode).toBe(500);
        expect(error.cause).not.toBe(null);
        expect(error.message).toBe('Unable to create user');
      }
    });
  });
});
