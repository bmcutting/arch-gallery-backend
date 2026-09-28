import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsBooleanOptional } from '../decorators/is-boolean.decorator';

export class PaginationRequest {
  @ApiPropertyOptional({ description: 'Número de página, empieza en 1' })
  @ValidateIf((o: PaginationRequest) => o.limit !== undefined) // validate page if limit is provided
  @IsInt({ message: 'Page must be an integer if limit is provided' })
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de elementos por página, empieza en 1',
  })
  @ValidateIf((o: PaginationRequest) => o.page !== undefined) // validate limit if page is provided
  @IsInt({ message: 'limit must be an integer if page is provided' })
  @Min(1)
  @Type(() => Number)
  limit?: number;

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
    description:
      'Filtrar por estado. Omitido o `true` devuelve solo los activos; ' +
      '`false` devuelve solo los eliminados (soft delete).',
  })
  @IsBooleanOptional()
  isActive?: boolean;
}
