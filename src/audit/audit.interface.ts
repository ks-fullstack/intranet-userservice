interface IUser {
    firstname: string;
    lastname: string;
    userId: string;
    emailId: string;
}

export default interface IAudit {
    serviceName: string;
    reqUrl: string;
    reqType: string;
    reqPayload?: object;
    message?: string;
    createdBy?: IUser;
}

export interface AuditLogEntry {
  timestamp: string;
  serviceName: string;
  reqUrl: string;
  reqType: string;
  reqPayload?: object;
  message?: string;
  createdBy?: IUser;
}
