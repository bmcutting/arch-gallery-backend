import { Command } from 'src/shared/interfaces/command.interface';
import { CreateSkillRequest } from './requests/create-skill.request';
import { SkillCreator } from 'src/user/domain/services/skill-create';
import { CreateSkillResponse } from './responses/create-skill.respone';

export class CreateSkillCommand implements Command<
  CreateSkillRequest,
  CreateSkillResponse
> {
  constructor(private readonly createSkillService: SkillCreator) {}

  async execute(props: CreateSkillRequest): Promise<CreateSkillResponse> {
    const skillId = await this.createSkillService.execute({
      name: props.name,
      level: props.level,
      userId: props.userId,
    });

    return { id: skillId };
  }
}
