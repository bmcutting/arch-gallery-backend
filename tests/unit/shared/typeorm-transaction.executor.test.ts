import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { DataSource, EntityManager } from 'typeorm';
import { TransactionExecutor } from 'src/shared/infrastructure/typeorm/services/typeorm-transaction.executor';

function createQueryRunnerDouble() {
  const manager = { marker: 'tx-manager' } as unknown as EntityManager;
  return {
    manager,
    connect: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
    startTransaction: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
    commitTransaction: vi
      .fn<() => Promise<void>>()
      .mockResolvedValue(undefined),
    rollbackTransaction: vi
      .fn<() => Promise<void>>()
      .mockResolvedValue(undefined),
    release: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
  };
}

describe('TransactionExecutor', () => {
  let queryRunner: ReturnType<typeof createQueryRunnerDouble>;
  let dataSource: DataSource;
  let executor: TransactionExecutor;

  beforeEach(() => {
    queryRunner = createQueryRunnerDouble();
    dataSource = {
      createQueryRunner: vi.fn(() => queryRunner),
    } as unknown as DataSource;
    executor = new TransactionExecutor(dataSource);
  });

  it('abre la transacción, hace commit y libera el query runner', async () => {
    const result = await executor.execute(async () => 'hecho');

    expect(result).toBe('hecho');
    expect(queryRunner.connect).toHaveBeenCalledOnce();
    expect(queryRunner.startTransaction).toHaveBeenCalledOnce();
    expect(queryRunner.commitTransaction).toHaveBeenCalledOnce();
    expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalledOnce();
  });

  it('hace rollback, relanza el error y libera igualmente', async () => {
    const boom = new Error('boom');

    await expect(
      executor.execute(async () => {
        throw boom;
      }),
    ).rejects.toBe(boom);

    expect(queryRunner.rollbackTransaction).toHaveBeenCalledOnce();
    expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalledOnce();
  });

  it('pasa el manager de la transacción al trabajo', async () => {
    const work = vi.fn(async (manager: EntityManager) => manager);

    await expect(executor.execute(work)).resolves.toBe(queryRunner.manager);
  });

  it('expone el manager activo solo dentro de execute', async () => {
    expect(executor.getManagerIfActive()).toBeNull();

    await executor.execute(async () => {
      expect(executor.getManagerIfActive()).toBe(queryRunner.manager);
    });

    expect(executor.getManagerIfActive()).toBeNull();
  });

  it('no deja manager activo si el trabajo falla', async () => {
    await expect(
      executor.execute(async () => {
        throw new Error('boom');
      }),
    ).rejects.toThrow();

    expect(executor.getManagerIfActive()).toBeNull();
  });
});
