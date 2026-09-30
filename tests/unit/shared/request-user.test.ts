import { describe, it, expect } from 'vitest';
import { userIdFrom } from 'src/shared/infrastructure/logging/request-user';

describe('userIdFrom', () => {
  it('saca el id del string plano que deja JwtAuthGuard', () => {
    const id = '01M3R49RS764YCWZ6SMQ7KNH5H';

    expect(userIdFrom({ user: { id } })).toBe(id);
  });

  it('devuelve null en una peticion sin autenticar', () => {
    expect(userIdFrom({})).toBeNull();
    expect(userIdFrom({ user: undefined })).toBeNull();
    expect(userIdFrom({ user: {} })).toBeNull();
  });

  it('no revienta con una peticion nula', () => {
    expect(userIdFrom(null)).toBeNull();
    expect(userIdFrom(undefined)).toBeNull();
  });
});
