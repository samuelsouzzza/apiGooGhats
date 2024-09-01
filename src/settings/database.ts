import mongoose from 'mongoose';
import 'dotenv/config';

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.CONNECTION_DATABASE as string);
    return 'Conectado ao banco de dados online.';
  } catch {
    return 'Não foi possível conectar ao banco de dados.';
  }
}

export default connectDatabase;
