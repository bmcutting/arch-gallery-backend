import { Column, Entity, ManyToOne } from 'typeorm';
import { UserModel } from './user';
import { Model } from 'src/shared/typeorm/base.model';

@Entity({ name: 'skills' })
export class SkillModel extends Model {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  level: string;

  @ManyToOne(() => UserModel, (user) => user.skills)
  user: UserModel;
}
