import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteProjectRequest {
  @ApiProperty({ description: 'Id del proyecto a eliminar' })
  @IsNotEmpty()
  @IsString()
  projectId: string;
}
