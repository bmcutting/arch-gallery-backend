import { UpdateUserRequest } from './requests/update-user.request';
import { UpdateUserResponse } from './responses/update-user.response';
import { Command } from 'src/shared/application/interfaces/command.interface';
import { UserRepository } from 'src/user/domain/repositories/user.repository';
import { NotFoundUserException } from 'src/user/domain/exceptions/user';
import { UpdateUser } from 'src/user/domain/services/user-update';
import { ensureResourceOwner } from 'src/authorization/domain/services/ensure-resource-owner';

interface UpdateUserProps {
  request: UpdateUserRequest;
  currentUserId: string;
}

export class UpdateUserCommand implements Command<
  UpdateUserProps,
  UpdateUserResponse
> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly updateUserService: UpdateUser,
  ) {}

  async execute(props: UpdateUserProps): Promise<UpdateUserResponse> {
    const user = await this.userRepository.findById(props.request.userId);
    if (!user) {
      throw new NotFoundUserException();
    }

    // El dueño de un usuario es él mismo.
    ensureResourceOwner({
      ownerId: user.getId(),
      userId: props.currentUserId,
    });

    await this.updateUserService.execute(user, {
      email: props.request.email,
      firstName: props.request.firstName,
      lastName: props.request.lastName,
      userName: props.request.userName,
      phoneNumber: props.request.phoneNumber,
      longBio: props.request.longBio,
      shortBio: props.request.shortBio,
      profileImageUrl: props.request.profileImageUrl,
      coverImageUrl: props.request.coverImageUrl,
      website: props.request.website,
      location: props.request.location,
      experienceYears: props.request.experienceYears,
      specialization: props.request.specialization,
      instagramUrl: props.request.instagramUrl,
      twitterUrl: props.request.twitterUrl,
      linkedinUrl: props.request.linkedinUrl,
      languages: props.request.languages,
      skills: props.request.skills,
      experiences: props.request.experiences,
    });

    return { success: true };
  }
}
