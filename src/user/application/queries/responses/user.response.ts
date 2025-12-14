import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({
    description: 'Identificador único ULID del usuario',
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
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  lastName: string;

  @ApiProperty({
    description: 'Nombre de usuario en el sistema',
    example: 'juan123',
  })
  userName: string;

  @ApiProperty({
    description: 'Biografía del perfil del usuario',
    example: 'Arquitecto de sueños',
  })
  bio: string;

  @ApiProperty({
    description: 'Sitio web del usuario',
    example: 'www.archdesign.com',
  })
  website: string;

  @ApiProperty({
    description: 'Localización del usuario',
    example: 'Madrid, España',
  })
  location: string;

  @ApiProperty({
    description: 'Indica si el usuario está activo',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de eliminación lógica del usuario',
    example: '2024-01-15T10:30:00.000Z',
    type: Date,
    nullable: true,
  })
  deletedAt: Date | null;
}
