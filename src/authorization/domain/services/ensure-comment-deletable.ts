import { NotResourceOwnerException } from '../exceptions/resource-access';

interface Props {
  commentOwnerId: string;
  projectOwnerId: string | null;
  userId: string;
}

/** Un comentario lo borra su autor o el dueño del proyecto comentado. */
export function ensureCommentDeletable({
  commentOwnerId,
  projectOwnerId,
  userId,
}: Props): void {
  if (commentOwnerId === userId) return;
  if (projectOwnerId === userId) return;

  throw new NotResourceOwnerException();
}
