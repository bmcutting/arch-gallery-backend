import { Model } from 'src/shared/typeorm/base.model';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'projects' })
export class ProjectModel extends Model {
  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('text', { array: true, default: [] })
  imagesUrl: string[];

  @ManyToOne(() => UserModel, (user) => user.projects)
  user: UserModel;
}
