import express from 'express';
import { validateAccessToken } from '../middlewares/authorization/authorizationMiddleware.js';
import textController from '../controllers/TextController.js';
import upload from "../middlewares/upload/uploadMiddleware.js";

const router = express.Router();

router.post("/upload", validateAccessToken as express.RequestHandler, upload.single("file"), textController.upload);
router.post('/translate-context', validateAccessToken as express.RequestHandler, textController.translateContext);
router.post('/translate', validateAccessToken as express.RequestHandler, textController.translate);

router.get('/:filename/', validateAccessToken as express.RequestHandler, textController.download);

export default router;
