import type { NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import type { ResponseDefaultMsg } from '../types/ResponseDefaultMsg';
import mongoose from 'mongoose';

export const connectMongoDB = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg>) => {
  // verificar conexão com o banco
  if (mongoose.connections[0].readyState) {
    return handler(req, res);
  }

  // verificar os arquivos do ENV
  const {DB_CONNECTION_STRING} = process.env;
  if (!DB_CONNECTION_STRING) {
    return res.status(500).json({error: 'ENV de configuração do banco não informado!'});
  }

  // conectar o banco de dados
  mongoose.connection.on('connected', () => console.log('Banco de dados conectado!'));
  mongoose.connection.on('error', error => console.log(`Erro ao tentar conectar no banco: ${error}`));
  await mongoose.connect(DB_CONNECTION_STRING);
  return handler(req, res);
}
