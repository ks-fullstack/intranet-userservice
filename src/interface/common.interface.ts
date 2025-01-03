export interface IServiceResponse {
  data?: any;
  message: string;
  count?: number;
  token?: string;
}

export interface IServiceResponseExtend extends IServiceResponse {
  success: boolean;
  statusCode: number;
}

export interface IJWTVerifyToken {
  isValid: boolean;
  data: any | undefined;
}
