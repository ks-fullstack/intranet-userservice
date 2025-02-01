import otp from "../models/otp.model";
import { IOTP, IOTPFilter, IOTPUpdate, IVerifyOTP, OTPFieldType } from "../interface/otp.interface";

class OTPRepo {
  public getOne(id: string) {
    return otp.findOne({ id });
  }

  public getAll(filter: string) {
    const filterExp: IOTPFilter = filter ? JSON.parse(filter) : {};
    return otp.find({ filterExp });
  }

  public getCount(filter: string) {
    const filterExp: IOTPFilter = filter ? JSON.parse(filter) : {};
    return otp.find(filterExp).estimatedDocumentCount();
  }

  public create(inputData: IOTP) {
    const saveData = new otp(inputData);
    return new Promise((resolve, reject) => {
      saveData
        .save()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public update(filterExp: IOTPFilter, inputData: IOTPUpdate) {
    return otp.findOneAndUpdate(filterExp, inputData, { new: true });
  }

  public delete(filterExp: IOTPFilter) {
    return otp.deleteMany(filterExp);
  }

  public findUserOTP(filterExp: IOTPFilter, selectFields?: OTPFieldType) {
    let selectFieldsExp = "-_id userId otpId otp isVerified expiryTime " + (selectFields?.join(" ") || "");
    return otp.findOne(filterExp).select(selectFieldsExp);
  }

  public verifyOTP(filterExp: IVerifyOTP, inputData: IOTPUpdate) {
    return otp.findOneAndUpdate(filterExp, inputData);
  }
}

export default new OTPRepo();
