import { OAuth2Client } from 'google-auth-library';
import logger from '../utils/logger/Logger.js';
import 'dotenv/config';

class GoogleAuthIntegration {
    private client: OAuth2Client;

    constructor() {
        this.client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
    }

    verifyGoogleToken = async (code: string) => {
        try {
            logger.info({ code }, 'Verifying Google auth code');

            const { tokens } = await this.client.getToken({
                code,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI
            });

            if (!tokens?.id_token) {
                throw new Error('No id_token found in Google response');
            }

            const ticket = await this.client.verifyIdToken({
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
        } catch (error) {
            throw new Error('Error verifying Google token: ' + (error instanceof Error ? error.message : String(error)));
        }
    };
}

export default GoogleAuthIntegration;
