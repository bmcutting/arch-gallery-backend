import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryRequest {
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Urbanismo',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Id del proyecto asociado a la categoría creada',
    example: '22d468e9-f816-40ae-9d86-b95a75edc524',
  })
  @IsString()
  @IsNotEmpty()
  projectId: string;
}
