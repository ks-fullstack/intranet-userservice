import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";
import { IUser } from "../interface/user.interface";
import updateUserChanges from "../services/change-stream.service";

const hashRounds: number = parseInt(process.env.HASH_ROUNDS || '8');

const userSchema: Schema<IUser> = new Schema(
  {
    userId: {
      lowercase: true,
      maxlength: 20,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    password: {
      required: true,
      type: String,
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
      maxlength: 2,
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
    collectionOptions: {
      changeStreamPreAndPostImages: {
        enabled: true,
      }
    }
  }
);

userSchema.index({ userId: 1, emailId: 1, mobileNo: 1 }, { unique: true });

// Encrypt User PIP Info & password
userSchema.pre("insertMany", async function (next, docs: IUser | IUser[]) {
  if (!Array.isArray(docs)) {
    docs = [docs];
  }
  for (const doc of docs) {
    if (doc.password) {
      doc.password = await bcrypt.hash(doc.password, hashRounds);
    }
  }
  next();
});

//Watch user changes for update statement
const user = mongoose.model<IUser>("User", userSchema);
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
user.watch(pipeline).on('change', data => {
  updateUserChanges(data);
});

export default user;
