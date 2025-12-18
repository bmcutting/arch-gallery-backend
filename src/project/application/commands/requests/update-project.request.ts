import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProjectRequest {
  projectId: string;

  @ApiPropertyOptional({ description: 'Título del proyecto' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Descripción del proyecto' })
  @IsOptional()
  @IsString()
  description?: string;
}
