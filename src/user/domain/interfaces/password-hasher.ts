/**
 * Puerto de hashing de contraseñas. Vive en dominio porque lo consumen servicios
 * de dominio (`UserCreator`, `AuthenticateUserWithTokens`); la implementación
 * concreta está en `infrastructure/services/`.
 */
export interface PasswordHasher {
  hash(plainPassword: string): Promise<string>;
  compare(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
