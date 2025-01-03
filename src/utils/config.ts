import { readJSONFile } from "./common-util";
import { IConfig } from "../interface/config.interface";

export class APIConfig {
  private static _instance: APIConfig = new APIConfig();
  public config: IConfig;
  public env: string = process.env.NODE_ENV || 'dev';

  constructor() {
    const configFilePath: string = `./config/${this.env}.config.json`;
    this.config = readJSONFile(configFilePath);
  }

  public static getInstanceOf(): APIConfig {
    return APIConfig._instance;
  }
}

export default APIConfig.getInstanceOf();
