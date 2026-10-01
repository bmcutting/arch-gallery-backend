import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeModel } from './infrastructure/typeorm/models/like.model';
import { LikeController } from './infrastructure/nest/controllers/like.controller';
import { TypeOrmLikeRepository } from './infrastructure/typeorm/repository/like';
import { UserModule } from 'src/user/user.module';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [UserModule, ProjectModule, TypeOrmModule.forFeature([LikeModel])],
  controllers: [LikeController],
  providers: [TypeOrmLikeRepository],
  exports: [TypeOrmLikeRepository],
})
export class LikeModule {}
