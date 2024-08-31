import { PrismaClient, Users } from '@prisma/client';
import {
  FindByUserEmailRequestData,
  FindUserBydIdRequestData,
} from 'users/types/db_model';
import { PostUserParams } from 'users/types';
import { DatabaseError } from 'errors';

export interface IUserRepository {
  findUserByEmail(
    userEmail: string
  ): Promise<FindByUserEmailRequestData | null>;
  create(userData: PostUserParams): Promise<boolean>;
  findUserById(userId: number): Promise<FindUserBydIdRequestData | null>;
}

export default class UserRepository implements IUserRepository {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async findUserById(userId: number): Promise<FindUserBydIdRequestData | null> {
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

      if (foundUser) {
        return {
          id: foundUser.id,
          email: foundUser.email,
          roles: foundUser.roles.map((userRole) => userRole.role.name),
        };
      }

      return null;
    } catch (error: any) {
      throw new DatabaseError('Unable to find user by id', { cause: error });
    }
  }

  async findUserByEmail(
    userEmail: string
  ): Promise<FindByUserEmailRequestData | null> {
    try {
      const foundUser = await this.prismaClient.users.findUnique({
        where: {
          email: userEmail,
        },
        select: {
          email: true,
        },
      });

      return foundUser;
    } catch (error: any) {
      throw new DatabaseError('Unable to find user by email', { cause: error });
    }
  }

  async create(userData: PostUserParams): Promise<boolean> {
    const { email, password, roles } = userData;

    try {
      await this.prismaClient.$transaction(async (prisma) => {
        const newUser = await prisma.users.create({
          data: {
            email,
            password,
          },
        });

        for (const roleId of roles) {
          await prisma.userRoles.upsert({
            where: {
              userId_roleId: {
                userId: newUser.id,
                roleId,
              },
            },
            create: {
              userId: newUser.id,
              roleId,
            },
            update: {},
          });
        }
      });

      return true;
    } catch (error: any) {
      throw new DatabaseError('Unable to create user', { cause: error });
    }
  }
}
