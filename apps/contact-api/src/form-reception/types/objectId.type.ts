import mongoose from 'mongoose';

export type ObjectIdConstructor = {
  (str: string): mongoose.Types.ObjectId;
  new (str: string): mongoose.Types.ObjectId;
};