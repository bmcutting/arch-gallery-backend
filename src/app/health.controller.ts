import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HEALTHCHECK_PATH } from 'src/shared/infrastructure/logging/logger.config';

@ApiTags('Health')
@Controller(HEALTHCHECK_PATH)
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Comprobar que la API responde' })
  @ApiResponse({ status: 200, description: 'La API esta viva' })
  check(): { status: string; timestamp: string } {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
