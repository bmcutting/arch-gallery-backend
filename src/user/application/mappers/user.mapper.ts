import { User } from 'src/user/domain/entities/user.entity';
import { UserResponse } from '../queries/responses/user.response';
import { SkillResponseMapper } from './skill.mapper';
import { ExperienceResponseMapper } from './experience.mapper';

export class UserResponseMapper {
  static toResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      phoneNumber: user.phoneNumber,
      longBio: user.longBio,
      shortBio: user.shortBio,
      profileImageUrl: user.profileImageUrl,
      coverImageUrl: user.coverImageUrl,
      website: user.website,
      location: user.location,
      isActive: user.isActive,
      experienceYears: user.experienceYears,
      specialization: user.specialization,
      instagramUrl: user.instagramUrl,
      twitterUrl: user.twitterUrl,
      linkedinUrl: user.linkedinUrl,
      languages: user.languages ?? [],
      createdAt: user.getCreatedAt(),
      deletedAt: user.getDeletedAt(),
      skills: user.skills
        ? SkillResponseMapper.toResponseList(user.skills)
        : [],
      experiences: user.experiences
        ? ExperienceResponseMapper.toResponseList(user.experiences)
        : [],
    };
  }

  static toResponseList(users: User[]): UserResponse[] {
    return users.map((user) => this.toResponse(user));
  }
}
