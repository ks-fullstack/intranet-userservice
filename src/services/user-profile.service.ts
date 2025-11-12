import { AppConstants } from "../constants/app.constant";
import { IAuthenticatedRequest, IServiceResponse } from "../interface/common.interface";
import { IUserProfile, IUserProfileFilter, IUserProfileUpdate, UserProfileFieldType } from "../interface/user-profile.interface";
import userProfileRepo from "../repos/user-profile.repo";
import CustomError from "../utils/custom.error";
import validationService from "./validation.service";

class UserProfileService {
  public async getOne(req: IAuthenticatedRequest) {
    const recordId = req.params.id;
    const { fields } = req.query;
    const fieldSelection: UserProfileFieldType = typeof fields === 'string' ? fields.split(",") as UserProfileFieldType : [];
    const resObj = await userProfileRepo.getOne(recordId, fieldSelection);
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
    const fieldSelection: UserProfileFieldType = typeof fields === 'string' ? fields.split(",") as UserProfileFieldType : [];
    const resObj = await userProfileRepo.getAll(filterExp, fieldSelection);
    const result: IServiceResponse = {
      count: resObj.length,
      data: resObj,
      message: resObj.length + AppConstants.GetResponseMessage,
    };
    return result;
  }

  public async getCount(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    const { filter } = req.query;
    const filterExp =  typeof filter === 'string' ? filter : "";
    const resObj = await userProfileRepo.getCount(filterExp);
    const result: IServiceResponse = {
      count: resObj,
      data: resObj,
      message: resObj + AppConstants.GetResponseMessage,
    };
    return result;
  }

  public async create(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    validationService.validatePostPayload(req);
    const inputData: IUserProfile  | IUserProfile[] = req.body;
    if (Array.isArray(inputData)) {
      inputData.forEach((item) => {
        item.createdBy = req.user;
      });
    } else {
      inputData.createdBy = req.user;
    }

    const resObj = await userProfileRepo.create(req.body);
    const result: IServiceResponse = {
      count: Array.isArray(resObj) ? resObj.length : 1,
      data: resObj,
      message: AppConstants.CreateResponseMessage,
    };
    return result;
  }

  public async update(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    validationService.validateFiterExpression(req);
    validationService.validateUpdateDataPayload(req);

    const filterExp: IUserProfileFilter = req.body.filterExp || "";
    const requestedDataToUpdate: IUserProfileUpdate = req.body.data || "";
    requestedDataToUpdate.updatedBy = req.user;
    const resObj = await userProfileRepo.update(filterExp, requestedDataToUpdate);
    const result: IServiceResponse = {
      count: resObj.modifiedCount,
      data: resObj,
      message: resObj.modifiedCount + AppConstants.UpdateResponeMessage,
    };
    return result;
  }

  public async delete(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    const filterExp: IUserProfileFilter = req.body.filterExp || "";
    if (!filterExp || (filterExp && Object.keys(filterExp).length === 0)) {
      throw new CustomError(422, "Filter expression required");
    } else {
      const resObj = await userProfileRepo.delete(filterExp);
      const result: IServiceResponse = {
        count: resObj.deletedCount,
        message: resObj.deletedCount + AppConstants.DeleteResponeMessage,
      };
      return result;
    }
  }
}

export default new UserProfileService();
