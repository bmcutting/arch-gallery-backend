import { UnauthorizedException } from './unauthorized.exception';

export class InvalidCredentialsException extends UnauthorizedException {
  constructor(message = 'Invalid email or password') {
    super({ message });
  }
}
