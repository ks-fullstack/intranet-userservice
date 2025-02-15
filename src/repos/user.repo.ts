import { Promise } from "mongoose";
import { IUser, IUserFilter, IUserUpdate, UserFieldType } from "../interface/user.interface";
import userModel from "../models/user.model";

class UserRepo {
  private defaultSelectedFields: string = "_id userId emailId mobileNo role isActive createdBy updatedBy ";

  public getOne(_id: string, selectedFields?: UserFieldType) {
    const selectedFieldsExp = this.defaultSelectedFields + (selectedFields?.join(" ") || "");
    return userModel.findById({_id}).select(selectedFieldsExp);
  }

  public getAll(filter: string, selectFields?: UserFieldType) {
    const filterExp: IUserFilter = filter ? JSON.parse(filter) : {};
    const selectFieldsExp = this.defaultSelectedFields + (selectFields?.join(" ") || "");
    return userModel.find(filterExp).select(selectFieldsExp);
  }

  public getCount(filter: string) {
    const filterExp: IUserFilter = filter ? JSON.parse(filter) : {};
    return userModel.find(filterExp).estimatedDocumentCount();
  }

  public create(inputData: IUser | IUser[]) {
    return userModel.insertMany(inputData);
  }

  public update(filterExp: IUserFilter, inputData: IUserUpdate) {
    return userModel.updateMany(filterExp, inputData, {new: true});
  }

  public delete(filterExp: IUserFilter) {
    return userModel.deleteMany(filterExp);
  }

  public save(inputData: IUser) {
    const saveData = new userModel(inputData);
    return new Promise((resolve: any, reject: any) => {
      saveData.save().then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  public findOneAndUpdate(filterExp: IUserFilter, inputData: IUserUpdate) {
    return userModel.findOneAndUpdate(filterExp, inputData, {new: true});
  }

  public findUser(filterExp: IUserFilter, selectedFields?: UserFieldType) {
    const selectedFieldsExp = "userId emailId mobileNo role " + (selectedFields?.join(" ") || "");
    return userModel.findOne(filterExp).select(selectedFieldsExp);
  }
}

export default new UserRepo();
