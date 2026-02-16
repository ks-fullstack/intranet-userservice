import { Response } from "express";
import { IServiceResponse, IServiceResponseExtend } from "../interface/common.interface";

class ResponseInterceptor {
  public static handleResponse(res: Response, result: IServiceResponse): void {
    const responseObj: IServiceResponseExtend = {
      statusCode: 200,
      success: true,
      ...result,
    };
    res.status(200).json(responseObj);
  }
}

export default ResponseInterceptor;
