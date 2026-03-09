import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponse } from 'src/category/application/queries/responses/category.response';
import { CommentResponse } from 'src/comment/application/queries/responses/comment.response';
import { LikeResponse } from 'src/like/application/queries/responses/like.response';

export class ProjectFeedResponse {
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
    description: 'Año de realización del proyecto',
    example: 2026,
  })
  year: number;

  @ApiProperty({
    description: 'Primera imagen del proyecto',
    example: 'http://tuimagen.com',
  })
  previewImage: string;

  @ApiProperty({
    description: 'Likes del proyecto',
    type: [LikeResponse],
    nullable: true,
  })
  likes: LikeResponse[] | null;

  @ApiProperty({
    description: 'Comentarios del proyecto',
    type: [CommentResponse],
    nullable: true,
  })
  comments: CommentResponse[] | null;

  @ApiProperty({
    description: 'Indica si el usuario autenticado ya dio like',
    example: true,
  })
  likedByUser: boolean;

  @ApiProperty({
    description: 'Categorías asociadas al proyecto',
    type: [CategoryResponse],
    nullable: true,
  })
  categories: CategoryResponse[] | null;

  @ApiProperty({
    description: 'Autor del proyecto',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Juan Pérez',
      profileImage: 'http://tuimagen.com/perfil.jpg',
    },
  })
  author: {
    id: string;
    name: string;
    profileImage: string | null;
  };
}
