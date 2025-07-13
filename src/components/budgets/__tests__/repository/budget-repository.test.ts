import { execSync } from 'child_process';

import { describe, it, expect, beforeEach } from 'bun:test';
import { PrismaClient } from '@prisma/client';
import { BudgetAction, CreateBudgetPayload } from 'components/budgets/types';
import UserRepository, {
  IUserRepository,
} from 'components/users/repository/user-repository';
import { PostUserParams } from 'components/users/types';
import { DatabaseError } from 'errors';
import { cleanDatabase } from 'utils/helpers/cleanDatabase';
import BudgetRepository, {
  IBudgetRepository,
} from 'components/budgets/repository/budget-repository';

const prisma = new PrismaClient();
const budgetRepository: IBudgetRepository = new BudgetRepository(prisma);
const userRepository: IUserRepository = new UserRepository(prisma);

const createTestUser = async (
  username: string,
  email: string
): Promise<string> => {
  const userData: PostUserParams = {
    username,
    email,
    password: 'securepassword',
    roles: [1],
  };
  return userRepository.create(userData);
};

const createTestBudgetConfiguration = async (
  userId: string,
  name: string
): Promise<number> => {
  return budgetRepository.createBudgetConfiguration(name, userId);
};

const createTestBudgets = async (
  userId: string,
  configId: number,
  budgets: CreateBudgetPayload[]
) => {
  return budgetRepository.createBudget(budgets);
};

