import WagesHttpRepository from 'components/wages/repository/wages_http-repository';
import WagesRepository from 'components/wages/repository/wages_repository';
import WagesUsecase from 'components/wages/usecase';

export const mockWagesUseCase = {
  createWage: jest.fn(),
} as unknown as WagesUsecase;

export const mockWagesRepository = {
  createWage: jest.fn(),
} as unknown as WagesRepository;

export const mockWagesHttpRepository = {} as unknown as WagesHttpRepository;
