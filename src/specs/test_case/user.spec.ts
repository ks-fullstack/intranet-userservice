import { expect } from "chai";

class UserTestCase {
  private agent: any;
  private basePath: string;
  private authToken: string = "";

  constructor(agent: any, basePath: string) {
    this.agent = agent;
    this.basePath = basePath;
  }

  setToken(token: string) {
    this.authToken = token;
  }

  public executeTestCase () {
    it("should Get all user's list", async () => {
      const res = await this.agent.get(this.basePath + "/get/list").set("Authorization", `Bearer ${this.authToken}`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.own.property("success");
    });

    it("should Get count of all user's", async () => {
      const res = await this.agent.get(this.basePath + "/get/count").set("Authorization", `Bearer ${this.authToken}`);
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.own.property("success");
    });
  }
}

export default UserTestCase;
