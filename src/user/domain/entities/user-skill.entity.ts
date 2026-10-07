import { Level } from '../enums/level';
import { Skill } from './skill.entity';

export interface UserSkillProps {
  id: string;
  userId: string;
  skill: Skill;
  level: Level | null;
  createdAt?: Date;
}

export class UserSkill {
  readonly id: string;
  readonly createdAt: Date;
  userId: string;
  skill: Skill;
  level: Level | null;

  constructor(props: UserSkillProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.skill = props.skill;
    this.level = props.level;
    this.createdAt = props.createdAt ?? new Date();
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getSkillId(): string {
    return this.skill.getId();
  }

  getLevel(): Level | null {
    return this.level;
  }

  // Setters

  setLevel(level: Level | null): void {
    this.level = level;
  }
}
