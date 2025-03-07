import logger from '../utils/logger/Logger';
import Database from '../database/config/db-connection';
import UserModel from '../models/access_management/UserModel';
import UserMetadataModel from '../models/access_management/UserMetadataModel';
import UserPasswordResetModel from '../models/access_management/UserPasswordResetModel';
import AuthenticationService from '../services/access_management/AuthenticationService';
import JwtTokenManagementService from '../services/access_management/JwtTokenManagementService';
import RegistrationService from '../services/access_management/RegistrationService';
import PasswordResetService from '../services/access_management/PasswordResetService';
class ServiceFactory {
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
ServiceFactory.db = Database.getInstance();
ServiceFactory.userModel = new UserModel(ServiceFactory.db);
ServiceFactory.userMetadataModel = new UserMetadataModel(ServiceFactory.db);
ServiceFactory.userPasswordResetModel = new UserPasswordResetModel(ServiceFactory.db);
(() => {
    try {
        ServiceFactory.registrationService = new RegistrationService(ServiceFactory.userModel, ServiceFactory.userMetadataModel);
        logger.info('RegistrationService initialized successfully');
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to initialize RegistrationService');
        throw error;
    }
    try {
        ServiceFactory.jwtTokenService = new JwtTokenManagementService(ServiceFactory.userModel);
        logger.info('JwtTokenManagementService initialized successfully');
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to initialize JwtTokenManagementService');
        throw error;
    }
    try {
        ServiceFactory.authenticationService = new AuthenticationService(ServiceFactory.userModel, ServiceFactory.jwtTokenService);
        logger.info('AuthenticationService initialized successfully');
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to initialize AuthenticationService');
        throw error;
    }
    try {
        ServiceFactory.passwordResetService = new PasswordResetService(ServiceFactory.userModel, ServiceFactory.userPasswordResetModel);
        logger.info('PasswordResetService initialized successfully');
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to initialize PasswordResetService');
        throw error;
    }
})();
export default ServiceFactory;
