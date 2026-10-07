import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserModel } from './user.model';
import { Model } from 'src/shared/infrastructure/typeorm/models/base.model';
import { SkillScope } from 'src/user/domain/enums/skill-scope';
import { UserSkillModel } from './user-skill.model';

@Entity()
@Index('IDX_skill_scope_normalized_name', ['scope', 'normalizedName'])
@Index('IDX_skill_created_by_normalized_name', [
  'created_by_id',
  'normalizedName',
])
export class SkillModel extends Model {
  @Column({ type: 'varchar', length: 100 })
  displayName: string;

  @Column({ type: 'varchar', length: 100 })
  normalizedName: string;

  @Column({ type: 'enum', enum: SkillScope })
  scope: SkillScope;

  @Column({ type: 'varchar', length: 26, nullable: true })
  created_by_id: string | null;

  @ManyToOne(() => UserModel, { nullable: true })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: UserModel | null;

  @OneToMany(() => UserSkillModel, (userSkill) => userSkill.skill)
  userSkills: UserSkillModel[];
}
