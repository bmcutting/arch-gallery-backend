import { Injectable } from '@nestjs/common';
import { DataSource, LessThan } from 'typeorm';
import { RefreshToken } from 'src/authentication/domain/entities/refresh-token.entity';
import { RefreshTokenRepository } from 'src/authentication/domain/repositories/refresh-token.repository';
import { BaseTypeOrmRepository } from 'src/shared/infrastructure/typeorm/repositories/base-typeorm.repository';
import { TypeOrmUnitOfWork } from 'src/shared/infrastructure/typeorm/services/typeorm-unit-of-work';
import { RefreshTokenMapper } from '../mappers/refresh-token.mapper';
import { RefreshTokenModel } from '../models/refresh-token.model';

@Injectable()
export class TypeOrmRefreshTokenRepository
  extends BaseTypeOrmRepository<RefreshTokenModel>
  implements RefreshTokenRepository
{
  constructor(dataSource: DataSource, unitOfWork: TypeOrmUnitOfWork) {
    super(dataSource, unitOfWork, RefreshTokenModel);
  }

  async create(refreshToken: RefreshToken): Promise<void> {
    await this.repository.save(RefreshTokenMapper.toModel(refreshToken));
  }

  async findByToken(hashedToken: string): Promise<RefreshToken | null> {
    const model = await this.repository.findOne({
      where: { token: hashedToken },
    });
    return model ? RefreshTokenMapper.toDomain(model) : null;
  }

  async revokeByToken(hashedToken: string): Promise<void> {
    await this.repository.update(
      { token: hashedToken },
      { isRevoked: true, revokedAt: new Date() },
    );
  }

  async deleteExpired(): Promise<void> {
    await this.repository.delete({ expiresAt: LessThan(new Date()) });
  }
}
