import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteLikeRequest {
  @ApiProperty({ description: 'Id del like a eliminar' })
  @IsNotEmpty()
  @IsString()
  likeId: string;
}
