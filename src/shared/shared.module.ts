import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { UlidGenerator } from './infrastructure/services/ulid.generator';
import { TypeOrmUnitOfWork } from './infrastructure/typeorm/services/typeorm-unit-of-work';
import { DomainExceptionFilter } from './infrastructure/nest/filters/domain-exception.filter';
import { GlobalExceptionFilter } from './infrastructure/nest/filters/global-exception.filter';

@Global()
@Module({
  providers: [
    UlidGenerator,
    TypeOrmUnitOfWork,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
  ],
  exports: [UlidGenerator, TypeOrmUnitOfWork],
})
export class SharedModule {}
