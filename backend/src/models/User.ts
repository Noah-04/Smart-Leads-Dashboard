import { Schema, model, type HydratedDocument, type Model } from "mongoose";

export enum UserRole {
  Admin = "Admin",
  SalesUser = "Sales User"
}

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;

type UserModel = Model<IUser>;

const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minlength: [2, "User name must be at least 2 characters"],
      maxlength: [80, "User name cannot exceed 80 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
      select: false
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.SalesUser,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

export const User = model<IUser, UserModel>("User", userSchema);
