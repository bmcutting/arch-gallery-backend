import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './infrastructure/nest/controllers/auth.controller';
import { TypeOrmRefreshTokenRepository } from './infrastructure/typeorm/repositories/refresh-token.repository';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [TypeOrmRefreshTokenRepository],
  exports: [],
})
export class AuthenticationModule {}
