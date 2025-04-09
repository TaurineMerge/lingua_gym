//utils
import logger from '../utils/logger/Logger.js';
//database
import Database from '../database/config/db-connection.js';
// models
import { UserModel, UserMetadataModel, UserPasswordResetModel } from '../models/access_management/access_management.js';
import { DictionarySetModel, DictionaryCardModel, SetCardsModel, UserSetsModel } from '../models/dictionary/dictionary.js';
import { TagModel, CardTagsModel, SetTagsModel } from '../models/tag/tag.js';
// services
import { AuthenticationService, JwtTokenManagementService, RegistrationService, PasswordResetService } from '../services/access_management/access_management.js';
import { DictionarySetService, DictionaryCardService, SetCardsService, UserSetsService } from '../services/dictionary/dictionary.js';
import { TagService, SetTagsService, CardTagsService } from '../services/tag/tag.js';
class ServiceFactory {
    //------Getters------
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
    static getDictionarySetService() {
        return ServiceFactory.dictionarySetService;
    }
    static getDictionaryCardService() {
        return ServiceFactory.dictionaryCardService;
    }
    static getSetCardsService() {
        return ServiceFactory.setCardsService;
    }
    static getUserSetsService() {
        return ServiceFactory.userSetsService;
    }
    static getTagService() {
        return ServiceFactory.tagService;
    }
    static getSetTagsService() {
        return ServiceFactory.setTagsService;
    }
    static getCardTagsService() {
        return ServiceFactory.cardTagsService;
    }
}
//------Databse------
//instance
ServiceFactory.db = Database.getInstance();
//------Models------
//user models
ServiceFactory.userModel = new UserModel(ServiceFactory.db);
ServiceFactory.userMetadataModel = new UserMetadataModel(ServiceFactory.db);
ServiceFactory.userPasswordResetModel = new UserPasswordResetModel(ServiceFactory.db);
//dictionary models
ServiceFactory.dictionarySetModel = new DictionarySetModel(ServiceFactory.db);
ServiceFactory.dictionaryCardModel = new DictionaryCardModel(ServiceFactory.db);
ServiceFactory.setCardsModel = new SetCardsModel(ServiceFactory.db);
ServiceFactory.userSetsModel = new UserSetsModel(ServiceFactory.db);
ServiceFactory.tagModel = new TagModel(ServiceFactory.db);
ServiceFactory.setTagsModel = new SetTagsModel(ServiceFactory.db);
ServiceFactory.cardTagsModel = new CardTagsModel(ServiceFactory.db);
//------Initializers------
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
    try {
        ServiceFactory.dictionarySetService = new DictionarySetService(ServiceFactory.dictionarySetModel);
        logger.info('DictionarySetService initialized successfully');
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to initialize DictionarySetService');
        throw error;
    }
    try {
        ServiceFactory.dictionaryCardService = new DictionaryCardService(ServiceFactory.dictionaryCardModel);
        logger.info('DictionaryCardService initialized successfully');
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to initialize DictionaryCardService');
        throw error;
    }
    try {
        ServiceFactory.setCardsService = new SetCardsService(ServiceFactory.setCardsModel);
        logger.info('SetCardsService initialized successfully');
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to initialize SetCardsService');
        throw error;
    }
    try {
        ServiceFactory.userSetsService = new UserSetsService(ServiceFactory.userSetsModel);
        logger.info('UserSetsService initialized successfully');
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to initialize UserSetsService');
        throw error;
    }
    try {
        ServiceFactory.tagService = new TagService(ServiceFactory.tagModel);
        logger.info('TagService initialized successfully');
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to initialize TagService');
        throw error;
    }
    try {
        ServiceFactory.setTagsService = new SetTagsService(ServiceFactory.setTagsModel);
        logger.info('SetTagsService initialized successfully');
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to initialize SetTagsService');
        throw error;
    }
    try {
        ServiceFactory.cardTagsService = new CardTagsService(ServiceFactory.cardTagsModel);
        logger.info('CardTagsService initialized successfully');
    }
    catch (error) {
        logger.error({ err: error }, 'Failed to initialize CardTagsService');
        throw error;
    }
})();
export default ServiceFactory;
