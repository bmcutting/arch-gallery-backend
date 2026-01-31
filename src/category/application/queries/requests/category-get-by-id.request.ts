import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetCategoryByIdRequest {
  @ApiProperty({
    description: 'Identificador único de la categoría que se desea obtener',
    example: '0a0647d6-1a41-4c79-a88e-23ea7c3e51c7',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
