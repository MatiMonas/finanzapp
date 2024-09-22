import { PrismaClient } from '@prisma/client';
import { Axios } from 'axios';
import BudgetRouter from 'modules/budgets/http/router';
import BudgetRepository from 'modules/budgets/repository/budget-repository';
import BudgetUsecase from 'modules/budgets/usecase';
import MonthlyWagesRouter from 'modules/monthly_wages/http/router';
import { MonthlyWagesHttpRepository } from 'modules/monthly_wages/repository/monthly_wages-http-repository';
import MonthlyWagesRepository from 'modules/monthly_wages/repository/monthly_wages-repository';
import MonthlyWagesUsecase from 'modules/monthly_wages/usecase';
import UsersRouter from 'modules/users/http/router';
import UserRepository from 'modules/users/repository/user-repository';
import UserUseCase from 'modules/users/usecase';
import { RedisClientType } from 'redis';

type ContainerServices = {
  redis: RedisClientType;
  prismaClient: PrismaClient;
  axios: Axios;
  userRepository: UserRepository;
  userUsecase: UserUseCase;
  userRouter: UsersRouter;
  budgetRepository: BudgetRepository;
  budgetUsecase: BudgetUsecase;
  budgetRouter: BudgetRouter;
  monthlyWagesRepository: MonthlyWagesRepository;
  monthlyWagesHttpRepository: MonthlyWagesHttpRepository;
  monthlyWagesUsecase: MonthlyWagesUsecase;
  monthlyWagesRouter: MonthlyWagesRouter;
};

export default ContainerServices;
