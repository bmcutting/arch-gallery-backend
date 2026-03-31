import { Skill } from '../entities/skill.entity';
import { Level } from '../enums/level';

export interface SkillRepository {
  create(props: CreateSkillProps): Promise<string>;
  findById(id: string): Promise<Skill | null>;
  findByName(name: string): Promise<Skill[] | null>;
  findAll(userId: string): Promise<Skill[]>;
  update(skill: Skill): Promise<string>;
  delete(id: string): Promise<void>;
}

export interface CreateSkillProps {
  userId: string;
  name: string;
  level?: Level;
}
