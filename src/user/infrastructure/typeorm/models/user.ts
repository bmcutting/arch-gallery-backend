import { LikeModel } from 'src/project/infrastructure/typeorm/models/like';
import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project';
import { Model } from 'src/shared/typeorm/base.model';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class UserModel extends Model {
  @Column({ type: 'text' })
  userName: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text' })
  firstName: string;

  @Column({ type: 'text' })
  lastName: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'text', nullable: true })
  phoneNumber: string;

  @Column({ type: 'text', nullable: true })
  profileImageUrl: string;

  @Column({ type: 'text', nullable: true })
  website: string;

  @Column({ type: 'text', nullable: true })
  location: string;

  @OneToMany(() => ProjectModel, (project) => project.user)
  projects: ProjectModel[];

  @OneToMany(() => LikeModel, (like) => like.user) likes: LikeModel[];
}
