import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

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

  // Lo asigna el controlador desde el token; se ignora lo que llegue en el body.
  @ApiHideProperty()
  @IsOptional()
  @IsString()
  userId: string;
}
