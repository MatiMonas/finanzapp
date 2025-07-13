import {
  IsString,
  IsEmail,
  IsArray,
  IsNumber,
  MinLength,
  MaxLength,
  Matches,
  ArrayMinSize,
} from 'class-validator';

export class PostUserParams {
  @IsString()
  @MinLength(2, { message: 'Username must be at least 2 characters long' })
  @MaxLength(25, { message: 'Username must be at most 25 characters long' })
  username!: string;

  @IsEmail({}, { message: 'Invalid email address' })
  @MaxLength(30, { message: 'Email must be at most 30 characters long' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
  @Matches(/[@$!%*?&#]/, {
    message: 'Password must contain at least one special character',
  })
  password!: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1, { message: 'Roles must be a non-empty array of numbers' })
  roles!: number[];
}
