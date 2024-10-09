import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Forms } from './form.schema';
@Schema()
export class LogTemplate {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Forms'})
  forms: Forms;
  @Prop({ required: true })
  template_email: string;
  @Prop({ required: false })
  date_register: string;
}
export const LogTemplatesSchema = SchemaFactory.createForClass(LogTemplate);