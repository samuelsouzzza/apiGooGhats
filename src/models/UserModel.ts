import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePic: { type: String, required: true },
    status: { type: String, default: 'offline' },
    lastAcess: { type: Date, default: Date.now() },
  },
  { collection: 'users' }
);

const UserModel = mongoose.model('UserModel', userSchema);

export default UserModel;
