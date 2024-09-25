import axios from 'axios';
import ContainerServices from 'container/container.interface';
import Container from 'container/container';
import prismaClient from 'infrastructure/persistance/prisma';

import UsersRouter from 'modules/users/http/router';
import UserUsecase, { IUserUsecase } from 'modules/users/usecase';
import UserRepository, {
  IUserRepository,
} from 'modules/users/repository/user-repository';

import BudgetRouter, { IBudgetRouter } from 'modules/budgets/http/router';
import BudgetUsecase, { IBudgetUsecase } from 'modules/budgets/usecase';
import BudgetRepository, {
  IBudgetRepository,
} from 'modules/budgets/repository/budget-repository';

import MonthlyWagesRouter, {
  IMonthlyWagesRouter,
} from 'modules/monthly-wages/http/router';
import MonthlyWagesUsecase, {
  IMonthlyWagesUsecase,
} from 'modules/monthly-wages/usecase';
import MonthlyWagesRepository, {
  IMonthlyWagesRepository,
} from 'modules/monthly-wages/repository/monthly-wages_repository';
import MonthlyWagesHttpRepository, {
  IMonthlyWagesHttpRepository,
} from 'modules/monthly-wages/repository/monthly-wages_http-repository';

type IContainer<T> = {
  [Property in keyof T]: T[Property];
} & {
  service: (name: keyof T, cbCreator: (c: T) => any) => any;
};

const container =
  new Container<ContainerServices>() as IContainer<ContainerServices> &
    Container<ContainerServices>;

container.service('prismaClient', () => prismaClient());
container.service('axios', () => axios);

// USER SERVICES
container.service('userRouter', (c) => new UsersRouter(c.userUsecase));
container.service(
  'userUsecase',
  (c): IUserUsecase => new UserUsecase(c.userRepository)
);
container.service(
  'userRepository',
  (c): IUserRepository => new UserRepository(c.prismaClient)
);

// BUDGET SERVICES
container.service(
  'budgetRouter',
  (c): IBudgetRouter => new BudgetRouter(c.budgetUsecase)
);
container.service(
  'budgetUsecase',
  (c): IBudgetUsecase => new BudgetUsecase(c.budgetRepository)
);
container.service(
  'budgetRepository',
  (c): IBudgetRepository => new BudgetRepository(c.prismaClient)
);

// MONTHLY WAGES SERVICES
container.service(
  'monthlyWagesRouter',
  (c): IMonthlyWagesRouter => new MonthlyWagesRouter(c.monthlyWagesUsecase)
);
container.service(
  'monthlyWagesUsecase',
  (c): IMonthlyWagesUsecase =>
    new MonthlyWagesUsecase(
      c.monthlyWagesRepository,
      c.monthlyWagesHttpRepository
    )
);
container.service(
  'monthlyWagesRepository',
  (c): IMonthlyWagesRepository => new MonthlyWagesRepository(c.prismaClient)
);
container.service(
  'monthlyWagesHttpRepository',
  (c): IMonthlyWagesHttpRepository => new MonthlyWagesHttpRepository(c.axios)
);

export default container;
