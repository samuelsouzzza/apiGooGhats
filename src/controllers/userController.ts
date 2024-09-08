import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import ChatModel from '../models/ChatModel';

export const getUsers = async (req: Request, res: Response) => {
  const { id, email } = req.params;
  const objId = new ObjectId(id);

  try {
    const chats = await ChatModel.find({ participants: { $in: [objId] } });

    const participantIds = chats.flatMap((chat) =>
      chat.participants.filter((participantId) => !participantId.equals(objId))
    );

    const searchCondition: any = {
      _id: { $ne: objId, $nin: participantIds },
    };

    if (email) {
      searchCondition.email = { $regex: email, $options: 'i' };
    }

    const usersFinded = await UserModel.find(searchCondition);

    return res.json(usersFinded);
  } catch (err) {
    if (err instanceof Error)
      console.log(
        'Houve algum erro ao buscar todos os usuários no banco de dados.',
        err.message
      );
  }
};

export const authUser = async (req: Request, res: Response) => {
  const { name, email, picture } = req.body;

  async function emailExists(email: string) {
    return await UserModel.findOne({ email });
  }

  const userFound = await emailExists(email);

  if (userFound) {
    await userFound.updateOne({ online: true });

    const token = jwt.sign(
      { idUser: userFound._id },
      process.env.API_KEY as string,
      {
        expiresIn: '7d',
      }
    );

    return res.status(409).json({
      message: 'Este usuário já possui cadastro.',
      data: userFound,
      token,
    });
  } else {
    const newUser = await UserModel.create({
      name,
      email,
      profilePic: picture,
      online: true,
    });

    const token = jwt.sign(
      { idUser: newUser._id },
      process.env.API_KEY as string,
      {
        expiresIn: '7d',
      }
    );

    return res
      .status(201)
      .json({ message: 'Usuário criado com sucesso!', data: newUser, token });
  }
};

export const updateStatusUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await UserModel.findOneAndUpdate(
      { _id: id },
      { online: status, lastAcess: Date.now() }
    );

    return res
      .status(200)
      .json({ message: 'Status do usuário atualizado com sucesso!' });
  } catch (err) {
    if (err instanceof Error)
      console.log(
        'Não foi possível atualizar o status do usuário.',
        err.message
      );
  }
};
