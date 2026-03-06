import { AppConstants } from "../constants";
import { IAuthenticatedRequest, IServiceResponse,  IUserProfile, IUserProfileFilter, IUserProfileUpdate, UserProfileFieldType } from "../interface";
import { UserProfileRepo } from "../repos";
import CustomError from "../utils/custom-error.util";
import validationService from "./validation.service";

class UserProfileService {
  public async getOne(req: IAuthenticatedRequest) {
    const recordId = req.params.id;
    const { fields } = req.query;
    const fieldSelection: UserProfileFieldType = typeof fields === 'string' ? fields.split(",") as UserProfileFieldType : [];
    const resObj = await UserProfileRepo.getOne(recordId, fieldSelection);
    const result: IServiceResponse = {
      count: resObj ? 1 : 0,
      data: resObj,
      message: (resObj ? 1 : 0) + AppConstants.GetResponseMessage,
    };
    return result;
  }

  public async getAll(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    const { fields, filter } = req.query;
    const filterExp =  typeof filter === 'string' ? filter : "";
    const fieldSelection: UserProfileFieldType = typeof fields === 'string' ? fields.split(",") as UserProfileFieldType : [];
    const resObj = await UserProfileRepo.getAll(filterExp, fieldSelection);
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
    const resObj = await UserProfileRepo.getCount(filterExp);
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

    const resObj = await UserProfileRepo.create(req.body);
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
    const resObj = await UserProfileRepo.update(filterExp, requestedDataToUpdate);
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
      const resObj = await UserProfileRepo.delete(filterExp);
      const result: IServiceResponse = {
        count: resObj.deletedCount,
        message: resObj.deletedCount + AppConstants.DeleteResponeMessage,
      };
      return result;
    }
  }
}

export default new UserProfileService();
