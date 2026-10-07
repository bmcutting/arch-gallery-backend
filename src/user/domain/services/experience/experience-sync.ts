import type IdGenerator from 'src/shared/domain/interfaces/id.generator';
import { Experience } from '../../entities/experience.entity';
import { ExperienceType } from '../../enums/experience';
import { NotFoundExperienceException } from '../../exceptions/experience';
import { ExperienceRepository } from '../../repositories/experience.repository';

export interface ExperienceSyncItem {
  id?: string;
  type: ExperienceType;
  title: string;
  institutionOrCompany: string;
  startYear: number;
  endYear?: number | null;
  description?: string | null;
  isCurrent?: boolean;
}

interface Props {
  userId: string;
  experiences: ExperienceSyncItem[];
}

export class ExperienceSync {
  constructor(
    private readonly repository: ExperienceRepository,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute({ userId, experiences }: Props): Promise<Experience[]> {
    const { items: existing } = await this.repository.find({ userId });
    const own = new Map(existing.map((item) => [item.getId(), item]));

    const kept: Experience[] = [];

    for (const item of experiences) {
      // Una id que no es de este usuario no existe: ni se actualiza ni se filtra su dueño.
      if (item.id && !own.has(item.id)) throw new NotFoundExperienceException();

      kept.push(
        item.id
          ? await this.replace(own, item)
          : await this.create(userId, item),
      );
    }

    const keptIds = new Set(kept.map((item) => item.getId()));
    for (const row of existing) {
      if (!keptIds.has(row.getId())) await this.repository.delete(row.getId());
    }

    return kept;
  }

  private async replace(
    own: Map<string, Experience>,
    item: ExperienceSyncItem,
  ): Promise<Experience> {
    const experience = own.get(item.id!)!;

    experience.setType(item.type);
    experience.setTitle(item.title);
    experience.setInstitutionOrCompany(item.institutionOrCompany);
    experience.setStartYear(item.startYear);
    experience.setEndYear(item.endYear ?? null);
    experience.setDescription(item.description ?? null);
    experience.setIsCurrent(item.isCurrent ?? false);

    await this.repository.update(experience);
    return experience;
  }

  private async create(
    userId: string,
    item: ExperienceSyncItem,
  ): Promise<Experience> {
    const experience = new Experience({
      id: this.idGenerator.create(),
      userId,
      type: item.type,
      title: item.title,
      institutionOrCompany: item.institutionOrCompany,
      startYear: item.startYear,
      endYear: item.endYear ?? null,
      description: item.description ?? null,
      isCurrent: item.isCurrent ?? false,
    });

    await this.repository.save(experience);
    return experience;
  }
}
