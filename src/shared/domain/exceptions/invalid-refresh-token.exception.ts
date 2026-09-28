import { DomainExceptionProps } from './domain.exception';
import { UnauthorizedException } from './unauthorized.exception';

export class InvalidRefreshTokenException extends UnauthorizedException {
  constructor(props: Partial<DomainExceptionProps> = {}) {
    super({ message: 'Invalid or expired refresh token', ...props });
  }
}
