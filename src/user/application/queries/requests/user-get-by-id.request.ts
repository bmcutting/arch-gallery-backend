import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserByIdRequest {
  @ApiProperty({
    description: 'Identificador único del usuario que se desea obtener',
    example: '01J9Z9A9K7ZQW1T8S9H3B5V4FY',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
