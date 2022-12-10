import type { NextApiResponse, NextApiRequest } from "next";
import type { ResponseDefaultMsg } from "../../../types/ResponseDefaultMsg";
import { connectMongoDB } from "../../../middlewares/connectMongoDB";
import { validateTokenJWT } from "../../../middlewares/validateTokenJWT";
import { TradeModel } from "../../../models/TradeModel";
import { FeedstockModel } from "../../../models/FeedstockModel";
import { policyCors } from "../../../middlewares/policyCors";

const getTradesUserEndpoint = async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg | any[]>) => {
  try {
    if (req.method !== 'GET') {
      return res.status(400).json({ error: 'Método informado é inválido!' });
    }

    const { id, by } = req.query;
    if (by) {
      const trades = await TradeModel.aggregate(
        [
          {$match:
            {
              userId: id,
            }
          },
          {$group:
            {
              _id: "$feedstockId",
              total: {$sum: "$amount"}
            }
          },
          {$sort:
            {
              total: -1
            }
          }
        ]
      );
      for (const trade of trades) {
        trade.feedstock = await FeedstockModel.findById(trade._id);
      };
      return res.status(200).json(trades);
    } else {
      const trades = await TradeModel.find({ userId: id }).sort({ date: -1 });
      return res.status(200).json(trades);
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: 'Não foi possível buscar o produto!' });
  }
}

export default policyCors(validateTokenJWT(connectMongoDB(getTradesUserEndpoint)));