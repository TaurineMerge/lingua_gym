import { OAuth2Client } from 'google-auth-library';
import logger from '../utils/logger/Logger.js';
import 'dotenv/config';

class GoogleAuthIntegration {
    private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
    constructor() {}

    verifyGoogleToken = async (idToken: string) => {
        try {
            logger.info({ idToken }, 'Verifying Google token');
            const ticket = await this.client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload) throw new Error('Invalid token payload');

            logger.info({ payload }, 'Google token verified');

            return {
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                googleId: payload.sub,
            };
        } catch {
            throw new Error('Invalid token');
        }
    };
}

export default GoogleAuthIntegration;