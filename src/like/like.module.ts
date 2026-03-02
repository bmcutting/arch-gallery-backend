import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentModel } from 'src/comment/infrastructure/typeorm/models/comment';
import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project';
import { LikeModel } from './infrastructure/typeorm/models/like';
import { TypeOrmProjectRepository } from 'src/project/infrastructure/typeorm/repository/project';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LikeController } from './infrastructure/nest/controllers/like.controller';
import { TypeOrmLikeRepository } from './infrastructure/typeorm/repository/like';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectModel, CommentModel, LikeModel])],
  controllers: [LikeController],
  providers: [
    TypeOrmProjectRepository,
    TypeOrmLikeRepository,
    JwtService,
    ConfigService,
  ],
  exports: [TypeOrmLikeRepository],
})
export class LikeModule {}
