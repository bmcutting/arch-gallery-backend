import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ArgumentMetadata,
  BadRequestException,
  ForbiddenException,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { IsString } from 'class-validator';
import { SafeValidationPipe } from 'src/shared/infrastructure/nest/pipes/safe-validation.pipe';

class SampleRequest {
  @IsString()
  name: string;
}

const metadata: ArgumentMetadata = {
  type: 'body',
  metatype: SampleRequest,
  data: undefined,
};

describe('SafeValidationPipe', () => {
  let pipe: SafeValidationPipe;
  let logError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    pipe = new SafeValidationPipe({ transform: true, whitelist: true });
    logError = vi
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => undefined);
  });

  it('deja pasar un payload valido', async () => {
    await expect(pipe.transform({ name: 'ok' }, metadata)).resolves.toEqual({
      name: 'ok',
    });
  });

  it('deja escapar la HttpException de una validacion fallida', async () => {
    // El 400 con el detalle de los campos lo produce ValidationPipe; la
    // subclase no debe reemplazarlo por su mensaje genérico.
    await expect(pipe.transform({ name: 42 }, metadata)).rejects.toThrow(
      BadRequestException,
    );
    expect(logError).not.toHaveBeenCalled();
  });

  it('deja escapar cualquier otra HttpException tal cual', async () => {
    const thrown = new ForbiddenException('nope');
    vi.spyOn(ValidationPipe.prototype, 'transform').mockRejectedValueOnce(
      thrown,
    );

    await expect(pipe.transform({}, metadata)).rejects.toBe(thrown);
    expect(logError).not.toHaveBeenCalled();
  });

  it('convierte en 400 un fallo de transform que no es HttpException', async () => {
    // Es el caso del body con una clave `constructor`: class-transformer
    // revienta antes de que corra ningun validador y eso escapaba como 500.
    vi.spyOn(ValidationPipe.prototype, 'transform').mockRejectedValueOnce(
      new TypeError('Cannot convert object to primitive value'),
    );

    await expect(pipe.transform({}, metadata)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('loguea el error original para que un bug propio siga siendo visible', async () => {
    vi.spyOn(ValidationPipe.prototype, 'transform').mockRejectedValueOnce(
      new TypeError('boom'),
    );

    await expect(pipe.transform({}, metadata)).rejects.toThrow(
      BadRequestException,
    );
    expect(logError).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'body',
        dto: 'SampleRequest',
        error: 'boom',
      }),
    );
  });
});
