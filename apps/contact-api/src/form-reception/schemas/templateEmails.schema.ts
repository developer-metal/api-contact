
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
const schema = mongoose.Schema.Types;
@Schema()
export class TemplateEmailCustom {
  @Prop({ type: String, default: '' })
  titleClient?: string;

  @Prop({ type: String,  default: ''})
  messageTemplate?: string;

  @Prop({ type: String, default: ''})
  titleExecutive?: string;

  @Prop({ type: String, default: ''})
  documentTemplate?: string;

  @Prop({ type: Array, required: false, default: [] })
  mailsTo: Array<any>;
}
export const TemplateEmails = SchemaFactory.createForClass(TemplateEmailCustom);