import { DomainExceptionProps } from './domain.exception';
import { UnauthorizedException } from './unauthorized.exception';

export class InvalidCredentialsException extends UnauthorizedException {
  constructor(props: Partial<DomainExceptionProps> = {}) {
    super({ message: 'Invalid email or password', ...props });
  }
}
