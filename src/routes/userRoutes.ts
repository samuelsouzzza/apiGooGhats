import { Router } from 'express';
import {
  authUser,
  getUsers,
  updateStatusUser,
} from '../controllers/userController';

export const userRouter = Router();

userRouter.get('/users/:id/:email?', getUsers);
userRouter.post('/auth', authUser);
userRouter.put('/updateUser/:id', updateStatusUser);
