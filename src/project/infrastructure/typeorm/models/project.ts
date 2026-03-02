import { CategoryModel } from 'src/category/infrastructure/typeorm/models/category';
import { Model } from 'src/shared/typeorm/base.model';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CommentModel } from '../../../../comment/infrastructure/typeorm/models/comment';
import { LikeModel } from '../../../../like/infrastructure/typeorm/models/like';

@Entity({ name: 'projects' })
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
  user: UserModel;

  @ManyToMany(() => CategoryModel, (category) => category.projects)
  @JoinTable({
    name: 'project_categories',
    joinColumn: { name: 'projectId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: CategoryModel[];

  @OneToMany(() => CommentModel, (comment) => comment.project)
  comments: CommentModel[];

  @OneToMany(() => LikeModel, (like) => like.project)
  likes: LikeModel[];
}
