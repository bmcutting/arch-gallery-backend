import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

/**
 * Estrategia de nombres del esquema.
 *
 * - Clases y propiedades a snake_case (`createdAt` -> `created_at`).
 * - Quita el sufijo `Model` para derivar el nombre de tabla
 *   (`UserModel` -> `user`). Sin esto, `SnakeNamingStrategy` daria `user_model`.
 *
 * Un `@Entity({ name: '...' })` explicito sigue ganando, pero en este proyecto
 * ninguno lo declara: todos los nombres se derivan.
 */
export class AppNamingStrategy extends SnakeNamingStrategy {
  tableName(className: string, customName: string): string {
    if (customName) {
      return customName;
    }

    const nameWithoutModel = className.endsWith('Model')
      ? className.slice(0, -5)
      : className;

    return super.tableName(nameWithoutModel, customName);
  }
}
