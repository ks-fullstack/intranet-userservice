import { Request } from "express";
import { AppConstants } from "../constants/app.constant";
import CustomError from "../utils/custom.error";

class ValidationService {
  private static _instance: ValidationService = new ValidationService();

  public static getInstanceOf(): ValidationService {
    return ValidationService._instance;
  }

  public validatePostPayload(req: Request): void {
    if (Array.isArray(req.body)) {
      if (req.body.length === 0) {
        throw new CustomError(AppConstants.EmptyPayloadMessage, 422);
      }
    } else {
      if (!req.body || (req.body && Object.keys(req.body).length === 0)) {
        throw new CustomError(AppConstants.EmptyPayloadMessage, 422);
      }
    }
  }

  public validateFiterExpression(req: Request): void {
    const filterExp = req.body.filterExp || "";
    if (!filterExp || (filterExp && Object.keys(filterExp).length === 0)) {
      throw new CustomError(AppConstants.FilterExpressionRequiredMessage, 422);
    }
  }

  public validateUpdateDataPayload(req: Request): void {
    const requestedDataToUpdate = req.body.data || "";
    if (!requestedDataToUpdate || (requestedDataToUpdate && Object.keys(requestedDataToUpdate).length === 0)) {
      throw new CustomError(AppConstants.UpdatePayloadRequiredMessage, 422);
    }
  }

  public validateQueryParam(req: Request, parameter: string): void {
    if (!req.params[parameter]) {
      throw new CustomError(AppConstants.InvalidQueryParameterMessage, 422);
    }
  }
}

export default ValidationService.getInstanceOf();
