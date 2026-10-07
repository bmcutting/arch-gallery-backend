import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ExperienceCreateRequest } from './experience-create.request';

/** Igual que crear, mas una `id` opcional para actualizar una que ya es tuya. */
export class ExperienceSyncItemRequest extends ExperienceCreateRequest {
  @ApiPropertyOptional({
    description:
      'Id de una experiencia tuya, para actualizarla en vez de crearla',
  })
  @IsOptional()
  @IsString()
  id?: string;
}
