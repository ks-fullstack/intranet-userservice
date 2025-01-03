import { Request } from "express";
import AppConstant from "../constants/app.constant";
import { IServiceResponse } from "../interface/common.interface";
import { IUserProfile, IUserProfileFilter, IUserProfileUpdate } from "../interface/user-profile.interface";
import userProfileRepo from "../repos/user-profile.repo";
import CustomError from "../utils/custom.error";

class UserProfileService {
  public async getOne(req: Request) {
    const recordId = req.params.id;
    const resObj = await userProfileRepo.getOne(recordId);
    const result: IServiceResponse = {
      count: 1,
      data: resObj,
      message: 1 + AppConstant.GetResponseMessage,
    };
    return result;
  }

  public async getAll(req: Request): Promise<IServiceResponse> {
    const filterExp = req.params.filter || "";
    const resObj = await userProfileRepo.getAll(filterExp);
    const result: IServiceResponse = {
      count: resObj.length,
      data: resObj,
      message: resObj.length + AppConstant.GetResponseMessage,
    };
    return result;
  }

  public async getCount(req: Request): Promise<IServiceResponse> {
    const filterExp = req.params.filter || "";
    const resObj = await userProfileRepo.getCount(filterExp);
    const result: IServiceResponse = {
      count: resObj,
      data: resObj,
      message: resObj + AppConstant.GetResponseMessage,
    };
    return result;
  }

  public async create(req: Request): Promise<IServiceResponse> {
    const data: IUserProfile = req.body;
    if (Array.isArray(data)) {
      if (data.length === 0) {
        throw new CustomError("Empty payload", 422);
      }
    } else {
      if (!data || (data && Object.keys(data).length === 0)) {
        throw new CustomError("Empty payload", 422);
      }
    }

    const resObj = await userProfileRepo.create(req.body);
    const result: IServiceResponse = {
      count: Array.isArray(resObj) ? resObj.length : 1,
      data: resObj,
      message: AppConstant.CreateResponseMessage,
    };
    return result;
  }

  public async update(req: Request): Promise<IServiceResponse> {
    const filterExp: IUserProfileFilter = req.body.filterExp || "";
    const requestedDataToUpdate: IUserProfileUpdate = req.body.data || "";
    if (!filterExp || (filterExp && Object.keys(filterExp).length === 0)) {
      throw new CustomError("Filter expression required", 422);
    } else if (!requestedDataToUpdate || (requestedDataToUpdate && Object.keys(requestedDataToUpdate).length === 0)) {
      throw new CustomError("Payload required to update data", 422);
    } else {
      const resObj = await userProfileRepo.update(filterExp, requestedDataToUpdate);
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
    const filterExp: IUserProfileFilter = req.body.filterExp || "";
    if (!filterExp || (filterExp && Object.keys(filterExp).length === 0)) {
      throw new CustomError("Filter expression required", 422);
    } else {
      const resObj = await userProfileRepo.delete(filterExp);
      const result: IServiceResponse = {
        count: resObj.deletedCount,
        message: resObj.deletedCount + AppConstant.DeleteResponeMessage,
      };
      return result;
    }
  }
}

export default new UserProfileService();
