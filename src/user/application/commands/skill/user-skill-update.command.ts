import { Command } from 'src/shared/application/interfaces/command.interface';
import { UnitOfWork } from 'src/shared/domain/interfaces/unit-of-work';
import { UserSkillSync } from 'src/user/domain/services/user-skill/user-skill-sync';
import { UserSkillResponse } from '../../queries/skill/responses/user-skill.response';
import { UserSkillResponseMapper } from '../../mappers/user-skill-response-mapper';
import { UserSkillUpdateRequest } from './requests/user-skill-update.request';

interface Props {
  request: UserSkillUpdateRequest;
  currentUserId: string;
}

export class UserSkillUpdateCommand implements Command<
  Props,
  UserSkillResponse[]
> {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly service: UserSkillSync,
  ) {}

  // Resolver el catalogo y reescribir el join son varias tablas: van en una transaccion.
  async execute({
    request,
    currentUserId,
  }: Props): Promise<UserSkillResponse[]> {
    return await this.unitOfWork.run({
      work: async () => {
        const userSkills = await this.service.execute({
          userId: currentUserId,
          skills: request.skills,
        });

        return UserSkillResponseMapper.toResponseList(userSkills);
      },
    });
  }
}
