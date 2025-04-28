import 'reflect-metadata';
import { container } from 'tsyringe';
import Database from '../database/config/db-connection.js';
import Logger from '../utils/logger/Logger.js';
import { UserModel, UserMetadataModel, UserPasswordResetModel, } from '../models/access_management/access_management.js';
import { AuthenticationService, JwtTokenManagementService, RegistrationService, PasswordResetService, } from '../services/access_management/access_management.js';
import { AdvancedSearchModel } from '../models/advanced_search/AdvancedSearchModel.js';
const db = new Database();
container.registerInstance('Logger', Logger);
container.registerInstance('Database', db);
container.register('UserModel', {
    useValue: new UserModel(db),
});
container.register('UserMetadataModel', {
    useValue: new UserMetadataModel(db),
});
container.register('UserPasswordResetModel', {
    useValue: new UserPasswordResetModel(db),
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
container.register("AdvancedSearchModel", {
    useFactory: (c) => (params) => new AdvancedSearchModel(c.resolve("Database"), params)
});
export default container;
