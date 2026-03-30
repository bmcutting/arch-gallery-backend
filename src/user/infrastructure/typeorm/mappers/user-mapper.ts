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
      isActive: true,
      userName: u.userName,
      firstName: u.firstName,
      lastName: u.lastName,
      phoneNumber: u.phoneNumber,
      longBio: u.longBio,
      shortBio: u.shortBio,
      profileImageUrl: u.profileImageUrl,
      website: u.website,
      location: u.location,
      experienceYears: u.experienceYears,
      specialization: u.specialization,
      instagramUrl: u.instagramUrl,
      twitterUrl: u.twitterUrl,
      linkedinUrl: u.linkedinUrl,
      languages: u.languages ?? [],
      skills: u.skills ? SkillTypeOrmMapper.toDomainList(u.skills) : [],
      experiences: u.experiences
        ? ExperienceTypeOrmMapper.toDomainList(u.experiences)
        : [],
      //project: u.project ? UserProjectTypeOrmMapper.execute(u.project) : null
    });
  }
}
