import { describe, it, expect } from 'vitest';
import { ensureResourceOwner } from 'src/authorization/domain/services/ensure-resource-owner';
import { NotResourceOwnerException } from 'src/authorization/domain/exceptions/resource-access';
import { DomainErrorCode } from 'src/shared/domain/exceptions/domain.exception';

const USER = '01M3R49RS764YCWZ6SMQ7KNH5H';
const OTHER = '01M3SM8AFJK7EQ5WQM227YXWE8';

describe('EnsureResourceOwner', () => {
  it('deja pasar al dueño', () => {
    expect(() =>
      ensureResourceOwner({ ownerId: USER, userId: USER }),
    ).not.toThrow();
  });

  it('rechaza a quien no es el dueño', () => {
    expect(() => ensureResourceOwner({ ownerId: OTHER, userId: USER })).toThrow(
      NotResourceOwnerException,
    );
  });

  it('rechaza cuando no hay dueño', () => {
    expect(() => ensureResourceOwner({ ownerId: null, userId: USER })).toThrow(
      NotResourceOwnerException,
    );
  });

  it('lanza un 403 de dominio con su slug', () => {
    try {
      ensureResourceOwner({ ownerId: OTHER, userId: USER });
      expect.unreachable('tenía que lanzar');
    } catch (error) {
      const exception = error as NotResourceOwnerException;
      expect(exception.code).toBe(DomainErrorCode.FORBIDDEN);
      expect(exception.message).toBe('not-resource-owner');
    }
  });
});
