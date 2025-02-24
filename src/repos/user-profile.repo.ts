import { IUserProfile, IUserProfileFilter, IUserProfileUpdate, UserProfileFieldType } from "../interface/user-profile.interface";
import userProfile from "../models/user-profile.model";

class UserProfileRepo {
  private defaultSelectedFields: string = "_id userRef userId firstname lastname gender dob profilePic emailId mobileNo role isActive createdBy updatedBy ";

  public getOne(_id: string, selectedFields?: UserProfileFieldType) {
    const selectedFieldsExp = this.defaultSelectedFields + (selectedFields?.join(" ") || "");
    return userProfile.findById({_id}).select(selectedFieldsExp);
  }

  public getAll(filter: string, selectedFields?: UserProfileFieldType) {
    const filterExp: IUserProfileFilter = filter ? JSON.parse(filter) : {};
    const selectedFieldsExp = this.defaultSelectedFields + (selectedFields?.join(" ") || "");
    return userProfile.find(filterExp).select(selectedFieldsExp);
  }

  public getCount(filter: string) {
    const filterExp: IUserProfileFilter = filter ? JSON.parse(filter) : {};
    return userProfile.find(filterExp).estimatedDocumentCount();
  }

  public create(inputData: IUserProfile | IUserProfile[]) {
    return userProfile.insertMany(inputData);
  }

  public update(filterExp: IUserProfileFilter, inputData: IUserProfileUpdate) {
    return userProfile.updateMany(filterExp, inputData, {new: true});
  }

  public findOneAndUpdate(filterExp: IUserProfileFilter, inputData: IUserProfileUpdate) {
    return userProfile.findOneAndUpdate(filterExp, inputData, {new: true});
  }

  public delete(filterExp: IUserProfileFilter) {
    return userProfile.deleteMany(filterExp);
  }

  public findUser(filterExp: IUserProfileFilter, selectedFields?: UserProfileFieldType) {
    const selectedFieldsExp = this.defaultSelectedFields + (selectedFields?.join(" ") || "");
    return userProfile.findOne(filterExp).select(selectedFieldsExp);
  }
}

export default new UserProfileRepo();
