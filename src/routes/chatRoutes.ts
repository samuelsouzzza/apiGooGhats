import { Router } from 'express';
import { createChat, getChats } from '../controllers/chatController';

export const chatRouter = Router();

chatRouter.get('/chats/:id', getChats);
chatRouter.post('/newChat', createChat);
