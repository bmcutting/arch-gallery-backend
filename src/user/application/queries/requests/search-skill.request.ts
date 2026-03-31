import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchSkillsRequest {
  @ApiProperty({ description: 'Buscar por nombre' })
  @IsString()
  name: string;
}
