import { Router } from "express";
import otpController from "../controllers/otp.controller";
import { validateRequest } from "../utils/jwt-util";

class OTPRoutes {
  public readonly router: Router = Router();

  constructor() {
    this.router.get("/get/list", validateRequest, otpController.getAll);
    this.router.get("/get/count", validateRequest, otpController.getCount);
    this.router.get("/get/:id", validateRequest, otpController.getOne);
    this.router.post("/create", validateRequest, otpController.create);
    this.router.put("/update", validateRequest, otpController.update);
    this.router.delete("/delete", validateRequest, otpController.delete);
    this.router.post("/send", otpController.sendOTP);
    this.router.post("/resend", otpController.sendOTP);
    this.router.post("/verify", otpController.verifyOTP);
  }
}

export default new OTPRoutes();
