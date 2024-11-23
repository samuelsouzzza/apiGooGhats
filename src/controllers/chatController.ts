import { Response, Request } from 'express';
import ChatModel from '../models/ChatModel';
import { ObjectId } from 'mongodb';

export const getChats = async (req: Request, res: Response) => {
  const { myId, yourId } = req.params;
  const myObjId = new ObjectId(myId);

  try {
    if (!yourId) {
      async function getChatsWithParticipants() {
        const chats = await ChatModel.find({
          participants: { $in: [myObjId] },
        }).populate('participants', 'name profilePic online lastAcess _id');
        return chats;
      }

      return res.json(await getChatsWithParticipants());
    } else {
      if (!ObjectId.isValid(yourId)) {
        return res.status(400).json({});
      }

      const yourObjId = new ObjectId(yourId);

      async function getChatsWithParticipants() {
        const chat = await ChatModel.findOne({
          participants: { $all: [myObjId, yourObjId] },
        }).populate({
          path: 'participants',
          select: 'name profilePic online lastAcess _id',
        });
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
      await ChatModel.create({
        participants: [myObj, yourObj],
      });

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
      const chat = await ChatModel.findOne({
        participants: { $size: 2, $all: [myObj, yourObj] },
      });

      if (chat) {
        await ChatModel.updateOne(
          { _id: chat._id },
          {
            $push: {
              messages: { senderId: myObj, text: text },
            },
            $currentDate: {
              updatedAt: true,
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

export const deleteChat = async (req: Request, res: Response) => {
  const { idChat, idMessage } = req.params;
  const objIdChat = new ObjectId(idChat);

  try {
    if (idMessage) {
      const objIdMessage = new ObjectId(idMessage);

      await ChatModel.updateOne(
        { _id: objIdChat },
        { $pull: { messages: { _id: objIdMessage } } }
      );
    } else {
      await ChatModel.deleteOne({ _id: objIdChat });
    }
  } catch (err) {
    if (err instanceof Error)
      console.log('Não foi apagar a conversa/mensagem.', err.message);
  }
};
