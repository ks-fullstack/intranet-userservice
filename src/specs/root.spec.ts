import http, { Server } from "http";
import { agent as request } from "supertest";
import MongoConnection from "../db/mongo-connection";
import APIConfig from "../utils/config";
import ExpressApp from "../utils/express-app";
import RoleTestCase from "./test_case/role.spec";
import UserTestCase from "./test_case/user.spec";

// Set up the chai Http assertion library
const apiBasePath = APIConfig.config.apiBasePath;
const agent = request(ExpressApp.app);

describe(`User Post Micro Service`, () => {
  let server: Server;

  before(async () => {
    await ExpressApp.connectApp();
    server = http.createServer(ExpressApp.app);
    await server.listen();
  });

  after(async () => {
    await MongoConnection.disconnectDB();
    await server.close();
  });

  describe("Executing test case", () => {
    const userTestCase = new UserTestCase(agent, apiBasePath + "/post");
    userTestCase.executeTestCase();

    const roleTestCase = new RoleTestCase(agent, apiBasePath + "/likes");
    roleTestCase.executeTestCase();
  });
});
