import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from 'src/authentication/domain/entities/refresh-token.entity';
import { RefreshTokenRepository } from 'src/authentication/domain/repositories/refresh-token.repository';
import { RefreshTokenModel } from '../models/refresh-token.model';
import { LessThan, Repository } from 'typeorm';
import { RefreshTokenMapper } from '../mappers/refresh-token.mapper';

@Injectable()
export class TypeOrmRefreshTokenRepository implements RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenModel)
    private readonly repository: Repository<RefreshTokenModel>,
  ) {}

  async create(refreshToken: RefreshToken): Promise<void> {
    const model = RefreshTokenMapper.toModel(refreshToken);
    await this.repository.save(model);
  }

  async findByToken(hashedToken: string): Promise<RefreshToken | null> {
    const model = await this.repository.findOne({
      where: { token: hashedToken },
    });
    return model ? RefreshTokenMapper.toDomain(model) : null;
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    const models = await this.repository.find({
      where: { userId },
    });
    return RefreshTokenMapper.toDomainList(models);
  }

  async revokeByUserId(userId: string): Promise<void> {
    await this.repository.update(
      { userId, isRevoked: false },
      { isRevoked: true, revokedAt: new Date() },
    );
  }

  async revokeByToken(hashedToken: string): Promise<void> {
    await this.repository.update(
      { token: hashedToken },
      { isRevoked: true, revokedAt: new Date() },
    );
  }

  async deleteExpired(): Promise<void> {
    await this.repository.delete({
      expiresAt: LessThan(new Date()),
    });
  }
}
