import {
  DataSource,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { TypeOrmUnitOfWork } from '../services/typeorm-unit-of-work';

export abstract class BaseTypeOrmRepository<Model extends ObjectLiteral> {
  protected constructor(
    private readonly dataSource: DataSource,
    private readonly unitOfWork: TypeOrmUnitOfWork,
    private readonly target: EntityTarget<Model>,
  ) {}

  protected get repository(): Repository<Model> {
    const manager: EntityManager | null = this.unitOfWork.getManagerIfActive();

    return manager
      ? manager.getRepository(this.target)
      : this.dataSource.getRepository(this.target);
  }
}
