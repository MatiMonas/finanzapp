import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { DatabaseError } from 'errors';
import UserRepository, {
  IUserRepository,
} from 'users/repository/user-repository';
import { PostUserParams } from 'users/types';
import { TESTING_DATABASE_PARAMS } from 'utils/constants';
import { cleanDatabase } from 'utils/helpers/cleanDatabase';

jest.mock('utils/env.ts', () => TESTING_DATABASE_PARAMS);

const prisma = new PrismaClient();
let userRepository: IUserRepository;

describe('UserRepository', () => {
  beforeAll(async () => {
    execSync('npx prisma db push --accept-data-loss');
    userRepository = new UserRepository(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    await cleanDatabase();
  });

  describe('findUserById', () => {
    test('OK - Returns a user when the user exists', async () => {
      const userData: PostUserParams = {
        username: 'test',
        email: 'test@example.com',
        password: 'securepassword',
        roles: [1],
      };

      await prisma.roles.create({ data: { name: 'ADMIN' } });
      await userRepository.create(userData);

      const createdUser = await userRepository.findUserById(1);
      const userId = createdUser?.id;

      const user = await userRepository.findUserById(userId!);

      expect(user).not.toBeNull();
      expect(user?.email).toBe(userData.email);
      expect(user?.roles).toContain('ADMIN');
    });

    test('OK - Returns null when the user does not exist', async () => {
      const user = await userRepository.findUserById(9999);
      expect(user).toBe(null);
    });

    test('Error - Handles Prisma client error', async () => {
      jest
        .spyOn(prisma.users, 'findUnique')
        .mockRejectedValueOnce(new Error('Prisma client error'));

      try {
        await userRepository.findUserById(1);
      } catch (error: any) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.statusCode).toBe(500);
        expect(error.cause.message).toMatch(/Prisma client error/);
        expect(error.message).toBe('Unable to find user by id');
      }
    });
  });

  describe('findUserByEmail', () => {
    test('OK - Returns a user when the user exists', async () => {
      const userData: PostUserParams = {
        username: 'test',
        email: 'test@example.com',
        password: 'securepassword',
        roles: [1],
      };

      await userRepository.create(userData);

      const user = await userRepository.findUserByEmail('test@example.com');

      expect(user).not.toBeNull();
      expect(user?.email).toBe('test@example.com');
      // expect(user?.role).toBe('user');
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
        expect(error.cause.message).toMatch(/Prisma client error/);
        expect(error.message).toBe('Unable to find user by email');
      }
    });
  });

  describe('createUser', () => {
    beforeEach(async () => {
      await prisma.roles.create({ data: { name: 'ADMIN' } });
    });
    test('OK - Creates user', async () => {
      const userData: PostUserParams = {
        username: 'test',
        email: 'test@example.com',
        password: 'securepassword',
        roles: [1],
      };

      const newUser = await userRepository.create(userData);
      const foundUser = await userRepository.findUserByEmail(userData.email);

      expect(newUser).toBe(true);
      expect(foundUser).not.toBe(null);
    });

    test('ERROR - Handles Prisma client error', async () => {
      jest
        .spyOn(prisma.users, 'create')
        .mockRejectedValueOnce(new Error('Prisma client error'));

      const userData: PostUserParams = {
        username: 'test',
        email: 'test@example.com',
        password: 'securepassword',
        roles: [1],
      };

      try {
        await userRepository.create(userData);
      } catch (error: any) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.statusCode).toBe(500);
        expect(error.cause.message).toMatch(/Prisma client error/);
        expect(error.message).toBe('Unable to create user');
      }
    });

    test('Shold not create an user if received role does not exists', async () => {
      const userData: PostUserParams = {
        username: 'test',
        email: 'test@example.com',
        password: 'securepassword',
        roles: [5],
      };
      try {
        await userRepository.create(userData);
      } catch (error: any) {
        expect(error.statusCode).toBe(500);
        expect(error.cause.message).toMatch(
          /Foreign key constraint failed on the field: `roleId`/
        );
        expect(error.message).toBe('Unable to create user');
      }
    });
  });
});
