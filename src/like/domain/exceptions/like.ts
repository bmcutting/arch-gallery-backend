import { HttpException, HttpStatus } from '@nestjs/common';
export class NotFoundLikeException extends HttpException {
  constructor() {
    super('Like not found', HttpStatus.NOT_FOUND);
  }
}
export class RepeatLikeException extends HttpException {
  constructor() {
    super('User already liked this project', HttpStatus.CONFLICT);
  }
}
