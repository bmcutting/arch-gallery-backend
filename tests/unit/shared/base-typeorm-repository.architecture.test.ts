import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as ts from 'typescript';

const SRC = join(process.cwd(), 'src');

/**
 * Repositorios que todavía no se han migrado a `BaseTypeOrmRepository`.
 * Cada fase de módulo debe borrar su entrada. La comparación es por igualdad
 * exacta, así que la lista tampoco puede quedarse con entradas obsoletas.
 *
 * Ojo: el resto de repositorios (`infrastructure/typeorm/repository/project.ts`
 * y compañía) todavía no casan con el patrón `*.repository.ts`; entrarán en el
 * radar de este test cuando las fases de módulo apliquen el renombrado.
 */
const PENDING_MIGRATION: string[] = [];

function repositoryFiles(): string[] {
  return readdirSync(SRC, { recursive: true })
    .map(String)
    .map((file) => file.replaceAll('\\', '/'))
    .filter((file) => file.includes('infrastructure/typeorm/'))
    .filter((file) => file.endsWith('.repository.ts'));
}

function classesNotExtendingBase(file: string): string[] {
  const source = ts.createSourceFile(
    file,
    readFileSync(join(SRC, file), 'utf8'),
    ts.ScriptTarget.Latest,
  );

  const offenders: string[] = [];

  source.forEachChild((node) => {
    if (!ts.isClassDeclaration(node) || !node.name) return;

    const isAbstract = node.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.AbstractKeyword,
    );
    if (isAbstract) return;

    const extendsBase = node.heritageClauses?.some(
      (clause) =>
        clause.token === ts.SyntaxKind.ExtendsKeyword &&
        clause.types.some(
          (type) =>
            ts.isIdentifier(type.expression) &&
            type.expression.text === 'BaseTypeOrmRepository',
        ),
    );

    if (!extendsBase) offenders.push(file);
  });

  return offenders;
}

describe('arquitectura de repositorios TypeORM', () => {
  it('encuentra repositorios que inspeccionar', () => {
    expect(repositoryFiles().length).toBeGreaterThan(0);
  });

  it('solo los pendientes declarados dejan de extender BaseTypeOrmRepository', () => {
    const offenders = repositoryFiles().flatMap(classesNotExtendingBase);

    expect([...new Set(offenders)].sort()).toEqual(
      [...PENDING_MIGRATION].sort(),
    );
  });
});
