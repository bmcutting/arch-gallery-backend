import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ExperienceType } from 'src/user/domain/enums/experience';

export class ExperienceCreateRequest {
  @ApiProperty({ enum: ExperienceType, example: ExperienceType.WORK })
  @IsEnum(ExperienceType)
  type: ExperienceType;

  @ApiProperty({ example: 'Arquitecta de proyectos' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Estudio Ramos' })
  @IsString()
  @IsNotEmpty()
  institutionOrCompany: string;

  @ApiProperty({ example: 2019 })
  @IsInt()
  @Type(() => Number)
  startYear: number;

  @ApiPropertyOptional({ example: 2023 })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  endYear?: number;

  @ApiPropertyOptional({ example: 'Dirección de obra en vivienda colectiva.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;
}
