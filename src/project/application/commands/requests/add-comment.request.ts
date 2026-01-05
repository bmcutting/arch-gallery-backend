import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddCommentRequest {
  @ApiProperty({ description: 'Texto del comentario' })
  @IsNotEmpty()
  @IsString()
  message: string;
}
