import logger from "../logger/Logger";

const validatePassword = (password: string): boolean => { // !NOT TESTED!
    if (password.length < 6) {
        logger.warn({ password }, 'Registration failed: Password must be at least 6 characters long');
        return false;
    }

    return true;
};

export default validatePassword;