import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AppNamingStrategy } from './naming.strategy';
import { resolveEnvFilePath } from '../env/env-file';
import { CategoryModel } from 'src/category/infrastructure/typeorm/models/category.model';
import { CommentModel } from 'src/comment/infrastructure/typeorm/models/comment.model';
import { LikeModel } from 'src/like/infrastructure/typeorm/models/like.model';
import { ProjectModel } from 'src/project/infrastructure/typeorm/models/project.model';
import { RefreshTokenModel } from 'src/authentication/infrastructure/typeorm/models/refresh-token.model';
import { ExperienceModel } from 'src/user/infrastructure/typeorm/models/experience.model';
import { SkillModel } from 'src/user/infrastructure/typeorm/models/skill.model';
import { UserModel } from 'src/user/infrastructure/typeorm/models/user.model';

export const ENTITIES = [
  CategoryModel,
  CommentModel,
  ExperienceModel,
  LikeModel,
  ProjectModel,
  RefreshTokenModel,
  SkillModel,
  UserModel,
];

// Mismo fichero de entorno que carga EnvModule.
config({ path: resolveEnvFilePath() });

export interface DatabaseConnection {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: false | { rejectUnauthorized: boolean };
}

export function createDataSource(conn: DatabaseConnection): DataSource {
  const options: DataSourceOptions = {
    type: 'postgres',
    host: conn.host,
    port: conn.port,
    username: conn.username,
    password: conn.password,
    database: conn.database,
    ssl: conn.ssl,
    namingStrategy: new AppNamingStrategy(),
    entities: ENTITIES,
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    // La CLI nunca aplica migraciones al cargar el DataSource: las corre
    // `migration:run` o `DatabaseModule` en onModuleInit, con logging.
    migrationsRun: false,
    synchronize: false,
    logging: false,
  };

  return new DataSource(options);
}

const toBool = (value?: string): boolean => value === 'true';

const AppDataSource = createDataSource({
  host: process.env.DB_HOST as string,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  ssl: toBool(process.env.DB_SSL)
    ? { rejectUnauthorized: toBool(process.env.DB_SSL_REJECT_UNAUTHORIZED) }
    : false,
});

export default AppDataSource;
