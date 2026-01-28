import { NextFunction, Request, Response } from "express";
import otpService from "../services/otp.service";
import responseInterceptor from "../interceptors/response.interceptor";

class OTPController {
  public getOne(req: Request, res: Response, next: NextFunction) {
    otpService
      .getOne(req)
      .then((result) => {
        responseInterceptor(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public getAll(req: Request, res: Response, next: NextFunction) {
    otpService
      .getAll(req)
      .then((result) => {
        responseInterceptor(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public getCount(req: Request, res: Response, next: NextFunction) {
    otpService
      .getCount(req)
      .then((result) => {
        responseInterceptor(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public create(req: Request, res: Response, next: NextFunction) {
    otpService
      .create(req)
      .then((result) => {
        responseInterceptor(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public update(req: Request, res: Response, next: NextFunction) {
    otpService
      .update(req)
      .then((result) => {
        responseInterceptor(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public delete(req: Request, res: Response, next: NextFunction) {
    otpService
      .delete(req)
      .then((result) => {
        responseInterceptor(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public sendOTP(req: Request, res: Response, next: NextFunction) {
    otpService
      .sendOTP(req)
      .then((result) => {
        responseInterceptor(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public verifyOTP(req: Request, res: Response, next: NextFunction) {
    otpService
      .verifyOTP(req)
      .then((result) => {
        responseInterceptor(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }
}

export default new OTPController();
