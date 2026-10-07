import type { PasswordHasher } from 'src/user/domain/interfaces/password-hasher';
import { User } from '../../entities/user.entity';
import { NotEqualPasswordsException } from '../../exceptions/user';
import { UserRepository } from '../../repositories/user.repository';

interface Props {
  user: User;
  oldPassword: string;
  newPassword: string;
}

export class UserChangePassword {
  constructor(
    private readonly repository: UserRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute({ user, oldPassword, newPassword }: Props): Promise<User> {
    const matches = await this.hasher.compare(oldPassword, user.password);

    if (!matches) throw new NotEqualPasswordsException();

    user.setPassword(await this.hasher.hash(newPassword));
    await this.repository.updatePassword(user);

    return user;
  }
}
