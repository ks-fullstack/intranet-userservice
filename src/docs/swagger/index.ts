import base from "./swagger.json";

import schemas from "./components/schemas.json";
import parameters from "./components/parameters.json";
import responses from "./components/responses.json";
import security from "./components/security.json";
import requestBodies from "./components/requestBodies.json";

import userPaths from "./paths/user.paths.json";
import rolePaths from "./paths/role.paths.json";


const swagger: any = {
  ...base,
  components: {
    schemas,
    parameters,
    responses,
    requestBodies,
    securitySchemes: security
  },
  paths: {
    ...userPaths,
    ...rolePaths
  }
};

export default swagger;
