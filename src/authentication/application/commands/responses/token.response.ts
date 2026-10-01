import { ApiProperty } from '@nestjs/swagger';

export class TokenResponse {
  @ApiProperty({
    description: 'Token de acceso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Token de refresco. El anterior queda revocado.',
    example: 'kMx7K...',
  })
  refresh_token: string;

  @ApiProperty({
    description: 'Tiempo de expiración del access token, en segundos',
    example: 86400,
  })
  expires_in: number;

  @ApiProperty({ description: 'Tipo de token', example: 'Bearer' })
  token_type: string;
}
