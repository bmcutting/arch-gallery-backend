import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponse {
  @ApiProperty({ example: 'Logged out successfully' })
  message: string;
}
