import { Prop, Schema, SchemaFactory  } from '@nestjs/mongoose';
import { AnswerData, LabelQuestion } from '../dto/form-widget.dto';
@Schema()
export class QuestionData {
    @Prop({ required: true })
    question: LabelQuestion;
    @Prop({ required: true })
    answer: AnswerData;
}
export const QuestionDataCustom = SchemaFactory.createForClass(QuestionData);