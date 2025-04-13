import axios from 'axios';
import ContainerServices from 'container/container.interface';
import Container from 'container/container';
import prismaClient from 'infrastructure/persistance/prisma';

import UsersRouter from 'components/users/http/router';
import UserUsecase, { IUserUsecase } from 'components/users/usecase';
import UserRepository, {
  IUserRepository,
} from 'components/users/repository/user-repository';

import BudgetRouter, { IBudgetRouter } from 'components/budgets/http/router';
import BudgetUsecase, { IBudgetUsecase } from 'components/budgets/usecase';

import WagesRouter, { IWagesRouter } from 'components/wages/http/router';
import WagesUsecase, { IWagesUsecase } from 'components/wages/usecase';
import WagesRepository, {
  IWagesRepository,
} from 'components/wages/repository/wages_repository';
import WagesHttpRepository, {
  IWagesHttpRepository,
} from 'components/wages/repository/wages_http-repository';
import BudgetRepository, {
  IBudgetRepository,
} from 'components/budgets/repository/budget-repository';

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

//  WAGES SERVICES
container.service(
  'wagesRouter',
  (c): IWagesRouter => new WagesRouter(c.wagesUsecase)
);
container.service(
  'wagesUsecase',
  (c): IWagesUsecase =>
    new WagesUsecase(
      c.wagesRepository,
      c.wagesHttpRepository,
      c.budgetRepository
    )
);
container.service(
  'wagesRepository',
  (c): IWagesRepository => new WagesRepository(c.prismaClient)
);
container.service(
  'wagesHttpRepository',
  (c): IWagesHttpRepository => new WagesHttpRepository(c.axios)
);

export default container;
