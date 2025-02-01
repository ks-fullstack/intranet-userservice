import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import AppConstant from "../constants/app.constant";
import { IServiceResponse } from "../interface/common.interface";
import { IUserFilter } from "../interface/user.interface";
import userRepo from "../repos/user.repo";
import userProfileRepo from "../repos/user-profile.repo";
import APIConfig from "../utils/config";
import { getCookies, setCookies } from "../utils/common-util";
import CustomError from "../utils/custom.error";
import { generateToken, validateToken } from "../utils/jwt-util";
import validationService from "./validation.service";

class LoginService {
  public async signUp(req: Request) {
    validationService.validatePostPayload(req);

    //Register user
    const userResObj = await userRepo.create(req.body);
    if(userResObj) {
      //Create user profile
      await userProfileRepo.create(req.body);
    }
    
    const result: IServiceResponse = {
      count: Array.isArray(userResObj) ? userResObj.length : 1,
      data: userResObj,
      message: AppConstant.CreateResponseMessage,
    };
    return result;
  }

  public async signIn(req: Request, res: Response) {
    validationService.validatePostPayload(req);

    const loginPayload: IUserFilter = { ...req.body };
    // Get user data
    let user = await userRepo.findUser({ userId: loginPayload.userId }, ["password", "loginAttempt", "isLocked", "refreshToken"]);
    const userResObj = user?.toObject();

    if (!userResObj) {
      throw new CustomError("Invalid username", 404);
    } else if (userResObj.isLocked) {
      throw new CustomError("Account locked", 401);
    }

    const enteredPassword: string = loginPayload.password || '';
    const savedPassword: string = userResObj.password || '';
    const isPasswordMatch = bcrypt.compareSync(enteredPassword, savedPassword);

    let result: IServiceResponse;
    if (isPasswordMatch) {
      delete userResObj.password;
      delete userResObj.isLocked;
      delete userResObj.loginAttempt;
      if(userResObj.refreshToken) {
        if(validateToken(userResObj.refreshToken).isValid) {
          throw new CustomError("User already logged in", 401);
        }
      }
      delete userResObj.refreshToken;

      const accessToken = generateToken(userResObj, APIConfig.config.jwtSettings.expiresIn);
      const refreshToken = generateToken(userResObj, APIConfig.config.jwtSettings.refreshTokenExpiresIn);

      await userRepo.update({ userId: loginPayload.userId }, { token: accessToken, refreshToken: refreshToken, loginAttempt: 0 });
      setCookies(res, "refreshToken", refreshToken);
      result = {
        data: userResObj,
        token: accessToken,
        message: "Login successful",
      };
    } else {
      const loginAttempt = (userResObj.loginAttempt || 0) + 1;
      if (loginAttempt > 3) {
        await userRepo.update({ userId: loginPayload.userId }, { loginAttempt: loginAttempt, isLocked: true });
        throw new CustomError("Account locked", 401);
      } else {
        await userRepo.update({ userId: loginPayload.userId }, { loginAttempt: loginAttempt });
        throw new CustomError("Invalid password", 401);
      }
    }

    return result;
  }

  public async signOut(req: Request) {
    validationService.validatePostPayload(req);

    const logoutPayload: IUserFilter = { ...req.body };
    await userRepo.update(logoutPayload, { token: "", refreshToken: "" });
    const result: IServiceResponse = {
      message: "Logout successful",
    };
    return result;
  }

  public async unlockUser(req: Request) {
    validationService.validatePostPayload(req);

    const unlockPayload: IUserFilter = { ...req.body };
    await userRepo.update(unlockPayload, { isLocked: false, loginAttempt: 0, token: "", refreshToken: "" });
    const result: IServiceResponse = {
      message: "User unlocked successfully",
    };
    return result;
  }

  public async refreshToken(req: Request) {
    const refreshToken: string = getCookies(req).refreshToken || "";
    if(!refreshToken) {
      throw new CustomError("Invalid request", 401);
    }

    const userObj = validateToken(refreshToken).data;
    const accessToken = generateToken(userObj, APIConfig.config.jwtSettings.expiresIn);
    await userRepo.update(userObj, { token: accessToken });
    const result: IServiceResponse = {
      data: userObj,
      token: accessToken,
      message: "Token refreshed successfully",
    };
    return result;
  }
}

export default new LoginService();
