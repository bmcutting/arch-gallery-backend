import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponse } from 'src/category/application/queries/responses/category.response';
import { CommentResponse } from 'src/comment/application/queries/responses/comment.response';
import { LikeResponse } from 'src/like/application/queries/responses/like.response';
import { UserResponse } from 'src/user/application/queries/responses/user.response';

export class ProjectResponse {
  @ApiProperty({
    description: 'Identificador único UUID del proyecto',
    example: '0a0647d6-1a41-4c79-a88e-23ea7c3e51c7',
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
    description: 'Año de creación del proyecto',
    example: 2022,
  })
  year: number;

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

  @ApiProperty({
    description: 'Likes del proyecto',
    type: [LikeResponse],
    nullable: true,
  })
  likes: LikeResponse[] | null;

  @ApiProperty({
    description: 'Comentarios del proyecto',
    example: 15,
  })
  comments: CommentResponse[] | null;
}
