import { Document } from "mongoose";
import { IBaseUser } from "./user.interface";

export interface IRole extends Document {
  roleId: string;
  role: string;
  description: string;
  isActive: boolean;
  createdBy?: IBaseUser;
  updatedBy?: IBaseUser;
}

export interface IRoleFilter {
  _id?: string;
  roleId?: string;
  role?: string;
  createdBy?: IBaseUser;
  [key: string]: any; // to handle mongoose $or, $and and other operations
}

export interface IRoleUpdate {
  isActive?: boolean;
  role?: string;
  description?: string;
  updatedBy?: IBaseUser;
  [key: string]: any; // to handle mongoose $set, $unset and other operations
}

export type RoleFieldType = Array<keyof IRole>;
