import mongoose, { Schema } from "mongoose";
import { Gender } from "../constants/app.enum";
import { IUserProfile } from "../interface/user-profile.interface";

const userProfileSchema: Schema<IUserProfile> = new Schema(
  {
    userRef: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true
    },
    userId: {
      lowercase: true,
      maxlength: 20,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    firstname: {
      maxlength: 30,
      required: true,
      type: String,
    },
    middlename: {
      maxlength: 30,
      type: String,
    },
    lastname: {
      maxlength: 30,
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
      lowercase: true,
      maxlength: 100,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    mobileNo: {
      maxlength: 18,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    role: {
      maxlength: 30,
      default: "user",
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

userProfileSchema.index({ userId: 1, emailId: 1, mobileNo: 1 }, { unique: true });

const userProfile = mongoose.model<IUserProfile>("UserProfile", userProfileSchema);

export default userProfile;
