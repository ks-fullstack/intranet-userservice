import mongoose, { Schema } from "mongoose";
import { IRole } from "../interface/role.interface";

const roleSchema: Schema<IRole> = new Schema(
  {
    roleId: {
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    role: {
      required: true,
      trim: true,
      type: String,
    },
    description: {
      type: String,
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
  },
);

roleSchema.index(
  { postId: 1 },
  { unique: true },
);

const role = mongoose.model<IRole>("rolemaster", roleSchema);

export default role;