describe('BudgetRepository', () => {
  describe('findBudgetConfigurationWhere', () => {
    it('OK - Returns budget configurations without deleted_at', async () => {
      await cleanDatabase();
      await prisma.roles.create({ data: { name: 'ADMIN' } });
      const userId = await createTestUser('test', 'test@example.com');
      const budgetConfigurationName = 'ActiveBudgetConfig';
      const budgetConfigurationId = await createTestBudgetConfiguration(
        userId,
        budgetConfigurationName
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

      await cleanDatabase();
    });

    it('NOT FOUND - Returns an empty array if no configurations found', async () => {
      const userId = 'non-existent-user-id';
      const configs = await budgetRepository.findBudgetConfigurationWhere({
        user_id: userId,
      });
      expect(configs).toEqual([]);

      await cleanDatabase();
    });

    it('ERROR - Handles Prisma client error', async () => {
      const original = prisma.budgetsConfigurations.findMany;
      prisma.budgetsConfigurations.findMany = (() =>
        Promise.reject(new Error('Prisma client error'))) as any;
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
      } finally {
        prisma.budgetsConfigurations.findMany = original;
      }

      await cleanDatabase();
    });
  });

  describe('createBudgetConfiguration', () => {
    it('OK - Creates budget configuration and sets it as active_configuration for user', async () => {
      await prisma.roles.create({ data: { name: 'ADMIN' } });
      const userId = await createTestUser('test', 'test@example.com');
      const budgetConfigurationName = 'ActiveBudgetConfig';

      const budgetConfigId = await budgetRepository.createBudgetConfiguration(
        budgetConfigurationName,
        userId
      );

      expect(budgetConfigId).toBe(1);

      const user = await prisma.users.findUnique({ where: { id: userId } });
      expect(user?.active_budget_configuration_id).toBe(budgetConfigId);

      await cleanDatabase();
    });

    it('ERROR - Handles Prisma client error', async () => {
      const original = prisma.budgetsConfigurations.create;
      prisma.budgetsConfigurations.create = (() =>
        Promise.reject(new Error('Prisma client error'))) as any;
      try {
        await prisma.roles.create({ data: { name: 'ADMIN' } });
        const userId = await createTestUser('test', 'test@example.com');

        await budgetRepository.createBudgetConfiguration('TestConfig', userId);
      } catch (error: any) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.statusCode).toBe(500);
        expect(error.cause.message).toMatch(/Prisma client error/);
        expect(error.message).toBe('Unable to create budget configuration');
      } finally {
        prisma.budgetsConfigurations.create = original;
      }

      await cleanDatabase();
    });
  });

  describe('deleteBudgetConfiguration', () => {
    it('OK - Soft deletes budget configurations and related budgets successfully', async () => {
      await prisma.roles.create({ data: { name: 'ADMIN' } });
      const userId = await createTestUser('test', 'test@example.com');
      const budgetConfigurationName = 'MyBudgetConfig';
      const configId = await createTestBudgetConfiguration(
        userId,
        budgetConfigurationName
      );

      await createTestBudgets(userId, configId, [
        {
          name: 'Test',
          percentage: 80,
          user_id: userId,
          budget_configuration_id: configId,
        },
        {
          name: 'Test 2',
          percentage: 20,
          user_id: userId,
          budget_configuration_id: configId,
        },
      ]);

      await budgetRepository.deleteBudgetConfiguration({
        user_id: userId,
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

      await cleanDatabase();
    });

    it('ERROR - Handles Prisma client error', async () => {
      const original = prisma.budgetsConfigurations.deleteMany;
      prisma.budgetsConfigurations.deleteMany = (() =>
        Promise.reject(new Error('Prisma client error'))) as any;
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
      } finally {
        prisma.budgetsConfigurations.deleteMany = original;
      }

      await cleanDatabase();
    });
  });

  describe('createBudget', () => {
    it('OK - Creates multiple budgets', async () => {
      await prisma.roles.create({ data: { name: 'ADMIN' } });
      const userId = await createTestUser('test', 'test@example.com');
      const budgetConfigurationId = await createTestBudgetConfiguration(
        userId,
        'MyBudgetConfig'
      );

      const budgetsPayload: CreateBudgetPayload[] = [
        {
          name: 'Savings',
          percentage: 50,
          user_id: userId,
          budget_configuration_id: budgetConfigurationId,
        },
        {
          name: 'Expenses',
          percentage: 50,
          user_id: userId,
          budget_configuration_id: budgetConfigurationId,
        },
      ];

      await createTestBudgets(userId, budgetConfigurationId, budgetsPayload);

      const budgets = await prisma.budgets.findMany({
        where: { budget_configuration_id: budgetConfigurationId },
      });

      expect(budgets).toHaveLength(2);
      expect(budgets[0].name).toBe('Savings');
      expect(budgets[1].name).toBe('Expenses');

      await cleanDatabase();
    });

    it('ERROR - Handles Prisma client error', async () => {
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

      const original = prisma.budgets.createMany;
      prisma.budgets.createMany = (() =>
        Promise.reject(new Error('Prisma client error'))) as any;
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
      } finally {
        prisma.budgets.createMany = original;
      }

      await cleanDatabase();
    });
  });

  describe('getBudgetsByConfigurationId', () => {
    it('OK - Returns budgets for a given configuration ID', async () => {
      await prisma.roles.create({ data: { name: 'ADMIN' } });
      const user_id = await createTestUser('test', 'test@example.com');
      const budgetConfigurationId = await createTestBudgetConfiguration(
        user_id,
        'MyBudgetConfig'
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
        budgetConfigurationId
      );

      expect(result).toHaveLength(2);
      expect(result[0]?.name).toBe('Savings');
      expect(result[1]?.name).toBe('Housing');

      await cleanDatabase();
    });

    it('ERROR - Handles Prisma client error', async () => {
      const original = prisma.budgets.findMany;
      prisma.budgets.findMany = (() =>
        Promise.reject(new Error('Prisma client error'))) as any;
      try {
        await budgetRepository.getBudgetsByConfigurationId(1);
      } catch (error: any) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.statusCode).toBe(500);
        expect(error.cause.message).toMatch(/Prisma client error/);
        expect(error.message).toBe(
          'Unable to find budgets by budget configuration id'
        );
      } finally {
        prisma.budgets.findMany = original;
      }

      await cleanDatabase();
    });
  });

  describe('updateBudgetConfigurationName', () => {
    it('should update budget configuration name successfully', async () => {
      await prisma.roles.create({ data: { name: 'ADMIN' } });
      const userId = await createTestUser('test', 'test@example.com');
      const budgetConfigurationName = 'MyBudgetConfig';
      const configId = await createTestBudgetConfiguration(
        userId,
        budgetConfigurationName
      );

      await createTestBudgets(userId, configId, [
        {
          name: 'Test',
          percentage: 80,
          user_id: userId,
          budget_configuration_id: configId,
        },
        {
          name: 'Test 2',
          percentage: 20,
          user_id: userId,
          budget_configuration_id: configId,
        },
      ]);

      const newBudgetConfigurationName = 'NewName';
      const result = await budgetRepository.updateBudgetConfigurationName(
        configId,
        newBudgetConfigurationName
      );

      expect(result).toBe(true);

      const updatedConfig = await prisma.budgetsConfigurations.findUnique({
        where: { id: configId },
      });

      expect(updatedConfig?.name).toBe(newBudgetConfigurationName);

      await cleanDatabase();
    });

    it('should throw a DatabaseError if Prisma fails', async () => {
      const original = prisma.budgetsConfigurations.update;
      prisma.budgetsConfigurations.update = (() =>
        Promise.reject(new Error('Prisma Error'))) as any;
      try {
        await budgetRepository.updateBudgetConfigurationName(1, 'NewName');
      } catch (error: any) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.message).toBe(
          'Unable to update budget configuration name'
        );
      } finally {
        prisma.budgetsConfigurations.update = original;
      }

      await cleanDatabase();
    });
  });

  describe('deleteBudgets', () => {
    it('should delete budgets by IDs successfully', async () => {
      await prisma.roles.create({ data: { name: 'ADMIN' } });
      const userId = await createTestUser('test', 'test@example.com');
      const budgetConfigurationName = 'MyBudgetConfig';
      const configId = await createTestBudgetConfiguration(
        userId,
        budgetConfigurationName
      );

      await createTestBudgets(userId, configId, [
        {
          name: 'Test',
          percentage: 80,
          user_id: userId,
          budget_configuration_id: configId,
        },
        {
          name: 'Test 2',
          percentage: 20,
          user_id: userId,
          budget_configuration_id: configId,
        },
      ]);

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

      await cleanDatabase();
    });

    it('should throw a DatabaseError if Prisma fails', async () => {
      const original = prisma.budgets.deleteMany;
      prisma.budgets.deleteMany = (() =>
        Promise.reject(new Error('Prisma Error'))) as any;
      try {
        await budgetRepository.deleteBudgets([1, 2]);
      } catch (error: any) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.message).toBe('Unable to delete budgets');
      } finally {
        prisma.budgets.deleteMany = original;
      }

      await cleanDatabase();
    });
  });

  describe('updateBudgets', () => {
    it('should update existing budgets successfully', async () => {
      await prisma.roles.create({ data: { name: 'ADMIN' } });
      const userId = await createTestUser('test', 'test@example.com');
      const budgetConfigurationName = 'MyBudgetConfig';
      const configId = await createTestBudgetConfiguration(
        userId,
        budgetConfigurationName
      );

      await createTestBudgets(userId, configId, [
        {
          name: 'Test',
          percentage: 80,
          user_id: userId,
          budget_configuration_id: configId,
        },
        {
          name: 'Test 2',
          percentage: 20,
          user_id: userId,
          budget_configuration_id: configId,
        },
      ]);

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

      await cleanDatabase();
    });

    it('should throw a DatabaseError if Prisma fails', async () => {
      const original = prisma.budgets.update;
      prisma.budgets.update = (() =>
        Promise.reject(new Error('Prisma Error'))) as any;
      try {
        const updatedData: BudgetAction[] = [
          { id: 1, name: 'UpdatedName', percentage: 50 },
        ];

        await budgetRepository.updateBudgets(updatedData);
      } catch (error: any) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.message).toBe('Unable to update budgets');
      } finally {
        prisma.budgets.update = original;
      }

      await cleanDatabase();
    });
  });

  describe('getBudgetDetails', () => {
    it('should get budget details successfully', async () => {
      await prisma.roles.create({ data: { name: 'ADMIN' } });
      const userId = await createTestUser('test', 'test@example.com');
      const budgetConfigurationName = 'MyBudgetConfig';
      const configId = await createTestBudgetConfiguration(
        userId,
        budgetConfigurationName
      );

      await createTestBudgets(userId, configId, [
        {
          name: 'Test',
          percentage: 80,
          user_id: userId,
          budget_configuration_id: configId,
        },
      ]);

      const budgetDetails = await budgetRepository.getBudgetDetails(1);
      expect(budgetDetails).not.toBeNull();
      expect(budgetDetails?.id).toBe(1);

      await cleanDatabase();
    });

    it('should throw a DatabaseError if Prisma fails', async () => {
      const original = prisma.budgets.findFirst;
      prisma.budgets.findFirst = (() =>
        Promise.reject(new Error('Prisma Error'))) as any;
      try {
        await budgetRepository.getBudgetDetails(1);
      } catch (error: any) {
        expect(error).toBeInstanceOf(DatabaseError);
        expect(error.message).toBe('Unable to get budget details');
      } finally {
        prisma.budgets.findFirst = original;
      }

      await cleanDatabase();
    });
  });
});
