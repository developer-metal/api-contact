import { Document } from 'mongoose';
import { TemplateEmail } from '../dto/create-project.dto';
export interface Project extends Document {
  slug: string;
  readonly name: string;
  readonly sender: string;
  readonly pocImage: Object;
  readonly templateEmails: TemplateEmail;
}
