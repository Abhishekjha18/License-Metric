// src/models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  uid: string;
  name: string;
  email: string;
}

const UserSchema: Schema = new Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String, required: true, unique: true }
});

export default mongoose.model<IUser>('User', UserSchema);
