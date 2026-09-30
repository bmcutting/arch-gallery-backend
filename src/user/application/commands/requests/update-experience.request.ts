import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ExperienceType } from 'src/user/domain/enums/experience';

export class UpdateExperienceRequest {
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  experienceId: string;

  @ApiProperty({
    description: 'Tipo de experiencia',
    example: ExperienceType.EDUCATION,
    enum: ExperienceType,
  })
  @IsOptional()
  type: ExperienceType;

  @ApiProperty({
    description: 'Título de la experiencia',
    example: 'Máster en Urbanismo',
  })
  @IsOptional()
  title: string;

  @ApiProperty({
    description: 'Institución o empresa',
    example: 'Universidad Politécnica de Madrid',
  })
  @IsOptional()
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
  @IsOptional()
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
