import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class SortOptionRequest<TFields extends string = string> {
  @ApiProperty({
    description: 'Campo por el cual ordenar',
    example: 'email',
  })
  @IsString()
  field: TFields;

  @ApiProperty({
    description: 'Dirección del orden: ASC = ascendente, DESC = descendente',
    enum: SortDirection,
    example: SortDirection.ASC,
  })
  @IsEnum(SortDirection)
  direction: SortDirection;
}
