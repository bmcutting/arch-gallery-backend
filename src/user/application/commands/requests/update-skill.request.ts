import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Level } from 'src/user/domain/enums/level';

export class UpdateSkillRequest {
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  skillId: string;

  @ApiProperty({
    description: 'Nombre de la skill',
    example: 'Modelado 3D',
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Nivel de la skill',
    enum: Level,
    example: Level.INTERMEDIATE,
  })
  @IsOptional()
  level: Level;
}
