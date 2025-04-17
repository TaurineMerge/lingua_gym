import logger from '../logger/Logger.js';

const validateUsername = (username: string) => { // !NOT TESTED!
    if (username.length < 3) {
        logger.error('Username must be at least 3 characters long');
        return false;
    }
    return true;
};

export default validateUsername;