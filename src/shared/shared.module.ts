import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { UlidGenerator } from './infrastructure/services/ulid.generator';
import { TransactionExecutor } from './infrastructure/typeorm/services/typeorm-transaction.executor';
import { DomainExceptionFilter } from './infrastructure/nest/filters/domain-exception.filter';

@Global()
@Module({
  providers: [
    UlidGenerator,
    TransactionExecutor,
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
  ],
  exports: [UlidGenerator, TransactionExecutor],
})
export class SharedModule {}
