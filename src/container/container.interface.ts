import { PrismaClient } from '@prisma/client';
import { RedisClientType } from 'redis';
import { Axios } from 'axios';

import BudgetRouter from 'components/budgets/http/router';
import BudgetRepository from 'components/budgets/repository/budget-repository';
import BudgetUsecase from 'components/budgets/usecase';

import WagesRouter from 'components/wages/http/router';
import WagesHttpRepository from 'components/wages/repository/wages_http-repository';
import WagesRepository from 'components/wages/repository/wages_repository';
import WagesUsecase from 'components/wages/usecase';

import UsersRouter from 'components/users/http/router';
import UserRepository from 'components/users/repository/user-repository';
import UserUseCase from 'components/users/usecase';

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

  wagesRepository: WagesRepository;
  wagesHttpRepository: WagesHttpRepository;
  wagesUsecase: WagesUsecase;
  wagesRouter: WagesRouter;
};

export default ContainerServices;
