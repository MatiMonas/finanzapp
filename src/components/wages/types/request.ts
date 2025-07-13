import {
  IsString,
  IsNumber,
  IsIn,
  IsOptional,
  IsNotEmpty,
  Min,
  Matches,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'YearRange', async: false })
class YearRangeConstraint implements ValidatorConstraintInterface {
  validate(year: string) {
    if (!/^[0-9]{4}$/.test(year)) return false;
    const y = Number(year);
    return y >= 2000 && y <= 2029;
  }
  defaultMessage(args: ValidationArguments) {
    const year = args.value;
    if (Number(year) < 2000) return 'year must be a reasonable year';
    if (Number(year) > 2029) return 'year must not be in the future';
    return 'year must be a valid 4-digit year';
  }
}

export class WageBody {
  @IsString({ message: 'user_id must be a string' })
  @IsNotEmpty({ message: 'user_id must be a string' })
  user_id!: string;

  @IsNumber({}, { message: 'amount must be a number' })
  @Min(1, { message: 'amount must be greater than 0' })
  amount!: number;

  @IsString({ message: 'month must be a string' })
  @Matches(/^(0?[1-9]|1[0-2])$/, { message: 'month must be between 1 and 12' })
  month!: string;

  @IsString({ message: 'year must be a string' })
  @Matches(/^\d{4}$/, { message: 'year must be a valid 4-digit year' })
  @Validate(YearRangeConstraint)
  year!: string;

  @IsIn(['USD', 'ARS'], { message: 'currency must be either USD or ARS' })
  currency!: 'USD' | 'ARS';
}

export type WageBodyWithMetadata = WageBody & {
  month_and_year?: string;
  monthly_wage_summary_id?: number | null;
};

export class WagesParams {
  @IsOptional()
  @IsString({ message: 'user_id must be a string' })
  user_id?: string;

  @IsOptional()
  @IsNumber({}, { message: 'amount must be a number' })
  @Min(1, { message: 'amount must be a valid number' })
  amount?: number;

  @IsOptional()
  @IsString({ message: 'month_and_year must be a string' })
  month_and_year?: string;

  @IsOptional()
  @IsNumber({}, { message: 'exchange_rate must be a number' })
  @Min(0, { message: 'exchange_rate must be a valid number' })
  exchange_rate?: number;

  @IsOptional()
  @IsIn(['USD', 'ARS'], { message: 'currency must be either USD or ARS' })
  currency?: 'USD' | 'ARS';
}
