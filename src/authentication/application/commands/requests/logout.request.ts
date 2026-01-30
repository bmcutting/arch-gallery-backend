import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutRequest {
  @ApiProperty({
    description: 'Refresh token a revocar',
    example: 'kMx7K...',
  })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
