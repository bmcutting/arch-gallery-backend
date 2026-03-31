import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundSkillException extends HttpException {
  constructor() {
    super(`Skill not found`, HttpStatus.NOT_FOUND);
  }
}

export class RepeatSkillException extends HttpException {
  constructor() {
    super(`Skill already exists`, HttpStatus.CONFLICT);
  }
}

export class InvalidSkillLevelException extends HttpException {
  constructor() {
    super(`Invalid skill level`, HttpStatus.BAD_REQUEST);
  }
}
