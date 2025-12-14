import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInRequest {
  @IsNotEmpty()
  @IsString()
  @IsEmail({ host_blacklist: [] })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
