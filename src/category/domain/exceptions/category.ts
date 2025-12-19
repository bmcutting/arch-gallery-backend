import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundCategoryException extends HttpException {
  constructor() {
    super(``, HttpStatus.NOT_FOUND);
  }
}

export class RepeatCategoryException extends HttpException {
  constructor() {
    super(``, HttpStatus.CONFLICT);
  }
}
