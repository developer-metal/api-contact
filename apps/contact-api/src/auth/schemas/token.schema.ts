import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Santiago');
@Schema()
export class Token {
  @Prop({ required: true })
  token: string;
  @Prop({ required: true })
  secret: string;
  @Prop({ required: true, default: () => dayjs().format('YYYY-MM-DD HH:mm:ss') })
  date: string;
}
export const tokenWhite = SchemaFactory.createForClass(Token);
tokenWhite.index({ token: 1 }, { unique: true});