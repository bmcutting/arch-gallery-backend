import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { EnvService } from 'src/env/services/env';
import { User } from 'src/user/domain/entities/user.entity';
import { TypeOrmUserRepository } from 'src/user/infrastructure/typeorm/repository/user';
import { TokenService } from '../../../domain/interfaces/token-service';
import { JwtTokenService } from '../services/jwt-token-service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly tokenService: TokenService = new JwtTokenService(
    this.envService,
  );

  constructor(
    private readonly envService: EnvService,
    private readonly repository: TypeOrmUserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: User }>();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('missing-token');
    }

    let user: User | null;
    try {
      const payload = this.tokenService.verify(token);
      user = await this.repository.findById(payload.sub);
    } catch {
      throw new UnauthorizedException('invalid-token');
    }

    if (!user || !user.isActive) {
      throw new UnauthorizedException('invalid-token');
    }

    request.user = user;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
