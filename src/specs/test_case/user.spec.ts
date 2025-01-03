import { expect } from "chai";

class UserTestCase {
  private agent: any;
  private basePath: string;

  constructor(agent: any, basePath: string) {
    this.agent = agent;
    this.basePath = basePath;
  }

  public executeTestCase() {
    describe("Execute User Testcase", () => {
      it("should Get all user\"s list", async () => {
        const res = await this.agent.get(this.basePath + "/get/list");
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.own.property("success");
      });

      it("should Get count of all user\"s", async () => {
        const res = await this.agent.get(this.basePath + "/get/count");
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.own.property("success");
      });
    });
  }
}

export default UserTestCase;
