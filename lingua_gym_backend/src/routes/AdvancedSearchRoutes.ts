import express from 'express';
import { validateAccessToken } from '../middlewares/authorization/authorizationMiddleware.js';
import advancedSearchController from '../controllers/AdvancedSearchController.js';

const router = express.Router();

router.get('/search', validateAccessToken as express.RequestHandler, advancedSearchController);

export default router;
