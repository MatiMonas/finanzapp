import ContainerServices from 'container/container.interface';
import Container from 'container/container';
import prismaClient from 'infrastructure/db/prisma';
import UsersRouter from 'domain/users/http/router';
import UserRepository, {
  IUserRepository,
} from 'domain/users/repository/user-repository';
import BudgetRouter, { IBudgetRouter } from 'domain/budgets/http/router';
import BudgetUsecase, { IBudgetUsecase } from 'domain/budgets/usecase';
import BudgetRepository, {
  IBudgetRepository,
} from 'domain/budgets/repository/budget-repository';
import UserUsecase, { IUserUsecase } from 'domain/users/usecase';

type IContainer<T> = {
  [Property in keyof T]: T[Property];
} & {
  service: (name: keyof T, cbCreator: (c: T) => any) => any;
};

const container =
  new Container<ContainerServices>() as IContainer<ContainerServices> &
    Container<ContainerServices>;

container.service('prismaClient', () => prismaClient());

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
export default container;
