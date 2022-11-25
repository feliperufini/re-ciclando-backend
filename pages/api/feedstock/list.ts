import type { NextApiRequest, NextApiResponse } from 'next';
import type { ResponseDefaultMsg } from '../../../types/ResponseDefaultMsg';
import { validateTokenJWT } from '../../../middlewares/validateTokenJWT';
import { connectMongoDB } from '../../../middlewares/connectMongoDB';
import { FeedstockModel } from '../../../models/FeedstockModel';
import { policyCors } from '../../../middlewares/policyCors';

const feedstockListEndpoint = async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg | any>) => {
  try {
    if (req.method === 'GET') {
      if (req?.query?.id) {
        // retorna apenas a matéria prima informada pelo id
        const feedstock = await FeedstockModel.findById(req?.query?.id);
        if (!feedstock) {
          return res.status(400).json({ error: 'Matéria prima não encontrada!' });
        }
        return res.status(200).json(feedstock);
      } else {
        // retorna todos as matéria primas
        const feedstocks = await FeedstockModel.find();
        if (!feedstocks) {
          return res.status(400).json({ error: 'Nenhuma matéria prima foi encontrada!' });
        }
        return res.status(200).json(feedstocks);
      }
    }
    return res.status(405).json({ error: 'Método informado não é válido!' });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: 'Não foi possível obter as matéria primas!' });
  }
}

export default policyCors(validateTokenJWT(connectMongoDB(feedstockListEndpoint)));