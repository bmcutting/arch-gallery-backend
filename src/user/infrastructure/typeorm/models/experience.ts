import { Column, Entity, ManyToOne } from 'typeorm';
import { UserModel } from './user';
import { Model } from 'src/shared/typeorm/base.model';
import { ExperienceType } from 'src/user/domain/enums/experience';

@Entity({ name: 'experiences' })
export class ExperienceModel extends Model {
  @Column({ type: 'enum', enum: ExperienceType })
  type: ExperienceType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  institutionOrCompany: string;

  @Column({ type: 'int' })
  startYear: number;

  @Column({ type: 'int', nullable: true })
  endYear: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  isCurrent: boolean;

  @ManyToOne(() => UserModel, (user) => user.experiences)
  user: UserModel;
}
