import { AppConstants, OTPConstants} from "../constants/app.constant";
import { IAuthenticatedRequest, IServiceResponse } from "../interface/common.interface";
import { IOTP, IOTPFilter, IOTPUpdate, IVerifyOTP, OTPFieldType } from "../interface/otp.interface";
import otpRepo from "../repos/otp.repo";
import userRepo from "../repos/user.repo";
import CustomError from "../utils/custom.error";
import { generateOTP } from "../utils/common-util";
import validationService from "./validation.service";

class OTPService {
  public async getOne(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    const recordId = req.params.id;
    const { fields } = req.query;
    const fieldSelection: OTPFieldType = typeof fields === 'string' ? fields.split(",") as OTPFieldType : [];
    const resObj = await otpRepo.getOne(recordId, fieldSelection);
    const result: IServiceResponse = {
      count: 1,
      data: resObj,
      message: 1 + AppConstants.GetResponseMessage,
    };
    return result;
  }

  public async getAll(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    const { fields, filter } = req.query;
    const filterExp =  typeof filter === 'string' ? filter : "";
    const fieldSelection: OTPFieldType = typeof fields === 'string' ? fields.split(",") as OTPFieldType : [];
    const resObj = await otpRepo.getAll(filterExp, fieldSelection);
    const result: IServiceResponse = {
      count: resObj.length,
      data: resObj,
      message: resObj.length + AppConstants.GetResponseMessage,
    };
    return result;
  }

  public async getCount(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    const filterExp = req.params.filter || "";
    const resObj = await otpRepo.getCount(filterExp);
    const result: IServiceResponse = {
      count: resObj,
      data: resObj,
      message: resObj + AppConstants.GetResponseMessage,
    };
    return result;
  }

  public async create(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    validationService.validatePostPayload(req);

    const inputData: IOTP | IOTP[] = req.body;
    // Generate OTP
    if (Array.isArray(inputData)) {
      inputData.forEach((item) => {
        item.otp = generateOTP(6, true);
        item.createdBy = req.user;
      });
    } else {
      inputData.otp = generateOTP(6, true);
      inputData.createdBy = req.user;
    }

    const resObj = await otpRepo.create(inputData);
    const result: IServiceResponse = {
      count: Array.isArray(resObj) ? resObj.length : 1,
      data: resObj,
      message: AppConstants.GetResponseMessage,
    };
    return result;
  }

  public async update(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    validationService.validateFiterExpression(req);
    validationService.validateUpdateDataPayload(req);

    const filterExp: IOTPFilter = req.body.filterExp || "";
    const requestedDataToUpdate: IOTPUpdate = req.body.data || "";
    requestedDataToUpdate.updatedBy = req.user;
    const resObj = await otpRepo.update(filterExp, requestedDataToUpdate);
    const result: IServiceResponse = {
      count: resObj.modifiedCount,
      data: resObj,
      message: resObj.modifiedCount + AppConstants.UpdateResponeMessage,
    };
    return result;
  }

  public async delete(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    validationService.validateFiterExpression(req);
    const filterExp: IOTPFilter = req.body.filterExp || "";
    const resObj = await otpRepo.delete(filterExp);
    const result: IServiceResponse = {
      count: resObj.deletedCount,
      message: resObj.deletedCount + AppConstants.DeleteResponeMessage,
    };
    return result;
  }

  public async sendOTP(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    validationService.validatePostPayload(req);
    const data: IOTP = req.body;
    let otpRes = null;

    const userRes = await userRepo.findUser({ userId: data.userId }, [ "isLocked" ]);
    if (!userRes) {
      throw new CustomError("User not found", 404);
    }
    else if (userRes.isLocked) {
      throw new CustomError("User account is locked", 401);
    }

    // Check if OTP already exists
    if(req.originalUrl.includes("resend")) {
      otpRes = await otpRepo.findUserOTP({ userId: data.userId, isVerfied: false, expiryTime: { $gt: new Date() } });
    }
    
    if (!otpRes) {
      data.otp = generateOTP(6, true);
      data.createdBy = req.user;
      otpRes = await otpRepo.create(data);
    }

    const result: IServiceResponse = {
      message: "OTP send successfully, ",
    };
    return result;
  }

  public async verifyOTP(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    validationService.validatePostPayload(req);
    const body: IVerifyOTP = req.body;
    const resObj = await otpRepo.verifyOTP(body, { isVerfied: true, updatedBy: req.user });
    const result: IServiceResponse = {
      message: resObj ? OTPConstants.OTPVerifiedMessage : OTPConstants.OTPVerificationFailedMessage,
    };
    return result;
  }
}

export default new OTPService();
