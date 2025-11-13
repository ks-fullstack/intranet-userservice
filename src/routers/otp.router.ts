import { Router } from "express";
import otpController from "../controllers/otp.controller";
import { validateRequest } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/access-control.middleware";

class OTPRoutes {
  public readonly router: Router = Router();

  constructor() {
    this.router.get("/get/list", validateRequest, authorizeRoles("admin", "superadmin"), otpController.getAll);
    this.router.get("/get/count", validateRequest, authorizeRoles("admin", "superadmin"), otpController.getCount);
    this.router.get("/get/:id", validateRequest, authorizeRoles("admin", "superadmin"), otpController.getOne);
    this.router.post("/create", validateRequest, authorizeRoles("admin", "superadmin"), otpController.create);
    this.router.put("/update", validateRequest, authorizeRoles("admin", "superadmin"), otpController.update);
    this.router.delete("/delete", validateRequest, authorizeRoles("admin", "superadmin"), otpController.delete);
    this.router.post("/send", otpController.sendOTP);
    this.router.post("/resend", otpController.sendOTP);
    this.router.post("/verify", otpController.verifyOTP);
  }
}

export default new OTPRoutes();
