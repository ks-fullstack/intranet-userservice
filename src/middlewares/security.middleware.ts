import { Express, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import APIConfig from "../utils/config";

class SecurityMiddleware {
  /**
   * Configure Helmet with recommended security settings
   * @param app Express application instance
   */
  public static configureHelmet(app: Express): void {
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
  }

  /**
   * Additional security headers for all responses
   * @param req
   * @param res
   * @param next
   */
  public static addSecurityHeaders(req: Request, res: Response, next: NextFunction): void {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
    res.setHeader("X-DNS-Prefetch-Control", "off");
    next();
  }

  /**
   * Get CORS options for dynamic origin handling
   * @returns CORS options object
   */
  public static getCorsOptions(): cors.CorsOptions {
    return {
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        const allowedOrigins = APIConfig.config.securitySettings.allowedOrigin;
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: APIConfig.config.securitySettings.allowedMethod,
      allowedHeaders: APIConfig.config.securitySettings.allowHeaders,
      credentials: APIConfig.config.securitySettings.allowCredentials,
      maxAge: 600 // Cache preflight response (10 mins)
    };
  }

  /**
   * Validate Content-Type for POST, PUT, PATCH requests
   * @param req 
   * @param res 
   * @param next
   */
  public static validateContentType(req: Request, res: Response, next: NextFunction): void {
    if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
      const contentType = req.headers["content-type"] || "";
      if (!contentType.includes("application/json") && !contentType.includes("multipart/form-data")) {
        res.status(415).json({ message: "Unsupported Media Type: Content-Type must be application/json or multipart/form-data" });
        return;
      }
    }
    next();
  }

  /**
   * Sanitize query parameters to prevent XSS attacks
   * @param req
   * @param res
   * @param next
   */
  public static sanitizeRequest(req: Request, res: Response, next: NextFunction): void {
    if (req.query) {
      for (const key in req.query) {
        if (typeof req.query[key] === "string") {
          req.query[key] = (req.query[key] as string)
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
            .replace(/javascript:/gi, "") // Remove javascript: from URLs
            .replace(/on\w+=["']?[^"'>]+["']?/gi, ""); // Remove event handlers like onClick
        }
      }
    }
    next();
  }
}

export default SecurityMiddleware;
