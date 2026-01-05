import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponse } from 'src/category/application/queries/responses/category.response';
import { UserResponse } from 'src/user/application/queries/responses/user.response';

export class ProjectResponse {
  @ApiProperty({
    description: 'Identificador único UUID del proyecto',
    example: '01J9Z9A9K7ZQW1T8S9H3B5V4FY',
  })
  id: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Título del proyecto',
    example: 'Diseño Torre K',
  })
  title: string;

  @ApiProperty({
    description: 'Descripción del proyecto',
    example: 'Diseó minimalista con planos de la Torre K',
  })
  description: string;

  @ApiProperty({
    description: 'Urls de las imágenes del proyecto',
    example: 'http://tuimagen.com',
  })
  imagesUrl: string[];

  @ApiProperty({
    description: 'Indica si el proyecto está activo',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de eliminación lógica del proyecto',
    example: '2024-01-15T10:30:00.000Z',
    type: Date,
    nullable: true,
  })
  deletedAt: Date | null;

  @ApiProperty({
    description: 'Usuario asociado al proyecto',
    type: UserResponse,
    nullable: true,
  })
  user: UserResponse | null;

  @ApiProperty({
    description: 'Categorías asociadas al proyecto',
    type: [CategoryResponse],
    nullable: true,
  })
  categories: CategoryResponse[] | null;

  @ApiProperty({ description: 'Cantidad de likes del proyecto', example: 42 })
  likesCount: number;

  @ApiProperty({
    description: 'Cantidad de comentarios del proyecto',
    example: 15,
  })
  commentsCount: number;
}
