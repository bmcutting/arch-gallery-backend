import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/domain/entities/user.entity';
import { JwtPayload } from '../interfaces/jwt.interface';

export class ValidateJwtToken {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(token: string): Promise<User> {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.configService.get<string>('JWT_SECRET') || '',
    });

    const user = new User({
      id: payload.sub,
      email: payload.email,
      password: '',
      firstName: payload.firstName || '',
      lastName: payload.lastName || '',
      userName: payload.userName || '',
      isActive: true,
    });

    return user;
  }
}
