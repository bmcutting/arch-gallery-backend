import { ApiProperty } from '@nestjs/swagger';
import { Level } from 'src/user/domain/enums/level';

export class SkillResponse {
  @ApiProperty({
    description: 'Identificador único UUID de la habilidad',
    example: 'a1234567-b89c-40d1-a456-556642440000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de la habilidad',
    example: 'Diseño arquitectónico',
  })
  name: string;

  @ApiProperty({
    description: 'Nivel de la habilidad',
    example: Level.ADVANCED,
    enum: Level,
    nullable: true,
  })
  level?: Level;
}
