import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundCommentException extends HttpException {
  constructor() {
    super(``, HttpStatus.NOT_FOUND);
  }
}
