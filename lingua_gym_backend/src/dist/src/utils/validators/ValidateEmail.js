import logger from '../logger/Logger.js';
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        logger.error({ email }, 'Invalid email format');
        throw new Error('Invalid email format');
    }
    return true;
};
export default validateEmail;
