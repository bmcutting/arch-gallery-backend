import { UserModel } from 'src/user/infrastructure/typeorm/models/user.model';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProjectModel } from '../../../../project/infrastructure/typeorm/models/project.model';
import { Model } from 'src/shared/infrastructure/typeorm/models/base.model';

@Entity()
export class CommentModel extends Model {
  @Column({ type: 'varchar', length: 26 })
  user_id: string;

  @Column({ type: 'varchar', length: 26 })
  project_id: string;

  @Column({ type: 'text' })
  message: string;

  @ManyToOne(() => ProjectModel, (project) => project.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: ProjectModel;

  @ManyToOne(() => UserModel, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserModel;
}
