import mongoose, { Schema } from "mongoose";
import { IOTP } from "../interface/otp.interface";
import APIConfig from "../utils/config";

const otpSchema: Schema<IOTP> = new Schema(
  {
    otpId: {
      maxlength: 20,
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    userId: {
      lowercase: true,
      maxlength: 20,
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      maxlength: 6,
      type: String,
      required: true,
    },
    isVerfied: {
      type: Boolean,
      default: false,
    },
    expiryTime: {
      type: Date,
      default: Date.now() + (APIConfig.config.otpExpiresInMin * 60 * 1000),
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

otpSchema.index({ otpId: 1, userId: 1, isVerfied: 1 }, { unique: true });

const otp = mongoose.model("otp", otpSchema);

export default otp;
