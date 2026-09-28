import { User } from 'src/user/domain/entities/user.entity';
import { UserModel } from '../models/user';
import { SkillTypeOrmMapper } from './skill-mapper';
import { ExperienceTypeOrmMapper } from './experience-mapper';

export class UserTypeOrmMapper {
  constructor() {}

  static execute(u: UserModel): User {
    return new User({
      id: u.id,
      email: u.email,
      password: u.password,
      isActive: u.isActive,
      deletedAt: u.deletedAt,
      userName: u.userName,
      firstName: u.firstName,
      lastName: u.lastName,
      phoneNumber: u.phoneNumber,
      longBio: u.longBio,
      shortBio: u.shortBio,
      profileImageUrl: u.profileImageUrl,
      coverImageUrl: u.coverImageUrl,
      website: u.website,
      location: u.location,
      experienceYears: u.experienceYears,
      specialization: u.specialization,
      instagramUrl: u.instagramUrl,
      twitterUrl: u.twitterUrl,
      linkedinUrl: u.linkedinUrl,
      languages: u.languages ?? [],
      // Las relaciones se filtran aqui: un `where` sobre la relacion iria al
      // WHERE raiz y haria desaparecer al usuario entero si no tuviera ninguna activa.
      skills: u.skills
        ? SkillTypeOrmMapper.toDomainList(u.skills.filter((s) => s.isActive))
        : [],
      experiences: u.experiences
        ? ExperienceTypeOrmMapper.toDomainList(
            u.experiences.filter((e) => e.isActive),
          )
        : [],
      //project: u.project ? UserProjectTypeOrmMapper.execute(u.project) : null
    });
  }
}
