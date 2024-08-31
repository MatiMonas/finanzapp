import { PrismaClient } from '@prisma/client';
import UserRepository from 'users/repository/user-repository';

const prisma = new PrismaClient();
let userRepository: UserRepository;

beforeAll(async () => {
  userRepository = new UserRepository(prisma);
});

afterAll(async () => {
  await prisma.$disconnect();
});

afterEach(async () => {
  await prisma.users.deleteMany();
});

describe('UserRepository', () => {
  test('findUserByEmail should return a user when the user exists', async () => {
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

  test('findUserByEmail should return null when the user does not exist', async () => {
    const user = await userRepository.findUserByEmail(
      'nonexistent@example.com'
    );

    expect(user).toBeNull();
  });
});
