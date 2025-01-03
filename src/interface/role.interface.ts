import { IBaseUser } from "./user.interface";

export interface IRole {
  roleId: string;
  role: string;
  description: string;
  isActive: boolean;
  createdBy?: IBaseUser;
  updatedBy?: IBaseUser;
}

export interface IRoleFilter extends IRoleUpdate {
  _id?: string;
  roleId?: string;
  createdBy?: IBaseUser;
}

export interface IRoleUpdate {
  isActive?: boolean;
  role?: string;
  description?: string;
  updatedBy?: IBaseUser;
}
