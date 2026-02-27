import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { AppConstants } from "../constants/app.constant";
import { IAuthenticatedRequest, IServiceResponse } from "../interface/common.interface";
import { IBaseUser, ILogin, IUserFilter } from "../interface/user.interface";
import userRepo from "../repos/user.repo";
import userProfileRepo from "../repos/user-profile.repo";
import APIConfig from "../utils/config";
import { getBaseURL, getCookies, setCookies } from "../utils/common.util";
import CustomError from "../utils/custom-error.util";
import { generateToken, randomToken, validateToken } from "../utils/jwt-util";
import validationService from "./validation.service";
import { callAPI } from "../utils/call-api.util";
import mongoose from "mongoose";

class LoginService {
  public async signUp(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    validationService.validatePostPayload(req);
    
    let resMsg = AppConstants.CreateResponseMessage;
    const userRef: IBaseUser = { 
      userId: req.body.userId,
      emailId: req.body.emailId,
      mobileNo: req.body.mobileNo,
      role: req.body.role || "user"
    };

    req.body.createdBy = req.user || userRef;

    // Check if user already exists
    const { userId, emailId, mobileNo } = req.body;
    const existingUser = await userRepo.findUser({ 
      $or: [
        { userId: userId },
        { emailId: emailId },
        { mobileNo: mobileNo }
      ]
    });
    if (existingUser) {
      throw new CustomError(409, "User already exists, cannot register again. Please use a different userId, emailId or mobileNo.");
    }

    //Register user
    const userBody = req.body;
    const verificationToken = randomToken();
    const verificationExpiresAt = new Date(Date.now() + APIConfig.config.verificationLinkExpiresInHours * 60 * 60 * 1000); 
    const userResObj = await userRepo.create(userBody);
    if (userResObj) {
      //Create user profile
      userResObj.forEach(user => {
        req.body.userRef = user._id;
      });
      await userProfileRepo.create(req.body);
      
      //Send user verification email
      const emailResponse = await callAPI("sendEmailApi", "", {
        method: "POST",
        data: {
          templateName: "verify_account",
          receiverEmail: userResObj[0].emailId,
          placeholderData: {
            TO_NAME: userResObj[0].userId,
            VERIFICATION_URL: `${ getBaseURL() }/user/verify/account/${verificationToken}`,
            LINK_VALID_TILL: APIConfig.config.verificationLinkExpiresInHours
          }
        }
      });

      if (!emailResponse || !emailResponse.success) {
        resMsg = `${emailResponse?.message || "Failed to send verification email"}. User registered successfully.`;
      } else {
        resMsg = "User registered successfully. Verification email sent."; 
        await userRepo.update({ userId: userResObj[0].userId }, { verificationToken: verificationToken, verificationExpiresAt: verificationExpiresAt });
      }
    }

    // Remove sensitive data before sending response
    const sanitizedUserRes = this.sanitizeUserResponse(userResObj);
    const result: IServiceResponse = {
      count: sanitizedUserRes ? 1 : 0,
      data: sanitizedUserRes,
      message: resMsg
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
      throw new CustomError(404, "Invalid username");
    } else if (userResObj.isLocked) {
      throw new CustomError(401, "Account locked");
    } else if (!userResObj.isActive) {
      throw new CustomError(401, "Account not active");
    }

    const enteredPassword: string = loginPayload.password || '';
    const savedPassword: string = userResObj.password || '';
    const isPasswordMatch = bcrypt.compareSync(enteredPassword, savedPassword);

    let result: IServiceResponse;
    if (isPasswordMatch) {
      const now = new Date();
      delete userResObj.password;
      delete userResObj.isLocked;
      delete userResObj.loginAttempt;
      delete userResObj.isActive;
      if (userResObj.refreshToken) {
        if (userResObj.refreshToken.expiresAt && userResObj.refreshToken.expiresAt > new Date()) {
          throw new CustomError(401, "User already logged in");
        }
      }
      delete userResObj.refreshToken;

      const accessToken = generateToken(userResObj, APIConfig.config.jwtSettings.expiresInHours + "h");
      const refreshToken = generateToken(userResObj, APIConfig.config.jwtSettings.refreshTokenExpiresInHours + "h");
      const refreshTokenExpiresIn = new Date(now.getTime() + parseInt(APIConfig.config.jwtSettings.refreshTokenExpiresInHours) * 60 * 60 * 1000);

      await userRepo.update({ userId: loginPayload.userId }, { refreshToken: { tokenHash: refreshToken, expiresAt: refreshTokenExpiresIn }, loginAttempt: 0 });
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
        throw new CustomError(401, "Account locked");
      } else {
        await userRepo.update({ userId: loginPayload.userId }, { loginAttempt: loginAttempt });
        throw new CustomError(401, "Invalid password");
      }
    }

