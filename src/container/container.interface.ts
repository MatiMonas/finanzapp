import { PrismaClient } from '@prisma/client';
import { RedisClientType } from 'redis';
import UserUseCase from 'users/usecase';
import UserRouter from 'users/http/router';
import UserRepository from 'users/repository/mysql-repository';

type ContainerServices = {
  prismaClient: PrismaClient;
  userRepository: UserRepository;
  userUseCase: UserUseCase;
  userRouter: UserRouter;
  redis: RedisClientType;
};

export default ContainerServices;
