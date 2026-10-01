import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import type { App } from 'supertest/types';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from 'src/app/app.module';
import { SafeValidationPipe } from 'src/shared/infrastructure/nest/pipes/safe-validation.pipe';

/**
 * Levanta la app contra la base de datos local: que un usuario desactivado deje
 * de entrar no se puede demostrar con dobles.
 *
 * Los tests comparten estado y corren en orden.
 */
describe('Autenticación (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  // `getHttpServer()` devuelve `any`; se tipa una vez aquí.
  const server = (): App => app.getHttpServer() as App;

  const unique = Date.now();
  const credentials = {
    email: `e2e-${unique}@test.com`,
    password: 'password123',
    firstName: 'E2E',
    lastName: 'Test',
    userName: `e2e${unique}`,
  };

  let userId: string;
  let accessToken: string;
  let refreshToken: string;
  let rotatedRefreshToken: string;

  const decodePayload = (token: string): Record<string, unknown> =>
    JSON.parse(
      Buffer.from(token.split('.')[1], 'base64url').toString(),
    ) as Record<string, unknown>;

  beforeAll(async () => {
    // Para que el log de Pino no ahogue la salida del test.
    process.env.LOG_LEVEL = 'silent';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    // Los mismos pipes que `main.ts`, o la validación no sería la real.
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
  }, 60_000);

  afterAll(async () => {
    // Los refresh tokens caen con el usuario por el ON DELETE CASCADE.
    if (userId) {
      await dataSource.query('DELETE FROM "user" WHERE id = $1', [userId]);
    }
    await app?.close();
  });

  it('registra al usuario', async () => {
    const response = await request(server())
      .post('/auth/register')
      .send(credentials)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    userId = (response.body as { id: string }).id;
    expect(userId).toHaveLength(26);
  });

  it('rechaza el registro repetido', async () => {
    await request(server())
      .post('/auth/register')
      .send(credentials)
      .expect(409);
  });

  it('hace login y devuelve el par de tokens', async () => {
    const response = await request(server())
      .post('/auth/login')
      .send({ email: credentials.email, password: credentials.password })
      .expect(201);

    const body = response.body as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      token_type: string;
      user: { id: string };
    };

    expect(body.token_type).toBe('Bearer');
    expect(body.expires_in).toBeGreaterThan(0);
    expect(body.user.id).toBe(userId);

    accessToken = body.access_token;
    refreshToken = body.refresh_token;
  });

  it('no mete nada más que el sujeto en el JWT', () => {
    expect(Object.keys(decodePayload(accessToken)).sort()).toEqual([
      'exp',
      'iat',
      'sub',
    ]);
    expect(decodePayload(accessToken).sub).toBe(userId);
  });

  it('devuelve invalid-credentials con la contraseña incorrecta', async () => {
    const response = await request(server())
      .post('/auth/login')
      .send({ email: credentials.email, password: 'password-incorrecta' })
      .expect(401);

    expect(response.body).toMatchObject({ message: 'invalid-credentials' });
  });

  it('devuelve invalid-credentials con un correo que no existe', async () => {
    // Mismo mensaje que con la contraseña mala: no filtrar qué correos existen.
    const response = await request(server())
      .post('/auth/login')
      .send({ email: `no-existe-${unique}@test.com`, password: 'password123' })
      .expect(401);

    expect(response.body).toMatchObject({ message: 'invalid-credentials' });
  });

  it('deja pasar una petición autenticada', async () => {
    await request(server())
      .get('/projects')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('rechaza sin token y con un token corrupto', async () => {
    const sinToken = await request(server()).get('/projects').expect(401);
    expect(sinToken.body).toMatchObject({ message: 'missing-token' });

    const corrupto = await request(server())
      .get('/projects')
      .set('Authorization', 'Bearer no.es.un.jwt')
      .expect(401);
    expect(corrupto.body).toMatchObject({ message: 'invalid-token' });
  });

  it('deja el healthcheck público', async () => {
    const response = await request(server()).get('/healthcheck').expect(200);

    expect(response.body).toMatchObject({ status: 'ok' });
    expect(response.headers['x-request-id']).toHaveLength(26);
  });

  it('rota el par de tokens en el refresh', async () => {
    const response = await request(server())
      .post('/auth/refresh')
      .send({ refresh_token: refreshToken })
      .expect(201);

    const body = response.body as {
      access_token: string;
      refresh_token: string;
    };

    expect(body.refresh_token).not.toBe(refreshToken);
    expect(decodePayload(body.access_token).sub).toBe(userId);

    rotatedRefreshToken = body.refresh_token;
  });

  it('invalida el refresh token ya usado', async () => {
    const response = await request(server())
      .post('/auth/refresh')
      .send({ refresh_token: refreshToken })
      .expect(401);

    expect(response.body).toMatchObject({ message: 'invalid-refresh-token' });
  });

  it('deja rotar solo a uno de dos refresh concurrentes', async () => {
    // La validacion corre fuera de la transaccion, asi que los dos la pasan.
    // Lo que lo cierra es que la revocacion filtra por `is_revoked`.
    const login = await request(server())
      .post('/auth/login')
      .send({ email: credentials.email, password: credentials.password })
      .expect(201);

    const token = (login.body as { refresh_token: string }).refresh_token;

    const responses = await Promise.all([
      request(server()).post('/auth/refresh').send({ refresh_token: token }),
      request(server()).post('/auth/refresh').send({ refresh_token: token }),
    ]);

    const statuses = responses.map((r) => r.status).sort();
    expect(statuses).toEqual([201, 401]);
  });

  it('revoca el refresh token en el logout', async () => {
    await request(server())
      .post('/auth/logout')
      .send({ refresh_token: rotatedRefreshToken })
      .expect(201);

    const response = await request(server())
      .post('/auth/refresh')
      .send({ refresh_token: rotatedRefreshToken })
      .expect(401);

    expect(response.body).toMatchObject({ message: 'invalid-refresh-token' });
  });

  it('corta el acceso en cuanto se desactiva al usuario', async () => {
    // El agujero que cierra esta fase: el access token sigue siendo válido de
    // firma y sin caducar, lo único que cambia es una fila de la base de datos.
    await request(server())
      .get('/projects')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    await dataSource.query(
      'UPDATE "user" SET is_active = false WHERE id = $1',
      [userId],
    );

    const response = await request(server())
      .get('/projects')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(401);

    expect(response.body).toMatchObject({ message: 'invalid-token' });
  });
});
