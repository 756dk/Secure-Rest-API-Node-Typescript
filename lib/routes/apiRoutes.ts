import * as express from 'express';
import { json } from "body-parser";
import { ApiNames } from '../util/Contants';
import * as jwt from 'jsonwebtoken';
import { Global } from '../util/Contants';

import { checkToken } from "../middleware/middleware";
import { AuthController } from "../controllers/authController";
import { UserController } from "../controllers/userController";


class ApiRouter {

  public router: express.Router;

  constructor() {
    this.router = express();
    this.addRoutes();
  }

  addRoutes(): void {
    this.router.post(ApiNames.LOGIN, AuthController.login); 
    this.router.post(ApiNames.REGISTER, AuthController.register);
    this.router.post(ApiNames.REFRESHTOKEN, AuthController.refreshtoken); 
    //Middleware routes Below
    this.router.post(ApiNames.LOGOUT, checkToken, AuthController.logout);       
    this.router.post(ApiNames.ADDUSER, checkToken, UserController.addUser);   
    this.router.post(ApiNames.VIEWUSER, checkToken, UserController.viewUser);          
  }
}
export default new ApiRouter().router;


