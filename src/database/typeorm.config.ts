import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AppNamingStrategy } from './naming.strategy';
import { resolveEnvFilePath } from '../env/env-file';

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

/**
 * Construye el DataSource. Tiene dos consumidores:
 *   1. La CLI de TypeORM, via el `export default` de abajo.
 *   2. El runtime de Nest (`DatabaseModule`), pasandole la conexion desde `EnvService`.
 *
 * Los globs usan `__dirname` para resolver a `.ts` con ts-node y a `.js` en
 * `dist` sin cambiar nada.
 */
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
    entities: [__dirname + '/../**/*.model{.ts,.js}'],
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
