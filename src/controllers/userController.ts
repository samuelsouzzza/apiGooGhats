import { Request, Response } from 'express';
import UserModel from '../models/UserModel';

export const getUsers = async (req: Request, res: Response) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const { email } = req.params;
  if (email) {
    try {
      const usersFinded = await UserModel.find({ email: { $regex: email } });

      return res.json(usersFinded);
    } catch (err) {
      if (err instanceof Error)
        console.log('Não foi possível localizar o usuário desse email.');
    }
  } else {
    try {
      const allUsers = await UserModel.find();

      return res.json(allUsers);
    } catch (err) {
      if (err instanceof Error)
        console.log(
          'Houve algum erro ao buscar todos os usuários no banco de dados.'
        );
    }
  }
};