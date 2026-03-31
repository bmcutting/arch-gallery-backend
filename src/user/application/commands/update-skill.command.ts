import { Command } from 'src/shared/interfaces/command.interface';
import { SkillRepository } from 'src/user/domain/repositories/skill.repository';
import { UpdateSkillResponse } from './responses/update-skill.response';
import { NotFoundSkillException } from 'src/user/domain/exceptions/skill';
import { UpdateSkill } from 'src/user/domain/services/skill-update';
import { UpdateSkillRequest } from './requests/update-skill.request';

interface UpdateSkillProps {
  request: UpdateSkillRequest;
}

export class UpdateSkillCommand implements Command<
  UpdateSkillProps,
  UpdateSkillResponse
> {
  constructor(
    private readonly skillRepository: SkillRepository,
    private readonly updateSkillService: UpdateSkill,
  ) {}

  async execute(props: UpdateSkillProps): Promise<UpdateSkillResponse> {
    const skill = await this.skillRepository.findById(props.request.skillId);
    if (!skill) {
      throw new NotFoundSkillException();
    }

    await this.updateSkillService.execute(skill, {
      name: props.request.name,
      level: props.request.level,
    });

    return { success: true };
  }
}
