import { Request, Response, NextFunction } from "express";
import auditService from "../audit/audit.service";
import APIConfig from "./config";

export default (req: Request, res: Response, next: NextFunction) => {
  //Request Logger
  auditService.create(req, APIConfig.config.serviceName, APIConfig.config.disableLogs);
  next();
};
