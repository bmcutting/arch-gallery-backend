import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundExperienceException extends HttpException {
  constructor() {
    super(`Experience not found`, HttpStatus.NOT_FOUND);
  }
}

export class RepeatExperienceException extends HttpException {
  constructor() {
    super(`Experience already exists`, HttpStatus.CONFLICT);
  }
}

export class InvalidExperienceLevelException extends HttpException {
  constructor() {
    super(`Invalid experience level`, HttpStatus.BAD_REQUEST);
  }
}
