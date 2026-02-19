import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProjectRequest {
  @ApiPropertyOptional({ description: 'Título del proyecto' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Descripción del proyecto' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Año de creación del proyecto', example: 2025 })
  @IsOptional()
  @IsNumber()
  year: number;
}
