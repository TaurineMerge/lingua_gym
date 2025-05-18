import express from 'express';
import { validateAccessToken } from '../middlewares/authorization/authorizationMiddleware.js';
import textController from '../controllers/TextController.js';

const router = express.Router();

router.post('/translate-context', validateAccessToken as express.RequestHandler, textController.translateContext);
router.post('/translate', validateAccessToken as express.RequestHandler, textController.translate);

export default router;
