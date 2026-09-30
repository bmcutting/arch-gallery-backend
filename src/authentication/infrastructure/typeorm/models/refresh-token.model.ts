import { Model } from 'src/shared/infrastructure/typeorm/models/base.model';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user.model';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class RefreshTokenModel extends Model {
  @Column({ type: 'varchar', length: 26 })
  @Index()
  user_id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  token: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'boolean', default: false })
  isRevoked: boolean;

  @Column({ type: 'timestamp', nullable: true })
  revokedAt: Date | null;

  @ManyToOne(() => UserModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserModel;
}
