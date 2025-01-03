import { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { IConfig } from "../interface/config.interface";

class SecurityMiddleware {
  constructor(app: Express, config: IConfig) {
    // Security Headers
    app.use(helmet.hidePoweredBy());
    app.use(helmet.frameguard({ action: "deny" }));
    app.use(helmet.noSniff());
    app.use(helmet.xssFilter());
    app.use(helmet.referrerPolicy({ policy: "no-referrer" }));

    // Sets "X-Download-Options: noopen".
    app.use(helmet.ieNoOpen());
    const sixtyDaysInSeconds = 5184000;
    app.use(helmet.hsts({ maxAge: sixtyDaysInSeconds }));

    app.use(helmet.contentSecurityPolicy({ directives: { defaultSrc: ["'self'"],
      sandbox: ["allow-forms", "allow-scripts"],
      scriptSrc: ["'self'", "'unsafe-inline'"] }}));

    // Request Headers
    app.use((req: Request, res: Response, next: NextFunction) => {
      // Website you wish to allow to connect
      res.setHeader("Access-Control-Allow-Origin",
        config.securitySettings.allowedOrigin);

      // Request methods you wish to allow
      res.setHeader("Access-Control-Allow-Methods",
        config.securitySettings.allowedMethod);

      // Request headers you wish to allow
      res.setHeader("Access-Control-Allow-Headers",
        config.securitySettings.allowHeaders);

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader("Access-Control-Allow-Credentials",
        config.securitySettings.allowCredentials.toString());

      // Pass to next layer of middleware
      next();
    });
  }
}

export default SecurityMiddleware;
