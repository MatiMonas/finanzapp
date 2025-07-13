import { PrismaClient } from '@prisma/client';
import { RedisClientType } from 'redis';
import { Axios } from 'axios';
import BudgetRepository from 'components/budgets/repository/budget-repository';
import BudgetUsecase from 'components/budgets/usecase';
import WagesHttpRepository from 'components/wages/repository/wages_http-repository';
import WagesRepository from 'components/wages/repository/wages_repository';
import WagesUsecase from 'components/wages/usecase';
import UserRepository from 'components/users/repository/user-repository';
import UserUseCase from 'components/users/usecase';

type ContainerServices = {
  redis: RedisClientType;
  prismaClient: PrismaClient;
  axios: Axios;

  userRepository: UserRepository;
  userUsecase: UserUseCase;

  budgetRepository: BudgetRepository;
  budgetUsecase: BudgetUsecase;

  wagesRepository: WagesRepository;
  wagesHttpRepository: WagesHttpRepository;
  wagesUsecase: WagesUsecase;
};

export default ContainerServices;
