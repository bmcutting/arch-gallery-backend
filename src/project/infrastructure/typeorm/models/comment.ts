import { UserModel } from 'src/user/infrastructure/typeorm/models/user';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ProjectModel } from './project';
import { Model } from 'src/shared/typeorm/base.model';

@Entity({ name: 'comments' })
export class CommentModel extends Model {
  @Column()
  userId: string;

  @Column()
  projectId: string;

  @Column({ type: 'text' })
  message: string;

  @ManyToOne(() => ProjectModel, (project) => project.comments)
  project: ProjectModel;

  @ManyToOne(() => UserModel)
  user: UserModel;
}
