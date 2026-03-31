import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Level } from 'src/user/domain/enums/level';

export class UpdateSkillRequest {
  @ApiProperty({
    description: 'Id único de la skill a actualizar',
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
  })
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
