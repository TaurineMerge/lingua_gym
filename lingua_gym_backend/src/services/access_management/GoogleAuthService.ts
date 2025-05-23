import 'reflect-metadata';
import { inject, injectable } from "tsyringe";
import GoogleAuthIntegration from "../../integrations/GoogleAuthIntegration.js";
import User from "../../models/access_management/User.js";
import { UserRepository } from "../../repositories/access_management/access_management.js";
import { RegistrationService } from "./access_management.js";
import logger from '../../utils/logger/Logger.js';
import { JwtTokenManager } from '../../models/access_management/access_management.js';
import { RegistrationMethod } from '../../database/interfaces/User/IUser.js';

@injectable()
class GoogleAuthService {
    constructor(
        @inject('GoogleAuth') private googleAuth: GoogleAuthIntegration, 
        @inject('UserRepository') private userRepository: UserRepository,
        @inject('RegistrationService') private registrationService: RegistrationService,
        @inject('JwtTokenManager') private jwtTokenManager: JwtTokenManager
    ) {}

    authenticateUser = async (code: string): Promise<{ accessToken: string; refreshToken: string }> => {
        try {
            const googleUser = await this.googleAuth.verifyGoogleToken(code);

            if (!googleUser.email) {
                throw new Error('Google user does not have an email');
            }

            let userData = await this.userRepository.getUserByEmail(googleUser.email);
            if (!userData) {
                logger.info({ email: googleUser.email }, 'Registering new user via Google');

                await this.registrationService.register(
                    googleUser.name || '',
                    googleUser.email,
                    '',
                    '',
                    RegistrationMethod.GOOGLE,
                );

                userData = await this.userRepository.getUserByEmail(googleUser.email);
                if (!userData) throw new Error('Failed to retrieve newly registered user');
            }

            const user = new User(userData);

            const accessToken = this.jwtTokenManager.generateAccessToken(user);
            const refreshToken = this.jwtTokenManager.generateRefreshToken(user);

            return { accessToken, refreshToken };
        } catch (error) {
            logger.error(error, 'Google authentication failed');
            throw new Error('Google authentication failed');
        }
    }
}

export default GoogleAuthService;