import { Column, Entity, ManyToOne } from 'typeorm';
import { UserModel } from './user';
import { Model } from 'src/shared/typeorm/base.model';
import { Level } from 'src/user/domain/enums/level';

@Entity({ name: 'skills' })
export class SkillModel extends Model {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'enum', enum: Level, nullable: true })
  level: Level | null;

  @ManyToOne(() => UserModel, (user) => user.skills)
  user: UserModel;
}
