import { execSync } from 'child_process';

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { PrismaClient } from '@prisma/client';
import UserRepository, {
  IUserRepository,
} from 'components/users/repository/user-repository';
import { PostUserParams } from 'components/users/types';
import { DatabaseError, UserNotFoundError } from 'errors';
import { createMockFn } from '__mocks__/testHelpers';
import { cleanDatabase } from 'utils/helpers/cleanDatabase';

const prisma = new PrismaClient();
let userRepository: IUserRepository;

// Helper functions to reduce code duplication
const createTestUserData = (
  overrides: Partial<PostUserParams> = {}
): PostUserParams => ({
  username: 'test',
  email: 'test@example.com',
  password: 'securepassword',
  roles: [1],
  ...overrides,
});

const createTestUser = async (userData?: PostUserParams): Promise<string> => {
  const data = userData || createTestUserData();
  return await userRepository.create(data);
};

const setupErrorMock = (
  method: 'create' | 'findUnique',
  errorMessage: string = 'Prisma client error'
) => {
  const originalMethod = prisma.users[method];
  const mockMethod = createMockFn(() =>
    Promise.reject(new Error(errorMessage))
  );
  (prisma.users as any)[method] = mockMethod;
  return { originalMethod, mockMethod };
};

const restoreMock = (method: 'create' | 'findUnique', originalMethod: any) => {
  (prisma.users as any)[method] = originalMethod;
};

const ensureRoleExists = async () => {
  await prisma.roles.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: 'ADMIN' },
  });
};

describe('UserRepository', () => {
  beforeEach(async () => {
    execSync('npx prisma db push --accept-data-loss ');
    userRepository = new UserRepository(prisma);
    await prisma.roles.upsert({
      where: { name: 'ADMIN' },
      update: {},
      create: { name: 'ADMIN' },
    });
  });

  afterEach(async () => {
    await cleanDatabase();
    // Restore original methods after each test
    (prisma.users.create as any) = prisma.users.create;
    (prisma.users.findUnique as any) = prisma.users.findUnique;
  });

  describe('createUser', () => {
    it('OK - Creates user', async () => {
      const userData = createTestUserData();
      const newUser = await userRepository.create(userData);
      const foundUser = await userRepository.findUserById(newUser);

      expect(newUser).toBe(foundUser?.id);
      expect(foundUser).not.toBe(null);
    });

    it('ERROR - Handles Prisma client error', async () => {
      const { originalMethod } = setupErrorMock('create');

      try {
        await userRepository.create(createTestUserData());
      } catch (error: any) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.statusCode).toBe(500);
        expect(error.cause.message).toMatch(new RegExp('Prisma client error'));
        expect(error.message).toBe('Unable to create user');
      } finally {
        restoreMock('create', originalMethod);
      }
    });

    it('Should not create an user if received role does not exists', async () => {
      const userData = createTestUserData({ roles: [5] });

      try {
        await userRepository.create(userData);
      } catch (error: any) {
        expect(error.statusCode).toBe(500);
        expect(error.cause.message).toContain("No 'Roles' record(s)");
        expect(error.message).toBe('Unable to create user');
      }
    });
  });

  describe('findUserById', () => {
    it('OK - Returns a user when the user exists', async () => {
      const newUser = await createTestUser();
      const createdUser = await userRepository.findUserById(newUser);
      const userId = createdUser?.id;

      const user = await userRepository.findUserById(userId!);

      expect(user).not.toBeNull();
      expect(user?.email).toBe('test@example.com');
    });

    it('OK - Returns user with roles when using findUserByIdWithRoles', async () => {
      const newUser = await createTestUser();
      const user = await userRepository.findUserByIdWithRoles(newUser);

      expect(user).not.toBeNull();
      expect(user?.email).toBe('test@example.com');
      expect(user?.roles).toContain('ADMIN');
    });

    it('OK - Returns null when the user does not exist', async () => {
      await expect(userRepository.findUserById('9999')).rejects.toThrow(
        UserNotFoundError
      );
      await expect(userRepository.findUserById('9999')).rejects.toThrow(
        `User with id "9999" not found.`
      );
    });

    it('Error - Handles Prisma client error', async () => {
      const { originalMethod } = setupErrorMock('findUnique');

      try {
        await userRepository.findUserById('UUID');
      } catch (error: any) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.statusCode).toBe(500);
        expect(error.cause.message).toMatch(new RegExp('Prisma client error'));
        expect(error.message).toBe('Unable to find user by id');
      } finally {
        restoreMock('findUnique', originalMethod);
      }
    });
  });

  describe('findUserByEmail', () => {
    beforeEach(async () => {
      await prisma.userRoles.deleteMany({});
      await prisma.users.deleteMany({});
      await prisma.roles.deleteMany({});
    });

    it('OK - Returns a user when the user exists', async () => {
      await ensureRoleExists();
      await createTestUser();

      const user = await userRepository.findUserByEmail('test@example.com');
      expect(user).not.toBeNull();
      expect(user?.email).toBe('test@example.com');
    });

    it('OK - Returns user with roles when using findUserByEmailWithRoles', async () => {
      await ensureRoleExists();
      await createTestUser();

      const user =
        await userRepository.findUserByEmailWithRoles('test@example.com');
      expect(user).not.toBeNull();
      expect(user?.email).toBe('test@example.com');
      expect(user?.roles).toContain('ADMIN');
    });

    it('OK - Returns null when the user does not exists', async () => {
      await prisma.userRoles.deleteMany({});
      await prisma.users.deleteMany({ where: { email: 'test@example.com' } });

      await expect(
        userRepository.findUserByEmail('test@example.com')
      ).rejects.toThrow(UserNotFoundError);
      await expect(
        userRepository.findUserByEmail('test@example.com')
      ).rejects.toThrow(`User with email "test@example.com" not found.`);
    });

    it('Error - Handles Prisma client error', async () => {
      const { originalMethod } = setupErrorMock('findUnique');

      try {
        await userRepository.findUserByEmail('test@example.com');
      } catch (error: any) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.statusCode).toBe(500);
        expect(error.cause.message).toMatch(new RegExp('Prisma client error'));
        expect(error.message).toBe('Unable to find user by email');
      } finally {
        restoreMock('findUnique', originalMethod);
      }
    });
  });
});
