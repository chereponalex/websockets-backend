require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import messageRouter from './routes/message.router';
import AppError from './utils/appError';
import ws from './websocket/websocket';

const startServer = async () => {
    try {
        const app = express();
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(
            cors({
                origin: true,
                credentials: true,
            })
        );
        app.use('/api/messages', messageRouter);

        app.all('*', (req: Request, res: Response, next: NextFunction) => {
            next(new AppError(404, `Route ${req.originalUrl} not found`));
        });

        app.use(
            (error: AppError, req: Request, res: Response, next: NextFunction) => {
                error.status = error.status || 'error';
                error.statusCode = error.statusCode || 500;

                res.status(error.statusCode).json({
                    status: error.status,
                    message: error.message,
                });
            }
        );

        const port = 8080;
        const server = app.listen(port);
        ws(server);
        
        console.log(`Server started on port: ${port}`);
    } catch (e) {
        console.log('ERROR WHILE STARTING SERVER', e);
        setTimeout(startServer, 5000);
    }
}

startServer();