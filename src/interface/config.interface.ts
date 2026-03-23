import { CookieOptions } from "express";
import { ConnectOptions } from "mongoose";

export interface IAuditSettings {
  enabled: boolean;
  logToFile: boolean;
  logToDatabase: boolean;
  logFilePath: string;
  logFileMaxSizeInMB: number;
  logFileRetentionDays: number;
  flushQueueIntervalInSeconds: number;
}

export interface IConfig {
  apiBasePath: string;
  auditSettings: IAuditSettings;
  cookieSettings: CookieOptions;
  dbConnectionStr: string;
  dbName: string;
  dbUsername: string;
  dbPassword: string;
  dbSettings: IDBSettings;
  otpExpiresInMin: number;
  jwtSettings: IJWTSettings;
  securitySettings: ISecuritySettings;
  serviceName: string;
  verificationLinkExpiresInHours: number;
  externalApisConfig?: Record<string, IExternalApiConfig>;
}

export interface IDBSettings extends ConnectOptions {
  appname: string;
  connectTimeoutMS: number;
  heartbeatFrequencyMS: number;
  replicaSet: string;
  retryWrites: boolean;
  socketTimeoutMS: number;
  ssl: boolean;
  maxPoolSize: number;
  minPoolSize: number;
}

export interface ISecuritySettings {
  allowCredentials: boolean;
  allowHeaders: string;
  allowedMethod: string;
  allowedOrigin: string;
  requestTimeoutInSeconds: number;
  requestBodyMaxSizeInMB: number;
}

export interface IJWTSettings {
  expiresInHours: string;
  refreshTokenExpiresInHours: string;
}

export interface IExternalApiConfig {
  baseUrl: string;
  timeout: number; // in seconds 
  apiKey?: string;
  authHeaderName?: string;
  defaultHeaders?: Record<string, string>;
  retryCount?: number;
  enabled?: boolean;
  // Multiple authentication strategy
  authConfig?: {
    type: "bearer" | "basic" | "apiKey" | "custom" | "none";
    username?: string;
    password?: string;
    headerName?: string;
    tokenPrefix?: string;
  };
}
