import mongoose, { Schema } from "mongoose";
import { Gender } from "../constants/app.enum";
import { IUserProfile } from "../interface/user-profile.interface";

const userProfileSchema: Schema<IUserProfile> = new Schema(
  {
    userId: {
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    firstname: {
      required: true,
      type: String,
    },
    middlename: {
      type: String,
    },
    lastname: {
      required: true,
      type: String,
    },
    gender: {
      required: true,
      type: String,
      enum: Gender
    },
    dob: {
      required: true,
      type: Date,
    },
    emailId: {
      required: true,
      type: String,
    },
    mobileNo: {
      type: String,
    },
    altenateNo: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    backgroundPic: {
      type: String,
    },
    role: {
      default: "user",
      type: String,
    },
    isEmailVerified: {
      default: false,
      type: Boolean,
    },
    isMobileNoVerified: {
      default: false,
      type: Boolean,
    },
    isActive: {
      default: true,
      type: Boolean,
    },
    createdBy: {
      type: Object,
    },
    updatedBy: {
      type: Object,
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);

userProfileSchema.index(
  { userId: 1, emailId: 1, mobileNo: 1 },
  { unique: true }
);

const userProfile = mongoose.model<IUserProfile>("UserProfile", userProfileSchema);

export default userProfile;
