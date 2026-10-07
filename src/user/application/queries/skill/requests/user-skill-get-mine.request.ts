import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TransformSort } from 'src/shared/application/decorators/transform-sort.decorator';
import { PaginationRequest } from 'src/shared/application/requests/pagination.request';
import { SortOptionRequest } from 'src/shared/application/requests/sort-option.request';
import { Level } from 'src/user/domain/enums/level';
import { SkillScope } from 'src/user/domain/enums/skill-scope';
import { UserSkillSortFields } from 'src/user/domain/enums/user-skill-sort-fields';

export class UserSkillGetMineRequest extends PaginationRequest {
  @ApiPropertyOptional({ description: 'Filtrar por nombre de la habilidad' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filtrar por nivel', enum: Level })
  @IsOptional()
  @IsEnum(Level)
  level?: Level;

  @ApiPropertyOptional({
    description: 'Filtrar por procedencia de la habilidad',
    enum: SkillScope,
  })
  @IsOptional()
  @IsEnum(SkillScope)
  scope?: SkillScope;

  @ApiPropertyOptional({
    type: [SortOptionRequest],
    example: [{ field: 'skillName', direction: 'ASC' }],
  })
  @TransformSort(UserSkillSortFields)
  sort?: SortOptionRequest<UserSkillSortFields>[];
}
