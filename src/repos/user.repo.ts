import { IUser, IUserFilter, IUserUpdate, UserFieldType } from "../interface/user.interface";
import userModel from "../models/user.model";

class UserRepo {
  public getOne(id: string) {
    return userModel.findById({id});
  }

  public getAll(filter: string) {
    const filterExp: IUserFilter = filter ? JSON.parse(filter) : {};
    return userModel.find(filterExp);
  }

  public getCount(filter: string) {
    const filterExp: IUserFilter = filter ? JSON.parse(filter) : {};
    return userModel.find(filterExp).estimatedDocumentCount();
  }

  public create(inputData: IUser) {
    const saveData = new userModel(inputData);
    return new Promise((resolve, reject) => {
      saveData.save().then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  public update(filterExp: IUserFilter, inputData: IUserUpdate) {
    return userModel.findOneAndUpdate(filterExp, inputData, {new: true});
  }

  public delete(filterExp: IUserFilter) {
    return userModel.deleteMany(filterExp);
  }

  public findUser(filterExp: IUserFilter, selectFields?: UserFieldType) {
    let selectFieldsExp = "-_id userId emailId role " + (selectFields?.join(" ") || "");
    return userModel.findOne(filterExp).select(selectFieldsExp);
  }
}

export default new UserRepo();
