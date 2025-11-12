import { Document } from "mongoose";
import { IBaseUser } from "./user.interface";

export interface IOTP extends Document {
  userId: string;
  otp: string;
  isVerfied?: boolean;
  expiryTime?: Date;
  createdBy?: IBaseUser;
  updatedBy?: IBaseUser;
}

export interface IOTPFilter extends IOTPUpdate {
  _id?: string;
  userId?: string;
  expiryTime?: Date | { $gt: Date } | { $lt: Date }; 
  createdBy?: IBaseUser;
  [key: string]: any; // to handle mongoose $or, $and and other operations
}

export interface IOTPUpdate {
  isVerfied?: boolean;
  updatedBy?: IBaseUser;
  [key: string]: any; // to handle mongoose $set, $unset and other operations
}

export interface IVerifyOTP {
  _id?: string;
  otp: string;
}

export type OTPFieldType = Array<keyof IOTP>;
