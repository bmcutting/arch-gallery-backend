import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserModel } from './user.model';
import { Model } from 'src/shared/infrastructure/typeorm/models/base.model';
import { ExperienceType } from 'src/user/domain/enums/experience';

@Entity()
export class ExperienceModel extends Model {
  @Column({ type: 'varchar', length: 26 })
  user_id: string;

  @Column({ type: 'enum', enum: ExperienceType })
  type: ExperienceType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  institutionOrCompany: string;

  @Column({ type: 'int' })
  startYear: number;

  @Column({ type: 'int', nullable: true })
  endYear: number | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: false })
  isCurrent: boolean;

  @ManyToOne(() => UserModel, (user) => user.experiences)
  @JoinColumn({ name: 'user_id' })
  user: UserModel;
}
