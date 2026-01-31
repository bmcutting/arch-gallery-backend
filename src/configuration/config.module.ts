import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('local', 'development', 'production')
          .default('local'),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        JWT_ALGORITHM: Joi.string().required(),
        REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().default('30d'),
      }),
    }),
  ],
})
export class ConfigutationModule {}
