import mongoose, { Schema} from "mongoose";
import IAudit from "./audit.interface";

const auditSchema = new Schema(
  {
    createdBy: {
      type: Object,
    },
    reqPayload: {
      type: Object,
    },
    reqType: {
      type: String,
    },
    reqUrl: {
      required: true,
      type: String,
    },
    serviceName: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const audit = mongoose.model<IAudit>("audit", auditSchema);

export default audit;
