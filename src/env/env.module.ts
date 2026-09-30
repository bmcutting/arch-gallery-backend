import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvService } from './services/env';
import { resolveEnvFilePath } from './env-file';

@Global()
@Module({
  controllers: [],
  exports: [EnvService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolveEnvFilePath(),
      expandVariables: true,
      isGlobal: true,
    }),
  ],
  providers: [EnvService],
})
export class EnvModule {}
