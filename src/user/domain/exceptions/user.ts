import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundUserException extends HttpException {
  constructor() {
    super(`user-not-found`, HttpStatus.NOT_FOUND);
  }
}

export class RepeatUserException extends HttpException {
  constructor() {
    super(`user-already-exists`, HttpStatus.CONFLICT);
  }
}

export class NotEqualPasswordsException extends HttpException {
  constructor() {
    super(`not-equal-passwords`, HttpStatus.CONFLICT);
  }
}
