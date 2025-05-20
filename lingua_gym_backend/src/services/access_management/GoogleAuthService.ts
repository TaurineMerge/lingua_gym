import 'reflect-metadata';
import { inject, injectable } from "tsyringe";
import GoogleAuthIntegration from "../../integrations/GoogleAuthIntegration.js";
import User from "../../models/access_management/User.js";
import { UserRepository } from "../../repositories/access_management/access_management.js";
import { RegistrationService } from "./access_management.js";

@injectable()
class GoogleAuthService {
    constructor(
        @inject('GoogleAuth') private googleAuth: GoogleAuthIntegration, 
        @inject('UserRepository') private userRepository: UserRepository,
        @inject('RegistrationService') private registrationService: RegistrationService
    ) {}

    authenticateUser = async (token: string) => {
        console.log(token);
        const googleUser = await this.googleAuth.verifyGoogleToken(token);
        console.log(googleUser);
        const user = new User(await this.userRepository.getUserByEmail(googleUser.email || ''));
        console.log(user);

        if (!user) {
            const newUser = await this.registrationService.register(googleUser.name || '', googleUser.email || '', '', '');
            return newUser;
        }

        return user;
    }
}

export default GoogleAuthService;