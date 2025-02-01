import { IBaseUser } from "./user.interface";

export interface IOTP {
  otpId: string;
  userId: string;
  otp?: string;
  isVerfied?: boolean;
  expiryTime?: Date;
  createdBy?: IBaseUser;
  updatedBy?: IBaseUser;
}

export interface IOTPFilter extends IOTPUpdate {
  _id?: string;
  otpId?: string;
  userId?: string;
  expiryTime?: Date | { $gt: Date }; 
  createdBy?: IBaseUser;
}

export interface IOTPUpdate {
  isVerfied?: boolean;
  updatedBy?: IBaseUser;
}

export interface IVerifyOTP {
  otpId: string;
  otp: string;
}

export type OTPFieldType = Array<keyof IOTP>;
