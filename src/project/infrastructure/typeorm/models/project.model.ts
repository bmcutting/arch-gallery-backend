import { CategoryModel } from 'src/category/infrastructure/typeorm/models/category.model';
import { Model } from 'src/shared/infrastructure/typeorm/models/base.model';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user.model';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CommentModel } from '../../../../comment/infrastructure/typeorm/models/comment.model';
import { LikeModel } from '../../../../like/infrastructure/typeorm/models/like.model';

@Entity()
export class ProjectModel extends Model {
  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  year: number;

  @Column('text', { array: true, default: [] })
  imagesUrl: string[];

  @ManyToOne(() => UserModel, (user) => user.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserModel;

  @ManyToMany(() => CategoryModel, (category) => category.projects)
  @JoinTable({ name: 'project_categories' })
  categories: CategoryModel[];

  @OneToMany(() => CommentModel, (comment) => comment.project)
  comments: CommentModel[];

  @OneToMany(() => LikeModel, (like) => like.project)
  likes: LikeModel[];
}
