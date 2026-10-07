import { Command } from 'src/shared/application/interfaces/command.interface';
import { NotFoundUserException } from 'src/user/domain/exceptions/user';
import { UserRepository } from 'src/user/domain/repositories/user.repository';
import { UserChangePassword } from 'src/user/domain/services/user/user-change-password';
import { UserChangePasswordRequest } from './requests/user-change-password.request';

interface Props {
  request: UserChangePasswordRequest;
  currentUserId: string;
}

export class UserChangePasswordCommand implements Command<Props, void> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly service: UserChangePassword,
  ) {}

  async execute({ request, currentUserId }: Props): Promise<void> {
    // No sirve el usuario del guard: lo carga con findById y ahi la contrasena no viene.
    const user = await this.userRepository.findByIdWithPassword(currentUserId);

    if (!user) throw new NotFoundUserException();

    await this.service.execute({
      user,
      oldPassword: request.oldPassword,
      newPassword: request.password,
    });
  }
}
