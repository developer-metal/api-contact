import { Document } from 'mongoose';
export interface Survey extends Document {
  readonly level: number;
  readonly email: string;
  readonly name: string;
  readonly actions: string;
  readonly dispositive: string;
}
