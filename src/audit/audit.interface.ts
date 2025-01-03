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
    createdBy?: IUser;
}
