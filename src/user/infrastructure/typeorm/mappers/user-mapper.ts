import { User } from 'src/user/domain/entities/user.entity';
import { UserModel } from '../models/user';

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
      //project: u.project ? UserProjectTypeOrmMapper.execute(u.project) : null
    });
  }
}
