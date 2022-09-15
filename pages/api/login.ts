import type { NextApiRequest, NextApiResponse } from 'next';
import type { ResponseDefaultMsg } from '../../types/ResponseDefaultMsg';
import { connectMongoDB } from '../../middlewares/connectionMongoDB';

const endpointLogin = (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg>) => {
  if (req.method === 'POST') {
    const {login, senha} = req.body;
    if (login === 'admin' && senha === '123456') {
      return res.status(200).json({msg: 'Usuário autenticado com sucesso!'});
    }
      return res.status(400).json({error: 'Usuário ou senha inválidos!'});
  }
    return res.status(405).json({error: 'Método informado não é válido!'});
}

export default connectMongoDB(endpointLogin);