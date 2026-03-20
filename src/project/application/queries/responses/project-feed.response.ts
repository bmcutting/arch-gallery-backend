import { ApiProperty } from '@nestjs/swagger';
import { ProjectResponse } from './project.response';

export class ProjectFeedResponse {
  @ApiProperty({
    description: 'Datos completos del proyecto',
    type: ProjectResponse,
  })
  project: ProjectResponse;

  @ApiProperty({
    description: 'Indica si el usuario autenticado ya dio like',
    example: true,
  })
  likedByUser: boolean;
}
