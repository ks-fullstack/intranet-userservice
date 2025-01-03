import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";
import { IUser } from "../interface/user.interface";

const hashRounds: number = parseInt(process.env.HASH_ROUNDS || '8');

const userSchema: Schema<IUser> = new Schema(
  {
    userId: {
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    password: {
      minlength: 8,
      required: true,
      type: String,
    },
    emailId: {
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    mobileNo: {
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    role: {
      default: "user",
      type: String,
    },
    isActive: {
      default: true,
      type: Boolean,
    },
    isLocked: {
      default: false,
      type: Boolean,
    },
    isVerifiedUser: {
      default: false,
      type: Boolean,
    },
    lastLogin: {
      type: Date,
    },
    loginAttempt: {
      default: 0,
      type: Number,
    },
    token: {
      type: String,
    },
    refreshToken: {
      type: String,
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

userSchema.index({ userId: 1, emailId: 1, mobileNo: 1 }, { unique: true });

// Encrypt User PIP Info & password
userSchema.pre("save", async function (next) {
  const user = this;

  if(user.isModified("password")) {
    let password: string = user.password?.toString() || '';
    user.password = await bcrypt.hash(password, hashRounds);
  }

  next();
});

const user = mongoose.model<IUser>("User", userSchema);

export default user;
