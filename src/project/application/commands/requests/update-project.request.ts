import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { CategoryResponse } from 'src/category/application/queries/responses/category.response';

export class UpdateProjectRequest {
  @ApiPropertyOptional({ description: 'Título del proyecto' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Descripción del proyecto' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Año de creación del proyecto', example: 2025 })
  @IsOptional()
  @IsNumber()
  year: number;

  @ApiProperty({
    description: 'Urls de las imágenes del proyecto',
    example: ['http://tuimagen.com', 'http://tuimagen.com'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagesUrl: string[];

  @ApiProperty({
    description: 'Categorías asociadas al proyecto',
    type: [CategoryResponse],
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories: string[];
}
