import bodyParser from "body-parser";
import express, { Express } from "express";
import MongoConnection from "../db/mongo-connection";
import Routes from "../routers/router";
import APIConfig from "./config";
import errorInterceptor from "../interceptors/error.interceptor"
import requestInterceptor from "../interceptors/request.interceptor";
import SecurityMiddleware from "../middleware/security.middleware";
import { watchUserCollection } from "../services/change-stream.service";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "../docs/swagger";

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

    // Security middleware
    new SecurityMiddleware(this.app, APIConfig.config);

    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());

    // Global request interceptor
    this.app.use(requestInterceptor);

    // Routing
    const routes = new Routes(APIConfig.config.apiBasePath);
    routes.initializeRouting(this.app);
    
    // Swagger UI
    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

    // Global error interceptor
    this.app.use(errorInterceptor);
  }
}

export default ExpressApp.getInstance();
