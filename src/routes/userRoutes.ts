import { Router } from 'express';
import { getUsers } from '../controllers/userController';

export const userRouter = Router();

userRouter.get('/users/:email?', getUsers);
