import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import accessManagementRoutes from './routes/AccessManagementRoutes';
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use('/access_management', accessManagementRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
