import { Express } from "express";
import { IRoutes } from "../interface/router.interface";
import healthRouter from "./health.router";
import roleRoutes from "./role.router";
import userRoutes from "./user.router";
import userProfileRouter from "./user-profile.router";

class MainRoute {
  public apiRoutes: IRoutes[];

  constructor(apiBasePath: string) {
    this.apiRoutes = [
      {
        path: "/",
        router: healthRouter.router,
      },
      {
        path: apiBasePath + "/user/profile",
        router: userProfileRouter.router,
      },
      {
        path: apiBasePath + "/user",
        router: userRoutes.router,
      },
      {
        path: apiBasePath + "/role",
        router: roleRoutes.router,
      },
    ];
  }

  public initializeRouting(app: Express) {
    this.apiRoutes.forEach((routeObj: IRoutes) => {
      app.use(routeObj.path, routeObj.router);
    });
  }
}

export default MainRoute;
