import 'reflect-metadata';
import { container } from 'tsyringe';

import Database from '../database/config/db-connection.js';
import Logger from '../utils/logger/Logger.js';

import { UserModel, UserMetadataModel, UserPasswordResetModel } from '../models/access_management/access_management.js';
import { AuthenticationService, JwtTokenManagementService, RegistrationService, PasswordResetService } from '../services/access_management/access_management.js';

const db = Database.getInstance();

container.registerInstance('Logger', Logger);
container.registerInstance('Database', db);

container.register<UserModel>('UserModel', { useValue: new UserModel(db) });
container.register<UserMetadataModel>('UserMetadataModel', { useValue: new UserMetadataModel(db) });
container.register<UserPasswordResetModel>('UserPasswordResetModel', { useValue: new UserPasswordResetModel(db) });

container.register<RegistrationService>('RegistrationService', {
  useClass: RegistrationService,
});
container.register<JwtTokenManagementService>('JwtTokenManagementService', {
  useClass: JwtTokenManagementService,
});
container.register<AuthenticationService>('AuthenticationService', {
  useClass: AuthenticationService,
});
container.register<PasswordResetService>('PasswordResetService', {
  useClass: PasswordResetService,
});

export default container;
