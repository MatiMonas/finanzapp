import { PrismaClient, Users } from '@prisma/client';
import { DatabaseError } from 'errors';
import {
  FindByUserEmailRequestData,
  FindUserBydIdRequestData,
} from '../types/db_model';
import { PostUserParams } from '../types';

export interface IUserRepository {
  findUserById(userId: string): Promise<FindUserBydIdRequestData>;
  findUserByEmail(userEmail: string): Promise<FindByUserEmailRequestData>;
  create(userData: PostUserParams): Promise<string>;
}

export default class UserRepository implements IUserRepository {
  prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async findUserById(userId: string): Promise<FindUserBydIdRequestData> {
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
  ): Promise<FindByUserEmailRequestData> {
    try {
      const foundUser = await this.prismaClient.users.findUnique({
        where: {
          email: userEmail,
        },
      });

      return foundUser;
    } catch (error: any) {
      throw new DatabaseError('Unable to find user by email', { cause: error });
    }
  }

  async create(userData: PostUserParams): Promise<string> {
    try {
      const { email, password, roles, username } = userData;

      return await this.prismaClient.$transaction(async (prisma) => {
        const { id } = await prisma.users.create({
          data: {
            username,
            email,
            password,
          },
        });

        for (const role_id of roles) {
          await prisma.userRoles.upsert({
            where: {
              user_id_role_id: {
                user_id: id,
                role_id,
              },
            },
            create: {
              user_id: id,
              role_id,
            },
            update: {},
          });
        }
        return id;
      });
    } catch (error: any) {
      throw new DatabaseError('Unable to create user', { cause: error });
    }
  }
}
