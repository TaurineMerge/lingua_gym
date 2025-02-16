import logger from '../utils/logger/Logger';
import Database from '../database/config/db-connection';
import UserModel from '../models/access_management/UserModel';
import UserMetadataModel from '../models/access_management/UserMetadataModel';
import UserPasswordResetModel from '../models/access_management/UserPasswordResetModel';
import AuthenticationService from '../services/access_management/AuthenticationService';
import JwtTokenManagementService from '../services/access_management/JwtTokenManagementService';
import RegistrationService from '../services/access_management/RegistrationService';
import PasswordResetService from '../services/access_management/PasswordResetService';

class ServicesFactory {
    private static db = Database.getInstance();

    private static userModel = new UserModel(ServicesFactory.db);
    private static userMetadataModel = new UserMetadataModel(ServicesFactory.db);
    private static userPasswordResetModel = new UserPasswordResetModel(ServicesFactory.db);

    private static registrationService: RegistrationService;
    private static jwtTokenService: JwtTokenManagementService;
    private static authenticationService: AuthenticationService;
    private static passwordResetService: PasswordResetService;

    static {
        try {
            ServicesFactory.registrationService = new RegistrationService(
                ServicesFactory.userModel, 
                ServicesFactory.userMetadataModel
            );
            logger.info('RegistrationService initialized successfully');
        } catch (error) {
            logger.error({ err: error }, 'Failed to initialize RegistrationService');
            throw error;
        }

        try {
            ServicesFactory.jwtTokenService = new JwtTokenManagementService(ServicesFactory.userModel);
            logger.info('JwtTokenManagementService initialized successfully');
        } catch (error) {
            logger.error({ err: error }, 'Failed to initialize JwtTokenManagementService');
            throw error;
        }

        try {
            ServicesFactory.authenticationService = new AuthenticationService(
                ServicesFactory.userModel, 
                ServicesFactory.jwtTokenService
            );
            logger.info('AuthenticationService initialized successfully');
        } catch (error) {
            logger.error({ err: error }, 'Failed to initialize AuthenticationService');
            throw error;
        }

        try {
            ServicesFactory.passwordResetService = new PasswordResetService(
                ServicesFactory.userModel, 
                ServicesFactory.userPasswordResetModel
            );
            logger.info('PasswordResetService initialized successfully');
        } catch (error) {
            logger.error({ err: error }, 'Failed to initialize PasswordResetService');
            throw error;
        }
    }

    static getAuthenticationService() {
        return ServicesFactory.authenticationService;
    }

    static getRegistrationService() {
        return ServicesFactory.registrationService;
    }

    static getPasswordResetService() {
        return ServicesFactory.passwordResetService;
    }

    static getJwtTokenManagementService() {
        return ServicesFactory.jwtTokenService;
    }
}

export default ServicesFactory;
