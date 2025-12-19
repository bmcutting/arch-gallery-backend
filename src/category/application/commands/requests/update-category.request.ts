import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryRequest {
  categoryId: string;

  @ApiPropertyOptional({ description: 'Nombre de la categoría' })
  @IsOptional()
  @IsString()
  name?: string;
}
