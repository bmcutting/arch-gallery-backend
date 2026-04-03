import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Experience } from 'src/user/domain/entities/experience.entity';
import { Skill } from 'src/user/domain/entities/skill.entity';

export class UpdateUserRequest {
  userId: string;

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

  @ApiPropertyOptional({ description: 'Hanilidades que domina el usuario' })
  @IsOptional()
  @IsArray()
  skills?: Skill[];

  @ApiPropertyOptional({
    description: 'Experiencia estudiantil o profesional del usuario',
  })
  @IsOptional()
  @IsArray()
  experiences?: Experience[];
}
