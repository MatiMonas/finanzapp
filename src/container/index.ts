import ContainerServices from 'container/container.interface';
import Container from 'container/container';
import prismaClient from 'infrastructure/persistance/prisma';
import UsersRouter from 'modules/users/http/router';
import UserRepository, {
  IUserRepository,
} from 'modules/users/repository/user-repository';
import BudgetRouter, { IBudgetRouter } from 'modules/budgets/http/router';
import BudgetUsecase, { IBudgetUsecase } from 'modules/budgets/usecase';
import BudgetRepository, {
  IBudgetRepository,
} from 'modules/budgets/repository/budget-repository';
import UserUsecase, { IUserUsecase } from 'modules/users/usecase';

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
