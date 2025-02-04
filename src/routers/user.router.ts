import { Router } from "express";
import loginController from "../controllers/login.controller";
import userController from "../controllers/user.controller";
import { validateRequest } from "../utils/jwt-util";

class UserRoutes {
  public readonly router: Router = Router();

  constructor() {
    this.router.get("/get/count", validateRequest, userController.getCount);
    this.router.get("/get/list", validateRequest, userController.getAll);
    this.router.get("/get/:id", validateRequest, userController.getOne);
    this.router.post("/create", validateRequest, userController.create);
    this.router.put("/update", validateRequest, userController.update);
    this.router.delete("/delete", validateRequest, userController.delete);

    //Login Routes
    this.router.post("/add", loginController.signUp);
    this.router.post("/register",validateRequest, loginController.signUp);
    this.router.post("/login", loginController.signIn);
    this.router.post("/logout", validateRequest, loginController.signOut);
    this.router.post("/unlock", validateRequest, loginController.unlockUser);
    this.router.get("/refresh/token", loginController.refreshToken);
  }
}

export default new UserRoutes();
