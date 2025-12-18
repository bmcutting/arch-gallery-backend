import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { EnvModule } from './modules/env/env.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user';
import { EnvService } from 'src/app/modules/env/services/env';
import { ProjectModule } from 'src/project/project.module';
import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project';

@Module({
  imports: [
    EnvModule,
    UserModule,
    TypeOrmModule.forRootAsync({
      useFactory(envServices: EnvService) {
        return {
          type: 'postgres',
          host: envServices.DATABASE_HOST,
          port: envServices.DATABASE_PORT,
          password: envServices.DATABASE_PASSWORD,
          username: envServices.DATABASE_USERNAME,
          database: envServices.DATABASE_NAME,
          synchronize: true,
          logging: false,
          dropSchema: false,
          entities: [UserModel, ProjectModel],
        };
      },
      inject: [EnvService],
      imports: [EnvModule],
    }),
    UserModule,
    ProjectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
