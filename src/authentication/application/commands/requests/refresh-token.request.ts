import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenRequest {
  @ApiProperty({
    description: 'Refresh token',
    example: 'kMx7K...',
  })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
