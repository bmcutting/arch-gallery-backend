import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { ExperienceType } from 'src/user/domain/enums/experience';

export class CreateExperienceRequest {
  @ApiProperty({
    description: 'Id único del usuario que crea la skill',
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
  })
  userId: string;

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
  @IsOptional()
  description: string;

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
  @IsOptional()
  endYear: number;

  @ApiProperty({
    description: 'Indica si la experiencia está en curso',
    example: false,
  })
  @IsOptional()
  isCurrent: boolean;
}
