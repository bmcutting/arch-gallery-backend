import { UnauthorizedException } from 'src/shared/domain/exceptions/unauthorized.exception';

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super({ message: 'invalid-credentials' });
  }
}

export class InvalidRefreshTokenException extends UnauthorizedException {
  constructor() {
    super({ message: 'invalid-refresh-token' });
  }
}
