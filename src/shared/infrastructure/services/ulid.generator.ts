import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
import type IdGenerator from 'src/shared/domain/interfaces/id.generator';

@Injectable()
export class UlidGenerator implements IdGenerator {
  create(): string {
    return ulid();
  }
}
