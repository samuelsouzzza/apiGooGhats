import { Router } from 'express';
import {
  createChat,
  deleteChat,
  getChats,
  sendMessage,
} from '../controllers/chatController';

export const chatRouter = Router();

chatRouter.get('/chats/:myId/:yourId?', getChats);
chatRouter.post('/newChat', createChat);
chatRouter.post('/newMessage/:myId/:yourId', sendMessage);
chatRouter.delete('/deleteChatMessage/:idChat/:idMessage?', deleteChat);
