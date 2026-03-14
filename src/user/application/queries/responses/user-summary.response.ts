import { ApiProperty } from '@nestjs/swagger';

export class UserSummaryResponse {
  @ApiProperty({
    description: 'Identificador único UUID del usuario',
    example: '0a0647d6-1a41-4c79-a88e-23ea7c3e51c7',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de usuario único dentro de la plataforma',
    example: 'arquitecto123',
  })
  userName: string;

  @ApiProperty({
    description: 'URL de la imagen de perfil del usuario',
    example: 'https://cdn.arch-gallery.com/profiles/arquitecto123.png',
  })
  profileImageUrl: string;
}
