import { Command } from 'src/shared/application/interfaces/command.interface';
import { ensureResourceOwner } from 'src/authorization/domain/services/ensure-resource-owner';
import { NotFoundUserException } from 'src/user/domain/exceptions/user';
import { UserRepository } from 'src/user/domain/repositories/user.repository';
import { UpdateUser } from 'src/user/domain/services/user/user-update';
import { UserSkillSync } from 'src/user/domain/services/user-skill/user-skill-sync';
import { ExperienceSync } from 'src/user/domain/services/experience/experience-sync';
import { UserResponse } from '../../queries/user/responses/user.response';
import { UserResponseMapper } from '../../mappers/user-response-mapper';
import { UserUpdateRequest } from './requests/user-update.request';

interface Props {
  request: UserUpdateRequest;
  id: string;
  currentUserId: string;
}

export class UserUpdateCommand implements Command<Props, UserResponse> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly service: UpdateUser,
    private readonly userSkillSync: UserSkillSync,
    private readonly experienceSync: ExperienceSync,
  ) {}

  async execute({ request, id, currentUserId }: Props): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFoundUserException();

    ensureResourceOwner({ ownerId: user.getId(), userId: currentUserId });

    await this.service.execute({
      id: user.getId(),
      user,
      email: request.email,
      userName: request.userName,
      firstName: request.firstName,
      lastName: request.lastName,
      phoneNumber: request.phoneNumber,
      longBio: request.longBio,
      shortBio: request.shortBio,
      profileImageUrl: request.profileImageUrl,
      coverImageUrl: request.coverImageUrl,
      website: request.website,
      location: request.location,
      experienceYears: request.experienceYears,
      specialization: request.specialization,
      instagramUrl: request.instagramUrl,
      twitterUrl: request.twitterUrl,
      linkedinUrl: request.linkedinUrl,
      languages: request.languages,
    });

    // Cada coleccion la escribe su propio servicio, sobre su propia tabla.
    if (request.skills) {
      await this.userSkillSync.execute({
        userId: user.getId(),
        skills: request.skills,
      });
    }

    if (request.experiences) {
      await this.experienceSync.execute({
        userId: user.getId(),
        experiences: request.experiences,
      });
    }

    // Se recarga: el usuario en memoria no sabe de las dos colecciones que acaban de cambiar.
    const updated = await this.userRepository.findById(user.getId());

    if (!updated) throw new NotFoundUserException();

    return UserResponseMapper.toResponse(updated);
  }
}
