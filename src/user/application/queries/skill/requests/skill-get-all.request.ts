import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { TransformSort } from 'src/shared/application/decorators/transform-sort.decorator';
import { PaginationRequest } from 'src/shared/application/requests/pagination.request';
import { SortOptionRequest } from 'src/shared/application/requests/sort-option.request';
import { SkillSortFields } from 'src/user/domain/enums/skill-sort-fields';

export class SkillGetAllRequest extends PaginationRequest {
  @ApiPropertyOptional({ description: 'Filtrar por nombre' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    type: [SortOptionRequest],
    description: 'Opciones de ordenamiento del catálogo',
    example: [{ field: 'displayName', direction: 'ASC' }],
  })
  @TransformSort(SkillSortFields)
  sort?: SortOptionRequest<SkillSortFields>[];
}
