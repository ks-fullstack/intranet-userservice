import { AddressType } from "../constants";
import { IBaseUser } from "./user.interface";

export interface IAddress {
  userId: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  pincode: string;
  city: string;
  state: string;
  country: string;
  addressType: AddressType;
  isDefaultAddress: string;
  isActive: boolean;
  createdBy?: IBaseUser;
  updatedBy?: IBaseUser;
}
