import { NextFunction, Request, Response } from "express";
import CustomError from "../utils/custom-error.util";

class ErrorInterceptor {
  public static handleError(
    error: CustomError,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    if (error) {
      error.statusCode = error.statusCode || 500;
      ErrorInterceptor.customErrorHandler(res, error);
    } else {
      next();
    }
  }

  private static getErrorMessage(err: CustomError): string {
    let errMessage = "";
    switch (err.statusCode) {
      case 400:
        errMessage = "Bad request";
        break;
      case 401:
        errMessage = "Unauthorized request";
        break;
      case 403:
        errMessage = "Forbidden request";
        break;
      case 404:
        errMessage = "Record not found";
        break;
      case 405:
        errMessage = "Method not allowed";
        break;
      case 408:
        errMessage = "Request timeout, please try again later";
        break;
      case 422:
        errMessage = "Invalid data provided";
        break;
      case 498:
        errMessage = "Token expired, please login again";
        break;
      case 500:
        errMessage = "Internal server error";
        break;
      default:
        errMessage = "Something went wrong";
        break;
    }
    return errMessage;
  }

  private static customErrorHandler(res: Response, err: CustomError): void {
    res.status(err.statusCode).json({
      message: err.message || ErrorInterceptor.getErrorMessage(err),
      statusCode: err.statusCode,
      success: false,
    });
  }
}

export default ErrorInterceptor;
