import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponse {
  @ApiProperty({
    description: 'Identificador único UUID de la categoría',
    example: '01J9Z9A9K7ZQW1T8S9H3B5V4FY',
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
