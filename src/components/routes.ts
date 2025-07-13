/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import { fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { WageController } from './wages/controllers/WageController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './users/controllers/UserController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BudgetController } from './budgets/controllers/BudgetController';
import type {
  Request as ExRequest,
  Response as ExResponse,
  RequestHandler,
  Router,
} from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
  WageResponse: {
    dataType: 'refObject',
    properties: {
      success: { dataType: 'boolean', required: true },
      message: { dataType: 'string', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  WageBody: {
    dataType: 'refObject',
    properties: {
      user_id: { dataType: 'string', required: true },
      amount: { dataType: 'double', required: true },
      month: { dataType: 'string', required: true },
      year: { dataType: 'string', required: true },
      currency: {
        dataType: 'union',
        subSchemas: [
          { dataType: 'enum', enums: ['USD'] },
          { dataType: 'enum', enums: ['ARS'] },
        ],
        required: true,
      },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  TestResponse: {
    dataType: 'refObject',
    properties: {
      message: { dataType: 'string', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  UserResponse: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'string', required: true },
      message: { dataType: 'string', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  PostUserParams: {
    dataType: 'refObject',
    properties: {
      username: { dataType: 'string', required: true },
      email: { dataType: 'string', required: true },
      password: { dataType: 'string', required: true },
      roles: {
        dataType: 'array',
        array: { dataType: 'double' },
        required: true,
      },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  BudgetDetailsResponse: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'double', required: true },
      user_id: { dataType: 'string', required: true },
      name: { dataType: 'string', required: true },
      percentage: { dataType: 'double', required: true },
      remaining_allocation: { dataType: 'double', required: true },
      budget_configuration_id: {
        dataType: 'union',
        subSchemas: [
          { dataType: 'double' },
          { dataType: 'enum', enums: [null] },
        ],
        required: true,
      },
      monthly_wage_summary_id: {
        dataType: 'union',
        subSchemas: [
          { dataType: 'double' },
          { dataType: 'enum', enums: [null] },
        ],
        required: true,
      },
      created_at: { dataType: 'datetime', required: true },
      updated_at: { dataType: 'datetime', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  'DefaultSelection_Prisma._36_BudgetsPayload_': {
    dataType: 'refAlias',
    type: {
      dataType: 'nestedObjectLiteral',
      nestedProperties: {
        monthly_wage_summary_id: { dataType: 'double', required: true },
        budget_configuration_id: { dataType: 'double', required: true },
        remaining_allocation: { dataType: 'double', required: true },
        percentage: { dataType: 'double', required: true },
        deleted_at: { dataType: 'datetime', required: true },
        updated_at: { dataType: 'datetime', required: true },
        created_at: { dataType: 'datetime', required: true },
        user_id: { dataType: 'string', required: true },
        id: { dataType: 'double', required: true },
        name: { dataType: 'string', required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  Budgets: {
    dataType: 'refAlias',
    type: {
      ref: 'DefaultSelection_Prisma._36_BudgetsPayload_',
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  'DefaultSelection_Prisma._36_BudgetsConfigurationsPayload_': {
    dataType: 'refAlias',
    type: {
      dataType: 'nestedObjectLiteral',
      nestedProperties: {
        deleted_at: { dataType: 'datetime', required: true },
        updated_at: { dataType: 'datetime', required: true },
        created_at: { dataType: 'datetime', required: true },
        is_active: { dataType: 'boolean', required: true },
        is_public: { dataType: 'boolean', required: true },
        user_id: { dataType: 'string', required: true },
        id: { dataType: 'double', required: true },
        name: { dataType: 'string', required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  BudgetConfigurationWithBudgets: {
    dataType: 'refObject',
    properties: {
      deleted_at: { dataType: 'datetime', required: true },
      updated_at: { dataType: 'datetime', required: true },
      created_at: { dataType: 'datetime', required: true },
      is_active: { dataType: 'boolean', required: true },
      is_public: { dataType: 'boolean', required: true },
      user_id: { dataType: 'string', required: true },
      id: { dataType: 'double', required: true },
      name: { dataType: 'string', required: true },
      budgets: {
        dataType: 'array',
        array: { dataType: 'refAlias', ref: 'Budgets' },
        required: true,
      },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  BudgetResponse: {
    dataType: 'refObject',
    properties: {
      success: { dataType: 'boolean', required: true },
      message: { dataType: 'string', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  BudgetItem: {
    dataType: 'refObject',
    properties: {
      name: { dataType: 'string', required: true },
      percentage: { dataType: 'double', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  PostBudgetConfigurationBody: {
    dataType: 'refObject',
    properties: {
      user_id: { dataType: 'string', required: true },
      budget_configuration_name: { dataType: 'string', required: true },
      budgets: {
        dataType: 'array',
        array: { dataType: 'refObject', ref: 'BudgetItem' },
        required: true,
      },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  BudgetAction: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'double' },
      name: { dataType: 'string' },
      percentage: { dataType: 'double' },
      create: { dataType: 'boolean' },
      delete: { dataType: 'boolean' },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  PatchBudgetBody: {
    dataType: 'refObject',
    properties: {
      user_id: { dataType: 'string', required: true },
      budget_configuration_name: { dataType: 'string' },
      budgets: {
        dataType: 'array',
        array: { dataType: 'refObject', ref: 'BudgetAction' },
      },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  DeleteBudgetConfigurationBody: {
    dataType: 'refObject',
    properties: {
      user_id: { dataType: 'string', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {
  noImplicitAdditionalProperties: 'throw-on-extras',
  bodyCoercion: true,
});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
  // ###########################################################################################################
  //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
  //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
  // ###########################################################################################################

  const argsWageController_createWage: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    wageData: { in: 'body', name: 'wageData', required: true, ref: 'WageBody' },
  };
  app.post(
    '/wages',
    ...fetchMiddlewares<RequestHandler>(WageController),
    ...fetchMiddlewares<RequestHandler>(WageController.prototype.createWage),

    async function WageController_createWage(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsWageController_createWage,
          request,
          response,
        });

        const controller = new WageController();

        await templateService.apiHandler({
          methodName: 'createWage',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUserController_test: Record<string, TsoaRoute.ParameterSchema> = {};
  app.get(
    '/users',
    ...fetchMiddlewares<RequestHandler>(UserController),
    ...fetchMiddlewares<RequestHandler>(UserController.prototype.test),

    async function UserController_test(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUserController_test,
          request,
          response,
        });

        const controller = new UserController();

        await templateService.apiHandler({
          methodName: 'test',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUserController_createUser: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    userData: {
      in: 'body',
      name: 'userData',
      required: true,
      ref: 'PostUserParams',
    },
  };
  app.post(
    '/users',
    ...fetchMiddlewares<RequestHandler>(UserController),
    ...fetchMiddlewares<RequestHandler>(UserController.prototype.createUser),

    async function UserController_createUser(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUserController_createUser,
          request,
          response,
        });

        const controller = new UserController();

        await templateService.apiHandler({
          methodName: 'createUser',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsBudgetController_getBudget: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    id: { in: 'path', name: 'id', required: true, dataType: 'double' },
  };
  app.get(
    '/budgets/:id',
    ...fetchMiddlewares<RequestHandler>(BudgetController),
    ...fetchMiddlewares<RequestHandler>(BudgetController.prototype.getBudget),

    async function BudgetController_getBudget(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsBudgetController_getBudget,
          request,
          response,
        });

        const controller = new BudgetController();

        await templateService.apiHandler({
          methodName: 'getBudget',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsBudgetController_getBudgetConfigurations: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    user_id: { in: 'query', name: 'user_id', dataType: 'string' },
    name: { in: 'query', name: 'name', dataType: 'string' },
    is_active: { in: 'query', name: 'is_active', dataType: 'boolean' },
  };
  app.get(
    '/budgets/configurations',
    ...fetchMiddlewares<RequestHandler>(BudgetController),
    ...fetchMiddlewares<RequestHandler>(
      BudgetController.prototype.getBudgetConfigurations
    ),

    async function BudgetController_getBudgetConfigurations(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsBudgetController_getBudgetConfigurations,
          request,
          response,
        });

        const controller = new BudgetController();

        await templateService.apiHandler({
          methodName: 'getBudgetConfigurations',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsBudgetController_createBudgetConfiguration: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    budgetData: {
      in: 'body',
      name: 'budgetData',
      required: true,
      ref: 'PostBudgetConfigurationBody',
    },
  };
  app.post(
    '/budgets/configurations',
    ...fetchMiddlewares<RequestHandler>(BudgetController),
    ...fetchMiddlewares<RequestHandler>(
      BudgetController.prototype.createBudgetConfiguration
    ),

    async function BudgetController_createBudgetConfiguration(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsBudgetController_createBudgetConfiguration,
          request,
          response,
        });

        const controller = new BudgetController();

        await templateService.apiHandler({
          methodName: 'createBudgetConfiguration',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsBudgetController_updateBudgetConfiguration: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    id: { in: 'path', name: 'id', required: true, dataType: 'double' },
    updateData: {
      in: 'body',
      name: 'updateData',
      required: true,
      ref: 'PatchBudgetBody',
    },
  };
  app.patch(
    '/budgets/configurations/:id',
    ...fetchMiddlewares<RequestHandler>(BudgetController),
    ...fetchMiddlewares<RequestHandler>(
      BudgetController.prototype.updateBudgetConfiguration
    ),

    async function BudgetController_updateBudgetConfiguration(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsBudgetController_updateBudgetConfiguration,
          request,
          response,
        });

        const controller = new BudgetController();

        await templateService.apiHandler({
          methodName: 'updateBudgetConfiguration',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 204,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsBudgetController_deleteBudgetConfiguration: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    id: { in: 'path', name: 'id', required: true, dataType: 'double' },
    deleteData: {
      in: 'body',
      name: 'deleteData',
      required: true,
      ref: 'DeleteBudgetConfigurationBody',
    },
  };
  app.delete(
    '/budgets/configurations/:id',
    ...fetchMiddlewares<RequestHandler>(BudgetController),
    ...fetchMiddlewares<RequestHandler>(
      BudgetController.prototype.deleteBudgetConfiguration
    ),

    async function BudgetController_deleteBudgetConfiguration(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsBudgetController_deleteBudgetConfiguration,
          request,
          response,
        });

        const controller = new BudgetController();

        await templateService.apiHandler({
          methodName: 'deleteBudgetConfiguration',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 204,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
