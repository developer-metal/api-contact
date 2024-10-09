import { ProjectSchema } from '../schemas/project.schema';

export const ProjectProviders = {
  name: 'Projects',
  useFactory: () => ProjectSchema
};
