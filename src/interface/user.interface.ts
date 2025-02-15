import { Document } from "mongoose";
export interface IUser extends IBaseUser, Document {
  password: string | undefined;
  isActive: boolean | undefined;
  isLocked: boolean | undefined;
  isVerifiedUser: boolean;
  lastLogin?: string;
  loginAttempt?: number;
  token?: string;
  refreshToken?: string;
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
}

export interface IUserUpdate {
  emailId?: string;
  mobileNo?: string;
  role?: string;
  isActive?: boolean;
  isLocked?: boolean;
  lastLogin?: string;
  password?: string;
  loginAttempt?: number;
  token?: string;
  refreshToken?: string;
  updatedBy?: IBaseUser;
}

export interface ILogin {
  userId: string;
  password: string;
}

export type UserFieldType = Array<keyof IUser | '-_id'>;
