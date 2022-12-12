import type { NextApiRequest, NextApiResponse } from "next";
import type { ResponseDefaultMsg } from "../../../types/ResponseDefaultMsg";
import { connectMongoDB } from "../../../middlewares/connectMongoDB";
import { validateTokenJWT } from "../../../middlewares/validateTokenJWT"
import { FeedstockModel } from "../../../models/FeedstockModel";

import nc from "next-connect";
import { policyCors } from "../../../middlewares/policyCors";

const handler = nc()
  .get(async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg> | any) => {
    try {
      const { id } = req?.query;
      const feedstock = await FeedstockModel.findById(id);

      return res.status(200).json(feedstock);
    } catch (e) {
      console.log(e);
    }
    return res.status(400).json({ error: 'Não foi possível obter os dados da matéria prima!' });
  })
  .put(async (req: any, res: NextApiResponse<ResponseDefaultMsg>) => {
    try {
      const { id } = req?.query;
      const feedstock = await FeedstockModel.findById(id);

      if (!feedstock) {
        return res.status(400).json({ error: 'Produto não encontrado!' });
      }

      const { name, coin, inventory } = req?.body;
      console.log(name, coin, inventory);
      
      if (name && name.length > 2) {
        feedstock.name = name;
      }
      if (coin && coin > 0) {
        feedstock.coin = coin;
      }
      if (inventory && inventory >= 0) {
        feedstock.inventory = inventory;
      }

      await FeedstockModel.findByIdAndUpdate({ _id: feedstock._id }, feedstock);
      return res.status(200).json({ msg: 'Produto alterado com sucesso!' });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: 'Não foi possível atualizar os dados do produto: ' + e });
    }
  });

export default policyCors(validateTokenJWT(connectMongoDB(handler)));