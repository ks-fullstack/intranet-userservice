import { Request, Response, NextFunction } from "express";
import auditService from "../audit/audit.service";
import APIConfig from "../utils/config";
import CustomError from "../utils/custom.error";

class RequestInterceptor {
  public static logRequest(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    auditService.logRequest(
      req,
      APIConfig.config.serviceName,
      APIConfig.config.disableLogs,
    );
    next();
  }

  public static limitRequestBodySize(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
      const contentLength = req.headers["content-length"];
      const maxSize =
        APIConfig.config.securitySettings.requestBodyMaxSizeInMB * 1024 * 1024; // Convert MB to bytes
      if (contentLength && parseInt(contentLength) > maxSize) {
        throw new CustomError(
          413,
          `Request body is too large. Maximum allowed size is ${APIConfig.config.securitySettings.requestBodyMaxSizeInMB} MB.`,
        );
      }
      next();
    };
  }

  public static setRequestTimeout(): (req: Request, res: Response, next: NextFunction) => void {
    const timeoutInSeconds = APIConfig.config.securitySettings.requestTimeoutInSeconds;
    return (req: Request, res: Response, next: NextFunction) => {
      const timer = setTimeout(() => {
        if (!res.headersSent) {
          const err = new CustomError(408, "Request timed out, please try again later");
          next(err);
        }
      }, timeoutInSeconds * 1000);

      // Clear the timeout if the request finishes or the connection closes
      res.on("finish", () => clearTimeout(timer));
      res.on("close", () => clearTimeout(timer));

      next();
    };
  }
}

export default RequestInterceptor;
