import express from 'express';
import userController from '../controllers/user.controller';
import {jwtRequiredAuthentication} from '../middlewares/auth_middleware';


const router = express.Router();


router.route('/password')
      .post([jwtRequiredAuthentication],userController.changePassword);


export default router;