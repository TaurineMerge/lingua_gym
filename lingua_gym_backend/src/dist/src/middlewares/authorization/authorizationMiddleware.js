import container from "../../di/Container.js";
import logger from "../../utils/logger/Logger.js";
const jwtService = container.resolve("JwtTokenManagementService");
const validateAccessToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        logger.warn({ path: req.path }, "Unauthorized access attempt: No token provided");
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const user = jwtService.checkAccessToken(token);
        req.body.userId = user.userId;
        logger.info({ userId: user.userId }, "User authenticated successfully");
        next();
    }
    catch (error) {
        logger.error({ error, path: req.path }, "Access token verification failed");
        return res.status(403).json({
            error: error instanceof Error ? error.message : "Invalid token",
        });
    }
};
const validateRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        logger.warn({ path: req.path }, "Refresh token validation failed: No token provided");
        return res.status(400).json({ error: "Refresh token required" });
    }
    try {
        const user = jwtService.checkRefreshToken(refreshToken);
        logger.info({ userId: user.userId }, "Refresh token validated successfully");
        next();
    }
    catch (error) {
        logger.error({ error, path: req.path }, "Refresh token verification failed");
        return res.status(403).json({
            error: error instanceof Error ? error.message : "Invalid refresh token",
        });
    }
};
export { validateAccessToken, validateRefreshToken };
