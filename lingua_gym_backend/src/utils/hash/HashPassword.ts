import bcrypt from 'bcrypt';
import logger from '../logger/Logger.js';

function hashPassword(password: string): string {
  try {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
  } catch (err) {
    logger.error({ error: err }, 'Password hashing failed');
    throw new Error('Password hashing failed');
  }
}

export default hashPassword;