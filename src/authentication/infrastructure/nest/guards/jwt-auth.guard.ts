import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/domain/entities/user.entity';
import { ValidateJwtToken } from '../../../domain/services/jwt-token-validate';
import { ValidateJwtTokenCommand } from '../../../application/commands/validate-jwt-token.command';

interface RequestWithUser {
  user?: User;
  headers: Record<string, string | undefined>;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication token required');
    }

    const token = authHeader.substring(7); // Quitar el 'Bearer '

    try {
      const jwtTokenValidateService = new ValidateJwtToken(
        this.jwtService,
        this.configService,
      );
      const command = new ValidateJwtTokenCommand(jwtTokenValidateService);

      const user = await command.execute({ token });
      request.user = user;

      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      throw new UnauthorizedException(
        'Invalid or expired authentication token',
      );
    }
  }
}
