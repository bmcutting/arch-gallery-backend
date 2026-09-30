import { UnauthorizedException } from './unauthorized.exception';

export class InvalidRefreshTokenException extends UnauthorizedException {
  constructor(message = 'Invalid or expired refresh token') {
    super({ message });
  }
}
