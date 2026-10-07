import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TransformSort } from 'src/shared/application/decorators/transform-sort.decorator';
import { PaginationRequest } from 'src/shared/application/requests/pagination.request';
import { SortOptionRequest } from 'src/shared/application/requests/sort-option.request';
import { ExperienceType } from 'src/user/domain/enums/experience';
import { ExperienceSortFields } from 'src/user/domain/enums/experience-sort-fields';

export class ExperienceGetMineRequest extends PaginationRequest {
  @ApiPropertyOptional({
    description: 'Filtrar por tipo',
    enum: ExperienceType,
  })
  @IsOptional()
  @IsEnum(ExperienceType)
  type?: ExperienceType;

  @ApiPropertyOptional({
    type: [SortOptionRequest],
    example: [{ field: 'startYear', direction: 'DESC' }],
  })
  @TransformSort(ExperienceSortFields)
  sort?: SortOptionRequest<ExperienceSortFields>[];
}
