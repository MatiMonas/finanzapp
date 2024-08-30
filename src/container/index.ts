import ContainerServices from 'container/container.interface';
import Container from 'container/container';
import prismaClient from 'infrastructure/db/prisma';
import UserUseCase from 'users/usecase';
import UserRouter from 'users/http/router';
import UserRepository from 'users/repository/mysql-repository';

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
container.service('userRepository', (c) => new UserRepository(c.prismaClient));
container.service('userRouter', (c) => new UserRouter(c.userUseCase));
container.service('userUseCase', (c) => new UserUseCase(c.userRepository));

export default container;
