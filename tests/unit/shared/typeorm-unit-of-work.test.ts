import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { DataSource, EntityManager } from 'typeorm';
import { TypeOrmUnitOfWork } from 'src/shared/infrastructure/typeorm/services/typeorm-unit-of-work';

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

describe('TypeOrmUnitOfWork', () => {
  let queryRunner: ReturnType<typeof createQueryRunnerDouble>;
  let createQueryRunner: ReturnType<typeof vi.fn>;
  let dataSource: DataSource;
  let unitOfWork: TypeOrmUnitOfWork;

  beforeEach(() => {
    queryRunner = createQueryRunnerDouble();
    createQueryRunner = vi.fn(() => queryRunner);
    dataSource = { createQueryRunner } as unknown as DataSource;
    unitOfWork = new TypeOrmUnitOfWork(dataSource);
  });

  it('abre la unidad, hace commit y libera el query runner', async () => {
    const result = await unitOfWork.run({ work: async () => 'hecho' });

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
      unitOfWork.run({
        work: async () => {
          throw boom;
        },
      }),
    ).rejects.toBe(boom);

    expect(queryRunner.rollbackTransaction).toHaveBeenCalledOnce();
    expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalledOnce();
  });

  it('expone el manager activo solo dentro de la unidad', async () => {
    expect(unitOfWork.getManagerIfActive()).toBeNull();

    await unitOfWork.run({
      work: async () => {
        expect(unitOfWork.getManagerIfActive()).toBe(queryRunner.manager);
      },
    });

    expect(unitOfWork.getManagerIfActive()).toBeNull();
  });

  it('no deja manager activo si el trabajo falla', async () => {
    await expect(
      unitOfWork.run({
        work: async () => {
          throw new Error('boom');
        },
      }),
    ).rejects.toThrow();

    expect(unitOfWork.getManagerIfActive()).toBeNull();
  });

  describe('reentrada', () => {
    it('se une a la unidad activa en vez de abrir otra', async () => {
      await unitOfWork.run({
        work: async () => {
          await unitOfWork.run({ work: async () => undefined });
        },
      });

      expect(createQueryRunner).toHaveBeenCalledOnce();
      expect(queryRunner.startTransaction).toHaveBeenCalledOnce();
      expect(queryRunner.commitTransaction).toHaveBeenCalledOnce();
    });

    it('un fallo dentro de la unidad anidada revierte la de fuera', async () => {
      const boom = new Error('boom');

      await expect(
        unitOfWork.run({
          work: async () => {
            await unitOfWork.run({
              work: async () => {
                throw boom;
              },
            });
          },
        }),
      ).rejects.toBe(boom);

      expect(queryRunner.rollbackTransaction).toHaveBeenCalledOnce();
      expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
    });
  });

  describe('onError', () => {
    it('corre tras el rollback y fuera del contexto de la unidad', async () => {
      // Es su razón de ser: escribir dentro de la unidad fallida revertiría el
      // registro junto con el fallo que documenta.
      let managerDuranteOnError: EntityManager | null = queryRunner.manager;

      await expect(
        unitOfWork.run({
          work: async () => {
            throw new Error('boom');
          },
          onError: () => {
            managerDuranteOnError = unitOfWork.getManagerIfActive();
          },
        }),
      ).rejects.toThrow();

      expect(queryRunner.rollbackTransaction).toHaveBeenCalledOnce();
      expect(managerDuranteOnError).toBeNull();
    });

    it('recibe el error original', async () => {
      const boom = new Error('boom');
      const onError = vi.fn();

      await expect(
        unitOfWork.run({
          work: async () => {
            throw boom;
          },
          onError,
        }),
      ).rejects.toBe(boom);

      expect(onError).toHaveBeenCalledWith(boom);
    });

    it('no corre cuando la unidad va bien', async () => {
      const onError = vi.fn();

      await unitOfWork.run({ work: async () => 'ok', onError });

      expect(onError).not.toHaveBeenCalled();
    });

    it('si onError falla, sigue mandando el error original', async () => {
      const boom = new Error('boom');

      await expect(
        unitOfWork.run({
          work: async () => {
            throw boom;
          },
          onError: () => {
            throw new Error('fallo al registrar el fallo');
          },
        }),
      ).rejects.toBe(boom);

      expect(queryRunner.release).toHaveBeenCalledOnce();
    });
  });
});
