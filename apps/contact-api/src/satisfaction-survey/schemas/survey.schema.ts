import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Projects } from '../../form-reception/schemas/project.schema';
@Schema()
export class Survey {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Projects'})
  project: Projects;
  @Prop({ required: true })
  level: number;
  @Prop({ required: false })
  actions: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  dispositive: string;
  @Prop({ required: false })
  creation_date: string;
  @Prop({ required: false })
  update_date: string;

}
export const SurveySchema = SchemaFactory.createForClass(Survey);