import { IUserProfile, IUserProfileFilter, IUserProfileUpdate } from "../interface/user-profile.interface";
import userProfile from "../models/user-profile.model";

class UserProfileRepo {
  public getOne(id: string) {
    return userProfile.findById({id});
  }

  public getAll(filter: string) {
    const filterExp: IUserProfileFilter = filter ? JSON.parse(filter) : {};
    return userProfile.find(filterExp);
  }

  public getCount(filter: string) {
    const filterExp: IUserProfileFilter = filter ? JSON.parse(filter) : {};
    return userProfile.find(filterExp).estimatedDocumentCount();
  }

  public create(inputData: IUserProfile) {
    const saveData = new userProfile(inputData);
    return new Promise((resolve, reject) => {
      saveData.save().then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  public update(filterExp: IUserProfileFilter, inputData: IUserProfileUpdate) {
    return userProfile.findOneAndUpdate(filterExp, inputData, {new: true});
  }

  public delete(filterExp: IUserProfileFilter) {
    return userProfile.deleteMany(filterExp);
  }
}

export default new UserProfileRepo();
