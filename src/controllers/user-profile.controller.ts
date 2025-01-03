import { NextFunction, Request, Response } from "express";
import responseInterceptor from "../utils/response.interceptor";
import userProfileService from "../services/user-profile.service";

class UserProfileController {
  public getOne(req: Request, res: Response, next: NextFunction) {
    try {
      userProfileService.getOne(req).then((result) => {
        responseInterceptor(res, result);
      }).catch((err) => {
        next(err);
      });
    } catch (err) {
      next(err);
    }
  }

  public getAll(req: Request, res: Response, next: NextFunction) {
    try {
      userProfileService.getAll(req).then((result) => {
        responseInterceptor(res, result);
      }).catch((err) => {
        next(err);
      });
    } catch (err) {
      next(err);
    }
  }

  public getCount(req: Request, res: Response, next: NextFunction) {
    try {
      userProfileService.getCount(req).then((result) => {
        responseInterceptor(res, result);
      }).catch((err) => {
        next(err);
      });
    } catch (err) {
      next(err);
    }
  }

  public create(req: Request, res: Response, next: NextFunction) {
    try {
      userProfileService.create(req).then((result) => {
        responseInterceptor(res, result);
      }).catch((err) => {
        next(err);
      });
    } catch (err) {
      next(err);
    }
  }

  public update(req: Request, res: Response, next: NextFunction) {
    try {
      userProfileService.update(req).then((result) => {
        responseInterceptor(res, result);
      }).catch((err) => {
        next(err);
      });
    } catch (err) {
      next(err);
    }
  }

  public delete(req: Request, res: Response, next: NextFunction) {
    try {
      userProfileService.delete(req).then((result) => {
        responseInterceptor(res, result);
      }).catch((err) => {
        next(err);
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new UserProfileController();
