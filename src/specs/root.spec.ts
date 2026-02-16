import * as dotenv from "dotenv";
dotenv.config({ path: "env/test.env" });

import http, { Server } from "http";
import { agent as request } from "supertest";
import MongoConnection from "../db/mongo-connection";
import APIConfig from "../utils/config";
import ExpressApp from "../express-app";
import RoleTestCase from "./test_case/role.spec";
import UserTestCase from "./test_case/user.spec";
import { expect } from "chai";
import { describe } from "mocha";

let server: Server;
let authToken: string;

// Set up the chai Http assertion library
const apiBasePath = APIConfig.config.apiBasePath;
const agent = request(ExpressApp.app);

describe(`User Micro Service`, function() {
  this.timeout(10000);

  before(async () => {
    await ExpressApp.connectApp();
    server = http.createServer(ExpressApp.app);
    await server.listen();
  });

  // This after hook will execute after ALL nested test suites complete
  // including all child tests from UserTestCase and RoleTestCase
  after(async () => {
    await MongoConnection.disconnectDB();
    await server.close();
  });

  describe("Executing test case", () => {
    const userTestCase = new UserTestCase(agent, apiBasePath + "/user");
    const roleTestCase = new RoleTestCase(agent, apiBasePath + "/role");

    it("should login into user service", async () => {
      const res = await agent.post(apiBasePath + "/user/login").send({
        userId: process.env.TEST_USERNAME?.trim() || "",
        password: process.env.TEST_PASSWORD?.trim() || ""
      });
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.own.property("success");
      expect(res.body.success).to.equal(true);
      expect(res.body).to.have.own.property("token");
      authToken = res.body.token;
      userTestCase.setToken(authToken);
      roleTestCase.setToken(authToken);
    });

    describe("Execute User Testcase", () => {
      userTestCase.executeTestCase();
    });

    describe("Execute Role Testcase", () => {
      roleTestCase.executeTestCase();
    });

    describe("Logout User and clear refresh token cookie", () => {
      it("should logout from user service", async () => {
        const res = await agent.post(apiBasePath + "/user/logout").set("Authorization", `Bearer ${authToken}`).send({
          userId: process.env.TEST_USERNAME?.trim() || ""
        });
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.own.property("success");
        expect(res.body.success).to.equal(true);
      });
    });
  });
});
