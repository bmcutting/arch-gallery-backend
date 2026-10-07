import { ApiProperty } from '@nestjs/swagger';
import { Level } from 'src/user/domain/enums/level';
import { SkillScope } from 'src/user/domain/enums/skill-scope';

export class UserSkillResponse {
  @ApiProperty({
    description:
      'Identificador de la asociación entre el usuario y la habilidad',
    example: '01JA7Z8QK3M4N5P6R7S8T9V0W1',
  })
  id: string;

  @ApiProperty({
    description: 'Identificador de la habilidad en el catálogo',
    example: '01JA7Z8QK3M4N5P6R7S8T9V0W2',
  })
  skillId: string;

  @ApiProperty({ description: 'Nombre de la habilidad', example: 'Revit' })
  name: string;

  @ApiProperty({
    description: 'global: del catálogo curado. private: creada por el usuario.',
    enum: SkillScope,
  })
  scope: SkillScope;

  @ApiProperty({
    description: 'Nivel declarado, o null si no lo declaró',
    enum: Level,
    nullable: true,
  })
  level: Level | null;
}
