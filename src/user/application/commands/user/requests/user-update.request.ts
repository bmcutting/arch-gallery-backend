import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserSkillUpdateItemRequest } from '../../skill/requests/user-skill-update.request';
import { ExperienceSyncItemRequest } from '../../experience/requests/experience-sync-item.request';

export class UserUpdateRequest {
  @ApiPropertyOptional({ description: 'Correo electrónico del usuario' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Nombre de usuario' })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiPropertyOptional({ description: 'Nombre' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Apellido' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ description: 'Número de teléfono' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'Biografía' })
  @IsOptional()
  @IsString()
  shortBio?: string;

  @ApiPropertyOptional({ description: 'Biografía extendida' })
  @IsOptional()
  @IsString()
  longBio?: string;

  @ApiPropertyOptional({ description: 'URL de la imagen de perfil' })
  @IsOptional()
  @IsString()
  profileImageUrl?: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen de portada del perfil',
  })
  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @ApiPropertyOptional({ description: 'Sitio web personal' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ description: 'Ubicación' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Años de experiencia' })
  @IsOptional()
  @IsNumber()
  experienceYears?: number;

  @ApiPropertyOptional({ description: 'Especialización' })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiPropertyOptional({ description: 'Enlace al perfil de Instagram' })
  @IsOptional()
  @IsString()
  instagramUrl?: string;

  @ApiPropertyOptional({ description: 'Enlace al perfil de Twitter/X' })
  @IsOptional()
  @IsString()
  twitterUrl?: string;

  @ApiPropertyOptional({ description: 'Enlace al perfil de LinkedIn' })
  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @ApiPropertyOptional({ description: 'Idiomas que domina el usuario' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiPropertyOptional({
    description:
      'Conjunto completo de habilidades: lo que no venga se elimina. Cada elemento lleva ' +
      '`id` del catálogo o `name` para crearla.',
    type: [UserSkillUpdateItemRequest],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserSkillUpdateItemRequest)
  skills?: UserSkillUpdateItemRequest[];

  @ApiPropertyOptional({
    description:
      'Conjunto completo de experiencias: lo que no venga se elimina. Con `id` actualiza una ' +
      'tuya, sin `id` la crea.',
    type: [ExperienceSyncItemRequest],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceSyncItemRequest)
  experiences?: ExperienceSyncItemRequest[];
}
