import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserChangePasswordRequest {
  @ApiProperty({
    description: 'Contraseña actual, para confirmar el cambio',
    example: 'laContraseñaAnterior',
  })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    description: 'Contraseña nueva',
    example: 'unaContraseñaSegura',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
