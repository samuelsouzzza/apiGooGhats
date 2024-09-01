import { Response, Request } from 'express';
import chatModel from '../models/ChatModel';
import { ObjectId } from 'mongodb';

export const getChats = async (req: Request, res: Response) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  let { id } = req.params;
  const myIdObj = new ObjectId(id);

  try {
    const myChats = await chatModel.find({ participants: { $in: [myIdObj] } });

    return res.json(myChats);
  } catch (err) {
    if (err instanceof Error)
      console.log('Não foi possível buscar as conversas.', err.message);
  }
};

export const createChat = async (req: Request, res: Response) => {
  if (req.body) {
    const { myId, yourId }: { myId: string; yourId: string } = req.body;

    const myObj = new ObjectId(myId);
    const yourObj = new ObjectId(yourId);

    try {
      await chatModel.create({ participants: [myObj, yourObj] });

      return res.json({ message: 'Conversa criada com sucesso!' });
    } catch (err) {
      if (err instanceof Error)
        console.log('Não foi possível buscar as conversas.', err.message);
    }
  }
};
