import mongoose, { Document } from "mongoose";
import { Gender } from "../constants/app.enum";
import { IBaseUser } from "./user.interface";

export interface IUserProfile extends IBaseUser, Document {
  userRef: mongoose.Types.ObjectId;
  firstname: string;
  middlename: string;
  lastname: string;
  gender?: Gender;
  dob: Date;
  altenateNo: string;
  profilePic: string;
  backgroundPic: string;
  isEmailVerified: boolean;
  isMobileNoVerified: boolean;
  isActive: boolean;
  createdBy?: IBaseUser;
  updatedBy?: IBaseUser;
}

export interface IUserProfileFilter {
  _id?: string;
  userRef?: mongoose.Types.ObjectId;
  userId?: string;
  emailId?: string;
  mobileNo?: string;
  role?: string;
  isActive?: boolean;
  [key: string]: any; // to handle mongoose $or, $and and other operations
}

export interface IUserProfileUpdate {
  userId?: string;
  emailId?: string;
  mobileNo?: string;
  role?: string;
  firstname?: string;
  middlename?: string;
  lastname?: string;
  gender?: Gender;
  dob?: string;
  altenateNo?: string;
  profilePic?: string;
  backgroundPic?: string;
  isEmailVerified?: boolean;
  isMobileNoVerified?: boolean;
  isActive?: boolean;
  updatedBy?: IBaseUser;
  [key: string]: any; // to handle mongoose $set, $unset and other operations
}

export type UserProfileFieldType = Array<keyof IUserProfile>;

export type UserProfileUpdateFieldType = Array<keyof IUserProfileUpdate>;
