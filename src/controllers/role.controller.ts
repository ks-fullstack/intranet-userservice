import { NextFunction, Request, Response } from "express";
import roleService from "../services/role.service";
import responseInterceptor from "../utils/response.interceptor";

class RoleController {

  public getOne(req: Request, res: Response, next: NextFunction) {
    try {
      roleService.getOne(req).then((result) => {
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
      roleService.getAll(req).then((result) => {
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
      roleService.getCount(req).then((result) => {
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
      roleService.create(req).then((result) => {
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
      roleService.update(req).then((result) => {
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
      roleService.delete(req).then((result) => {
        responseInterceptor(res, result);
      }).catch((err) => {
        next(err);
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new RoleController();
