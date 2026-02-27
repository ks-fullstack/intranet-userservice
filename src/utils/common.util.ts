import { Request, Response } from 'express';
import fs from 'fs';
import APIConfig from './config';

const readJSONFile = (filePath: string) => {
  const file = fs.readFileSync(filePath).toString();
  return JSON.parse(file);
}

//#region Cookies Method
const getCookies = (req: Request) => {
  let cookies: any = {};
  let cookieList = req.headers.cookie?.split(';');
  if (cookieList) {
    cookieList.forEach((cookie) => {
      let [key, value] = cookie.split('=');
      cookies[key.trim()] = value.trim();
    });
  }
  return cookies;
}

const setCookies = (res: Response, cookieName: string, cookieValue: string) => {
  res.cookie(cookieName, cookieValue, APIConfig.config.cookieSettings); // 8 hours
}

const clearCookies = (res: Response, cookieName: string) => {
  let cookieSettings = { 
    httpOnly: APIConfig.config.cookieSettings.httpOnly,
    secure: APIConfig.config.cookieSettings.secure,
    sameSite: APIConfig.config.cookieSettings.sameSite
  };
  res.clearCookie(cookieName, cookieSettings);
}
//#endregion

const generateOTP = (length: number = 6, isAlfaNumeric: boolean = false): string => {
  let chars: string = '0123456789', otp: string = '';
  if (isAlfaNumeric) {
    chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  }

  for (let i = 0; i < length; i++) {
    otp += chars[Math.floor(Math.random() * chars.length)];
  }

  return otp;
}

const getBaseURL = (): string => {
  let baseUrl: string = "";
  if (process.env.DOMAIN?.includes('localhost')) {
    baseUrl = `${process.env.PROTOCOL}://${process.env.DOMAIN}:${process.env.PORT}${APIConfig.config.apiBasePath}`;
  } else {
    baseUrl = `${process.env.PROTOCOL}://${process.env.DOMAIN}${APIConfig.config.apiBasePath}`;
  }
  return baseUrl;
}

export { readJSONFile, getCookies, setCookies, clearCookies, generateOTP, getBaseURL };
