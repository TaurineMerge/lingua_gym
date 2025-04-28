import { Request, Response, NextFunction } from "express";
import container from "../../di/Container.js";
import logger from "../../utils/logger/Logger.js";
import { JwtTokenManagementService } from "../../services/access_management/access_management.js";

const jwtService = container.resolve<JwtTokenManagementService>("JwtTokenManagementService");

const validateAccessToken = (req: Request, res: Response, next: NextFunction): Response | void => {
  const token = req.cookies.accessToken;

  if (!token) {
    logger.warn({ path: req.path }, "Unauthorized access attempt: No token provided");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = jwtService.verifyAccessToken(token);
    req.body.userId = user.userId;
    logger.info({ userId: user.userId }, "User authenticated successfully");
    next();
  } catch (error) {
    logger.error({ error, path: req.path }, "Access token verification failed");
    return res.status(403).json({
      error: error instanceof Error ? error.message : "Invalid token",
    });
  }
};

const validateRefreshToken = (req: Request, res: Response, next: NextFunction): Response | void => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    logger.warn({ path: req.path }, "Refresh token validation failed: No token provided");
    return res.status(400).json({ error: "Refresh token required" });
  }

  try {
    const user = jwtService.verifyRefreshToken(refreshToken);
    logger.info({ userId: user.userId }, "Refresh token validated successfully");
    next();
  } catch (error) {
    logger.error({ error, path: req.path }, "Refresh token verification failed");
    return res.status(403).json({
      error: error instanceof Error ? error.message : "Invalid refresh token",
    });
  }
};

export { validateAccessToken, validateRefreshToken };
