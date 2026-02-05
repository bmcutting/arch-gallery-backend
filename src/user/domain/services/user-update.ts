import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { RepeatUserException } from '../exceptions/user';

export interface UpdateUserProps {
  email?: string;
  password?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  bio?: string;
  profileImageUrl?: string;
  website?: string;
  location?: string;
  experienceYears?: number;
  specialization?: string;
}

export class UpdateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(user: User, props: UpdateUserProps): Promise<User> {
    let hasChanges = false;

    if (props.email !== undefined && props.email !== user.getEmail()) {
      const existingUser = await this.userRepository.findByEmail(props.email);
      if (existingUser) {
        throw new RepeatUserException();
      }
      user.setEmail(props.email);
      hasChanges = true;
    }

    if (
      props.firstName !== undefined &&
      props.firstName !== user.getFirstName()
    ) {
      user.setFirstName(props.firstName);
      hasChanges = true;
    }

    if (props.lastName !== undefined && props.lastName !== user.getLastName()) {
      user.setLastName(props.lastName);
      hasChanges = true;
    }

    if (props.userName !== undefined && props.userName !== user.getUserName()) {
      user.setUserName(props.userName);
      hasChanges = true;
    }

    if (
      props.phoneNumber !== undefined &&
      props.phoneNumber !== user.getPhoneNumber()
    ) {
      user.setPhoneNumber(props.phoneNumber);
      hasChanges = true;
    }

    if (props.bio !== undefined && props.bio !== user.getBio()) {
      user.setBio(props.bio);
      hasChanges = true;
    }

    if (
      props.profileImageUrl !== undefined &&
      props.profileImageUrl !== user.getProfileImageUrl()
    ) {
      user.setProfileImageUrl(props.profileImageUrl);
      hasChanges = true;
    }

    if (props.website !== undefined && props.website !== user.website) {
      user.website = props.website;
      hasChanges = true;
    }

    if (props.location !== undefined && props.location !== user.getLocation()) {
      user.setLocation(props.location);
      hasChanges = true;
    }

    if (
      props.experienceYears !== undefined &&
      props.experienceYears !== user.getExperienceYears()
    ) {
      user.setExperienceYears(props.experienceYears);
      hasChanges = true;
    }

    if (
      props.specialization !== undefined &&
      props.specialization !== user.getSpecialization()
    ) {
      user.setSpecialization(props.specialization);
      hasChanges = true;
    }

    if (hasChanges) {
      await this.userRepository.update(user);
    }

    return user;
  }
}
