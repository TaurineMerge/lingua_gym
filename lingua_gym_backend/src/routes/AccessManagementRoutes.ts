import express from 'express';
import AuthController from '../controllers/AccessManagementController.js';
import { validateAccessToken, validateRefreshToken } from '../middlewares/authorization/authorizationMiddleware.js';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', validateAccessToken as express.RequestHandler, AuthController.logout);
router.post('/request-password-reset', AuthController.requestPasswordReset);
router.post('/reset-password', AuthController.resetPassword);
router.post('/check-email-exists', AuthController.checkIfEmailExists);
router.post('/check-username-exists', AuthController.checkIfUsernameExists);

router.get('/is-authenticated', AuthController.checkIfAuthenticated);
router.get('/refresh-token', validateRefreshToken as express.RequestHandler, AuthController.refreshToken);

export default router;
