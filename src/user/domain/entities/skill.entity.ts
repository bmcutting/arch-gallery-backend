import { Level } from '../enums/level';

export interface SkillProps {
  id: string;
  name: string;
  level?: Level;
}

export class Skill {
  readonly id: string;
  name: string;
  level?: Level;

  constructor(props: SkillProps) {
    this.id = props.id;
    this.name = props.name;
    this.level = props.level;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getLevel(): Level | undefined | null {
    return this.level;
  }

  // Setters
  setName(name: string): void {
    this.name = name;
  }

  setLevel(level: Level): void {
    this.level = level;
  }
}
