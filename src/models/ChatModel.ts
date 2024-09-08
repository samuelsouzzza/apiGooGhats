import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
    required: true,
  },
  text: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' }],
});

const chatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true },
  ],
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: {
    type: Date,
  },
});

const ChatModel = mongoose.model('chats', chatSchema);

export default ChatModel;
