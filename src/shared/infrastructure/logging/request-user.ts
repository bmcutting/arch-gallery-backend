export function userIdFrom(request: unknown): string | null {
  const { user } = (request ?? {}) as { user?: { id?: string } };
  return user?.id ?? null;
}
