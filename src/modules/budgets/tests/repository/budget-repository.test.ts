import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import BudgetRepository, {
  IBudgetRepository,
} from 'modules/budgets/repository/budget-repository';
import {
  BudgetAction,
  CreateBudgetPayload,
} from 'modules/budgets/types/request';
import UserRepository, {
  IUserRepository,
} from 'modules/users/repository/user-repository';
import { PostUserParams } from 'modules/users/types';
import { DatabaseError } from 'errors';

import { TESTING_DATABASE_PARAMS } from 'utils/constants';
import { cleanDatabase } from 'utils/helpers/cleanDatabase';

jest.mock('utils/env.ts', () => TESTING_DATABASE_PARAMS);

const prisma = new PrismaClient();
let budgetRepository: IBudgetRepository;
let userRepository: IUserRepository;

describe('BudgetRepository', () => {
  beforeAll(async () => {
    execSync('npx prisma db push --accept-data-loss');
    budgetRepository = new BudgetRepository(prisma);
    userRepository = new UserRepository(prisma);
  });

  afterEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('findBudgetConfigurationWhere', () => {
    test('OK - Returns budget configurations without deleted_at', async () => {
      await prisma.roles.create({ data: { name: 'ADMIN' } });
      const userData: PostUserParams = {
        username: 'test',
        email: 'test@example.com',
        password: 'securepassword',
        roles: [1],
      };

      const userId = await userRepository.create(userData);
      const budgetConfigurationName = 'ActiveBudgetConfig';

      const budgetConfigurationId =
        await budgetRepository.createBudgetConfiguration(
          budgetConfigurationName,
          userId
        );

      await prisma.budgets.create({
        data: {
          name: 'test',
          budget_configuration_id: budgetConfigurationId,
          user_id: userId,
          percentage: 100,
        },
      });

      const configs = await budgetRepository.findBudgetConfigurationWhere({
        user_id: userId,
      });

      expect(configs).toHaveLength(1);
      expect(configs[0].name).toBe(budgetConfigurationName);
      expect(configs[0].deleted_at).toBeNull();
      expect(configs[0].budgets[0].name).toBe('test');
    });

    test('ERROR - Handles Prisma client error', async () => {
      jest
        .spyOn(prisma.budgetsConfigurations, 'findMany')
        .mockRejectedValueOnce(new Error('Prisma client error'));

      try {
        await budgetRepository.findBudgetConfigurationWhere({
          user_id: 'some-user-uuid',
        });
      } catch (error: any) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.statusCode).toBe(500);
        expect(error.cause.message).toMatch(/Prisma client error/);
        expect(error.message).toBe(
          'Unable to find budget configurations with the specified criteria'
        );
      }
    });
  });

  describe('createBudgetConfiguration', () => {
    test('OK - Creates budget configuration', async () => {
      const userId = 'some-user-uuid';
      const budgetConfigurationName = 'MyBudgetConfig';

      const budgetConfigId = await budgetRepository.createBudgetConfiguration(
        budgetConfigurationName,
        userId
      );

      expect(budgetConfigId).toBe(1);
    });

    test('ERROR - Handles Prisma client error', async () => {
      jest
        .spyOn(prisma.budgetsConfigurations, 'create')
        .mockRejectedValueOnce(new Error('Prisma client error'));

      try {
        await budgetRepository.createBudgetConfiguration('TestConfig', 'uuid');
      } catch (error: any) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.statusCode).toBe(500);
        expect(error.cause.message).toMatch(/Prisma client error/);
        expect(error.message).toBe('Unable to create budget configuration');
      }
    });
  });

  describe('deleteBudgetConfiguration', () => {
    test('OK - Soft deletes budget configurations and related budgets successfully', async () => {
      await prisma.roles.create({ data: { name: 'ADMIN' } });
      const userData: PostUserParams = {
        username: 'test',
        email: 'test@example.com',
        password: 'securepassword',
        roles: [1],
      };

      const user_id = await userRepository.create(userData);
      const budgetConfigurationName = 'MyBudgetConfig';

      const configId = await budgetRepository.createBudgetConfiguration(
        budgetConfigurationName,
        user_id
      );

      await prisma.budgets.createMany({
        data: [
          {
            name: 'Test',
            percentage: 80,
            user_id,
            budget_configuration_id: configId,
          },
          {
            name: 'Test 2',
            percentage: 20,
            user_id,
            budget_configuration_id: configId,
          },
        ],
      });

      await budgetRepository.deleteBudgetConfiguration({
        user_id,
        budget_configuration_id: configId,
      });

      const deletedConfig = await budgetRepository.findBudgetConfigurationWhere(
        { id: configId }
      );

      expect(deletedConfig).toEqual([]);

      const deletedBudgets = await prisma.budgets.findMany({
        where: { budget_configuration_id: configId },
      });

      expect(deletedBudgets).toHaveLength(2);
    });

    test('ERROR - Handles Prisma client error', async () => {
      jest
        .spyOn(prisma.budgetsConfigurations, 'deleteMany')
        .mockRejectedValueOnce(new Error('Prisma client error'));

      try {
        await budgetRepository.deleteBudgetConfiguration({
          user_id: 'some-user-uuid',
          budget_configuration_id: 1,
        });
      } catch (error: any) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.statusCode).toBe(500);
        expect(error.cause.message).toMatch(/Prisma client error/);
        expect(error.message).toBe(
          'Unable to delete budget configuration with id 1'
        );
      }
    });
  });

  describe('createBudget', () => {
    test('OK - Creates multiple budgets', async () => {
      await prisma.roles.create({ data: { name: 'ADMIN' } });
      const userData: PostUserParams = {
        username: 'test',
        email: 'test@example.com',
        password: 'securepassword',
        roles: [1],
      };

      const user_id = await userRepository.create(userData);
      const budgetConfigurationName = 'MyBudgetConfig';

      await budgetRepository.createBudgetConfiguration(
        budgetConfigurationName,
        user_id
      );
      const budgetData: CreateBudgetPayload[] = [
        {
          user_id,
          name: 'Savings',
          percentage: 40,
          budget_configuration_id: 1,
        },
        {
          user_id,
          name: 'Housing',
          percentage: 60,
          budget_configuration_id: 1,
        },
      ];

      const result = await budgetRepository.createBudget(budgetData);
      expect(result).toBe(true);
    });

    test('ERROR - Handles Prisma client error', async () => {
      await prisma.roles.create({ data: { name: 'ADMIN' } });
      const userData: PostUserParams = {
        username: 'test',
        email: 'test@example.com',
        password: 'securepassword',
        roles: [1],
      };

      const user_id = await userRepository.create(userData);
      const budgetConfigurationName = 'MyBudgetConfig';

      await budgetRepository.createBudgetConfiguration(
        budgetConfigurationName,
        user_id
      );

      jest
        .spyOn(prisma.budgets, 'createMany')
        .mockRejectedValueOnce(new Error('Prisma client error'));

      try {
        const budgetData: CreateBudgetPayload[] = [
          {
            user_id,
            name: 'Savings',
            percentage: 40,
            budget_configuration_id: 1,
          },
          {
            user_id,
            name: 'Housing',
            percentage: 60,
            budget_configuration_id: 1,
          },
        ];
        await budgetRepository.createBudget(budgetData);
      } catch (error: any) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.statusCode).toBe(500);
        expect(error.cause.message).toMatch(/Prisma client error/);
        expect(error.message).toBe('Unable to create budget');
      }
    });
  });

  describe('getBudgetsByConfigurationId', () => {
    test('OK - Returns budgets for a given configuration ID', async () => {
      await prisma.roles.create({ data: { name: 'ADMIN' } });
      const userData: PostUserParams = {
        username: 'test',
        email: 'test@example.com',
        password: 'securepassword',
        roles: [1],
      };

      const user_id = await userRepository.create(userData);
      const budgetConfigurationName = 'MyBudgetConfig';

      const budgetConfigId = await budgetRepository.createBudgetConfiguration(
        budgetConfigurationName,
        user_id
      );

      const budgetData: CreateBudgetPayload[] = [
        {
          user_id,
          name: 'Savings',
          percentage: 40,
          budget_configuration_id: 1,
        },
        {
          user_id,
          name: 'Housing',
          percentage: 60,
          budget_configuration_id: 1,
        },
      ];

      await budgetRepository.createBudget(budgetData);

      const result = await budgetRepository.getBudgetsByConfigurationId(
        budgetConfigId
      );

      expect(result).toHaveLength(2);
      expect(result[0]?.name).toBe('Savings');
      expect(result[1]?.name).toBe('Housing');
    });

    test('ERROR - Handles Prisma client error', async () => {
      jest
        .spyOn(prisma.budgets, 'findMany')
        .mockRejectedValueOnce(new Error('Prisma client error'));

      try {
        await budgetRepository.getBudgetsByConfigurationId(1);
      } catch (error: any) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.statusCode).toBe(500);
        expect(error.cause.message).toMatch(/Prisma client error/);
        expect(error.message).toBe(
          'Unable to find budgets by budget configuration id'
        );
      }
    });
  });

  describe('updateBudgetConfigurationName', () => {
    test('should update budget configuration name successfully', async () => {
      await prisma.roles.create({ data: { name: 'ADMIN' } });
      const userData: PostUserParams = {
        username: 'test',
        email: 'test@example.com',
        password: 'securepassword',
        roles: [1],
      };

      const user_id = await userRepository.create(userData);
      const budgetConfigurationName = 'MyBudgetConfig';
      const newBudgetConfigurationName = 'MyNewBudgetConfig';

      const configId = await budgetRepository.createBudgetConfiguration(
        budgetConfigurationName,
        user_id
      );

      const result = await budgetRepository.updateBudgetConfigurationName(
        configId,
        newBudgetConfigurationName
      );

      expect(result).toBe(true);

      const updatedConfig = await prisma.budgetsConfigurations.findUnique({
        where: { id: configId },
      });

      expect(updatedConfig?.name).toBe(newBudgetConfigurationName);
    });

    test('should throw a DatabaseError if Prisma fails', async () => {
      jest
        .spyOn(prisma.budgetsConfigurations, 'update')
        .mockRejectedValueOnce(new Error('Prisma Error'));

      try {
        await budgetRepository.updateBudgetConfigurationName(1, 'NewName');
      } catch (error: any) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.message).toBe(
          'Unable to update budget configuration name'
        );
      }
    });
  });

  describe('deleteBudgets', () => {
    test('should delete budgets by IDs successfully', async () => {
      await prisma.roles.create({ data: { name: 'ADMIN' } });
      const userData: PostUserParams = {
        username: 'test',
        email: 'test@example.com',
        password: 'securepassword',
        roles: [1],
      };

      const user_id = await userRepository.create(userData);
      const budgetConfigurationName = 'MyBudgetConfig';

      const configId = await budgetRepository.createBudgetConfiguration(
        budgetConfigurationName,
        user_id
      );

      const budgetData = [
        {
          name: 'Rent',
          percentage: 30,
          user_id,
          budget_configuration_id: configId,
        },
        {
          name: 'Savings',
          percentage: 20,
          user_id,
          budget_configuration_id: configId,
        },
      ];

      await budgetRepository.createBudget(budgetData);

      const budgets = await prisma.budgets.findMany();
      const budgetIds = budgets.map((budget) => budget.id);

      const result = await budgetRepository.deleteBudgets(budgetIds);

      expect(result).toBe(true);

      const deletedBudgets = await prisma.budgets.findMany({
        where: {
          id: { in: budgetIds },
        },
      });

      expect(deletedBudgets).toHaveLength(0);
    });

    test('should throw a DatabaseError if Prisma fails', async () => {
      jest
        .spyOn(prisma.budgets, 'deleteMany')
        .mockRejectedValueOnce(new Error('Prisma Error'));

      try {
        await budgetRepository.deleteBudgets([1, 2]);
      } catch (error: any) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.message).toBe('Unable to delete budgets');
      }
    });
  });

  describe('updateBudgets', () => {
    test('should update existing budgets successfully', async () => {
      await prisma.roles.create({ data: { name: 'ADMIN' } });
      const userData: PostUserParams = {
        username: 'test',
        email: 'test@example.com',
        password: 'securepassword',
        roles: [1],
      };

      const user_id = await userRepository.create(userData);
      const budgetConfigurationName = 'MyBudgetConfig';

      const configId = await budgetRepository.createBudgetConfiguration(
        budgetConfigurationName,
        user_id
      );

      const budgetData = [
        {
          name: 'Rent',
          percentage: 30,
          user_id,
          budget_configuration_id: configId,
        },
        {
          name: 'Savings',
          percentage: 20,
          user_id,
          budget_configuration_id: configId,
        },
      ];

      await budgetRepository.createBudget(budgetData);

      const updatedData: BudgetAction[] = [
        { id: 1, name: 'NewRent', percentage: 35 },
        { id: 2, name: 'NewSavings', percentage: 25 },
      ];

      const result = await budgetRepository.updateBudgets(updatedData);

      expect(result).toBe(true);

      const validIds = updatedData
        .map((b) => b.id)
        .filter((id): id is number => id !== undefined);

      const updatedBudgets = await prisma.budgets.findMany({
        where: {
          id: { in: validIds },
        },
      });

      expect(updatedBudgets).toHaveLength(2);
      expect(updatedBudgets.find((b) => b.id === 1)?.name).toBe('NewRent');
      expect(updatedBudgets.find((b) => b.id === 2)?.name).toBe('NewSavings');
    });

    test('should throw a DatabaseError if Prisma fails', async () => {
      jest
        .spyOn(prisma.budgets, 'update')
        .mockRejectedValueOnce(new Error('Prisma Error'));

      try {
        const updatedData: BudgetAction[] = [
          { id: 1, name: 'UpdatedName', percentage: 50 },
        ];

        await budgetRepository.updateBudgets(updatedData);
      } catch (error: any) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.message).toBe('Unable to update budgets');
      }
    });
  });
});
