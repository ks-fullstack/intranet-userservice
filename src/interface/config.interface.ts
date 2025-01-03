import { CookieOptions } from "express";
import { ConnectOptions } from "mongoose";

export interface IConfig {
  apiBasePath: string;
  cookieSettings: CookieOptions;
  dbConnectionStr: string;
  dbName: string;
  dbUsername: string;
  dbPassword: string;
  dbSettings: IDBSettings;
  disableLogs: boolean;
  jwtSettings: IJWTSettings;
  securitySettings: ISecuritySettings;
  serviceName: string;
}

export interface IDBSettings extends ConnectOptions {
  appname: string;
  connectTimeoutMS: number;
  heartbeatFrequencyMS: number;
  replicaSet: string;
  retryWrites: boolean;
  socketTimeoutMS: number;
  ssl: boolean;
}

export interface ISecuritySettings {
  allowCredentials: boolean;
  allowHeaders: string;
  allowedMethod: string;
  allowedOrigin: string;
}

export interface IJWTSettings {
  expiresIn: string;
  refreshTokenExpiresIn: string;
}
