import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteCommentRequest {
  @ApiProperty({ description: 'Id del comentario a eliminar' })
  @IsNotEmpty()
  @IsString()
  commentId: string;
}
