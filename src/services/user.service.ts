import { AppConstants } from "../constants/app.constant";
import { IAuthenticatedRequest, IServiceResponse } from "../interface/common.interface";
import { IUserFilter, IUserUpdate, UserFieldType } from "../interface/user.interface";
import userProfileRepo from "../repos/user-profile.repo";
import userRepo from "../repos/user.repo";
import validationService from "./validation.service";

class UserService {
  public async getOne(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    const recordId = req.params.id;
    const { fields } = req.query;
    const fieldSelection: UserFieldType = typeof fields === 'string' ? fields.split(",") as UserFieldType : [];
    const resObj = await userRepo.getOne(recordId, fieldSelection);
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
    const fieldSelection: UserFieldType = typeof fields === 'string' ? fields.split(",") as UserFieldType : [];
    const resObj = await userRepo.getAll(filterExp, fieldSelection);
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
    const resObj = await userRepo.getCount(filterExp);
    const result: IServiceResponse = {
      count: resObj,
      data: resObj,
      message: resObj + AppConstants.GetResponseMessage,
    };
    return result;
  }

  public async create(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    validationService.validatePostPayload(req);

    if (Array.isArray(req.body)) {
      req.body.forEach((item) => {
        item.createdBy = req.user;
      });
    } else {
      req.body.createdBy = req.user;
    }

    const resObj = await userRepo.create(req.body);
    if(resObj) {
      //Create user profile
      resObj.forEach(user => {
        if (Array.isArray(req.body)) {
          const userIndex = req.body.findIndex(reqUser => reqUser.userId === user.userId);
          if(userIndex !== -1) {
            req.body[userIndex].userRef = user._id;
          }
        } else {
          req.body.userRef = user._id;
        }
      });
      await userProfileRepo.create(req.body);
    }
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

    const filterExp: IUserFilter = req.body.filterExp || "";
    const requestedDataToUpdate: IUserUpdate = req.body.data || "";
    requestedDataToUpdate.updatedBy = req.user;
    const resObj = await userRepo.update(filterExp, requestedDataToUpdate);
    const result: IServiceResponse = {
      count: resObj.modifiedCount,
      data: resObj,
      message: resObj.modifiedCount + AppConstants.UpdateResponeMessage,
    };
    return result;
  }

  public async delete(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    validationService.validateFiterExpression(req);
    const filterExp: IUserFilter = req.body.filterExp || "";
    const resObj = await userRepo.delete(filterExp);
    const result: IServiceResponse = {
      count: resObj.deletedCount,
      message: resObj.deletedCount + AppConstants.DeleteResponeMessage,
    };
    return result;
  }
}

export default new UserService();
