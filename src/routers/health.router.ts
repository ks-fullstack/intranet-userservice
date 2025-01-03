import { Router } from "express";
import healthController from "../controllers/health.controller";

class HealthRoutes {
  public readonly router: Router = Router();

  constructor() {
    this.router.get("/", healthController.checkHealth);
  }
}

export default new HealthRoutes();
