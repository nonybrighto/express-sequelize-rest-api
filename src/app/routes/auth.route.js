import express from 'express';
import authController from '../controllers/auth.controller';
import {loginLimiter, jwtRequiredAuthentication} from '../middlewares/auth_middleware';

const router = express.Router();


router.route('/register')
     .post(authController.register);

router.route('/login')
     .post([loginLimiter],authController.login);

router.route('/refresh')
      .get([jwtRequiredAuthentication],authController.refreshJwtToken);

//post request should contain id_token and access_token
router.post('/google/token', authController.googleIdTokenAuth);
//facebook's post body should contain access_token and optionally, refresh_token 
router.post('/facebook/token', authController.facebookTokenAuth);


export default router;