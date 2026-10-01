import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmUserRepository } from './infrastructure/typeorm/repository/user';
import { UserModel } from './infrastructure/typeorm/models/user.model';
import { UserController } from './infrastructure/nest/controllers/user.controller';
import { ExperienceController } from './infrastructure/nest/controllers/experience.controller';
import { SkillController } from './infrastructure/nest/controllers/skill.controller';
import { TypeOrmSkillRepository } from './infrastructure/typeorm/repository/skill';
import { TypeOrmExperienceRepository } from './infrastructure/typeorm/repository/experience';
import { SkillModel } from './infrastructure/typeorm/models/skill.model';
import { ExperienceModel } from './infrastructure/typeorm/models/experience.model';
import { BcryptPasswordHasher } from './infrastructure/services/bcrypt-password-hasher';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel, SkillModel, ExperienceModel])],
  controllers: [UserController, ExperienceController, SkillController],
  providers: [
    TypeOrmUserRepository,
    TypeOrmSkillRepository,
    TypeOrmExperienceRepository,
    BcryptPasswordHasher,
  ],
  exports: [
    TypeOrmUserRepository,
    TypeOrmSkillRepository,
    TypeOrmExperienceRepository,
    BcryptPasswordHasher,
  ],
})
export class UserModule {}
