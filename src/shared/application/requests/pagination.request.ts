import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationRequest {
  @ApiPropertyOptional({ description: 'Número de página, empieza en 1' })
  @ValidateIf((o: PaginationRequest) => o.pageSize !== undefined) // validate page if pageSize is provided
  @IsInt({ message: 'Page must be an integer if pageSize is provided' })
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de elementos por página, empieza en 1',
  })
  @ValidateIf((o: PaginationRequest) => o.page !== undefined) // validate pageSize if page is provided
  @IsInt({ message: 'pageSize must be an integer if page is provided' })
  @Min(1)
  @Type(() => Number)
  pageSize?: number;

  @ApiPropertyOptional({ description: 'Término de búsqueda global' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filtrar por fecha de creación mínima' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAtMin?: Date;

  @ApiPropertyOptional({ description: 'Filtrar por fecha de creación máxima' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAtMax?: Date;

  @ApiPropertyOptional({
    description: 'Incluir tanto activos como eliminados (soft delete)',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeDeleted?: boolean;

  @ApiPropertyOptional({
    description: 'Mostrar solo usuarios eliminados (soft delete)',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  onlyDeleted?: boolean;

  @ApiPropertyOptional({
    description: 'Filtrar por fecha de eliminación mínima (soft delete)',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deletedAtMin?: Date;

  @ApiPropertyOptional({
    description: 'Filtrar por fecha de eliminación máxima (soft delete)',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deletedAtMax?: Date;

  @ApiPropertyOptional({
    description: 'Filtrar por estado activo/inactivo',
    enum: [true, false],
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
