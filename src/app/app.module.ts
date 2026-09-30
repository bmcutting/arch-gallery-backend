import { Module } from '@nestjs/common';
import { EnvModule } from 'src/env/env.module';
import { DatabaseModule } from 'src/database/database.module';
import { SharedModule } from 'src/shared/shared.module';
import { UserModule } from 'src/user/user.module';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { ProjectModule } from 'src/project/project.module';
import { CategoryModule } from 'src/category/category.module';
import { CommentModule } from 'src/comment/comment.module';
import { LikeModule } from 'src/like/like.module';

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    SharedModule,
    UserModule,
    AuthenticationModule,
    ProjectModule,
    CategoryModule,
    CommentModule,
    LikeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
