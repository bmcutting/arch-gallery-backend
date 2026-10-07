import { User } from 'src/user/domain/entities/user.entity';
import { UserModel } from '../models/user.model';
import { UserSkillTypeOrmMapper } from './user-skill-mapper';
import { ExperienceTypeOrmMapper } from './experience-mapper';

export class UserTypeOrmMapper {
  static toModel(user: User): UserModel {
    const model = new UserModel();
    model.id = user.id;
    model.email = user.email;
    model.password = user.password;
    model.userName = user.userName;
    model.firstName = user.firstName;
    model.lastName = user.lastName;
    model.phoneNumber = user.phoneNumber;
    model.shortBio = user.shortBio;
    model.longBio = user.longBio;
    model.profileImageUrl = user.profileImageUrl;
    model.coverImageUrl = user.coverImageUrl;
    model.website = user.website;
    model.location = user.location;
    model.experienceYears = user.experienceYears;
    model.specialization = user.specialization;
    model.instagramUrl = user.instagramUrl;
    model.twitterUrl = user.twitterUrl;
    model.linkedinUrl = user.linkedinUrl;
    model.languages = user.languages;
    model.isActive = user.isActive;
    model.deletedAt = user.deletedAt;
    return model;
  }

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
      // Dos niveles: la fila de join activa y su fila de catalogo tambien activa.
      // Sin filtrar: user_skill se borra en duro, y borrar una skill se lleva sus filas de join.
      skills: u.skills ? UserSkillTypeOrmMapper.toDomainList(u.skills) : [],
      experiences: u.experiences
        ? ExperienceTypeOrmMapper.toDomainList(
            u.experiences.filter((e) => e.isActive),
          )
        : [],
      //project: u.project ? UserProjectTypeOrmMapper.execute(u.project) : null
    });
  }
}
