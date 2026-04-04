import { UserRepository } from '../repositories/user.repository';
import { RepeatUserException } from '../exceptions/user';
import { PasswordHasher } from 'src/shared/utils/password-hasher';

export interface CreateUserProps {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userName: string;
}

export class UserCreator {
  constructor(
    private readonly passwordHasher: PasswordHasher,
    private readonly repository: UserRepository,
  ) {}

  async execute(props: CreateUserProps) {
    const existingUser = await this.repository.findByEmail(props.email);
    if (existingUser) {
      throw new RepeatUserException();
    }
    const user = await this.repository.findByUserName(props.userName);
    if (user) {
      throw new RepeatUserException();
    }

    const hashedPassword = await this.passwordHasher.hash(props.password);

    const userId = await this.repository.create({
      userName: props.userName,
      email: props.email,
      password: hashedPassword,
      firtsName: props.firstName,
      lastName: props.lastName,
    });

    return userId;
  }
}
