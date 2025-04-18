import logger from "../logger/Logger.js";
const validatePassword = (password) => {
    if (password.length < 6) {
        logger.warn({ password }, 'Registration failed: Password must be at least 6 characters long');
        return false;
    }
    return true;
};
export default validatePassword;
