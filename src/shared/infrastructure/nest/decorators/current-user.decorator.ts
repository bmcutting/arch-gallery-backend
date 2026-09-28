import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/domain/entities/user.entity';

/**
 * Devuelve el usuario autenticado desde el request.
 * Lo rellena `JwtAuthGuard` en `request.user`.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<{ user: User }>();
    return request.user;
  },
);
