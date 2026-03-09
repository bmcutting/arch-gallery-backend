import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

  @ApiProperty({
    description: 'Identificador del usuario autenticado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  currentUserId: string;
}
