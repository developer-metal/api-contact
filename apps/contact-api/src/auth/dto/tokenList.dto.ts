import { ApiProperty } from '@nestjs/swagger';

export class TokenList {
  @ApiProperty()
  token: string;
  @ApiProperty()
  secret: string;
  @ApiProperty()
  date: string;
}