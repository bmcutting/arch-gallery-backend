import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectRequest {
  @ApiProperty({
    description: 'Título del proyecto',
    example: 'Diseño futuro',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Año de creación del proyecto', example: 2025 })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({
    description: 'Descripción del proyecto',
    example: 'Un diseño elegante con toques futuristas',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'Categorías del proyecto' })
  @IsOptional()
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  categories?: string[];

  @ApiProperty({
    description: 'Id del usuario que crea el proyecto',
    example: '22d468e9-f816-40ae-9d86-b95a75edc524',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
