import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmUserRepository } from './infrastructure/typeorm/repository/user';
import { UserModel } from './infrastructure/typeorm/models/user';
import { UserController } from './infrastructure/nest/controllers/user.controller';
import { AuthController } from './infrastructure/nest/controllers/auth.controller';
import { EnvService } from 'src/app/modules/env/services/env';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  controllers: [UserController, AuthController],
  providers: [TypeOrmUserRepository, EnvService, JwtService, ConfigService],
  exports: [TypeOrmUserRepository],
})
export class UserModule {}
