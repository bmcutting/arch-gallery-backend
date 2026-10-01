export interface RefreshTokenCrypto {
  generate(): string;
  hash(token: string): string;
}
