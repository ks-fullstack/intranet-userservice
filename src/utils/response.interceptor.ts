import { Response } from "express";
import { IServiceResponse, IServiceResponseExtend } from "../interface/common.interface";

export default (res: Response, result: IServiceResponse) => {
  const responseObj: IServiceResponseExtend = {
    statusCode: 200,
    success: true,
    ...result,
  };
  res.status(200).json(responseObj);
};
