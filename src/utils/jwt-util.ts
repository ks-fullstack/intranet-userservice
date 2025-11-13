import jwt from "jsonwebtoken";
import { IJWTVerifyToken } from "../interface/common.interface";

const jwtSecretKey: string = process.env.JWT_SECRET_KEY || "";

const generateToken = (payload: Object | string, expiresIn: string): string => {
  const token: string = jwt.sign({ data: payload }, jwtSecretKey, { expiresIn });
  return token;
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

export { generateToken, validateToken };