import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundProjectException extends HttpException {
  constructor() {
    super(``, HttpStatus.NOT_FOUND);
  }
}
