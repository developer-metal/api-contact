import { ApiProperty } from '@nestjs/swagger';

export class Csrf  {
  @ApiProperty()
  code = 200;

  @ApiProperty()
  payload: string = 'eeEDFXza-f2o5zMJGnNcEwPvb3GQK-zhoNpI';
}
