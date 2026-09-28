import { describe, it, expect, beforeAll } from 'vitest';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { APP_FILTER } from '@nestjs/core';
import { DomainExceptionFilter } from 'src/shared/infrastructure/nest/filters/domain-exception.filter';
import { Global, Module } from '@nestjs/common';

import { SharedModule } from 'src/shared/shared.module';
import { CategoryModule } from 'src/category/category.module';
import { ProjectModule } from 'src/project/project.module';
import { UserModule } from 'src/user/user.module';
import { CommentModule } from 'src/comment/comment.module';
import { LikeModule } from 'src/like/like.module';

import { CategoryModel } from 'src/category/infrastructure/typeorm/models/category';
import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user';
import { CommentModel } from 'src/comment/infrastructure/typeorm/models/comment';
import { LikeModel } from 'src/like/infrastructure/typeorm/models/like';
import { SkillModel } from 'src/user/infrastructure/typeorm/models/skill';
import { ExperienceModel } from 'src/user/infrastructure/typeorm/models/experience';

import { TransactionExecutor } from 'src/shared/infrastructure/typeorm/services/typeorm-transaction.executor';
import { UlidGenerator } from 'src/shared/infrastructure/services/ulid.generator';

const MODELS = [
  CategoryModel,
  ProjectModel,
  UserModel,
  CommentModel,
  LikeModel,
  SkillModel,
  ExperienceModel,
];

// En la app real `DataSource` lo provee TypeOrmCoreModule, que es @Global.
// Aqui se replica esa forma para poder resolver TransactionExecutor sin base de datos.
@Global()
@Module({
  providers: [{ provide: DataSource, useValue: {} }],
  exports: [DataSource],
})
class FakeDataSourceModule {}

async function compile(...modules: unknown[]) {
  let builder = Test.createTestingModule({
    imports: [FakeDataSourceModule, SharedModule, ...(modules as never[])],
  });
  for (const model of MODELS) {
    builder = builder.overrideProvider(getRepositoryToken(model)).useValue({});
  }
  return builder.compile();
}

// nest build NO detecta un UnknownDependenciesException: es error de arranque,
// no de compilación. Este test cubre ese hueco.
describe('grafo de inyección de dependencias', () => {
  // EnvService usa getOrThrow, así que UserModule no se instancia sin estas variables.
  beforeAll(() => {
    process.env.DATABASE_NAME ??= 'test';
    process.env.DATABASE_USERNAME ??= 'test';
    process.env.DATABASE_PASSWORD ??= 'test';
    process.env.DATABASE_PORT ??= '5432';
    process.env.DATABASE_HOST ??= 'localhost';
    process.env.TOKEN_SECRET_WORD ??= 'test';
    process.env.REFRESH_SECRET_WORD ??= 'test';
  });
  it.each([
    ['CategoryModule', CategoryModule],
    ['ProjectModule', ProjectModule],
    ['UserModule', UserModule],
    ['CommentModule', CommentModule],
    ['LikeModule', LikeModule],
  ])('%s resuelve sus dependencias', async (_name, module) => {
    const ref = await compile(module);
    await ref.close();
  });

  it('SharedModule provee el ejecutor de transacciones y el generador de ids', async () => {
    const ref = await compile();

    expect(ref.get(TransactionExecutor)).toBeInstanceOf(TransactionExecutor);
    expect(ref.get(UlidGenerator)).toBeInstanceOf(UlidGenerator);
    await ref.close();
  });

  // Los enhancers APP_* no se recuperan con ref.get(), así que se comprueba la
  // declaración: si alguien quita el filtro global, toda DomainException pasa a 500.
  it('SharedModule declara el filtro de excepciones de dominio como APP_FILTER', () => {
    const providers = Reflect.getMetadata('providers', SharedModule) as {
      provide?: unknown;
      useClass?: unknown;
    }[];

    expect(providers).toContainEqual({
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    });
  });
});
