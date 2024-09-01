import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import { ObjectId } from 'mongodb';

export const getUsers = async (req: Request, res: Response) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const { id, email } = req.params;
  const objId = new ObjectId(id);

  if (email) {
    try {
      const usersFinded = await UserModel.find({
        email: { $regex: email, $options: 'i' },
      });

      return res.json(usersFinded);
    } catch (err) {
      if (err instanceof Error)
        console.log(
          'Não foi possível localizar o usuário desse email.',
          err.message
        );
    }
  } else {
    try {
      const allUsers = await UserModel.find({ _id: { $ne: objId } });

      return res.json(allUsers);
    } catch (err) {
      if (err instanceof Error)
        console.log(
          'Houve algum erro ao buscar todos os usuários no banco de dados.',
          err.message
        );
    }
  }
};
