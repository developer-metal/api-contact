import { tokenWhite } from '../schemas/token.schema';

export const tokensProviders = {
  name: 'Token',
  useFactory: () => tokenWhite
};
