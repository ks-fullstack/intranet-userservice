import { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { IConfig } from "../interface/config.interface";

class SecurityMiddleware {
  constructor(app: Express, config: IConfig) {
    /* ------------------------------------------------------------------
    * Helmet – Secure Express apps by setting various HTTP headers
    * ------------------------------------------------------------------ */
    app.use(
      helmet({
        hidePoweredBy: true,
        frameguard: { action: "deny" },
        referrerPolicy: { policy: "no-referrer" },
        hsts: {
          maxAge: 60 * 60 * 24 * 60, // 60 days
          includeSubDomains: true,
          preload: true
        },
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
          }
        },
        crossOriginEmbedderPolicy: false // avoids breaking Swagger / file downloads
      })
    );

    /* ------------------------------------------------------------------
    * CORS – Centralized & Safe
    * ------------------------------------------------------------------ */
    app.use(
      cors({
        origin: (origin, callback) => {
          const allowedOrigins = config.securitySettings.allowedOrigin;
          if (!origin) return callback(null, true);

          if (allowedOrigins.includes(origin)) {
            return callback(null, true);
          }

          return callback(new Error("CORS policy violation"));
        },
        methods: config.securitySettings.allowedMethod,
        allowedHeaders: config.securitySettings.allowHeaders,
        credentials: config.securitySettings.allowCredentials,
        maxAge: 600 // Cache preflight response (10 mins)
      })
    );

    /* ------------------------------------------------------------------
     * Preflight OPTIONS handler
     * ------------------------------------------------------------------ */
    app.options("*", cors());

    /* ------------------------------------------------------------------
     * Additional Hardening Headers
     * ------------------------------------------------------------------ */
    app.use((req: Request, res: Response, next: NextFunction) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
      res.setHeader("X-DNS-Prefetch-Control", "off");
      next();
    });
  }
}

export default SecurityMiddleware;
