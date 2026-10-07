import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundExperienceException extends HttpException {
  constructor() {
    super(`experience-not-found`, HttpStatus.NOT_FOUND);
  }
}
