import { Module } from '@nestjs/common';
import { TypeOrmCommentRepository } from './infrastructure/typeorm/repository/comment';
import { CommentModel } from './infrastructure/typeorm/models/comment.model';
import { CommentController } from './infrastructure/nest/controllers/comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [
    UserModule,
    ProjectModule,
    TypeOrmModule.forFeature([CommentModel]),
  ],
  controllers: [CommentController],
  providers: [TypeOrmCommentRepository],
  exports: [TypeOrmCommentRepository],
})
export class CommentModule {}
