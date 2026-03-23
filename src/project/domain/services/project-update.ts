import { Project } from '../entities/project.entity';
import { ProjectRepository } from '../repositories/project.repository';
import { Category } from 'src/category/domain/entities/category';

export interface UpdateProjectProps {
  title?: string;
  description?: string;
  year?: number;
  categories?: string[];
  imagesUrl?: string[];
}

export class UpdateProject {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(project: Project, props: UpdateProjectProps): Promise<Project> {
    let hasChanges = false;

    if (props.title !== undefined && props.title !== project.getTitle()) {
      project.setTitle(props.title);
      hasChanges = true;
    }

    if (
      props.description !== undefined &&
      props.description !== project.getDescription()
    ) {
      project.setDescription(props.description);
      hasChanges = true;
    }

    if (props.year !== undefined && props.year !== project.getYear()) {
      project.setYear(props.year);
      hasChanges = true;
    }

    if (props.imagesUrl !== undefined) {
      const newImages = props.imagesUrl.filter(
        (img) => !project.imagesUrl.includes(img),
      );
      const removedImages = project.imagesUrl.filter(
        (img) => !props.imagesUrl?.includes(img),
      );

      if (newImages.length > 0 || removedImages.length > 0) {
        project.imagesUrl = props.imagesUrl;
        hasChanges = true;
      }
    }

    if (props.categories !== undefined) {
      const currentCategories = project.categories.map((c) => c.name);
      const newCategories = props.categories;

      const hasCategoryChanges =
        newCategories.length !== currentCategories.length ||
        !newCategories.every((c) => currentCategories.includes(c));

      if (hasCategoryChanges) {
        project.categories = newCategories.map(
          (name) => ({ name }) as Category,
        );
        hasChanges = true;
      }
    }

    if (hasChanges) {
      await this.projectRepository.update(project);
    }

    return project;
  }
}
