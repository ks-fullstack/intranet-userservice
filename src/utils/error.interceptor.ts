import { NextFunction, Request, Response } from "express";
import CustomError from "./custom.error";

const customErrorHandler = (res: Response, err: CustomError) => {
  res.status(err.statusCode).json({
    message: err.message || getErrorMessage(err),
    statusCode: err.statusCode,
    success: false,
  });
};

const getErrorMessage = (err: CustomError): string => {
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
};

export default (error: CustomError, req: Request, res: Response, next: NextFunction) => {
  error.statusCode = error.statusCode || 500;
  customErrorHandler(res, error);
};
