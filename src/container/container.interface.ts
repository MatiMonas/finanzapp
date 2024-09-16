import { PrismaClient } from '@prisma/client';
import BudgetRouter from 'modules/budgets/http/router';
import BudgetRepository from 'modules/budgets/repository/budget-repository';
import BudgetUsecase from 'modules/budgets/usecase';
import UsersRouter from 'modules/users/http/router';
import UserRepository from 'modules/users/repository/user-repository';
import UserUseCase from 'modules/users/usecase';
import { RedisClientType } from 'redis';

type ContainerServices = {
  prismaClient: PrismaClient;
  userRepository: UserRepository;
  userUsecase: UserUseCase;
  userRouter: UsersRouter;
  budgetRepository: BudgetRepository;
  budgetUsecase: BudgetUsecase;
  budgetRouter: BudgetRouter;
  redis: RedisClientType;
};

export default ContainerServices;
