import { TUser } from '@repo/schemas';
import { model, Schema } from 'mongoose';
import { hash } from 'bcrypt';

export interface IUser extends TUser {
  _id?: any;
  createdAt: Date | string;
  updatedAt: Date | string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Please enter a valid email'],
      trim: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: [true, 'Please enter a valid name'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Please enter a valid last name'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter a valid password'],
    },
    role: {
      type: String,
      enum: ['reader', 'writer', 'admin'],
      default: 'reader',
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    this.password = await hash(this.password!, 10);
  }
  next();
});

export const User = model<typeof userSchema>('User', userSchema);
