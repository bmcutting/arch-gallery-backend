import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteLikeRequest {
  @ApiProperty({ description: 'Id del proyecto asociado al like a eliminar' })
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @ApiProperty({ description: 'Id del usuario loggeado' })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
