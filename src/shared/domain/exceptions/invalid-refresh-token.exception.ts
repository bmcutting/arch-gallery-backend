import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidRefreshTokenException extends HttpException {
  constructor(message?: string) {
    super(
      { message: message ?? 'Invalid or expired refresh token' },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
