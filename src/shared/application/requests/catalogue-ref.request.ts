import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

/**
 * Referencia a una fila de catálogo: una existente por `id`, o una nueva por `name`.
 * Si llegan los dos gana el `id` y el `name` se ignora.
 */
export class CatalogueRefRequest {
  @ApiPropertyOptional({
    description: 'Id de una fila del catálogo ya existente',
    example: '01JA7Z8QK3M4N5P6R7S8T9V0W1',
  })
  @ValidateIf((ref: CatalogueRefRequest) => !ref.name)
  @IsString()
  @IsNotEmpty()
  id?: string;

  @ApiPropertyOptional({
    description: 'Nombre, para crearla o reutilizar una que ya exista',
    example: 'Diseño arquitectónico',
  })
  @ValidateIf((ref: CatalogueRefRequest) => !ref.id)
  @IsString()
  @IsNotEmpty()
  name?: string;
}
