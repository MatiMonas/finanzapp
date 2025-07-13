import UserUsecase from 'components/users/usecase';

import { createMockFn } from './testHelpers';

export const mockUserUseCase = {
  test: () => Promise.resolve('ok'),
  create: createMockFn(),
} as unknown as UserUsecase;

export function createMockUserRepository() {
  return {
    create: createMockFn(),
    findUserById: createMockFn(),
    findUserByEmail: createMockFn(),
    findUserByIdWithRoles: createMockFn(),
    findUserByEmailWithRoles: createMockFn(),
  };
}
