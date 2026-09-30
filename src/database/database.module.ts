import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EnvService } from 'src/env/services/env';
import { createDataSource } from './typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        ...createDataSource({
          host: env.DB_HOST,
          port: env.DB_PORT,
          username: env.DB_USERNAME,
          password: env.DB_PASSWORD,
          database: env.DB_NAME,
          ssl: env.DB_SSL
            ? { rejectUnauthorized: env.DB_SSL_REJECT_UNAUTHORIZED }
            : false,
        }).options,
        // Las migraciones no salen del DataSource: las aplica onModuleInit
        // segun DB_RUN_MIGRATIONS, con control explicito y log.
        migrationsRun: false,
        synchronize: env.DB_SYNCHRONIZE,
        dropSchema: env.DB_DROP_SCHEMA,
      }),
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly env: EnvService,
  ) {}

  async onModuleInit() {
    if (!this.env.DB_RUN_MIGRATIONS) {
      return;
    }

    const migrations = await this.dataSource.runMigrations();
    if (migrations.length > 0) {
      this.logger.log(
        `Ejecutadas ${migrations.length} migracion(es): ${migrations
          .map((m) => m.name)
          .join(', ')}`,
      );
    } else {
      this.logger.log('No hay migraciones pendientes');
    }
  }
}
