import { NextFunction, Request, Response } from "express";
import loginService from "../services/login.service";
import { clearCookies } from "../utils/common-util";
import ResponseInterceptor from "../interceptors/response.interceptor";

class LoginController {
  public signUp(req: Request, res: Response, next: NextFunction) {
    loginService
      .signUp(req)
      .then((result) => {
        ResponseInterceptor.handleResponse(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public signIn(req: Request, res: Response, next: NextFunction) {
    loginService
      .signIn(req, res)
      .then((result) => {
        ResponseInterceptor.handleResponse(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public signOut(req: Request, res: Response, next: NextFunction) {
    loginService
      .signOut(req)
      .then((result) => {
        clearCookies(res, "refreshToken");
        ResponseInterceptor.handleResponse(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public unlockUser(req: Request, res: Response, next: NextFunction) {
    loginService
      .unlockUser(req)
      .then((result) => {
        ResponseInterceptor.handleResponse(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public refreshToken(req: Request, res: Response, next: NextFunction) {
    loginService
      .refreshToken(req)
      .then((result) => {
        ResponseInterceptor.handleResponse(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public deleteUser(req: Request, res: Response, next: NextFunction) {
    loginService
      .deleteUser(req)
      .then((result) => {
        ResponseInterceptor.handleResponse(res, result);
      })
      .catch((err) => {
        next(err);
      });
  }

  public verifyUser(req: Request, res: Response, next: NextFunction) {
    loginService
      .verifyUser(req)
      .then((result) => {
        res.redirect(`${process.env.FRONTEND_URL}?status=success`);
      })
      .catch((err) => {
        res.redirect(`${process.env.FRONTEND_URL}/verified?status=failed`);
      });
  }
}

export default new LoginController();
