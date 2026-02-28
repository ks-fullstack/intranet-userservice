import { Document } from "mongoose";
export interface IUser extends IBaseUser, Document {
  password: string | undefined;
  isActive: boolean | undefined;
  isLocked: boolean | undefined;
  isVerifiedUser: boolean | undefined;
  lastLogin?: Date;
  loginAttempt?: number;
  refreshToken?: {
    tokenHash: string;
    expiresAt: Date | undefined;
  };
  verificationToken?: string;
  verificationExpiresAt?: Date;
  createdBy?: IBaseUser;
  updatedBy?: IBaseUser;
}

export interface IBaseUser {
  userId: string;
  emailId: string;
  mobileNo: string;
  role: string;
}

export interface IUserFilter {
  _id?: string;
  userId?: string;
  emailId?: string;
  mobileNo?: string;
  createdBy?: IBaseUser;
  refreshToken?: {
    tokenHash?: string;
    expiresAt?: Date | { $gt: Date } | { $lt: Date };
  };
  verificationToken?: string;
  [key: string]: any; // to handle mongoose $or, $and and other operations
}

export interface IUserUpdate {
  emailId?: string;
  mobileNo?: string;
  role?: string;
  isVerifiedUser?: boolean;
  isActive?: boolean;
  isLocked?: boolean;
  lastLogin?: string;
  password?: string;
  loginAttempt?: number;
  refreshToken?: {
    tokenHash: string;
    expiresAt: Date | null;
  };
  updatedBy?: IBaseUser;
  [key: string]: any; // to handle mongoose $set, $unset and other operations
}

export interface ILogin {
  userId: string;
  password: string;
}

export type UserFieldType = Array<keyof IUser | '-_id'>;
