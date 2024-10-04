import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(5, { message: 'Must be at least 5 characters long' })
  @MaxLength(50, { message: 'Must be at most 50 characters long' })
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10, { message: 'Must be at least 10 characters long' })
  @MaxLength(200, { message: 'Must be at most 200 characters long' })
  @Matches(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;
}
