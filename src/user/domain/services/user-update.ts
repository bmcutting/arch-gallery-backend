import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { RepeatUserException } from '../exceptions/user';
import { Skill } from '../entities/skill.entity';
import { Experience } from '../entities/experience.entity';

export interface UpdateUserProps {
  email?: string;
  password?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  longBio?: string;
  shortBio?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  website?: string;
  location?: string;
  experienceYears?: number;
  specialization?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  languages?: string[];
  skills?: Skill[];
  experiences?: Experience[];
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

    if (props.longBio !== undefined && props.longBio !== user.getLongBio()) {
      user.setLongBio(props.longBio);
      hasChanges = true;
    }

    if (props.shortBio !== undefined && props.shortBio !== user.getShortBio()) {
      user.setShortBio(props.shortBio);
      hasChanges = true;
    }

    if (
      props.profileImageUrl !== undefined &&
      props.profileImageUrl !== user.getProfileImageUrl()
    ) {
      user.setProfileImageUrl(props.profileImageUrl);
      hasChanges = true;
    }

    if (
      props.coverImageUrl !== undefined &&
      props.coverImageUrl !== user.getCoverImageUrl()
    )
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

    if (
      props.instagramUrl !== undefined &&
      props.instagramUrl !== user.getInstagramUrl()
    ) {
      user.setInstagramUrl(props.instagramUrl);
      hasChanges = true;
    }

    if (
      props.twitterUrl !== undefined &&
      props.twitterUrl !== user.getTwitterUrl()
    ) {
      user.setTwitterUrl(props.twitterUrl);
      hasChanges = true;
    }

    if (
      props.linkedinUrl !== undefined &&
      props.linkedinUrl !== user.getLinkedinUrl()
    ) {
      user.setLinkedinUrl(props.linkedinUrl);
      hasChanges = true;
    }

    if (
      props.languages !== undefined &&
      JSON.stringify(props.languages) !== JSON.stringify(user.getLanguages())
    ) {
      user.setLanguages(props.languages);
      hasChanges = true;
    }

    if (props.skills !== undefined) {
      // Convertir objetos planos a instancias de Skill (dominio)
      const skillInstances = props.skills.map(
        (skillData) =>
          new Skill({
            id: skillData.id,
            name: skillData.name,
            level: skillData.level,
          }),
      );

      if (JSON.stringify(skillInstances) !== JSON.stringify(user.getSkills())) {
        user.setSkill(skillInstances);
        hasChanges = true;
      }

      if (props.experiences !== undefined) {
        const experienceInstances = props.experiences.map(
          (expData) =>
            new Experience({
              id: expData.id,
              type: expData.type,
              title: expData.title,
              institutionOrCompany: expData.institutionOrCompany,
              description: expData.description,
              startYear: expData.startYear,
              endYear: expData.endYear,
              isCurrent: expData.isCurrent,
            }),
        );
        if (
          JSON.stringify(experienceInstances) !==
          JSON.stringify(user.getExperiences())
        ) {
          user.setExperience(experienceInstances);
          hasChanges = true;
        }
      }

      try {
        if (hasChanges) {
          await this.userRepository.update(user);
        }
      } catch (err) {
        throw new Error(
          `Error al actualizar el usuario: ${(err as Error).message}`,
        );
      }
    }

    return user;
  }
}
