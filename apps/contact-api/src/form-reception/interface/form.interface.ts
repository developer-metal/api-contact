import { Document } from 'mongoose';
import { FormRequest } from '../dto/form.dto';

export interface SavedForm extends Document {
  readonly form: FormRequest;
  thanksSent: boolean;
  interestedSent: boolean;
  readonly sendDate: Date;
}
