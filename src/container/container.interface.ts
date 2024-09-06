import { PrismaClient } from '@prisma/client';
import BudgetRouter from 'domain/budgets/http/router';
import BudgetRepository from 'domain/budgets/repository/budget-repository';
import BudgetUsecase from 'domain/budgets/usecase';
import UsersRouter from 'domain/users/http/router';
import UserRepository from 'domain/users/repository/user-repository';
import UserUseCase from 'domain/users/usecase';
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
