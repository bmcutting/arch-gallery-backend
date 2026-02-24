import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class GetProjectFeedRequest {
  @ApiPropertyOptional({
    description: 'Cursor para paginación (UUID del último proyecto recibido)',
  })
  @IsOptional()
  cursor?: string;

  @ApiPropertyOptional({
    description: 'Cantidad máxima de proyectos a devolver',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
