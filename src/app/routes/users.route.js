import express from 'express';
import userController from '../controllers/user.controller';
import paginationMiddleware from '../middlewares/pagination_middleware';
const router = express.Router();


router.route('/')
     .get([paginationMiddleware],userController.list);


export default router;