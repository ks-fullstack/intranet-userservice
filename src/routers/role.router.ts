import { Router } from "express";
import roleController from "../controllers/role.controller";

class RoleRoutes {
  public readonly router: Router = Router();

  constructor() {
    this.router.get("/get/list/:filter?", roleController.getAll);
    this.router.get("/get/count/:filter?", roleController.getCount);
    this.router.get("/get/:id", roleController.getOne);
    this.router.post("/create", roleController.create);
    this.router.put("/update", roleController.update);
    this.router.delete("/delete", roleController.delete);
  }
}

export default new RoleRoutes();
