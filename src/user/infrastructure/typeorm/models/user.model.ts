import { CommentModel } from 'src/comment/infrastructure/typeorm/models/comment.model';
import { LikeModel } from 'src/like/infrastructure/typeorm/models/like.model';
import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project.model';
import { Model } from 'src/shared/infrastructure/typeorm/models/base.model';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserSkillModel } from './user-skill.model';
import { ExperienceModel } from './experience.model';

@Entity()
export class UserModel extends Model {
  @Column({ type: 'varchar', length: 100, unique: true })
  userName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  shortBio: string | null;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  longBio: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phoneNumber: string | null;

  @Column({ type: 'text', nullable: true })
  profileImageUrl: string | null;

  @Column({ type: 'text', nullable: true })
  coverImageUrl: string | null;

  @Column({ type: 'text', nullable: true })
  website: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location: string | null;

  @Column({ type: 'int', nullable: true })
  experienceYears: number | null;

  @Column({ type: 'text', nullable: true })
  specialization: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  instagramUrl: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  twitterUrl: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkedinUrl: string | null;

  @Column('text', { array: true, nullable: true })
  languages: string[];

  @OneToMany(() => UserSkillModel, (userSkill) => userSkill.user)
  skills: UserSkillModel[];

  @OneToMany(() => ExperienceModel, (experience) => experience.user)
  experiences: ExperienceModel[];

  @OneToMany(() => ProjectModel, (project) => project.user)
  projects: ProjectModel[];

  @OneToMany(() => LikeModel, (like) => like.user)
  likes: LikeModel[];

  @OneToMany(() => CommentModel, (comment) => comment.user)
  comments: CommentModel[];
}
