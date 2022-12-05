import type { NextApiResponse, NextApiRequest } from "next";
import type { ResponseDefaultMsg } from "../../../types/ResponseDefaultMsg";
import { connectMongoDB } from "../../../middlewares/connectMongoDB";
import { validateTokenJWT } from "../../../middlewares/validateTokenJWT";
import { FeedstockModel } from "../../../models/FeedstockModel";
import { policyCors } from "../../../middlewares/policyCors";

const searchFeedstockEndpoint = async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg | any[]>) => {
  try {
    if (req.method !== 'GET') {
      return res.status(400).json({ error: 'Método informado é inválido!' });
    }

    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Matéria Prima não encontrada!' });
    }

    const feedstockSearch = await FeedstockModel.findById(id);

    return res.status(200).json(feedstockSearch);

  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: 'Não foi possível buscar o produto!' });
  }
}

export default policyCors(validateTokenJWT(connectMongoDB(searchFeedstockEndpoint)));