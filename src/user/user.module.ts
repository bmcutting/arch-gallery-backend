import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmUserRepository } from './infrastructure/typeorm/repository/user';
import { UserModel } from './infrastructure/typeorm/models/user';
import { UserController } from './infrastructure/nest/controllers/user.controller';
import { EnvService } from 'src/app/modules/env/services/env';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ExperienceController } from './infrastructure/nest/controllers/experience.controller';
import { SkillController } from './infrastructure/nest/controllers/skill.controller';
import { TypeOrmSkillRepository } from './infrastructure/typeorm/repository/skill';
import { TypeOrmExperienceRepository } from './infrastructure/typeorm/repository/experience';
import { SkillModel } from './infrastructure/typeorm/models/skill';
import { ExperienceModel } from './infrastructure/typeorm/models/experience';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel, SkillModel, ExperienceModel])],
  controllers: [UserController, ExperienceController, SkillController],
  providers: [
    TypeOrmUserRepository,
    TypeOrmSkillRepository,
    TypeOrmExperienceRepository,
    EnvService,
    JwtService,
    ConfigService,
  ],
  exports: [
    TypeOrmUserRepository,
    TypeOrmSkillRepository,
    TypeOrmExperienceRepository,
  ],
})
export class UserModule {}
