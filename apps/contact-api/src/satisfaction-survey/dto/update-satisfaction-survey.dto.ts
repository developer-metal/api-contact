import { PartialType } from '@nestjs/swagger';
import { CreateSatisfactionSurveyDto } from './create-satisfaction-survey.dto';

export class UpdateSatisfactionSurveyDto extends PartialType(CreateSatisfactionSurveyDto) {}
