import MonthlyWagesRepository from 'modules/monthly-wages/repository/monthly_wages-repository';
import MonthlyWagesUsecase from 'modules/monthly-wages/usecase';
import MonthlyWagesHttpRepository from 'modules/monthly-wages/repository/monthly_wages-http-repository';

export const mockMonthlyWagesUseCase = {
  createMonthlyWage: jest.fn(),
} as unknown as MonthlyWagesUsecase;

export const mockMonthlyWagesRepository = {
  createMonthlyWage: jest.fn(),
} as unknown as MonthlyWagesRepository;

export const mockMonthlyWagesHttpRepository =
  {} as unknown as MonthlyWagesHttpRepository;
