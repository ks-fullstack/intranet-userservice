import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IAuthenticatedRequest, IJWTVerifyToken } from "../interface/common.interface";
import { getCookies } from "./common-util";
import CustomError from "./custom.error";
import { IBaseUser } from "../interface/user.interface";

const jwtSecretKey: string = process.env.JWT_SECRET_KEY || "";

const generateToken = (payload: Object | string, expiresIn: string): string => {
  const options = {
    expiresIn: expiresIn, // Token expiration time
  };
  const token: string = jwt.sign({ data: payload }, jwtSecretKey, options);
  return token;
};

const validateRequest = (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
  const accessToken = req.headers?.authorization || "";
  const refreshToken = getCookies(req).refreshToken || "";

  if (accessToken && refreshToken) {
    const token = accessToken.split(" ")[1]; // Bearer <token>

    jwt.verify(token, jwtSecretKey, (err, decodeData) => {
      if (err) {
        // Invalid token
        throw new CustomError("", 403);
      } else {
        const userData: any = decodeData;
        req.user = userData.data as IBaseUser;
        next();
      }
    });
  } else {
    // Unauthorized request
    throw new CustomError("", 401);
  }
};

const validateToken = (token: string): IJWTVerifyToken => {
  const result: IJWTVerifyToken = {
    isValid: false,
    data: undefined,
  };
  try {
    const decodeData: any = jwt.verify(token, jwtSecretKey);
    result.isValid = true;
    result.data = decodeData.data;
    return result;
  } catch (error) {
    return result;
  }
};

export { generateToken, validateRequest, validateToken };
