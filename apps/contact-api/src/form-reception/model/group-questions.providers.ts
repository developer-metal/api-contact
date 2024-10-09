import { GroupQuestionsSchema } from '../schemas/group-questions.schema';
export const GroupQuestionsProviders = {
  name: 'GroupQuestions',
  useFactory: () => GroupQuestionsSchema
};