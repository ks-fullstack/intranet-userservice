import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service";
import ResponseInterceptor from "../interceptors/response.interceptor";

class UserController {
  public getOne(req: Request, res: Response, next: NextFunction) {
    userService
      .getOne(req)
      .then((result) => {
        ResponseInterceptor.handleResponse(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public getAll(req: Request, res: Response, next: NextFunction) {
    userService
      .getAll(req)
      .then((result) => {
        ResponseInterceptor.handleResponse(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public getCount(req: Request, res: Response, next: NextFunction) {
    userService
      .getCount(req)
      .then((result) => {
        ResponseInterceptor.handleResponse(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public create(req: Request, res: Response, next: NextFunction) {
    userService
      .create(req)
      .then((result) => {
        ResponseInterceptor.handleResponse(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public update(req: Request, res: Response, next: NextFunction) {
    userService
      .update(req)
      .then((result) => {
        ResponseInterceptor.handleResponse(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public delete(req: Request, res: Response, next: NextFunction) {
    userService
      .delete(req)
      .then((result) => {
        ResponseInterceptor.handleResponse(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }
}

export default new UserController();
