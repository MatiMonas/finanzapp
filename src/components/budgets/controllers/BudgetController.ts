import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Route,
  Tags,
  Path,
  Query,
  SuccessResponse,
} from 'tsoa';

import {
  PostBudgetConfigurationBody,
  PatchBudgetBody,
  DeleteBudgetConfigurationBody,
  BudgetDetailsResponse,
  BudgetResponse,
  BudgetConfigurationResponse,
} from '../types';
import container from '../../../container';

@Route('budgets')
@Tags('Budgets')
export class BudgetController extends Controller {
  private budgetUsecase = container.budgetUsecase;

  /**
   * Get a budget by ID
   */
  @Get('{id}')
  public async getBudget(
    @Path() id: number
  ): Promise<BudgetDetailsResponse | null> {
    return this.budgetUsecase.getBudgetDetails(id);
  }

  /**
   * Get all budget configurations for a user
   */
  @Get('configurations')
  public async getBudgetConfigurations(
    @Query() user_id?: string,
    @Query() name?: string,
    @Query() is_active?: boolean
  ): Promise<BudgetConfigurationResponse[]> {
    const filters = { user_id, name, is_active };
    return this.budgetUsecase.getBudgetConfigurations(filters);
  }

  /**
   * Create a new budget configuration
   */
  @Post('configurations')
  @SuccessResponse('201', 'Created')
  public async createBudgetConfiguration(
    @Body() budgetData: PostBudgetConfigurationBody
  ): Promise<BudgetResponse> {
    const result = await this.budgetUsecase.createBudget(budgetData);
    this.setStatus(201);
    return {
      success: Boolean(result),
      message: result
        ? 'Budget configuration created successfully'
        : 'Failed to create budget configuration',
    };
  }

  /**
   * Update a budget configuration
   */
  @Patch('configurations/{id}')
  @SuccessResponse('204', 'No Content')
  public async updateBudgetConfiguration(
    @Path() id: number,
    @Body() updateData: PatchBudgetBody
  ): Promise<BudgetResponse> {
    const payload = {
      budget_configuration_id: id,
      ...updateData,
    };
    const result =
      await this.budgetUsecase.partialUpdateBudgetConfiguration(payload);
    this.setStatus(204);
    return {
      success: Boolean(result),
      message: result
        ? 'Budget configuration updated successfully'
        : 'Failed to update budget configuration',
    };
  }

  /**
   * Delete a budget configuration
   */
  @Delete('configurations/{id}')
  @SuccessResponse('204', 'No Content')
  public async deleteBudgetConfiguration(
    @Path() id: number,
    @Body() deleteData: DeleteBudgetConfigurationBody
  ): Promise<BudgetResponse> {
    const budgetToDelete = {
      budget_configuration_id: id,
      user_id: deleteData.user_id,
    };
    const result =
      await this.budgetUsecase.deleteBudgetConfiguration(budgetToDelete);
    this.setStatus(204);
    return {
      success: Boolean(result),
      message: result
        ? 'Budget configuration deleted successfully'
        : 'Failed to delete budget configuration',
    };
  }
}
