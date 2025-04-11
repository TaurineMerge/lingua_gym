var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import accessManagementRoutes from './routes/AccessManagementRoutes.js';
import container from './di/Container.js';
const app = express();
const PORT = process.env.PORT || 3000;
const db = container.resolve('Database');
const logger = container.resolve('Logger');
app.use(express.json());
app.use(cookieParser());
app.use('/access_management', accessManagementRoutes);
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});
const server = app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger.info(`Server is running on http://localhost:${PORT}`);
    }
    catch (err) {
        logger.fatal({ err }, 'Failed to start server');
        process.exit(1);
    }
}));
const shutdown = () => __awaiter(void 0, void 0, void 0, function* () {
    logger.info('Shutting down...');
    server.close(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db.close();
        logger.info('Server stopped');
        process.exit(0);
    }));
});
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
