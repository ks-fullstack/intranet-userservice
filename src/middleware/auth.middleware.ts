import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { IAuthenticatedRequest } from "../interface/common.interface";
import { IBaseUser } from "../interface/user.interface";
import { getCookies } from "../utils/common-util";
import { validateToken } from "../utils/jwt-util";
import CustomError from "../utils/custom-error.util";

const jwtSecretKey: string = process.env.JWT_SECRET_KEY || "";

const validateRequest = (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
  const accessToken = req.headers?.authorization || "";
  const refreshToken = getCookies(req).refreshToken || "";

  if (accessToken) {
    const token = accessToken.split(" ")[1]; // Bearer <token>

    jwt.verify(token, jwtSecretKey, (err, decodeData) => {
      if (err) {
        if ((err as Error).name === "TokenExpiredError" && refreshToken) {
          const refreshTokenData = validateToken(refreshToken);
          if (refreshTokenData.isValid) {
            const userData: any = refreshTokenData.data;
            req.user = userData.data as IBaseUser;
            next();
          } else {
            // Invalid refresh token
            throw new CustomError(498);
          }
        } else {
          // Invalid access token
          throw new CustomError(498, "Invalid access token");
        }
      } else {
        const userData: any = decodeData;
        req.user = userData.data as IBaseUser;
        next();
      }
    });
  } else {
    // Unauthorized request
    throw new CustomError(401);
  }
};

export { validateRequest };
