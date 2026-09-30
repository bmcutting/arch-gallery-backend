import {
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  ValidationPipe,
} from '@nestjs/common';

@Injectable()
export class SafeValidationPipe extends ValidationPipe {
  private readonly logger = new Logger(SafeValidationPipe.name);

  async transform(
    value: unknown,
    metadata: ArgumentMetadata,
  ): Promise<unknown> {
    try {
      return await super.transform(value, metadata);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error({
        message: 'Request payload could not be transformed into a DTO',
        type: metadata.type,
        dto: metadata.metatype?.name,
        error: error instanceof Error ? error.message : String(error),
      });

      throw new BadRequestException('Malformed request payload');
    }
  }
}
