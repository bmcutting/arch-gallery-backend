import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponse {
  @ApiProperty({
    description: 'Identificador único UUID de la categoría',
    example: '0a0647d6-1a41-4c79-a88e-23ea7c3e51c7',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Urbanismo',
  })
  name: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Indica si la categoría está activo',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de eliminación lógica de la categoría',
    example: '2024-01-15T10:30:00.000Z',
    type: Date,
    nullable: true,
  })
  deletedAt: Date | null;
}
