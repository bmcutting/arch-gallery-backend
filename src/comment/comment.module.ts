import { Module } from '@nestjs/common';
import { TypeOrmCommentRepository } from './infrastructure/typeorm/repository/comment';
import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project';
import { CommentModel } from './infrastructure/typeorm/models/comment';
import { CommentController } from './infrastructure/nest/controllers/comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmProjectRepository } from 'src/project/infrastructure/typeorm/repository/project';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LikeModel } from 'src/project/infrastructure/typeorm/models/like';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectModel, CommentModel, LikeModel])],
  controllers: [CommentController],
  providers: [
    TypeOrmProjectRepository,
    TypeOrmCommentRepository,
    JwtService,
    ConfigService,
  ],
  exports: [TypeOrmCommentRepository],
})
export class CommentModule {}
