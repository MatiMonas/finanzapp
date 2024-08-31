import ContainerServices from 'container/container.interface';
import Container from 'container/container';
import prismaClient from 'infrastructure/db/prisma';
import UserUseCase from 'users/usecase';
import UserRouter from 'users/http/router';
import UserRepository, {
  IUserRepository,
} from 'users/repository/user-repository';
import { IUserUseCase } from 'users/usecase/IUserUsecase';

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
container.service('userRouter', (c) => new UserRouter(c.userUseCase));
container.service(
  'userUseCase',
  (c): IUserUseCase => new UserUseCase(c.userRepository)
);
container.service(
  'userRepository',
  (c): IUserRepository => new UserRepository(c.prismaClient)
);

export default container;
