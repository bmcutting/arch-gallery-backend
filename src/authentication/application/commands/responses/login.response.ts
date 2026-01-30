import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserResponse } from 'src/user/application/queries/responses/user.response';

export class LoginResponse {
  @ApiProperty({
    description: 'Token de acceso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiPropertyOptional({
    description: 'Token de refresco',
    example: 'kMx7K...',
  })
  refresh_token?: string;

  @ApiProperty({
    description: 'Tiempo de expiración en segundos',
    example: 3600,
  })
  expires_in: number;

  @ApiProperty({
    description: 'Tipo de token',
    example: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    description: 'Información del usuario autenticado',
    type: UserResponse,
  })
  user: UserResponse;
}
