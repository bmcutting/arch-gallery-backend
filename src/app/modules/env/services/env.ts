import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  readonly DATABASE_NAME: string;
  readonly DATABASE_USERNAME: string;
  readonly DATABASE_PASSWORD: string;
  readonly DATABASE_PORT: number;
  readonly DATABASE_HOST: string;
  readonly ACCESS_TOKEN_SECRET_WORD: string;
  readonly REFRESH_TOKEN_SECRET_WORD: string;

  constructor(private readonly configService: ConfigService) {
    this.DATABASE_NAME = this.configService.getOrThrow<string>('DATABASE_NAME');
    this.DATABASE_USERNAME =
      this.configService.getOrThrow<string>('DATABASE_USERNAME');
    this.DATABASE_PASSWORD =
      this.configService.getOrThrow<string>('DATABASE_PASSWORD');
    this.DATABASE_PORT = Number(
      this.configService.getOrThrow<string>('DATABASE_PORT'),
    );
    this.DATABASE_HOST = this.configService.getOrThrow<string>('DATABASE_HOST');
    this.ACCESS_TOKEN_SECRET_WORD =
      this.configService.getOrThrow<string>('TOKEN_SECRET_WORD');
    this.REFRESH_TOKEN_SECRET_WORD = this.configService.getOrThrow<string>(
      'REFRESH_SECRET_WORD',
    );
  }
}
