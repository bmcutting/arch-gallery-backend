import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { CatalogueRefRequest } from 'src/shared/application/requests/catalogue-ref.request';
import { Level } from 'src/user/domain/enums/level';

export class UserSkillUpdateItemRequest extends CatalogueRefRequest {
  @ApiPropertyOptional({
    description: 'Nivel declarado. Si no se manda, queda sin declarar.',
    enum: Level,
    example: Level.ADVANCED,
  })
  @IsOptional()
  @IsEnum(Level)
  level?: Level;
}

export class UserSkillUpdateRequest {
  @ApiProperty({
    description:
      'El conjunto completo de habilidades del usuario: lo que no venga se elimina.',
    type: [UserSkillUpdateItemRequest],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserSkillUpdateItemRequest)
  skills: UserSkillUpdateItemRequest[];
}
