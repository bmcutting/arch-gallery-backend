import { ApiProperty } from '@nestjs/swagger';
import { UserSummaryResponse } from 'src/user/application/queries/responses/user-summary.response';

export class CommentResponse {
  @ApiProperty({
    description: 'Identificador único UUID del like',
    example: '0a0647d6-1a41-4c79-a88e-23ea7c3e51c7',
  })
  id: string;

  @ApiProperty({
    description: 'Identificador único UUID del proyecto',
    example: '0a0647d6-1a41-4c79-a88e-23ea7c3e51c7',
  })
  projectId: string;

  @ApiProperty({
    description: 'Identificador único UUID del usuario',
    example: '0a0647d6-1a41-4c79-a88e-23ea7c3e51c7',
  })
  userId: string;

  @ApiProperty({
    description: 'Texto del comentario del proyecto',
    example: 'Excelente proyecto',
  })
  message: string;

  @ApiProperty({ type: UserSummaryResponse })
  user: UserSummaryResponse;
}
