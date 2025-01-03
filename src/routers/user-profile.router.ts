import { Router } from "express";
import userProfileController from "../controllers/user-profile.controller";

class UserRoutes {
  public readonly router: Router = Router();

  constructor() {
    this.router.get("/get/count/:filter?", userProfileController.getCount);
    this.router.get("/get/list/:filter?", userProfileController.getAll);
    this.router.get("/get/:id", userProfileController.getOne);
    this.router.post("/create", userProfileController.create);
    this.router.put("/update", userProfileController.update);
    this.router.delete("/delete", userProfileController.delete);
  }
}

export default new UserRoutes();
