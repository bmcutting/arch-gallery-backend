import { RefreshToken } from 'src/authentication/domain/entities/refresh-token.entity';
import { RefreshTokenModel } from '../models/refresh-token.model';

export class RefreshTokenMapper {
  /**
   * Converts RefreshTokenModel (TypeORM) to RefreshToken (domain)
   */
  static toDomain(model: RefreshTokenModel): RefreshToken {
    return new RefreshToken({
      id: model.id,
      userId: model.userId,
      token: model.token,
      expiresAt: model.expiresAt,
      isRevoked: model.isRevoked,
      createdAt: model.createdAt,
      revokedAt: model.revokedAt,
    });
  }

  /**
   * Converts RefreshToken (domain) to RefreshTokenModel (TypeORM)
   */
  static toModel(domain: RefreshToken): RefreshTokenModel {
    const model = new RefreshTokenModel();
    model.id = domain.id;
    model.userId = domain.userId;
    model.token = domain.token;
    model.expiresAt = domain.expiresAt;
    model.isRevoked = domain.isRevoked;
    model.revokedAt = domain.revokedAt;
    return model;
  }

  /**
   * Converts an array of RefreshTokenModel (TypeORM) to an array of RefreshToken (domain)
   */
  static toDomainList(models: RefreshTokenModel[]): RefreshToken[] {
    return models.map((model) => this.toDomain(model));
  }
}
