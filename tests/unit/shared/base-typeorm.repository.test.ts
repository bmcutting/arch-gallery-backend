import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { DataSource, EntityManager } from 'typeorm';
import { BaseTypeOrmRepository } from 'src/shared/infrastructure/typeorm/repositories/base-typeorm.repository';
import type { TransactionExecutor } from 'src/shared/infrastructure/typeorm/services/typeorm-transaction.executor';

class FakeModel {
  id: string;
}

/** Expone el getter protegido para poder observarlo desde el test. */
class TestRepository extends BaseTypeOrmRepository<FakeModel> {
  constructor(dataSource: DataSource, executor: TransactionExecutor) {
    super(dataSource, executor, FakeModel);
  }

  get exposed() {
    return this.repository;
  }
}

describe('BaseTypeOrmRepository', () => {
  const fromDataSource = { origin: 'data-source' };
  const fromManager = { origin: 'manager' };

  let dataSource: DataSource;
  let executor: TransactionExecutor;
  let getManagerIfActive: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    dataSource = {
      getRepository: vi.fn(() => fromDataSource),
    } as unknown as DataSource;
    getManagerIfActive = vi.fn(() => null);
    executor = { getManagerIfActive } as unknown as TransactionExecutor;
  });

  it('usa el DataSource cuando no hay transacción activa', () => {
    const repository = new TestRepository(dataSource, executor);

    expect(repository.exposed).toBe(fromDataSource);
    expect(dataSource.getRepository).toHaveBeenCalledWith(FakeModel);
  });

  it('usa el manager de la transacción cuando la hay', () => {
    const manager = {
      getRepository: vi.fn(() => fromManager),
    } as unknown as EntityManager;
    getManagerIfActive.mockReturnValue(manager);

    const repository = new TestRepository(dataSource, executor);

    expect(repository.exposed).toBe(fromManager);
    expect(manager.getRepository).toHaveBeenCalledWith(FakeModel);
    expect(dataSource.getRepository).not.toHaveBeenCalled();
  });
});
