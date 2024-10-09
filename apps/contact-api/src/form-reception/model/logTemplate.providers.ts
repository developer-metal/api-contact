import { LogTemplatesSchema } from '../schemas/LogTemplate.schema';

export const LogTemplatesProviders = {
  name: 'LogTemplate',
  useFactory: () => LogTemplatesSchema
};
