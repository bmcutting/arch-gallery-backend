import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { TransformSort } from 'src/shared/application/decorators/transform-sort.decorator';
import { PaginationRequest } from 'src/shared/application/requests/pagination.request';
import { SortOptionRequest } from 'src/shared/application/requests/sort-option.request';
import { UserSortFields } from 'src/user/domain/enums/user-sort-fields';

export class UserGetAllRequest extends PaginationRequest {
  @ApiPropertyOptional({ description: 'Filtrar por nombre' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Filtrar por apellido' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ description: 'Filtrar por email' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    type: [SortOptionRequest],
    description: 'Opciones de ordenamiento para usuarios',
    example: [
      { field: 'createdAt', direction: 'DESC' },
      { field: 'lastName', direction: 'ASC' },
    ],
  })
  @TransformSort(UserSortFields)
  sort?: SortOptionRequest<UserSortFields>[];
}
