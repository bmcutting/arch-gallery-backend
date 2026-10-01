import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { DataSource, EntityManager } from 'typeorm';
import {
  UnitOfWork,
  UnitOfWorkProps,
} from 'src/shared/domain/interfaces/unit-of-work';

@Injectable()
export class TypeOrmUnitOfWork implements UnitOfWork {
  private static readonly storage = new AsyncLocalStorage<EntityManager>();

  constructor(private readonly dataSource: DataSource) {}

  getManagerIfActive(): EntityManager | null {
    return TypeOrmUnitOfWork.storage.getStore() ?? null;
  }

  async run<T>({ work, onError }: UnitOfWorkProps<T>): Promise<T> {
    // Reentrada: anidar no abre una segunda transacción.
    if (TypeOrmUnitOfWork.storage.getStore()) return work();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      return await TypeOrmUnitOfWork.storage.run(
        queryRunner.manager,
        async () => {
          const result = await work();
          await queryRunner.commitTransaction();
          return result;
        },
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (onError) {
        try {
          await onError(error);
        } catch {
          // Intencionadamente vacío.
        }
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
