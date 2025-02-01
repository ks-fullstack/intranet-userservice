import { Router } from "express";
import userProfileController from "../controllers/user-profile.controller";
import { validateRequest } from "../utils/jwt-util";

class UserRoutes {
  public readonly router: Router = Router();

  constructor() {
    this.router.get("/get/count/:filter?", validateRequest, userProfileController.getCount);
    this.router.get("/get/list/:filter?", validateRequest, userProfileController.getAll);
    this.router.get("/get/:id", validateRequest, userProfileController.getOne);
    this.router.post("/create", validateRequest, userProfileController.create);
    this.router.put("/update", validateRequest, userProfileController.update);
    this.router.delete("/delete", validateRequest, userProfileController.delete);
  }
}

export default new UserRoutes();
