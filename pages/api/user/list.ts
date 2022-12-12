import type { NextApiRequest, NextApiResponse } from 'next';
import type { ResponseDefaultMsg } from '../../../types/ResponseDefaultMsg';
import { validateTokenJWT } from '../../../middlewares/validateTokenJWT';
import { connectMongoDB } from '../../../middlewares/connectMongoDB';
import { UserModel } from '../../../models/UserModel';
import { policyCors } from '../../../middlewares/policyCors';

const userListEndpoint = async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg | any>) => {
  try {
    if (req.method === 'GET') {
      if (req?.query?.id) {
        // retorna apenas o usuário informada pelo id
        const user = await UserModel.findById(req?.query?.id);
        if (!user) {
          return res.status(400).json({ error: 'Usuário não encontrado!' });
        }
        return res.status(200).json(user);
      } else {
        // retorna todos os usuários
        const users = await UserModel.find().sort({ name: 1 });
        if (!users) {
          return res.status(400).json({ error: 'Nenhuma usuário foi encontrado!' });
        }
        return res.status(200).json(users);
      }
    }
    return res.status(405).json({ error: 'Método informado não é válido!' });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: 'Não foi possível obter os usuários!' });
  }
}

export default policyCors(validateTokenJWT(connectMongoDB(userListEndpoint)));