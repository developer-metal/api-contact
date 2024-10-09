import { WidgetFormSchema } from '../schemas/widgetForm.schema';

export const widgetFormsProviders = {
  name: 'WidgetsForm',
  useFactory: () => WidgetFormSchema
};
