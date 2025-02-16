import logger from '../utils/logger/Logger.js';
import Database from '../database/config/db-connection.js';
import UserModel from '../models/access_management/UserModel.js';
import UserMetadataModel from '../models/access_management/UserMetadataModel.js';
import UserPasswordResetModel from '../models/access_management/UserPasswordResetModel.js';
import AuthenticationService from '../services/access_management/AuthenticationService.js';
import JwtTokenManagementService from '../services/access_management/JwtTokenManagementService.js';
import RegistrationService from '../services/access_management/RegistrationService.js';
import PasswordResetService from '../services/access_management/PasswordResetService.js';

class ServiceFactory {
    private static db = Database.getInstance();

    private static userModel = new UserModel(ServiceFactory.db);
    private static userMetadataModel = new UserMetadataModel(ServiceFactory.db);
    private static userPasswordResetModel = new UserPasswordResetModel(ServiceFactory.db);

    private static registrationService: RegistrationService;
    private static jwtTokenService: JwtTokenManagementService;
    private static authenticationService: AuthenticationService;
    private static passwordResetService: PasswordResetService;

    static {
        try {
            ServiceFactory.registrationService = new RegistrationService(
                ServiceFactory.userModel, 
                ServiceFactory.userMetadataModel
            );
            logger.info('RegistrationService initialized successfully');
        } catch (error) {
            logger.error({ err: error }, 'Failed to initialize RegistrationService');
            throw error;
        }

        try {
            ServiceFactory.jwtTokenService = new JwtTokenManagementService(ServiceFactory.userModel);
            logger.info('JwtTokenManagementService initialized successfully');
        } catch (error) {
            logger.error({ err: error }, 'Failed to initialize JwtTokenManagementService');
            throw error;
        }

        try {
            ServiceFactory.authenticationService = new AuthenticationService(
                ServiceFactory.userModel, 
                ServiceFactory.jwtTokenService
            );
            logger.info('AuthenticationService initialized successfully');
        } catch (error) {
            logger.error({ err: error }, 'Failed to initialize AuthenticationService');
            throw error;
        }

        try {
            ServiceFactory.passwordResetService = new PasswordResetService(
                ServiceFactory.userModel, 
                ServiceFactory.userPasswordResetModel
            );
            logger.info('PasswordResetService initialized successfully');
        } catch (error) {
            logger.error({ err: error }, 'Failed to initialize PasswordResetService');
            throw error;
        }
    }

    static getAuthenticationService() {
        return ServiceFactory.authenticationService;
    }

    static getRegistrationService() {
        return ServiceFactory.registrationService;
    }

    static getPasswordResetService() {
        return ServiceFactory.passwordResetService;
    }

    static getJwtTokenManagementService() {
        return ServiceFactory.jwtTokenService;
    }
}

export default ServiceFactory;
