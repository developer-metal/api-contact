import { SurveySchema } from '../schemas/survey.schema';

export const SurveyProviders = {
  name: 'Survey',
  useFactory: () => SurveySchema
};
