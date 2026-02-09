import { CommentModel } from 'src/project/infrastructure/typeorm/models/comment';
import { LikeModel } from 'src/project/infrastructure/typeorm/models/like';
import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project';
import { Model } from 'src/shared/typeorm/base.model';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class UserModel extends Model {
  @Column({ type: 'varchar', length: 100, unique: true })
  userName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;

  @Column({ type: 'text', nullable: true })
  profileImageUrl: string;

  @Column({ type: 'text', nullable: true })
  website: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  experienceYears: number;

  @Column({ type: 'text', nullable: true })
  specialization: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  instagramUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  twitterUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkedinUrl: string;

  @Column('text', { array: true, nullable: true })
  languages: string[];

  @OneToMany(() => ProjectModel, (project) => project.user, { cascade: true })
  projects: ProjectModel[];

  @OneToMany(() => LikeModel, (like) => like.user, { cascade: true })
  likes: LikeModel[];

  @OneToMany(() => CommentModel, (comment) => comment.user, { cascade: true })
  comments: CommentModel[];
}
