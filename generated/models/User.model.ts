import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  // Add password comparison logic here if needed
  return true;
};

const UserModel = mongoose.model<IUser>('User', UserSchema);
export default UserModel;
