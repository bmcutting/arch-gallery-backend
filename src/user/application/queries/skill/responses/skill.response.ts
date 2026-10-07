import { ApiProperty } from '@nestjs/swagger';
import { SkillScope } from 'src/user/domain/enums/skill-scope';

export class SkillResponse {
  @ApiProperty({
    description: 'Identificador de la habilidad en el catálogo',
    example: '01JA7Z8QK3M4N5P6R7S8T9V0W1',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de la habilidad',
    example: 'Diseño arquitectónico',
  })
  name: string;

  @ApiProperty({
    description:
      'global: del catálogo curado. private: creada por ti y solo visible para ti.',
    enum: SkillScope,
    example: SkillScope.GLOBAL,
  })
  scope: SkillScope;
}
