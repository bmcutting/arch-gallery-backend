import { describe, it, expect } from 'vitest';
import { ensureCommentDeletable } from 'src/authorization/domain/services/ensure-comment-deletable';
import { NotResourceOwnerException } from 'src/authorization/domain/exceptions/resource-access';

const AUTHOR = '01M3R49RS764YCWZ6SMQ7KNH5H';
const PROJECT_OWNER = '01M3SM8AFJK7EQ5WQM227YXWE8';
const STRANGER = '01M3SM7V18CKKQ3G6YAWP0HAFE';

describe('EnsureCommentDeletable', () => {
  it('deja pasar al autor del comentario', () => {
    expect(() =>
      ensureCommentDeletable({
        commentOwnerId: AUTHOR,
        projectOwnerId: PROJECT_OWNER,
        userId: AUTHOR,
      }),
    ).not.toThrow();
  });

  it('deja pasar al dueño del proyecto, que modera el suyo', () => {
    expect(() =>
      ensureCommentDeletable({
        commentOwnerId: AUTHOR,
        projectOwnerId: PROJECT_OWNER,
        userId: PROJECT_OWNER,
      }),
    ).not.toThrow();
  });

  it('rechaza a un tercero', () => {
    expect(() =>
      ensureCommentDeletable({
        commentOwnerId: AUTHOR,
        projectOwnerId: PROJECT_OWNER,
        userId: STRANGER,
      }),
    ).toThrow(NotResourceOwnerException);
  });

  it('rechaza al tercero aunque el proyecto no se haya podido resolver', () => {
    expect(() =>
      ensureCommentDeletable({
        commentOwnerId: AUTHOR,
        projectOwnerId: null,
        userId: STRANGER,
      }),
    ).toThrow(NotResourceOwnerException);
  });

  it('deja pasar al autor aunque el proyecto no se haya podido resolver', () => {
    expect(() =>
      ensureCommentDeletable({
        commentOwnerId: AUTHOR,
        projectOwnerId: null,
        userId: AUTHOR,
      }),
    ).not.toThrow();
  });
});
