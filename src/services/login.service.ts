import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { AppConstants } from "../constants/app.constant";
import { IAuthenticatedRequest, IServiceResponse } from "../interface/common.interface";
import { IBaseUser, ILogin, IUserFilter } from "../interface/user.interface";
import userRepo from "../repos/user.repo";
import userProfileRepo from "../repos/user-profile.repo";
import APIConfig from "../utils/config";
import { getCookies, setCookies } from "../utils/common-util";
import CustomError from "../utils/custom.error";
import { generateToken, validateToken } from "../utils/jwt-util";
import validationService from "./validation.service";

class LoginService {
  public async signUp(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    validationService.validatePostPayload(req);
    
    const userRef: IBaseUser = { 
      userId: req.body.userId, 
      emailId: req.body.emailId, 
      mobileNo: req.body.mobileNo,
      role: req.body.role || "user"
    };

    req.body.createdBy = req.user || userRef;

    //Register user
    const userResObj = await userRepo.create(req.body);
    if(userResObj) {
      //Create user profile
      userResObj.forEach(user => {
        req.body.userRef = user._id;
      });
      await userProfileRepo.create(req.body);
    }
    
    const result: IServiceResponse = {
      count: Array.isArray(userResObj) ? userResObj.length : 1,
      data: userResObj,
      message: AppConstants.CreateResponseMessage,
    };
    return result;
  }

  public async signIn(req: Request, res: Response): Promise<IServiceResponse> {
    validationService.validatePostPayload(req);

    const loginPayload: ILogin = { ...req.body };
    // Get user data
    let user = await userRepo.findUser({ userId: loginPayload.userId }, ["password", "loginAttempt", "isLocked", "isActive", "refreshToken"]);
    const userResObj = user?.toObject();

    if (!userResObj) {
      throw new CustomError("Invalid username", 404);
    } else if (userResObj.isLocked) {
      throw new CustomError("Account locked", 401);
    } else if (!userResObj.isActive) {
      throw new CustomError("Account not active", 401);
    }

    const enteredPassword: string = loginPayload.password || '';
    const savedPassword: string = userResObj.password || '';
    const isPasswordMatch = bcrypt.compareSync(enteredPassword, savedPassword);

    let result: IServiceResponse;
    if (isPasswordMatch) {
      delete userResObj.password;
      delete userResObj.isLocked;
      delete userResObj.loginAttempt;
      delete userResObj.isActive;
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

  public async signOut(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    validationService.validatePostPayload(req);

    const logoutPayload: IUserFilter = { ...req.body };
    const res = await userRepo.update(logoutPayload, { token: "", refreshToken: "", updatedBy: req.user });
    const result: IServiceResponse = {
      message: "Logout successful",
    };
    return result;
  }

  public async unlockUser(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    validationService.validatePostPayload(req);
    req.body.updatedBy = req.user;

    const unlockPayload: IUserFilter = { ...req.body };
    await userRepo.update(unlockPayload, { isLocked: false, loginAttempt: 0, token: "", refreshToken: "" });
    const result: IServiceResponse = {
      message: "User unlocked successfully",
    };
    return result;
  }

  public async refreshToken(req: Request): Promise<IServiceResponse> {
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
