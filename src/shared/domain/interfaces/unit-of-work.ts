export interface UnitOfWorkProps<T> {
  work: () => Promise<T>;
  onError?: (error: unknown) => Promise<void> | void;
}

/**
 * Puerto para ejecutar un bloque como unidad de trabajo.
 */
export interface UnitOfWork {
  run<T>(props: UnitOfWorkProps<T>): Promise<T>;
}
