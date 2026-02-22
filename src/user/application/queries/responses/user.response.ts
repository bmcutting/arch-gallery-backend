import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({
    description: 'Identificador único UUID del usuario',
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
    description: 'Número de teléfono del usuario',
    example: '+34 600 123 456',
    nullable: true,
  })
  phoneNumber: string | null;

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
    description: 'Años de experiencia',
    example: '3',
  })
  experienceYears: number;

  @ApiProperty({
    description: 'Especialización',
    example: 'Urbanismo',
  })
  specialization: string;

  @ApiProperty({
    description: 'Enlace al perfil de Instagram',
    example: 'https://instagram.com/juan.arquitecto',
    nullable: true,
  })
  instagramUrl: string | null;

  @ApiProperty({
    description: 'Enlace al perfil de Twitter/X',
    example: 'https://twitter.com/juan_arq',
    nullable: true,
  })
  twitterUrl: string | null;

  @ApiProperty({
    description: 'Enlace al perfil de LinkedIn',
    example: 'https://linkedin.com/in/juan-arquitecto',
    nullable: true,
  })
  linkedinUrl: string | null;

  @ApiProperty({
    description: 'Enlace de la imagen de perfil',
    example: 'https://avatars.githubusercontent.com/u/50972694',
    nullable: true,
  })
  profileImageUrl: string | null;

  @ApiProperty({
    description: 'Idiomas que domina el usuario',
    example: ['Español', 'Inglés', 'Francés'],
    type: [String],
    nullable: true,
  })
  languages: string[];

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
