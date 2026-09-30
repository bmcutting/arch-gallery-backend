import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExperienceType } from 'src/user/domain/enums/experience';

export class CreateExperienceRequest {
  // Lo asigna el controlador desde el token; se ignora lo que llegue en el body.
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Tipo de experiencia',
    example: ExperienceType.EDUCATION,
    enum: ExperienceType,
  })
  @IsEnum(ExperienceType)
  type: ExperienceType;

  @ApiProperty({
    description: 'Título de la experiencia',
    example: 'Máster en Urbanismo',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Institución o empresa',
    example: 'Universidad Politécnica de Madrid',
  })
  @IsString()
  @IsNotEmpty()
  institutionOrCompany: string;

  @ApiProperty({
    description: 'Descripción de la experiencia',
    example: 'Programa de posgrado en urbanismo sostenible',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Año de inicio',
    example: 2020,
  })
  @IsInt()
  @Type(() => Number)
  startYear: number;

  @ApiProperty({
    description: 'Año de finalización',
    example: 2022,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  endYear: number;

  @ApiProperty({
    description: 'Indica si la experiencia está en curso',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isCurrent: boolean;
}
