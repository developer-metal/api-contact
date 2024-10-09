import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Projects } from '../schemas/project.schema';
import { FormField } from '../dto/form.dto';
@Schema()
export class Forms {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Projects'})
  project: Projects;
  @Prop({ required: true })
  requestNumber: string;
  @Prop({ required: true, default: true })
  termconditions: boolean;
  @Prop({ required: true })
  contactName: string;
  @Prop({ required: false })
  contactLastName: string;
  @Prop({ required: true })
  contactEmail: string;
  @Prop({ required: true})
  projectSlug: string;
  @Prop({ required: true, default: {}})
  fields: FormField;
  @Prop({ required: false, default: []})
  blobs: Array<any>;
  @Prop({ required: true })
  user_agent: string;
  @Prop({required: true })
  sendDate: Date;
  @Prop({required: true, default: false})
  thanksSent: boolean;
  @Prop({required: true, default: false})
  interestedSent: boolean;
  @Prop({required: false, default: 0})
  countSendWellcome: number;
  @Prop({required: false, default: 0})
  countSendinterested: number;
}
export const FormSchema = SchemaFactory.createForClass(Forms);