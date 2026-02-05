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
      bio: u.bio,
      profileImageUrl: u.profileImageUrl,
      website: u.website,
      location: u.location,
      experienceYears: u.experienceYears,
      specialization: u.specialization,
      //project: u.project ? UserProjectTypeOrmMapper.execute(u.project) : null
    });
  }
}
