import mongoose, { Connection } from "mongoose";
import { IDBSettings } from "../interface/config.interface";
import APIConfig from "../utils/config";

type eventType = "connected" | "reconnected" | "disconnected"| "close" | "error";
type callbackFun<A extends any[] = [], R = any>  = (...args: A) => R;

class MongoConnection {
  private static _instance: MongoConnection = new MongoConnection();
  private static _connect: Connection;
  private connectionStr: string;
  private options: IDBSettings;

  constructor() {
    const username: string = process.env.DB_USERNAME || "";
    const password: string = process.env.DB_PASSWORD || "";
    const dbName: string = APIConfig.config.dbName;

    this.connectionStr = APIConfig.config.dbConnectionStr.replace("$username$", username)
        .replace("$password$", password).replace("$dbname$", dbName);
    console.log(this.connectionStr);
    this.options = APIConfig.config.dbSettings;

    MongoConnection._connect = mongoose.connection;

    MongoConnection._connect.on("connected", () => {
      console.log("MongoDb Connection Established", new Date());
    });

    MongoConnection._connect.on("reconnected", () => {
      console.log("MongoDB Connection Re-established", new Date());
    });

    MongoConnection._connect.on("disconnected", () => {
      console.log("MongoDB Connection Disconnected", new Date());
    });

    MongoConnection._connect.on("close", () => {
      console.log("MongoDB Connection Closed", new Date());
    });

    MongoConnection._connect.on("error", (error) => {
      console.log("MongoDB Connection Error: ", error);
    });
  }

  public static getInstance(): MongoConnection {
    return MongoConnection._instance;
  }

  public async connectDB() {
    await mongoose.connect(this.connectionStr, this.options);
  }

  public async disconnectDB() {
    await MongoConnection._connect.close();
  }

  public triggerCallbackFunOnMongoConnEvent(event: eventType, callbackFun: callbackFun) {
    MongoConnection._connect.on(event, () => {
      return callbackFun();
    });
  }
}

export default MongoConnection.getInstance();
