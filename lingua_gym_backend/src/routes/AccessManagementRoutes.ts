import express from 'express';
import AuthController from '../controllers/AccessManagementController.js';
import { validateAccessToken, validateRefreshToken } from '../middlewares/authorization/authorizationMiddleware.js';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', validateAccessToken as express.RequestHandler, AuthController.logout);
router.post('/refresh-token', validateRefreshToken as express.RequestHandler, AuthController.refreshToken);
router.post('/request-password-reset', AuthController.requestPasswordReset);
router.post('/reset-password', AuthController.resetPassword);

export default router;
