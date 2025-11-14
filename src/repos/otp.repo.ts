import otp from "../models/otp.model";
import { IOTP, IOTPFilter, IOTPUpdate, IVerifyOTP, OTPFieldType } from "../interface/otp.interface";

class OTPRepo {
  private defaultSelectedFields: string = "-_id userId otp isVerified expiryTime ";

  public getOne(_id: string, selectedFields?: OTPFieldType) {
    const selectedFieldsExp = this.defaultSelectedFields + (selectedFields?.join(" ") || "");
    return otp.findOne({ _id }).select(selectedFieldsExp);
  }

  public getAll(filter: string, selectedFields?: OTPFieldType) {
    const filterExp: IOTPFilter = filter ? JSON.parse(filter) : {};
    const selectFieldsExp = this.defaultSelectedFields + (selectedFields?.join(" ") || "");
    return otp.find(filterExp).select(selectFieldsExp);
  }

  public getCount(filter: string) {
    const filterExp: IOTPFilter = filter ? JSON.parse(filter) : {};
    return otp.find(filterExp).estimatedDocumentCount();
  }

  public create(inputData: IOTP | IOTP[]) {
    return otp.insertMany(inputData);
  }

  public update(filterExp: IOTPFilter, inputData: IOTPUpdate) {
    return otp.updateMany(filterExp, inputData);
  }

  public findOneAndUpdate(filterExp: IOTPFilter, inputData: IOTPUpdate) {
    return otp.findOneAndUpdate(filterExp, inputData, { new: true });
  }

  public delete(filterExp: IOTPFilter) {
    return otp.deleteMany(filterExp);
  }

  public findUserOTP(filterExp: IOTPFilter, selectFields?: OTPFieldType) {
    const selectFieldsExp = this.defaultSelectedFields + (selectFields?.join(" ") || "");
    return otp.findOne(filterExp).select(selectFieldsExp);
  }

  public verifyOTP(filterExp: IVerifyOTP, inputData: IOTPUpdate) {
    return otp.updateMany(filterExp, inputData);
  }
}

export default new OTPRepo();
