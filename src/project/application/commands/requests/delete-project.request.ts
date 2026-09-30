import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DeleteProjectRequest {
  @ApiProperty({ description: 'Id del proyecto a eliminar' })
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @ApiHideProperty()
  @IsOptional()
  @IsString()
  currentUserId: string;
}
