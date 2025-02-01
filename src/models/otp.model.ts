import mongoose, { Schema } from "mongoose";
import { IOTP } from "../interface/otp.interface";

const otpSchema: Schema<IOTP> = new Schema(
  {
    otpId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    isVerfied: {
      type: Boolean,
      default: false,
    },
    expiryTime: {
      type: Date,
      default: Date.now() + (5 * 60 * 1000), // 5 minutes
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
