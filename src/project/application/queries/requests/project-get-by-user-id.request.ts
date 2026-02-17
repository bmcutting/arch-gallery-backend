import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetProjectByUserIdRequest {
  @ApiProperty({
    description:
      'Identificador único del usuario del que se desea obtener sus pryectos',
    example: '0a0647d6-1a41-4c79-a88e-23ea7c3e51c7',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
