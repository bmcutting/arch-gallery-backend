import { NotResourceOwnerException } from '../exceptions/resource-access';

interface Props {
  ownerId: string | null;
  userId: string;
}

export function ensureResourceOwner({ ownerId, userId }: Props): void {
  if (ownerId !== userId) throw new NotResourceOwnerException();
}
