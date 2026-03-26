import { ApiProperty } from '@nestjs/swagger';
import { ExperienceType } from 'src/user/domain/enums/experience';

export class ExperienceResponse {
  @ApiProperty({
    description: 'Identificador único UUID de la experiencia',
    example: 'b9876543-c21d-40d1-a456-556642440111',
  })
  id: string;

  @ApiProperty({
    description: 'Tipo de experiencia',
    example: ExperienceType.EDUCATION,
    enum: ExperienceType,
  })
  type: ExperienceType;

  @ApiProperty({
    description: 'Título de la experiencia',
    example: 'Máster en Urbanismo',
  })
  title: string;

  @ApiProperty({
    description: 'Institución o empresa',
    example: 'Universidad Politécnica de Madrid',
  })
  institutionOrCompany: string;

  @ApiProperty({
    description: 'Descripción de la experiencia',
    example: 'Programa de posgrado en urbanismo sostenible',
    nullable: true,
  })
  description?: string;

  @ApiProperty({
    description: 'Año de inicio',
    example: 2020,
  })
  startYear: number;

  @ApiProperty({
    description: 'Año de finalización',
    example: 2022,
    nullable: true,
  })
  endYear?: number;

  @ApiProperty({
    description: 'Indica si la experiencia está en curso',
    example: false,
  })
  isCurrent: boolean;
}
