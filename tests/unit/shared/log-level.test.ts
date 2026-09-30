import { describe, it, expect } from 'vitest';
import { levelForStatus } from 'src/shared/infrastructure/logging/log-level';

describe('levelForStatus', () => {
  it('marca los 5xx como error', () => {
    expect(levelForStatus(500)).toBe('error');
    expect(levelForStatus(503)).toBe('error');
  });

  it('marca los 4xx como warn', () => {
    expect(levelForStatus(400)).toBe('warn');
    expect(levelForStatus(401)).toBe('warn');
    expect(levelForStatus(409)).toBe('warn');
    expect(levelForStatus(499)).toBe('warn');
  });

  it('deja el resto en info', () => {
    expect(levelForStatus(200)).toBe('info');
    expect(levelForStatus(204)).toBe('info');
    expect(levelForStatus(302)).toBe('info');
    expect(levelForStatus(399)).toBe('info');
  });
});
