import { Gender } from "../constants/app.enum";
import { IBaseUser } from "./user.interface";

export interface IUserProfile extends IBaseUser {
  userRef: IBaseUser;
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

export interface IUserProfileFilter extends IUserProfileUpdate {
  _id?: string;
  userRef?: IBaseUser;
}

export interface IUserProfileUpdate {
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
}

export type UserProfileFieldType = Array<keyof IUserProfile>;
