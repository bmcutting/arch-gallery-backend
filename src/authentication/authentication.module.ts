import { forwardRef, Module } from '@nestjs/common';
import { RefreshTokenModel } from './infrastructure/typeorm/models/refresh-token.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Algorithm } from 'jsonwebtoken';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './infrastructure/nest/controllers/auth.controller';
import { TypeOrmRefreshTokenRepository } from './infrastructure/typeorm/repositories/refresh-token.repository';
import { SharedModule } from 'src/shared/shared.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './infrastructure/nest/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([RefreshTokenModel]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<number>('JWT_EXPIRATION_TIME'),
          algorithm: configService.get<string>('JWT_ALGORITHM') as Algorithm,
        },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [JwtAuthGuard, TypeOrmRefreshTokenRepository],
  exports: [JwtModule, JwtAuthGuard, TypeOrmRefreshTokenRepository],
})
export class AuthenticationModule {}
