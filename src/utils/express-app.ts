import bodyParser from "body-parser";
import express, { Express } from "express";
import MongoConnection from "../db/mongo-connection";
import Routes from "../routers/router";
import APIConfig from "./config";
import errorInterceptor from "./error.interceptor";
import requestInterceptor from "./request.interceptor";
import SecurityMiddleware from "./security";

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

    // Global error interceptor
    this.app.use(errorInterceptor);
  }
}

export default ExpressApp.getInstance();
