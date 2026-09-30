export enum DomainErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  FORBIDDEN = 'FORBIDDEN',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

export interface DomainExceptionProps {
  /**
   * Clave corta y estable en kebab-case (`'not-project-owner'`), pensada para que
   * el cliente la use como identificador, no para enseñarla al usuario.
   */
  message: string;

  /**
   * Metadato opcional: qué campo provocó el error (p. ej. `'email'` en un
   * duplicado), para que el frontend lo marque en el formulario.
   */
  field?: string;
}

export abstract class DomainException extends Error {
  abstract readonly code: DomainErrorCode;
  readonly field?: string;

  constructor(props: DomainExceptionProps) {
    super(props.message);
    this.name = new.target.name;
    this.field = props.field;
  }
}
