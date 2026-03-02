import { Model } from 'src/shared/typeorm/base.model';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { ProjectModel } from '../../../../project/infrastructure/typeorm/models/project';

@Entity({ name: 'likes' })
@Unique(['userId', 'projectId'])
export class LikeModel extends Model {
  @Column()
  userId: string;

  @Column()
  projectId: string;

  @ManyToOne(() => UserModel, (user) => user.likes, { onDelete: 'CASCADE' })
  user: UserModel;

  @ManyToOne(() => ProjectModel, (project) => project.likes, {
    onDelete: 'CASCADE',
  })
  project: ProjectModel;
}
