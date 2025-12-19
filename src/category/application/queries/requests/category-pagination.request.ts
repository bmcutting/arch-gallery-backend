import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CategorySortFields } from 'src/category/domain/enums/category-sort-fields';
import { TransformSort } from 'src/shared/application/decorators/transform-sort.decorator';
import { PaginationRequest } from 'src/shared/application/requests/pagination.request';
import { SortOptionRequest } from 'src/shared/application/requests/sort-option.request';

export class CategoryPaginationRequest extends PaginationRequest {
  @ApiPropertyOptional({ description: 'Filtrar por nombre' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    type: [SortOptionRequest],
    description: 'Opciones de ordenamiento para categorñia',
    example: [{ field: 'name', order: 'DESC' }],
  })
  @TransformSort(CategorySortFields)
  sort?: SortOptionRequest<CategorySortFields>[];
}
