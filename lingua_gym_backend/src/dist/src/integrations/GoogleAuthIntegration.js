var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { OAuth2Client } from 'google-auth-library';
import logger from '../utils/logger/Logger.js';
import 'dotenv/config';
class GoogleAuthIntegration {
    constructor() {
        this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
        this.verifyGoogleToken = (idToken) => __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info({ idToken }, 'Verifying Google token');
                const ticket = yield this.client.verifyIdToken({
                    idToken,
                    audience: process.env.GOOGLE_CLIENT_ID,
                });
                const payload = ticket.getPayload();
                if (!payload)
                    throw new Error('Invalid token payload');
                logger.info({ payload }, 'Google token verified');
                return {
                    email: payload.email,
                    name: payload.name,
                    picture: payload.picture,
                    googleId: payload.sub,
                };
            }
            catch (_a) {
                throw new Error('Invalid token');
            }
        });
    }
}
export default GoogleAuthIntegration;
