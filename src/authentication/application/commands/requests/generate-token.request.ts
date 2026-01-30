import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class GenerateTokenRequest {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '01HQK8R7N5P3Z9QX1A2B4C6D8E',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'johndoe',
    required: false,
  })
  @IsOptional()
  @IsString()
  userName?: string;
}
