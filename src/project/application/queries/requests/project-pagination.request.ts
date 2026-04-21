import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ProjectSortFields } from 'src/project/domain/enums/project-sort-fields';
import { TransformSort } from 'src/shared/application/decorators/transform-sort.decorator';
import { PaginationRequest } from 'src/shared/application/requests/pagination.request';
import { SortOptionRequest } from 'src/shared/application/requests/sort-option.request';

export class ProjectPaginationRequest extends PaginationRequest {
  @ApiPropertyOptional({ description: 'Filtrar por título' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    type: [SortOptionRequest],
    description: 'Opciones de ordenamiento para usuarios',
    example: [
      { field: 'createdAt', order: 'DESC' },
      { field: 'lastName', order: 'ASC' },
    ],
  })
  @TransformSort(ProjectSortFields)
  sort?: SortOptionRequest<ProjectSortFields>[];

  @ApiProperty({
    description: 'Identificador del usuario autenticado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  currentUserId: string;
}
