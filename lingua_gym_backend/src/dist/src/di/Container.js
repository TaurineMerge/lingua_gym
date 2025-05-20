import 'reflect-metadata';
import { container } from 'tsyringe';
import Database from '../database/config/db-connection.js';
import Logger from '../utils/logger/Logger.js';
import { UserRepository, UserMetadataRepository, UserPasswordResetRepository, } from '../repositories/access_management/access_management.js';
import { AuthenticationService, JwtTokenManagementService, RegistrationService, PasswordResetService, } from '../services/access_management/access_management.js';
import { AdvancedSearchRepository } from '../repositories/advanced_search/AdvancedSearchRepository.js';
import GoogleAuthIntegration from '../integrations/GoogleAuthIntegration.js';
import GoogleAuthService from '../services/access_management/GoogleAuthService.js';
const db = new Database();
container.registerInstance('Logger', Logger);
container.registerInstance('Database', db);
container.register('UserRepository', {
    useValue: new UserRepository(db),
});
container.register('UserMetadataRepository', {
    useValue: new UserMetadataRepository(db),
});
container.register('UserPasswordResetRepository', {
    useValue: new UserPasswordResetRepository(db),
});
container.register('RegistrationService', {
    useClass: RegistrationService,
});
container.register('JwtTokenManagementService', {
    useClass: JwtTokenManagementService,
});
container.register('AuthenticationService', {
    useClass: AuthenticationService,
});
container.register('PasswordResetService', {
    useClass: PasswordResetService,
});
container.register("AdvancedSearchRepository", {
    useFactory: (c) => (params) => new AdvancedSearchRepository(c.resolve("Database"), params)
});
container.register("GoogleAuth", {
    useClass: GoogleAuthIntegration,
});
container.register("GoogleAuthService", {
    useClass: GoogleAuthService,
});
export default container;
