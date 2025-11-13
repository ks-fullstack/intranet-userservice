import { Router } from "express";
import roleController from "../controllers/role.controller";
import { validateRequest } from "../middleware/auth.middleware";
import { authorizeRoles } from "../middleware/access-control.middleware";

class RoleRoutes {
  public readonly router: Router = Router();

  constructor() {
    this.router.get("/get/list", validateRequest, authorizeRoles("admin", "superadmin"), roleController.getAll);
    this.router.get("/get/count", validateRequest, authorizeRoles("admin", "superadmin"), roleController.getCount);
    this.router.get("/get/:id", validateRequest, authorizeRoles("admin", "superadmin"), roleController.getOne);
    this.router.post("/create", validateRequest, authorizeRoles("admin", "superadmin"), roleController.create);
    this.router.put("/update", validateRequest, authorizeRoles("admin", "superadmin"), roleController.update);
    this.router.delete("/delete", validateRequest, authorizeRoles("admin", "superadmin"), roleController.delete);
  }
}

export default new RoleRoutes();
