import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { UserModel } from './user.model';
import { SkillModel } from './skill.model';
import { Model } from 'src/shared/infrastructure/typeorm/models/base.model';
import { Level } from 'src/user/domain/enums/level';

@Entity()
@Index('IDX_user_skill_user_id_skill_id', ['user_id', 'skill_id'])
@Index('IDX_user_skill_skill_id_user_id', ['skill_id', 'user_id'])
export class UserSkillModel extends Model {
  @Column({ type: 'varchar', length: 26 })
  user_id: string;

  @Column({ type: 'varchar', length: 26 })
  skill_id: string;

  @Column({ type: 'enum', enum: Level, nullable: true })
  level: Level | null;

  @ManyToOne(() => UserModel, (user) => user.skills, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @ManyToOne(() => SkillModel, (skill) => skill.userSkills, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'skill_id' })
  skill: SkillModel;
}
