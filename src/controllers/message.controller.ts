import { NextFunction, Request, Response } from 'express';
import messages from '../utils/mockDB';
import { connectionsList } from '../websocket/websocket';

export const getMessagesHandler = async (
    req: Request<{}, {}>,
    res: Response,
    next: NextFunction
) => {
    try {
        res.status(200).json(messages);
    } catch (err: any) {
        next(err);
    }
};

export const createMessageHandler = async (
    req: Request<{ message: string }, {}>,
    res: Response,
    next: NextFunction
) => {
    try {
        const message = req.body.message
        messages.push({ id: messages.length + 1, text: message });
        connectionsList.length > 0 && connectionsList.forEach(connection => {
            connection.send(JSON.stringify({
                type: 'message-created',
                text: message
            }));
        })
        res.status(200).json('message created');
    } catch (err: any) {
        next(err);
    }
};

export const deleteMessageHandler = async (
    req: Request<{ messageId: string }, {}>,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.messageId);
        let deleteIndex = null;
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].id === id) {
                deleteIndex = i
                break;
            }
        }

        if (deleteIndex !== null) {
            messages.splice(deleteIndex, 1)
            connectionsList.length > 0 && connectionsList.forEach(connection => {
                connection.send(JSON.stringify({
                    type: 'message-deleted'
                }));
            })
            res.status(200).json('message deleted');
        } else {
            res.status(404).json('message not found');
        }

    } catch (err: any) {
        next(err);
    }
};