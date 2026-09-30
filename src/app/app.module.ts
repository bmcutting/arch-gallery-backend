import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { EnvModule } from 'src/env/env.module';
import { EnvService } from 'src/env/services/env';
import { DatabaseModule } from 'src/database/database.module';
import { SharedModule } from 'src/shared/shared.module';
import { createPinoConfig } from 'src/shared/infrastructure/logging/logger.config';
import { UserModule } from 'src/user/user.module';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { ProjectModule } from 'src/project/project.module';
import { CategoryModule } from 'src/category/category.module';
import { CommentModule } from 'src/comment/comment.module';
import { LikeModule } from 'src/like/like.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    EnvModule,
    // `EnvModule` es @Global, asi que no hace falta declararlo en `imports`
    // para que `EnvService` se pueda inyectar en la factoria.
    LoggerModule.forRootAsync({
      inject: [EnvService],
      useFactory: createPinoConfig,
    }),
    DatabaseModule,
    SharedModule,
    UserModule,
    AuthenticationModule,
    ProjectModule,
    CategoryModule,
    CommentModule,
    LikeModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
