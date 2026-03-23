import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project';
import { Model } from 'src/shared/typeorm/base.model';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity({ name: 'categories' })
export class CategoryModel extends Model {
  @Column({ type: 'text', unique: true, nullable: false })
  name: string;

  @ManyToMany(() => ProjectModel, (project) => project.categories)
  projects: ProjectModel[];
}
