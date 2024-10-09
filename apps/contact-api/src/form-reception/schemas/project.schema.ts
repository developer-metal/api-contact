
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { TemplateEmailCustom } from './templateEmails.schema';
const schema = mongoose.Schema.Types;
@Schema()
export class Projects {
  @Prop({ type: String, required: true })
  slug: string;
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ required: false })
  active: boolean;
  @Prop({ type: String, required: false, default: '' })
  sender?: string;
  @Prop({ type: Object, required: false, default: {} })
  pocImage?: object;
  @Prop({ required: false })
  max_form?: number;
  @Prop({ required: false, default: {} })
  templateEmails: TemplateEmailCustom;
}
export const ProjectSchema = SchemaFactory.createForClass(Projects);
ProjectSchema.index({ slug: 1 }, { unique: true });
ProjectSchema.index({ slug: 'text' }, { unique: true });