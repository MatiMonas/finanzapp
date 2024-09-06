import { PrismaClient } from '@prisma/client';
import { RedisClientType } from 'redis';
import UserUsecase from 'users/usecase';
import UserRouter from 'users/http/router';
import UserRepository from 'users/repository/user-repository';
import BudgetRepository from 'budgets/repository/budget-repository';
import BudgetUsecase from 'budgets/usecase';
import BudgetRouter from 'budgets/http/router';

type ContainerServices = {
  prismaClient: PrismaClient;
  userRepository: UserRepository;
  userUsecase: UserUsecase;
  userRouter: UserRouter;
  budgetRepository: BudgetRepository;
  budgetUsecase: BudgetUsecase;
  budgetRouter: BudgetRouter;
  redis: RedisClientType;
};

export default ContainerServices;
