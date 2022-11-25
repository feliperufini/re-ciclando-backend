import type { NextApiRequest, NextApiResponse } from 'next';
import type { ResponseDefaultMsg } from '../../../types/ResponseDefaultMsg';
import { validateTokenJWT } from '../../../middlewares/validateTokenJWT';
import { connectMongoDB } from '../../../middlewares/connectMongoDB';
import { TradepointModel } from '../../../models/TradepointModel';
import { policyCors } from '../../../middlewares/policyCors';

const tradepointListEndpoint = async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg | any>) => {
  try {
    if (req.method === 'GET') {
      if (req?.query?.id) {
        // retorna apenas a ponto de troca informada pelo id
        const tradepoint = await TradepointModel.findById(req?.query?.id);
        if (!tradepoint) {
          return res.status(400).json({ error: 'Ponto de troca não encontrado!' });
        }
        return res.status(200).json(tradepoint);
      } else {
        // retorna todos as ponto de trocas
        const tradepoints = await TradepointModel.find();
        if (!tradepoints) {
          return res.status(400).json({ error: 'Nenhum ponto de troca foi encontrado!' });
        }
        return res.status(200).json(tradepoints);
      }
    }
    return res.status(405).json({ error: 'Método informado não é válido!' });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: 'Não foi possível obter os ponto de trocas!' });
  }
}

export default policyCors(validateTokenJWT(connectMongoDB(tradepointListEndpoint)));