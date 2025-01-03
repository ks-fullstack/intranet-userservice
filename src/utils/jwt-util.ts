import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IJWTVerifyToken } from "../interface/common.interface";
import { getCookies } from "./common-util";
import CustomError from "./custom.error";

const jwtSecretKey: string = process.env.JWT_SECRET_KEY || "";

const generateToken = (payload: Object | string, expiresIn: string): string => {
  const options = {
    expiresIn: expiresIn, // Token expiration time
  };
  const token: string = jwt.sign({ data: payload }, jwtSecretKey, options);
  return token;
};

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers?.authorization || "";
  const refreshToken = getCookies(req).refreshToken || "";

  if (accessToken && refreshToken) {
    const token = accessToken.split(" ")[1]; // Bearer <token>

    jwt.verify(token, jwtSecretKey, (err, res) => {
      if (err) {
        // Invalid token
        throw new CustomError("", 403);
      } else {
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
