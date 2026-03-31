import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Skills')
@Controller('skills')
@ApiBearerAuth('JWT-auth')
export class SkillController {}
