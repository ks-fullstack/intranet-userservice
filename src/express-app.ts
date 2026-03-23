import bodyParser from "body-parser";
import express, { Express } from "express";
import MongoConnection from "./db/mongo-connection";
import Routes from "./routers/router";
import APIConfig from "./utils/config";
import { RequestInterceptor, ErrorInterceptor } from "./interceptors";
import SecurityMiddleware from "./middleware/security.middleware";
import { watchUserCollection } from "./services/change-stream.service";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "./docs/swagger";
import cors from "cors";
import compression from "compression";
import auditService from "./audit/audit.service";

class ExpressApp {
  private static _instance: ExpressApp = new ExpressApp();
  public app: Express;

  constructor() {
    this.app = express();
  }

  public static getInstance(): ExpressApp {
    return ExpressApp._instance;
  }

  public async connectApp() {
    // Connect Database
    MongoConnection.triggerCallbackFunOnMongoConnEvent("connected", watchUserCollection);
    await MongoConnection.connectDB();
    
    // Helmet security middleware
    SecurityMiddleware.configureHelmet(this.app);

    // CORS configuration
    this.app.use(cors(SecurityMiddleware.getCorsOptions()));

    // Compression middleware
    this.app.use(compression());

    // Body parsers
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());

    // Security middleware
    this.app.use(SecurityMiddleware.addSecurityHeaders);
    this.app.use(SecurityMiddleware.validateContentType);
    this.app.use(SecurityMiddleware.sanitizeRequest);
    
    // Global request interceptor
    this.app.use(RequestInterceptor.logRequest);
    this.app.use(RequestInterceptor.limitRequestBodySize());
    this.app.use(RequestInterceptor.setRequestTimeout());

    // Routing
    const routes = new Routes(APIConfig.config.apiBasePath);
    routes.initializeRouting(this.app);

    // Global error interceptor
    this.app.use(ErrorInterceptor.handleError);
    
    // Swagger UI
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

    // Schedule daily cleanup of old audit logs
    this.scheduleAuditLogCleanup();
  }

  /**
   * Schedule audit log cleanup to run daily
   */
  private scheduleAuditLogCleanup(): void {
    // Run cleanup every 24 hours
    setInterval(() => {
      auditService
        .cleanupOldLogs()
        .catch((err) => {
          console.error("Error during audit log cleanup:", err);
        });
    }, 24 * 60 * 60 * 1000);

    console.log("Audit log cleanup scheduled to run daily");
  }
}

export default ExpressApp.getInstance();
