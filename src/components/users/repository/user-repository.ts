import { PrismaClient } from '@prisma/client';
import { UserNotFoundError } from 'errors';
import { handlePrismaError } from 'utils/helpers/prismaErrorHandler';
import bcrypt from 'bcrypt';

import {
  FindByUserEmailRequestData,
  FindUserBydIdRequestData,
  FindByUserEmailBasicData,
  FindUserBydIdBasicData,
} from '../types/db_model';
import { PostUserParams } from '../types';

export interface IUserRepository {
  findUserById(userId: string): Promise<FindUserBydIdBasicData>;
  findUserByIdWithRoles(userId: string): Promise<FindUserBydIdRequestData>;
  findUserByEmail(userEmail: string): Promise<FindByUserEmailBasicData>;
  findUserByEmailWithRoles(
    userEmail: string
  ): Promise<FindByUserEmailRequestData>;
  create(userData: PostUserParams): Promise<string>;
}

export default class UserRepository implements IUserRepository {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async findUserById(userId: string): Promise<FindUserBydIdBasicData> {
    try {
      const foundUser = await this.prismaClient.users.findUnique({
        where: {
          id: userId,
        },
      });

      if (!foundUser) {
        throw new UserNotFoundError(`User with id "${userId}" not found.`);
      }

      return {
        id: foundUser.id,
        email: foundUser.email,
      };
    } catch (error: unknown) {
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      handlePrismaError(error, 'Unable to find user by id');
    }
  }

  async findUserByIdWithRoles(
    userId: string
  ): Promise<FindUserBydIdRequestData> {
    try {
      const foundUser = await this.prismaClient.users.findUnique({
        where: {
          id: userId,
        },
        include: {
          roles: {
            include: {
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!foundUser) {
        throw new UserNotFoundError(`User with id "${userId}" not found.`);
      }

      const roles = foundUser.roles.map((userRole) => userRole.role.name);

      return {
        id: foundUser.id,
        email: foundUser.email,
        roles,
      };
    } catch (error: unknown) {
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      handlePrismaError(error, 'Unable to find user by id');
    }
  }

  async findUserByEmail(userEmail: string): Promise<FindByUserEmailBasicData> {
    try {
      const foundUser = await this.prismaClient.users.findUnique({
        where: {
          email: userEmail,
        },
      });

      if (!foundUser) {
        throw new UserNotFoundError(
          `User with email "${userEmail}" not found.`
        );
      }

      return {
        id: foundUser.id,
        email: foundUser.email,
      };
    } catch (error: unknown) {
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      handlePrismaError(error, 'Unable to find user by email');
    }
  }

  async findUserByEmailWithRoles(
    userEmail: string
  ): Promise<FindByUserEmailRequestData> {
    try {
      const foundUser = await this.prismaClient.users.findUnique({
        where: {
          email: userEmail,
        },
        include: {
          roles: {
            include: {
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!foundUser) {
        throw new UserNotFoundError(
          `User with email "${userEmail}" not found.`
        );
      }

      const roles = foundUser.roles.map((userRole) => userRole.role.name);

      return {
        id: foundUser.id,
        email: foundUser.email,
        roles,
      };
    } catch (error: unknown) {
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      handlePrismaError(error, 'Unable to find user by email');
    }
  }

  async create(userData: PostUserParams): Promise<string> {
    try {
      const { username, email, password, roles } = userData;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await this.prismaClient.users.create({
        data: {
          username,
          email,
          password: hashedPassword,
          roles: {
            create: roles.map((roleId) => ({
              role: {
                connect: {
                  id: roleId,
                },
              },
            })),
          },
        },
      });

      return newUser.id;
    } catch (error: unknown) {
      handlePrismaError(error, 'Unable to create user');
    }
  }
}
