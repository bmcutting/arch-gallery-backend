import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DeleteCommentRequest {
  @ApiProperty({ description: 'Id del comentario a eliminar' })
  @IsNotEmpty()
  @IsString()
  commentId: string;

  @ApiHideProperty()
  @IsOptional()
  @IsString()
  currentUserId: string;
}
