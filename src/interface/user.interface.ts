export interface IUser extends IBaseUser {
  password: string | undefined;
  isActive: boolean;
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

export interface IUserFilter extends IUserUpdate {
  _id?: string;
  userId?: string;
  createdBy?: IUser;
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
  updatedBy?: IUser;
}

export interface ILogin {
  userId: string;
  password: string;
}

export type UserFieldType = Array<keyof IUser>;
