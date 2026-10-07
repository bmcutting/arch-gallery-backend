import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import type { App } from 'supertest/types';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from 'src/app/app.module';
import { SafeValidationPipe } from 'src/shared/infrastructure/nest/pipes/safe-validation.pipe';

/**
 * Lo que solo un test contra la base demuestra: que dos usuarios pueden tener la misma skill
 * sin quitársela, que era el bug que esta fase existe para matar.
 *
 * Los tests comparten estado y corren en orden.
 */
describe('Skills de usuario (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  const server = (): App => app.getHttpServer() as App;

  const unique = Date.now();
  const SKILL_NAME = `Revit${unique}`;

  interface Account {
    id: string;
    email: string;
    password: string;
    token: string;
  }

  const accounts: Record<'a' | 'b', Account> = {
    a: {
      id: '',
      email: `skills-${unique}-a@test.com`,
      password: 'password123',
      token: '',
    },
    b: {
      id: '',
      email: `skills-${unique}-b@test.com`,
      password: 'password123',
      token: '',
    },
  };

  // Id de catalogo de la skill privada de cada uno, y de una global cualquiera.
  let privateSkillIdA = '';
  let privateSkillIdB = '';
  let globalSkillId = '';

  async function register(tag: 'a' | 'b'): Promise<void> {
    const account = accounts[tag];

    const registered = await request(server())
      .post('/auth/register')
      .send({
        email: account.email,
        password: account.password,
        firstName: tag.toUpperCase(),
        lastName: 'Skills',
        userName: `skills${unique}${tag}`,
      })
      .expect(201);

    account.id = (registered.body as { id: string }).id;

    const logged = await request(server())
      .post('/auth/login')
      .send({ email: account.email, password: account.password })
      .expect(201);

    account.token = (logged.body as { access_token: string }).access_token;
  }

  beforeAll(async () => {
    process.env.LOG_LEVEL = 'silent';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new SafeValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
    dataSource = app.get(DataSource);

    await register('a');
    await register('b');
  }, 60_000);

  afterAll(async () => {
    // Las filas de catalogo van antes que el usuario: `created_by_id` las ata a el.
    for (const account of Object.values(accounts)) {
      if (!account.id) continue;
      await dataSource.query('DELETE FROM user_skill WHERE user_id = $1', [
        account.id,
      ]);
      await dataSource.query('DELETE FROM skill WHERE created_by_id = $1', [
        account.id,
      ]);
      await dataSource.query('DELETE FROM experience WHERE user_id = $1', [
        account.id,
      ]);
      await dataSource.query('DELETE FROM "user" WHERE id = $1', [account.id]);
    }
    await app?.close();
  });

  it('el catalogo sembrado se busca y viene paginado', async () => {
    const response = await request(server())
      .get('/skills')
      .query({ name: 'revit' })
      .set('Authorization', `Bearer ${accounts.a.token}`)
      .expect(200);

    const body = response.body as {
      items: { id: string; name: string; scope: string }[];
      totalItems: number;
      totalPages: number;
      limit: number;
      hasNextPage: boolean;
    };

    expect(body.totalPages).toBeDefined();
    expect(body.items.length).toBeGreaterThan(0);
    expect(body.items[0].scope).toBe('global');

    globalSkillId = body.items[0].id;
  });

  // El JS borraba los no-ASCII y el SQL los transcribia, asi que no casaban nunca.
  it('la busqueda con acento devuelve resultados', async () => {
    const response = await request(server())
      .get('/skills')
      .query({ name: 'diseño' })
      .set('Authorization', `Bearer ${accounts.a.token}`)
      .expect(200);

    const body = response.body as { items: unknown[] };
    expect(body.items.length).toBeGreaterThan(0);
  });

  it('A fija sus skills: una nueva y una del catalogo', async () => {
    const response = await request(server())
      .patch('/users/me/skills')
      .set('Authorization', `Bearer ${accounts.a.token}`)
      .send({
        skills: [
          { name: SKILL_NAME, level: 'advanced' },
          { id: globalSkillId, level: 'expert' },
        ],
      })
      .expect(200);

    const body = response.body as {
      skillId: string;
      name: string;
      level: string;
    }[];
    expect(body).toHaveLength(2);

    const mine = body.find((item) => item.name === SKILL_NAME);
    expect(mine).toBeDefined();
    privateSkillIdA = mine!.skillId;
  });

  it('B escribe el MISMO nombre y A no pierde la suya', async () => {
    const response = await request(server())
      .patch('/users/me/skills')
      .set('Authorization', `Bearer ${accounts.b.token}`)
      .send({ skills: [{ name: SKILL_NAME, level: 'beginner' }] })
      .expect(200);

    const body = response.body as { skillId: string; name: string }[];
    privateSkillIdB = body[0].skillId;

    // Filas de catalogo distintas: ninguna se reasigna.
    expect(privateSkillIdB).not.toBe(privateSkillIdA);
  });

  it('cada uno conserva su skill con SU nivel', async () => {
    for (const [tag, expected] of [
      ['a', 'advanced'],
      ['b', 'beginner'],
    ] as const) {
      const response = await request(server())
        .get('/users/me')
        .set('Authorization', `Bearer ${accounts[tag].token}`)
        .expect(200);

      const body = response.body as {
        skills: { skillId: string; name: string; level: string | null }[];
      };
      const found = body.skills.find((skill) => skill.name === SKILL_NAME);

      expect(found).toBeDefined();
      expect(found!.level).toBe(expected);
    }
  });

  it('la respuesta trae las dos ids: la asociacion y el catalogo', async () => {
    const response = await request(server())
      .get('/users/me')
      .set('Authorization', `Bearer ${accounts.a.token}`)
      .expect(200);

    const body = response.body as {
      skills: { id: string; skillId: string; scope: string }[];
    };

    expect(body.skills[0].id).toBeDefined();
    expect(body.skills[0].skillId).toBeDefined();
    expect(body.skills[0].id).not.toBe(body.skills[0].skillId);
    expect(body.skills[0].scope).toBeDefined();
  });

  it('B no puede referenciar la skill privada de A, y da el mismo 404 que una id inventada', async () => {
    const stolen = await request(server())
      .patch('/users/me/skills')
      .set('Authorization', `Bearer ${accounts.b.token}`)
      .send({ skills: [{ id: privateSkillIdA }] })
      .expect(404);

    const ghost = await request(server())
      .patch('/users/me/skills')
      .set('Authorization', `Bearer ${accounts.b.token}`)
      .send({ skills: [{ id: '01JA0000000000000000000000' }] })
      .expect(404);

    expect((stolen.body as { message: string }).message).toBe(
      'skill-not-found',
    );
    expect((ghost.body as { message: string }).message).toBe('skill-not-found');
  });

  it('pedir la misma skill dos veces en una peticion es un 400', async () => {
    const response = await request(server())
      .patch('/users/me/skills')
      .set('Authorization', `Bearer ${accounts.a.token}`)
      .send({ skills: [{ name: SKILL_NAME }, { id: privateSkillIdA }] })
      .expect(400);

    expect((response.body as { message: string }).message).toBe(
      'user-skill-duplicate',
    );
  });

  it('el PATCH es el conjunto completo: lo que no viene se borra', async () => {
    const response = await request(server())
      .patch('/users/me/skills')
      .set('Authorization', `Bearer ${accounts.a.token}`)
      .send({ skills: [] })
      .expect(200);

    expect(response.body).toEqual([]);
  });

  it('las rutas viejas de skill ya no existen', async () => {
    await request(server())
      .post('/skills')
      .set('Authorization', `Bearer ${accounts.a.token}`)
      .send({ name: 'colada' })
      .expect(404);

    await request(server())
      .patch(`/skills/${globalSkillId}`)
      .set('Authorization', `Bearer ${accounts.a.token}`)
      .send({ name: 'colada' })
      .expect(404);
  });

  it('PATCH /users/:id acepta skills, pero solo como referencia', async () => {
    const ok = await request(server())
      .patch(`/users/${accounts.a.id}`)
      .set('Authorization', `Bearer ${accounts.a.token}`)
      .send({ skills: [{ name: SKILL_NAME, level: 'advanced' }] })
      .expect(200);

    const body = ok.body as { skills: { name: string }[] };
    expect(body.skills).toHaveLength(1);
    expect(body.skills[0].name).toBe(SKILL_NAME);

    // Un elemento sin `id` ni `name` no es una referencia valida.
    await request(server())
      .patch(`/users/${accounts.a.id}`)
      .set('Authorization', `Bearer ${accounts.a.token}`)
      .send({ skills: [{ level: 'advanced' }] })
      .expect(400);
  });

  it('B borra su skill privada y desaparece de su perfil', async () => {
    await request(server())
      .delete(`/skills/${privateSkillIdB}`)
      .set('Authorization', `Bearer ${accounts.b.token}`)
      .expect(200);

    const profile = await request(server())
      .get('/users/me')
      .set('Authorization', `Bearer ${accounts.b.token}`)
      .expect(200);

    const body = profile.body as { skills: { name: string }[] };
    expect(
      body.skills.find((skill) => skill.name === SKILL_NAME),
    ).toBeUndefined();
  });

  it('nadie puede borrar una fila global del catalogo', async () => {
    await request(server())
      .delete(`/skills/${globalSkillId}`)
      .set('Authorization', `Bearer ${accounts.a.token}`)
      .expect(404);
  });
  it('GET /users/me/skills lista las mias, filtrando y ordenando', async () => {
    await request(server())
      .patch('/users/me/skills')
      .set('Authorization', `Bearer ${accounts.a.token}`)
      .send({
        skills: [
          { name: SKILL_NAME, level: 'advanced' },
          { id: globalSkillId, level: 'beginner' },
        ],
      })
      .expect(200);

    const all = await request(server())
      .get('/users/me/skills')
      .set('Authorization', `Bearer ${accounts.a.token}`)
      .expect(200);

    const body = all.body as {
      items: {
        id: string;
        skillId: string;
        name: string;
        scope: string;
        level: string;
      }[];
      totalItems: number;
    };

    expect(body.totalItems).toBe(2);
    // Las dos ids: la de la asociacion y la del catalogo.
    expect(body.items[0].id).toBeDefined();
    expect(body.items[0].skillId).toBeDefined();
    expect(body.items[0].id).not.toBe(body.items[0].skillId);

    const onlyPrivate = await request(server())
      .get('/users/me/skills')
      .query({ scope: 'private' })
      .set('Authorization', `Bearer ${accounts.a.token}`)
      .expect(200);

    const privateBody = onlyPrivate.body as { items: { scope: string }[] };
    expect(privateBody.items).toHaveLength(1);
    expect(privateBody.items[0].scope).toBe('private');

    const byLevel = await request(server())
      .get('/users/me/skills')
      .query({ level: 'beginner' })
      .set('Authorization', `Bearer ${accounts.a.token}`)
      .expect(200);

    expect((byLevel.body as { items: unknown[] }).items).toHaveLength(1);
  });

  it('GET /experiences/me lista las mias y filtra por tipo', async () => {
    const created = await request(server())
      .post('/experiences')
      .set('Authorization', `Bearer ${accounts.b.token}`)
      .send({
        type: 'work',
        title: 'Titulo original',
        institutionOrCompany: 'Estudio',
        startYear: 2020,
      })
      .expect(201);

    // El POST devuelve el recurso, no un {id}.
    const body = created.body as { id: string; title: string; type: string };
    expect(body.title).toBe('Titulo original');

    const mine = await request(server())
      .get('/experiences/me')
      .query({ type: 'work' })
      .set('Authorization', `Bearer ${accounts.b.token}`)
      .expect(200);

    expect((mine.body as { totalItems: number }).totalItems).toBeGreaterThan(0);

    const other = await request(server())
      .get('/experiences/me')
      .query({ type: 'education' })
      .set('Authorization', `Bearer ${accounts.b.token}`)
      .expect(200);

    expect((other.body as { totalItems: number }).totalItems).toBe(0);

    // Y el PATCH devuelve la experiencia actualizada, no un {success}.
    const updated = await request(server())
      .patch(`/experiences/${body.id}`)
      .set('Authorization', `Bearer ${accounts.b.token}`)
      .send({ title: 'Titulo CAMBIADO' })
      .expect(200);

    expect((updated.body as { title: string }).title).toBe('Titulo CAMBIADO');
  });

  it('PATCH /users/:id devuelve el usuario y acepta skills y experiencias', async () => {
    const response = await request(server())
      .patch(`/users/${accounts.a.id}`)
      .set('Authorization', `Bearer ${accounts.a.token}`)
      .send({
        location: 'Madrid',
        skills: [{ name: SKILL_NAME, level: 'expert' }],
        experiences: [
          {
            type: 'education',
            title: 'Master',
            institutionOrCompany: 'ETSAM',
            startYear: 2015,
          },
        ],
      })
      .expect(200);

    const body = response.body as {
      location: string;
      skills: { name: string; level: string }[];
      experiences: { title: string }[];
    };

    expect(body.location).toBe('Madrid');
    expect(body.skills).toHaveLength(1);
    expect(body.skills[0].level).toBe('expert');
    expect(body.experiences).toHaveLength(1);
    expect(body.experiences[0].title).toBe('Master');
  });

  // El @Patch(':id') declarado antes capturaba esta ruta como un update con id='change-password'.
  it('PATCH /users/change-password no la captura el @Patch(:id)', async () => {
    const wrong = await request(server())
      .patch('/users/change-password')
      .set('Authorization', `Bearer ${accounts.b.token}`)
      .send({ oldPassword: 'noesesta', password: 'otraClave123' })
      .expect(409);

    expect((wrong.body as { message: string }).message).toBe(
      'not-equal-passwords',
    );

    await request(server())
      .patch('/users/change-password')
      .set('Authorization', `Bearer ${accounts.b.token}`)
      .send({ oldPassword: accounts.b.password, password: 'otraClave123' })
      .expect(200);

    await request(server())
      .post('/auth/login')
      .send({ email: accounts.b.email, password: 'otraClave123' })
      .expect(201);

    await request(server())
      .post('/auth/login')
      .send({ email: accounts.b.email, password: accounts.b.password })
      .expect(401);
  });
});
