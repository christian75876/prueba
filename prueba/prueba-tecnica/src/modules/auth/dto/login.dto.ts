import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class loginAuthDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
