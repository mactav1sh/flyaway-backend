import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser {
  id?: string;
  name: string;
  role: string;
  email: string;
  password: string | undefined;
  passwordConfirm: string | undefined;
  passwordChangedAt: string;
  passwordResetToken: string;
  passwordResetTokenExpires: Date;
  active: boolean;
  comparePasswords: Function;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'email is not valid'],
    },
    password: {
      type: String,
      required: [true, 'user must provide a password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'please confirm your password'],
      minlength: 8,
      validate: [passwordConfirmValidator, "passwords doesn't match"],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
  },
  { timestamps: true }
);

function passwordConfirmValidator(this: IUser, field: string): boolean {
  return field === this.password;
}

// MIDDLEWARES
// 1. HASHING PASSWORD
userSchema.pre('save', async function (next) {
  // Incase of updating user other data skip updating password
  if (!this.isModified('password')) return next();
  // Incase of updating password
  // - 1) hash password
  this.password = await bcrypt.hash(this.password as string, 12);
  // - 2) delete passwordConfirm
  this.passwordConfirm = undefined;
});

// 2. COMPARE PASSWORDS
userSchema.methods.comparePasswords = async function (
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
};

const User = mongoose.model('User', userSchema);
export default User;
