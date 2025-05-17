import express from 'express';
import { validateAccessToken } from '../middlewares/authorization/authorizationMiddleware.js';
import textController from '../controllers/TextController.js';
const router = express.Router();
router.post('/translate', validateAccessToken, textController.translate);
export default router;
