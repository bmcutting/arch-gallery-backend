import { UserRepository } from '../../repositories/user.repository';
import { RepeatUserException } from '../../exceptions/user';
import type { PasswordHasher } from 'src/user/domain/interfaces/password-hasher';
import type IdGenerator from 'src/shared/domain/interfaces/id.generator';
import { User } from '../../entities/user.entity';

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
    private readonly ids: IdGenerator,
  ) {}

  async execute(props: CreateUserProps): Promise<User> {
    const existingEmail = await this.repository.findByEmail(props.email);
    if (existingEmail) {
      throw new RepeatUserException();
    }
    const existingUserName = await this.repository.findByUserName(
      props.userName,
    );
    if (existingUserName) {
      throw new RepeatUserException();
    }

    const user = new User({
      id: this.ids.create(),
      email: props.email,
      password: await this.passwordHasher.hash(props.password),
      userName: props.userName,
      firstName: props.firstName,
      lastName: props.lastName,
      phoneNumber: null,
      shortBio: null,
      longBio: null,
      profileImageUrl: null,
      coverImageUrl: null,
      website: null,
      location: null,
      experienceYears: null,
      specialization: null,
      instagramUrl: null,
      twitterUrl: null,
      linkedinUrl: null,
      languages: [],
      skills: [],
      experiences: [],
      isActive: true,
      deletedAt: null,
    });

    await this.repository.save(user);
    return user;
  }
}
