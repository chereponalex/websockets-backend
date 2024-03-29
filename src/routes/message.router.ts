import express from 'express';
import { getMessagesHandler, deleteMessageHandler, createMessageHandler } from '../controllers/message.controller';

const router = express.Router();
router.get('/list', getMessagesHandler);
router.post('/', createMessageHandler);
router.delete('/delete/:messageId', deleteMessageHandler);


export default router;