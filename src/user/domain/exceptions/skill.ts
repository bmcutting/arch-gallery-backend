import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundSkillException extends HttpException {
  constructor() {
    super(`skill-not-found`, HttpStatus.NOT_FOUND);
  }
}

export class InvalidSkillNameException extends HttpException {
  constructor() {
    super(`skill-name-invalid`, HttpStatus.BAD_REQUEST);
  }
}

export class DuplicateUserSkillException extends HttpException {
  constructor() {
    super(`user-skill-duplicate`, HttpStatus.BAD_REQUEST);
  }
}
