import { Request, Response, NextFunction } from "express";
import ServiceFactory from "../../services/ServiceFactory";
import logger from "../../utils/logger/Logger";

const authenticateToken = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    logger.warn({ path: req.path }, "Unauthorized access attempt: No token provided");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const jwtService = ServiceFactory.getJwtTokenManagementService();
    const user = jwtService.verifyAccessToken(token);

    logger.info({ userId: user.userId }, "User authenticated successfully");
    next();
  } catch (error) {
    logger.error({ error, path: req.path }, "Token verification failed");

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
    const jwtService = ServiceFactory.getJwtTokenManagementService();
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

export { authenticateToken, validateRefreshToken };