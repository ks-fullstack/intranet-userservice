import { NextFunction, Request, Response } from "express";
import responseInterceptor from "../utils/response.interceptor";
import loginService from "../services/login.service";
import { clearCookies } from "../utils/common-util";

class LoginController {
  public signUp(req: Request, res: Response, next: NextFunction) {
    try {
      loginService.signUp(req).then((result) => {
        responseInterceptor(res, result);
      }).catch((err) => {
        next(err);
      });
    } catch (err) {
      next(err);
    }
  }

  public signIn(req: Request, res: Response, next: NextFunction) {
    try {
      loginService.signIn(req, res).then((result) => {
        responseInterceptor(res, result);
      }).catch((err) => {
        next(err);
      });
    } catch (err) {
      next(err);
    }
  }

  public signOut(req: Request, res: Response, next: NextFunction) {
    try {
      loginService.signOut(req).then((result) => {
        clearCookies(res, "refreshToken");
        responseInterceptor(res, result);
      }).catch((err) => {
        next(err);
      });
    } catch (err) {
      next(err);
    }
  }

  public unlockUser(req: Request, res: Response, next: NextFunction) {
    try {
      loginService.unlockUser(req).then((result) => {
        responseInterceptor(res, result);
      }).catch((err) => {
        next(err);
      });
    } catch (err) {
      next(err);
    }
  }

  public refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      loginService.refreshToken(req).then((result) => {
        responseInterceptor(res, result);
      }).catch((err) => {
        next(err);
      });
    } catch (err) {
      next(err);
    }
  }

  public deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      loginService.deleteUser(req).then((result) => {
        responseInterceptor(res, result);
      }).catch((err) => {
        next(err);
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new LoginController();
