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
        this.verifyGoogleToken = (code) => __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info({ code }, 'Verifying Google auth code');
                const { tokens } = yield this.client.getToken({
                    code,
                    redirect_uri: process.env.GOOGLE_REDIRECT_URI
                });
                if (!(tokens === null || tokens === void 0 ? void 0 : tokens.id_token)) {
                    throw new Error('No id_token found in Google response');
                }
                const ticket = yield this.client.verifyIdToken({
                    idToken: tokens.id_token,
                    audience: process.env.GOOGLE_CLIENT_ID,
                });
                const payload = ticket.getPayload();
                if (!payload) {
                    throw new Error('Token payload is empty');
                }
                logger.info({
                    email: payload.email,
                    name: payload.name,
                    googleId: payload.sub
                }, 'Google token verified successfully');
                return {
                    email: payload.email,
                    name: payload.name,
                    picture: payload.picture,
                    googleId: payload.sub,
                };
            }
            catch (error) {
                throw new Error('Error verifying Google token: ' + (error instanceof Error ? error.message : String(error)));
            }
        });
        this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
    }
}
export default GoogleAuthIntegration;
