import { Model } from 'src/shared/typeorm/base.model';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class RefreshTokenModel extends Model {
  @Column({ type: 'varchar' })
  @Index()
  userId: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  token: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'boolean', default: false })
  isRevoked: boolean;

  @Column({ type: 'timestamp', nullable: true })
  revokedAt: Date | null;

  @ManyToOne(() => UserModel)
  @JoinColumn({ name: 'userId' })
  user: UserModel;
}
