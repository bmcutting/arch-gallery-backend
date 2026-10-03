import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

// `unaccent` la necesita `WhereUtils.ilikeUnaccent`, que usan los filtros de
// project, user y category: sin la extensión esas búsquedas responden 500.
const EXTENSIONS = ['unaccent'];

@Injectable()
export class DatabaseExtensionsService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseExtensionsService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit(): Promise<void> {
    for (const extension of EXTENSIONS) {
      try {
        await this.dataSource.query(
          `CREATE EXTENSION IF NOT EXISTS "${extension}"`,
        );
        this.logger.log(`Extensión ${extension} disponible`);
      } catch (error) {
        // Sin romper el arranque: la app sigue sirviendo todo lo que no sea
        // búsqueda, y crear extensiones puede requerir permisos que no tenga.
        this.logger.warn(
          `No se pudo crear la extensión ${extension}, las búsquedas por texto fallarán: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }
  }
}
