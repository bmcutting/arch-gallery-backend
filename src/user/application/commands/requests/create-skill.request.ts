import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Level } from 'src/user/domain/enums/level';

export class CreateSkillRequest {
  @ApiProperty({
    description: 'Nombre de la skill',
    example: 'Modelado 3D',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Nivel de la skill',
    enum: Level,
    example: Level.INTERMEDIATE,
  })
  @IsOptional()
  @IsEnum(Level)
  level: Level;

  // Lo asigna el controlador desde el token; se ignora lo que llegue en el body.
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  userId: string;
}
