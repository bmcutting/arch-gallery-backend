import { ApiProperty } from '@nestjs/swagger';

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
    description: 'Primera imagen del proyecto',
    example: 'http://tuimagen.com',
  })
  previewImage: string;

  @ApiProperty({
    description: 'Cantidad de likes del proyecto',
    example: 42,
  })
  likesCount: number;

  @ApiProperty({
    description: 'Cantidad de comentarios del proyecto',
    example: 10,
  })
  commentsCount: number;

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
