import { IUserProfileUpdate, UserProfileUpdateFieldType } from "../interface/user-profile.interface";
import userProfileRepo from "../repos/user-profile.repo";

const updateUserChanges = async(change: any) => {
  const lookUpFields: UserProfileUpdateFieldType = ["userId", "emailId", "mobileNo", "role"];
  const userId = change.documentKey._id;
  const updatedFields = change.updateDescription.updatedFields;

  let updatedUserData: IUserProfileUpdate = {};
  lookUpFields.forEach(fieldName => {
    if (updatedFields[fieldName]) {
      updatedUserData[fieldName] = updatedFields[fieldName];
    }
  });

  //console.log("Detected Changes:", updatedUserData);

  // Update corresponding UserProfile
  await userProfileRepo.findOneAndUpdate(
    { userRef: userId },
    updatedUserData
  );
};

export default updateUserChanges;
