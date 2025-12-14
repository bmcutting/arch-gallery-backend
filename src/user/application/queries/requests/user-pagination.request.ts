import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsDate, IsBoolean } from 'class-validator';
import { TransformSort } from 'src/shared/application/decorators/transform-sort.decorator';
import { PaginationRequest } from 'src/shared/application/requests/pagination.request';
import { SortOptionRequest } from 'src/shared/application/requests/sort-option.request';
import { UserSortFields } from 'src/user/domain/enums/user-sort-fields';

export class UserPaginationRequest extends PaginationRequest {
  @ApiPropertyOptional({ description: 'Término de búsqueda global' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filtrar por nombre' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Filtrar por apellido' })
  @IsOptional()
  @IsString()
  lastName?: string;

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

  @ApiPropertyOptional({ description: 'Filtrar por email' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por estado activo/inactivo',
    enum: [true, false],
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    type: [SortOptionRequest],
    description: 'Opciones de ordenamiento para usuarios',
    example: [
      { field: 'createdAt', order: 'DESC' },
      { field: 'lastName', order: 'ASC' },
    ],
  })
  @TransformSort(UserSortFields)
  sort?: SortOptionRequest<UserSortFields>[];
}
