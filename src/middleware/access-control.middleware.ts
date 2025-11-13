import { Response, NextFunction } from "express";
import { IAuthenticatedRequest } from "../interface/common.interface";
import CustomError from "../utils/custom.error";

const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req?.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new CustomError(403, "Forbidden: You don't have permission to access this resource");
    }

    next();
  };
}

export { authorizeRoles };