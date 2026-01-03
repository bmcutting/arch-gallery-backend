import { Model } from 'src/shared/typeorm/base.model';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user';
import { Entity, ManyToOne } from 'typeorm';
import { ProjectModel } from './project';

@Entity({ name: 'likes' })
export class LikeModel extends Model {
  @ManyToOne(() => UserModel, (user) => user.likes) user: UserModel;

  @ManyToOne(() => ProjectModel, (project) => project.likes)
  project: ProjectModel;
}