    return result;
  }

  public async signOut(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    validationService.validatePostPayload(req);

    const logoutPayload: IUserFilter = { ...req.body };
    await userRepo.update(logoutPayload, { refreshToken: { tokenHash: "", expiresAt: null }, updatedBy: req.user });
    const result: IServiceResponse = {
      message: "Logout successful",
    };
    return result;
  }

  public async unlockUser(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    validationService.validatePostPayload(req);
    req.body.updatedBy = req.user;

    const unlockPayload: IUserFilter = { ...req.body };
    await userRepo.update(unlockPayload, { isLocked: false, loginAttempt: 0, refreshToken: { tokenHash: "", expiresAt: null } });
    const result: IServiceResponse = {
      message: "User unlocked successfully",
    };
    return result;
  }

  public async refreshToken(req: Request): Promise<IServiceResponse> {
    const refreshToken: string = getCookies(req).refreshToken || "";
    if (!refreshToken) {
      throw new CustomError(401, "Invalid request");
    }

    const userObj = validateToken(refreshToken).data;
    const accessToken = generateToken(userObj, APIConfig.config.jwtSettings.expiresInHours + "h");
    const result: IServiceResponse = {
      data: userObj,
      token: accessToken,
      message: "Token refreshed successfully",
    };
    return result;
  }

  public async deleteUser(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    validationService.validateFiterExpression(req);
    const filterExp: IUserFilter = req.body.filterExp || "";
    const resObj = await userRepo.delete(filterExp);
    const userProfileRes = await userProfileRepo.delete({ userId: filterExp.userId });
    const result: IServiceResponse = {
      count: resObj.deletedCount,
      data: resObj,
      message: "User deleted successfully",
    };
    return result;
  }

  public async verifyUser(req: IAuthenticatedRequest): Promise<IServiceResponse> {
    const userRes = await userRepo.findUser({ verificationToken: req.params.token });
    const userObj = userRes?.toObject();

    // Verify token
    if (!userObj) {
      throw new CustomError(400, "Invalid verification link.");
    }

    // Check token expiry
    if (userObj.verificationExpiresAt && userObj.verificationExpiresAt < new Date()) {
      throw new CustomError(400, "Verification link expired. Please request a new one.");
    }

    // Update user verification status
    const upadetUserObj = await userRepo.update({ userId: userObj?.userId }, { isVerifiedUser : true });
    await userProfileRepo.update({ userId: userObj?.userId }, { isEmailVerified: true});
    const result: IServiceResponse = {
      message: "Account verified successfully!",
      data: upadetUserObj
    }
    return result;
  }

  private sanitizeUserResponse(userResObj: any): any {
    const userResObjArray = Array.isArray(userResObj) ? userResObj : [userResObj];
    const sanitizedUserResObjArray = userResObjArray.map(user => {
      const sanitizedUser = user instanceof mongoose.Document ? user.toObject() : user;
      delete sanitizedUser.password;
      delete sanitizedUser.isLocked;
      delete sanitizedUser.loginAttempt;
      delete sanitizedUser.isActive;
      delete sanitizedUser.refreshToken;
      delete sanitizedUser.isVerifiedUser;
      delete sanitizedUser.verificationToken;
      delete sanitizedUser.verificationExpiresAt;
      delete sanitizedUser._id;
      delete sanitizedUser.__v;
      return sanitizedUser;
    });
    return Array.isArray(userResObj) ? sanitizedUserResObjArray : sanitizedUserResObjArray[0];
  }
}

export default new LoginService();
