import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/domain/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt.interface';

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export class GenerateJwtToken {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(user: User): Promise<TokenResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
    };

    const access_token = await this.jwtService.signAsync(payload);
    const expirationTime = this.configService.get<string>(
      'JWT_EXPIRATION_TIME',
    );

    const expires_in = this.parseExpirationTime(expirationTime || '7d');

    return { access_token, expires_in, token_type: 'Bearer' };
  }

  private parseExpirationTime(expirationTime: string): number {
    const timeValue = parseInt(expirationTime.slice(0, -1));
    const timeUnit = expirationTime.slice(-1);

    switch (timeUnit) {
      case 's':
        return timeValue;

      case 'm':
        return timeValue * 60;

      case 'h':
        return timeValue * 3600;

      case 'd':
        return timeValue * 86400;

      default:
        return 604800; // 7 días
    }
  }
}
