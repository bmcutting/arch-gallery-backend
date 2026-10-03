import { ForbiddenException } from 'src/shared/domain/exceptions/forbidden.exception';

export class NotResourceOwnerException extends ForbiddenException {
  constructor() {
    super({ message: 'not-resource-owner' });
  }
}
