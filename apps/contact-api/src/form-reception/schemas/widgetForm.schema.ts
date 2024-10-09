import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Projects } from './project.schema';
import { NotificationsData, TitleData } from '../dto/form-widget.dto';
import { QuestionData } from './questions-data.schema';
@Schema()
export class WidgetsForm {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Projects'})
  project: Projects;
  @Prop({ required: true })
  single_form: string;
  @Prop({ required: true })
  active: boolean;
  @Prop({ required: true })
  project_name: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  header_image: string;
  @Prop({ required: false })
  url_external: string;
  @Prop({ required: true })
  notifications: NotificationsData;
  @Prop({ required: true })
  template: string;
  @Prop({ required: true, type: [{ type: QuestionData }] })
  elements: QuestionData[];
  @Prop({ required: false })
  creationDate: string;
  @Prop({ required: false })
  updateDate: string;
}
export const WidgetFormSchema = SchemaFactory.createForClass(WidgetsForm);
WidgetFormSchema.index({ project: 1 }, { unique: true });
WidgetFormSchema.index({ project: 'text' }, { unique: true });