import { ApiProperty } from '@nestjs/swagger';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
export class Auth {
  @ApiProperty()
  code = 200;

  @ApiProperty()
  uptime: number = process.uptime();

  @ApiProperty()
  date: string = dayjs().tz('America/Santiago').unix().toString();

  @ApiProperty()
  message: string = '[api-contact - (up)] OK]';
}
