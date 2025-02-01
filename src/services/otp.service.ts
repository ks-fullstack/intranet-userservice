import { Request } from "express";
import AppConstant from "../constants/app.constant";
import { IServiceResponse } from "../interface/common.interface";
import { IOTP, IOTPFilter, IOTPUpdate, IVerifyOTP } from "../interface/otp.interface";
import otpRepo from "../repos/otp.repo";
import userRepo from "../repos/user.repo";
import CustomError from "../utils/custom.error";
import { generateOTP } from "../utils/common-util";

class OTPService {
  public async getOne(req: Request): Promise<IServiceResponse> {
    const recordId = req.params.id;
    const resObj = await otpRepo.getOne(recordId);
    const result: IServiceResponse = {
      count: 1,
      data: resObj,
      message: 1 + AppConstant.GetResponseMessage,
    };
    return result;
  }

  public async getAll(req: Request): Promise<IServiceResponse> {
    const filterExp = req.params.filter || "";
    const resObj = await otpRepo.getAll(filterExp);
    const result: IServiceResponse = {
      count: resObj.length,
      data: resObj,
      message: resObj.length + AppConstant.GetResponseMessage,
    };
    return result;
  }

  public async getCount(req: Request): Promise<IServiceResponse> {
    const filterExp = req.params.filter || "";
    const resObj = await otpRepo.getCount(filterExp);
    const result: IServiceResponse = {
      count: resObj,
      data: resObj,
      message: resObj + AppConstant.GetResponseMessage,
    };
    return result;
  }

  public async create(req: Request): Promise<IServiceResponse> {
    const data: IOTP = req.body;
    if (Array.isArray(data)) {
      if (data.length === 0) {
        throw new CustomError("Empty payload", 422);
      }
    } else {
      if (!data || (data && Object.keys(data).length === 0)) {
        throw new CustomError("Empty payload", 422);
      }
    }

    // Generate OTP
    if (Array.isArray(data)) {
      data.forEach((item) => {
        item.otp = generateOTP(6, true);
      });
    } else {
      data.otp = generateOTP(6, true);
    }

    const resObj = await otpRepo.create(data);
    const result: IServiceResponse = {
      count: Array.isArray(resObj) ? resObj.length : 1,
      data: resObj,
      message: AppConstant.GetResponseMessage,
    };
    return result;
  }

  public async update(req: Request): Promise<IServiceResponse> {
    const filterExp: IOTPFilter = req.body.filterExp || "";
    const requestedDataToUpdate: IOTPUpdate = req.body.data || "";
    if (!filterExp || (filterExp && Object.keys(filterExp).length === 0)) {
      throw new CustomError("Filter expression required", 422);
    } else if (
      !requestedDataToUpdate ||
      (requestedDataToUpdate && Object.keys(requestedDataToUpdate).length === 0)
    ) {
      throw new CustomError("Payload required to update data", 422);
    } else {
      const resObj = await otpRepo.update(filterExp, requestedDataToUpdate);
      let updatedRecordCount = 0;
      if (resObj) {
        updatedRecordCount = Array.isArray(resObj) ? resObj.length : 1;
      }
      const result: IServiceResponse = {
        count: updatedRecordCount,
        data: resObj,
        message: updatedRecordCount + AppConstant.UpdateResponeMessage,
      };
      return result;
    }
  }

  public async delete(req: Request): Promise<IServiceResponse> {
    const filterExp: IOTPFilter = req.body.filterExp || "";
    if (!filterExp || (filterExp && Object.keys(filterExp).length === 0)) {
      throw new CustomError("Filter expression required", 422);
    } else {
      const resObj = await otpRepo.delete(filterExp);
      const result: IServiceResponse = {
        count: resObj.deletedCount,
        message: resObj.deletedCount + AppConstant.DeleteResponeMessage,
      };
      return result;
    }
  }

  public async sendOTP(req: Request): Promise<IServiceResponse> {
    const data: IOTP = req.body;
    let otpRes = null;
    if (!data || (data && Object.keys(data).length === 0)) {
      throw new CustomError("Empty payload", 422);
    }

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
      otpRes = await otpRepo.create(data);
    }

    const result: IServiceResponse = {
      count: otpRes ? 1 : 0,
      data: otpRes,
      message: AppConstant.GetResponseMessage,
    };
    return result;
  }

  public async verifyOTP(req: Request): Promise<IServiceResponse> {
    const body: IVerifyOTP = req.body;
    if (!body || (body && Object.keys(body).length === 0)) {
      throw new CustomError("Empty payload", 422);
    }
    const resObj = await otpRepo.verifyOTP(body, { isVerfied: true });
    const result: IServiceResponse = {
      count: resObj ? 1 : 0,
      data: resObj,
      message: resObj ? AppConstant.GetResponseMessage : "OTP verification failed",
    };
    return result;
  }
}

export default new OTPService();
