import { Router } from "express";
import otpController from "../controllers/otp.controller";

class OTPRoutes {
  public readonly router: Router = Router();

  constructor() {
    this.router.get("/get/list/:filter?", otpController.getAll);
    this.router.get("/get/count/:filter?", otpController.getCount);
    this.router.get("/get/:id", otpController.getOne);
    this.router.post("/create", otpController.create);
    this.router.put("/update", otpController.update);
    this.router.delete("/delete", otpController.delete);
    this.router.post("/send", otpController.sendOTP);
    this.router.post("/resend", otpController.sendOTP);
    this.router.post("/verify", otpController.verifyOTP);
  }
}

export default new OTPRoutes();
