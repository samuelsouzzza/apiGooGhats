import { Response, Request } from 'express';
import chatModel from '../models/ChatModel';
import { ObjectId } from 'mongodb';

export const getChats = async (req: Request, res: Response) => {
  const { myId, yourId } = req.params;
  const myObjId = new ObjectId(myId);

  try {
    if (!yourId) {
      async function getChatsWithParticipants() {
        const chats = await chatModel
          .find({ participants: { $in: [myObjId] } })
          .populate('participants', 'name profilePic online _id');
        return chats;
      }

      return res.json(await getChatsWithParticipants());
    } else {
      if (!ObjectId.isValid(yourId)) {
        return res.status(400).json({ error: 'ID de usuário inválido.' });
      }

      const yourObjId = new ObjectId(yourId);

      async function getChatsWithParticipants() {
        const chat = await chatModel
          .findOne({
            participants: { $all: [myObjId, yourObjId] },
          })
          .populate('participants', 'name profilePic online updatedAt _id');
        return chat;
      }

      return res.json(await getChatsWithParticipants());
    }
  } catch (err) {
    if (err instanceof Error)
      console.log('Não foi possível buscar as conversas .', err.message);
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

export const sendMessage = async (req: Request, res: Response) => {
  if (req.body && req.params) {
    const { myId, yourId } = req.params;
    const { text } = req.body;

    const myObj = new ObjectId(myId);
    const yourObj = new ObjectId(yourId);

    try {
      const chat = await chatModel.findOne({ participants: [myObj, yourObj] });

      if (chat) {
        await chatModel.updateOne(
          { _id: chat._id },
          {
            $push: {
              messages: { senderId: myObj, text: text },
            },
            $currentDate: {
              updatedAt: Date.now(),
            },
          }
        );
      }

      return res.json({ message: 'Mensagem enviada com sucesso!' });
    } catch (err) {
      if (err instanceof Error)
        console.log('Não foi possível buscar as conversas.', err.message);
    }

    return;
  }
};
