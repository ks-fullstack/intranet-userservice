import { Request, Response } from 'express';
import fs from 'fs';
import APIConfig from './config';

const readJSONFile = (filePath: string) => {
  const file = fs.readFileSync(filePath).toString();
  return JSON.parse(file);
}

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

export { readJSONFile, getCookies, setCookies };
