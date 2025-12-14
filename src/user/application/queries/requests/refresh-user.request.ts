import { IsJWT } from 'class-validator';

export class GetUserByTokenRequest {
  @IsJWT()
  token: string;
}
