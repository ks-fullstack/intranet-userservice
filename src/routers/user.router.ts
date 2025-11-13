import { Router } from "express";
import loginController from "../controllers/login.controller";
import userController from "../controllers/user.controller";
import { authorizeRoles } from "../middleware/access-control.middleware";
import { validateRequest } from "../middleware/auth.middleware";

class UserRoutes {
  public readonly router: Router = Router();

  constructor() {
    this.router.get("/get/count", validateRequest, authorizeRoles("admin", "superadmin"), userController.getCount);
    this.router.get("/get/list", validateRequest, authorizeRoles("admin", "superadmin"), userController.getAll);
    this.router.get("/get/:id", validateRequest, authorizeRoles("admin", "superadmin"), userController.getOne);
    this.router.post("/create", validateRequest, authorizeRoles("admin", "superadmin"), userController.create);
    this.router.put("/update", validateRequest, authorizeRoles("admin", "superadmin"), userController.update);
    this.router.delete("/delete", validateRequest, authorizeRoles("admin", "superadmin"), userController.delete);

    //Login Routes
    this.router.post("/add", validateRequest, authorizeRoles("admin", "superadmin"), loginController.signUp);
    this.router.post("/unlock", validateRequest, authorizeRoles("admin", "superadmin"), loginController.unlockUser);
    this.router.get("/refresh/token", authorizeRoles("admin", "superadmin"), loginController.refreshToken);
    this.router.delete("/account/delete", validateRequest, authorizeRoles("admin", "superadmin"), loginController.deleteUser);
    this.router.post("/register", loginController.signUp);
    this.router.post("/login", loginController.signIn);
    this.router.post("/logout", validateRequest, loginController.signOut);
  }
}

export default new UserRoutes();
