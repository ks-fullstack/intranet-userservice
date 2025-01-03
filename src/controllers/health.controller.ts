import { NextFunction, Request, Response } from "express";
import { IServiceResponse } from "../interface/common.interface";
import APIConfig from "../utils/config";
import responseHandler from "../utils/response.interceptor";

const serviceName = APIConfig.config.serviceName;

class HealthController {

  public checkHealth(req: Request, res: Response, next: NextFunction) {
    const healthcheck = {
      uptime: process.uptime(),
      timestamp: Date.now()
    };
    try {
      const result: IServiceResponse = {
        data: healthcheck,
        message: "Intranet-PostService up and running",
      };
      responseHandler(res, result);
    } catch (err) {
      next(err);
    }
  }
}

export default new HealthController();
