import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { createDataSource } from '../database/typeorm.config';
import { resolveEnvFilePath } from '../env/env-file';
import { MainSeeder } from './main.seeder';
import { UserFactory } from './user.factory';
import { ProjectFactory } from './project.factory';
import { LikeFactory } from './like.factory';
import { CategoryFactory } from './category.factory';
import { CommentFactory } from './comment.factory';
import { ExperienceFactory } from './experience.factory';

config({ path: resolveEnvFilePath() });

const toBool = (value?: string): boolean => value === 'true';

// Mismo DataSource que el runtime: misma naming strategy y mismas entidades por
// glob. Antes tenia el suyo propio, con lo que sembraba sobre un esquema
// paralelo con los nombres por defecto.
const base = createDataSource({
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  ssl: toBool(process.env.DB_SSL)
    ? { rejectUnauthorized: toBool(process.env.DB_SSL_REJECT_UNAUTHORIZED) }
    : false,
});

const dropSchema = toBool(process.env.DB_DROP_SCHEMA);

const options: DataSourceOptions & SeederOptions = {
  ...base.options,
  // Si se va a borrar el esquema, no sincronizar al abrir: con un esquema que ya derivo el
  // ALTER falla antes de llegar al drop, y el flag no sirve para nada.
  synchronize: dropSchema ? false : toBool(process.env.DB_SYNCHRONIZE),
  seeds: [MainSeeder],
  factories: [
    UserFactory,
    ProjectFactory,
    LikeFactory,
    CategoryFactory,
    CommentFactory,
    ExperienceFactory,
  ],
};

async function seed() {
  const dataSource = new DataSource(options);
  await dataSource.initialize();

  // Borrar el esquema es opt-in: antes `npm run seed` lo hacia siempre.
  if (dropSchema) {
    console.warn('DB_DROP_SCHEMA=true: recreando el esquema desde cero');
    await dataSource.synchronize(true);
  }

  await runSeeders(dataSource);
  await dataSource.destroy();
}

void seed();
