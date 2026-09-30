import { Model } from 'src/shared/infrastructure/typeorm/models/base.model';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user.model';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { ProjectModel } from '../../../../project/infrastructure/typeorm/models/project.model';

@Entity()
@Unique(['user_id', 'project_id'])
export class LikeModel extends Model {
  @Column({ type: 'varchar', length: 26 })
  user_id: string;

  @Column({ type: 'varchar', length: 26 })
  project_id: string;

  @ManyToOne(() => UserModel, (user) => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @ManyToOne(() => ProjectModel, (project) => project.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: ProjectModel;
}
