import { AppConstants } from "../constants/app.constant";
import { IAuthenticatedRequest, IServiceResponse } from "../interface/common.interface";
import { IRole, IRoleFilter, IRoleUpdate, RoleFieldType } from "../interface/role.interface";
import roleRepo from "../repos/role.repo";
import CustomError from "../utils/custom.error";
import validationService from "./validation.service";

class RoleService {
  public async getOne(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    const recordId = req.params.id;
    const { fields } = req.query;
    const fieldSelection: RoleFieldType = typeof fields === 'string' ? fields.split(",") as RoleFieldType : [];
    const resObj = await roleRepo.getOne(recordId, fieldSelection);
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
    const fieldSelection: RoleFieldType = typeof fields === 'string' ? fields.split(",") as RoleFieldType : [];
    const resObj = await roleRepo.getAll(filterExp, fieldSelection);
    const result: IServiceResponse = {
      count: resObj.length,
      data: resObj,
      message: resObj.length + AppConstants.GetResponseMessage,
    };
    return result;
  }

  public async getCount(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    const filterExp = req.params.filter || "";
    const resObj = await roleRepo.getCount(filterExp);
    const result: IServiceResponse = {
      count: resObj,
      data: resObj,
      message: resObj + AppConstants.GetResponseMessage,
    };
    return result;
  }

  public async create(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    validationService.validatePostPayload(req);

    const inputData: IRole | IRole[] = req.body;
    if (Array.isArray(inputData)) {
      inputData.forEach((item) => {
        item.createdBy = req.user;
      });
    } else {
      inputData.createdBy = req.user;
    }
    const resObj = await roleRepo.create(inputData);
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
    const filterExp: IRoleFilter = req.body.filterExp || "";
    const requestedDataToUpdate: IRoleUpdate = req.body.data || "";
    requestedDataToUpdate.updatedBy = req.user;
    const resObj = await roleRepo.update(filterExp, requestedDataToUpdate);
    const result: IServiceResponse = {
      count: resObj.modifiedCount,
      data: resObj,
      message: resObj.modifiedCount + AppConstants.UpdateResponeMessage,
    };
    return result;
  }

  public async delete(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    const filterExp: IRoleFilter = req.body.filterExp || "";
    if (!filterExp || (filterExp && Object.keys(filterExp).length === 0)) {
      throw new CustomError("Filter expression required", 422);
    } else {
      const resObj = await roleRepo.delete(filterExp);
      const result: IServiceResponse = {
        count: resObj.deletedCount,
        message: resObj.deletedCount + AppConstants.DeleteResponeMessage,
      };
      return result;
    }
  }
}

export default new RoleService();
