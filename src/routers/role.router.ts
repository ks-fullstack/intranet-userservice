import { Router } from "express";
import roleController from "../controllers/role.controller";
import { validateRequest } from "../utils/jwt-util";

class RoleRoutes {
  public readonly router: Router = Router();

  constructor() {
    this.router.get("/get/list/:filter?", validateRequest,  roleController.getAll);
    this.router.get("/get/count/:filter?", validateRequest, roleController.getCount);
    this.router.get("/get/:id", validateRequest, roleController.getOne);
    this.router.post("/create", validateRequest, roleController.create);
    this.router.put("/update", validateRequest, roleController.update);
    this.router.delete("/delete", validateRequest, roleController.delete);
  }
}

export default new RoleRoutes();
