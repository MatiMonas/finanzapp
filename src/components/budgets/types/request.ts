import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  Min,
  Max,
  IsNotEmpty,
  ArrayMinSize,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'ValidBudgetActions', async: false })
class ValidBudgetActionsConstraint implements ValidatorConstraintInterface {
  validate(budgets: BudgetAction[]) {
    if (!Array.isArray(budgets)) return false;

    for (const budget of budgets) {
      if (
        budget.id !== undefined &&
        (typeof budget.id !== 'number' || budget.id < 1)
      ) {
        return false;
      }
      if (
        budget.name !== undefined &&
        (typeof budget.name !== 'string' || budget.name.trim() === '')
      ) {
        return false;
      }
      if (
        budget.percentage !== undefined &&
        (typeof budget.percentage !== 'number' ||
          budget.percentage < 0 ||
          budget.percentage > 100)
      ) {
        return false;
      }
      if (budget.create !== undefined && typeof budget.create !== 'boolean') {
        return false;
      }
      if (budget.delete !== undefined && typeof budget.delete !== 'boolean') {
        return false;
      }
    }
    return true;
  }

  defaultMessage() {
    return 'budgets must be valid';
  }
}

export class BudgetIdParam {
  @IsNumber({}, { message: 'id must be a number' })
  @Min(1, { message: 'id must be a valid number' })
  id!: number;
}

export class PostBudgetConfigurationBody {
  @IsString({ message: 'user_id must be a string' })
  @IsNotEmpty({ message: 'user_id must be a string' })
  user_id!: string;

  @IsString({ message: 'budget_configuration_name must be a string' })
  @IsNotEmpty({ message: 'budget_configuration_name must be a string' })
  budget_configuration_name!: string;

  @IsArray({ message: 'budgets must be an array' })
  @ArrayMinSize(1, { message: 'budgets must be an array' })
  budgets!: BudgetItem[];
}

export class BudgetItem {
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name must be a string' })
  name!: string;

  @IsNumber({}, { message: 'percentage must be a number' })
  @Min(0, { message: 'percentage must not be less than 0' })
  @Max(100, { message: 'percentage must not be greater than 100' })
  percentage!: number;
}

export class PatchBudgetBody {
  @IsString({ message: 'user_id must be a string' })
  @IsNotEmpty({ message: 'user_id must be a string' })
  user_id!: string;

  @IsOptional()
  @IsNumber({}, { message: 'budget_configuration_id must be a number' })
  budget_configuration_id?: number;

  @IsOptional()
  @IsString({ message: 'budget_configuration_name must be a string' })
  @IsNotEmpty({ message: 'budget_configuration_name must be a string' })
  budget_configuration_name?: string;

  @IsOptional()
  @IsArray({ message: 'budgets must be an array' })
  @Validate(ValidBudgetActionsConstraint)
  budgets?: BudgetAction[];
}

export class BudgetAction {
  @IsOptional()
  @IsNumber({}, { message: 'id must be a number' })
  @Min(1, { message: 'id must be a valid number' })
  id?: number;

  @IsOptional()
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name must be a string' })
  name?: string;

  @IsOptional()
  @IsNumber({}, { message: 'percentage must be a number' })
  @Min(0, { message: 'percentage must not be less than 0' })
  @Max(100, { message: 'percentage must not be greater than 100' })
  percentage?: number;

  @IsOptional()
  @IsBoolean({ message: 'create must be a boolean' })
  create?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'delete must be a boolean' })
  delete?: boolean;
}

export class DeleteBudgetConfigurationBody {
  @IsString({ message: 'user_id must be a string' })
  @IsNotEmpty({ message: 'user_id must be a string' })
  user_id!: string;

  @IsNumber({}, { message: 'budget_configuration_id must be a number' })
  budget_configuration_id!: number;
}

export class BudgetConfigurationParams {
  @IsOptional()
  @IsNumber({}, { message: 'id must be a number' })
  id?: number;

  @IsOptional()
  @IsString({ message: 'name must be a string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'user_id must be a string' })
  user_id?: string;

  @IsOptional()
  @IsBoolean({ message: 'is_active must be a boolean' })
  is_active?: boolean;
}
