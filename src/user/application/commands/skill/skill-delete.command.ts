import { Command } from 'src/shared/application/interfaces/command.interface';
import { UnitOfWork } from 'src/shared/domain/interfaces/unit-of-work';
import { SkillDelete } from 'src/user/domain/services/skill/skill-delete';

interface Props {
  id: string;
  currentUserId: string;
}

export class SkillDeleteCommand implements Command<Props, void> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly service: SkillDelete,
  ) {}

  // Borrar la fila de catalogo y sus filas de join son dos tablas.
  async execute({ id, currentUserId }: Props): Promise<void> {
    await this.unitOfWork.run({
      work: async () => {
        await this.service.execute({ id, ownerId: currentUserId });
      },
    });
  }
}
