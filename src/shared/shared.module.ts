import { Module } from '@nestjs/common';
import { BcryptPasswordHasher } from './utils/password-hasher';

@Module({
  providers: [BcryptPasswordHasher],
  exports: [BcryptPasswordHasher],
})
export class SharedModule {}
