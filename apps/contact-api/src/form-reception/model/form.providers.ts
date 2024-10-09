import { FormSchema } from '../schemas/form.schema';

export const formsProviders = {
  name: 'Forms',
  useFactory: () => FormSchema
};
