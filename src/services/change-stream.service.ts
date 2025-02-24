import { ChangeStream, Document } from "mongodb";
import { IUserProfileUpdate, UserProfileUpdateFieldType } from "../interface/user-profile.interface";
import user from "../models/user.model";
import userProfileRepo from "../repos/user-profile.repo";

let userChangeStream: ChangeStream | null = null;

const watchUserCollection = () => {
  console.log("Watch user collection for changes");
  
  // Close existing change stream if any
  if(userChangeStream) {
    userChangeStream.close();
  }

  // Pipeline to watch only specific fields
  const pipeline = [
    {
      $match: {
        $and: 
        [
          { operationType: "update" },
          {
            $or: [
              { "updateDescription.updatedFields.userId": { $exists: true } },
              { "updateDescription.updatedFields.emailId": { $exists: true } },
              { "updateDescription.updatedFields.mobileNo": { $exists: true } },
              { "updateDescription.updatedFields.role": { $exists: true } },
            ]
          }
        ]
      }
    },
  ];
  userChangeStream = user.watch(pipeline);
  userChangeStream.on('change', async (data: Document) => {
    const lookUpFields: UserProfileUpdateFieldType = ["userId", "emailId", "mobileNo", "role"];
    const userId = data.documentKey._id;
    const updatedFields = data.updateDescription.updatedFields;
  
    let updatedUserData: IUserProfileUpdate = {};
    lookUpFields.forEach(fieldName => {
      if (updatedFields[fieldName]) {
        updatedUserData[fieldName] = updatedFields[fieldName];
      }
    });
  
    // Update corresponding UserProfile
    await userProfileRepo.findOneAndUpdate(
      { userRef: userId },
      updatedUserData
    );
  }).on('error', (error) => {
    setTimeout(watchUserCollection, 5000); // Reconnect on error
  });
};

export { watchUserCollection };
