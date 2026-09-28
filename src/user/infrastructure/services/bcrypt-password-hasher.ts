import * as bcrypt from 'bcryptjs';
import type { PasswordHasher } from 'src/user/domain/interfaces/password-hasher';

export class BcryptPasswordHasher implements PasswordHasher {
  private readonly saltRounds = 10;

  async hash(plainPassword: string): Promise<string> {
    return await bcrypt.hash(plainPassword, this.saltRounds);
  }

  async compare(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
