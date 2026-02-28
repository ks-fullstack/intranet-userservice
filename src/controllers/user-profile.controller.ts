import { NextFunction, Request, Response } from "express";
import userProfileService from "../services/user-profile.service";
import { ResponseInterceptor } from "../interceptors";

class UserProfileController {
  public getOne(req: Request, res: Response, next: NextFunction) {
    userProfileService
      .getOne(req)
      .then((result) => {
        ResponseInterceptor.handleResponse(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public getAll(req: Request, res: Response, next: NextFunction) {
    userProfileService
      .getAll(req)
      .then((result) => {
        ResponseInterceptor.handleResponse(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public getCount(req: Request, res: Response, next: NextFunction) {
    userProfileService
      .getCount(req)
      .then((result) => {
        ResponseInterceptor.handleResponse(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public create(req: Request, res: Response, next: NextFunction) {
    userProfileService
      .create(req)
      .then((result) => {
        ResponseInterceptor.handleResponse(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public update(req: Request, res: Response, next: NextFunction) {
    userProfileService
      .update(req)
      .then((result) => {
        ResponseInterceptor.handleResponse(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public delete(req: Request, res: Response, next: NextFunction) {
    userProfileService
      .delete(req)
      .then((result) => {
        ResponseInterceptor.handleResponse(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }
}

export default new UserProfileController();
