import { Module } from '@nestjs/common';
import { TypeOrmUserRepository } from './infrastructure/typeorm/repositories/user.repository';
import { TypeOrmSkillRepository } from './infrastructure/typeorm/repositories/skill.repository';
import { TypeOrmUserSkillRepository } from './infrastructure/typeorm/repositories/user-skill.repository';
import { TypeOrmExperienceRepository } from './infrastructure/typeorm/repositories/experience.repository';
import { UserController } from './infrastructure/nest/controllers/user.controller';
import { ExperienceController } from './infrastructure/nest/controllers/experience.controller';
import {
  SkillController,
  UserSkillController,
} from './infrastructure/nest/controllers/skill.controller';
import { BcryptPasswordHasher } from './infrastructure/services/bcrypt-password-hasher';

// Sin `TypeOrmModule.forFeature`: los cuatro repositorios extienden BaseTypeOrmRepository, que
// resuelve el DataSource global, asi que no necesitan token de repositorio por entidad.
@Module({
  controllers: [
    UserController,
    ExperienceController,
    SkillController,
    UserSkillController,
  ],
  providers: [
    TypeOrmUserRepository,
    TypeOrmSkillRepository,
    TypeOrmUserSkillRepository,
    TypeOrmExperienceRepository,
    BcryptPasswordHasher,
  ],
  exports: [
    TypeOrmUserRepository,
    TypeOrmSkillRepository,
    TypeOrmUserSkillRepository,
    TypeOrmExperienceRepository,
    BcryptPasswordHasher,
  ],
})
export class UserModule {}
