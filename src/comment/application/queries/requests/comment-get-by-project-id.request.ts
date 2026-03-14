import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetCommentsByProjectIdRequest {
  @ApiProperty({
    description:
      'Identificador único del proyecto del cual se desean obtener los comentarios',
    example: '0a0647d6-1a41-4c79-a88e-23ea7c3e51c7',
  })
  @IsString()
  @IsNotEmpty()
  projectId: string;
}
