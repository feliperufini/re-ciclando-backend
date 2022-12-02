import type { NextApiResponse } from "next";
import type { ResponseDefaultMsg } from "../../../types/ResponseDefaultMsg";
import { connectMongoDB } from "../../../middlewares/connectMongoDB";
import { validateTokenJWT } from "../../../middlewares/validateTokenJWT";
import { FeedstockModel } from "../../../models/FeedstockModel";

import nc from "next-connect";
import { policyCors } from "../../../middlewares/policyCors";

const handler = nc()
  .put(
    async (req: any, res: NextApiResponse<ResponseDefaultMsg>) => {
      try {
        const { feedstockId, userId, amount } = req?.body;

        const feedstock = await FeedstockModel.findById(feedstockId);
        if (!feedstock) {
          return res.status(400).json({ error: 'Matéria prima não encontrada!' });
        }

        const date = Date.now();
        if (!userId || !amount) {
          return res.status(412).json({ error: 'Existem informações que não foram passadas por parâmetro!' });
        }

        await FeedstockModel.updateOne(
          { _id: feedstockId },
          {
            $push: {
              "trade": {
                userId: userId,
                amount: amount,
                date: date
              }
            }
          }
        );

        return res.status(200).json({ msg: 'Troca cadastrada com sucesso!' });
      } catch (e) {
        console.log(e);
        return res.status(400).json({ error: 'Não foi possível atualizar os dados da matéria prima: ' + e });
      }
    }
  );

export default policyCors(validateTokenJWT(connectMongoDB(handler)));