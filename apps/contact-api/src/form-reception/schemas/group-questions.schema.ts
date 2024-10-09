import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { WidgetsForm } from './widgetForm.schema';
import { ImagenNotifications, QuestionStages } from '../dto/form-widget.dto';
@Schema()
export class GroupQuestions {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'WidgetsForm'})
  forms: WidgetsForm;
  @Prop({ required: true })
  project_name: string;
  @Prop({ required: true })
  active: boolean;
  @Prop({ required: true })
  stages: QuestionStages[];
  @Prop({ required: true })
  image_notifications: ImagenNotifications;
  @Prop({ required: false })
  creationDate: string;
  @Prop({ required: false })
  updateDate: string;
}
export const GroupQuestionsSchema = SchemaFactory.createForClass(GroupQuestions);
GroupQuestionsSchema.index({ forms: 1 }, { unique: true });
GroupQuestionsSchema.index({ forms: 'text' }, { unique: true });