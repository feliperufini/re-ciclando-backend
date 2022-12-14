import type { NextApiResponse } from "next";
import type { ResponseDefaultMsg } from "../../../types/ResponseDefaultMsg";
import { connectMongoDB } from "../../../middlewares/connectMongoDB";
import { validateTokenJWT } from "../../../middlewares/validateTokenJWT";
import { FeedstockModel } from "../../../models/FeedstockModel";
import { TradeModel } from "../../../models/TradeModel";
import { UserModel } from "../../../models/UserModel";

import nc from "next-connect";
import { policyCors } from "../../../middlewares/policyCors";

const handler = nc()
  .post(
    async (req: any, res: NextApiResponse<ResponseDefaultMsg>) => {
      try {
        const { feedstockId, userId, amount } = req?.body;

        const feedstock = await FeedstockModel.findById(feedstockId);
        if (!feedstock) {
          return res.status(400).json({ error: 'Matéria prima não encontrada!' });
        }
        if (!userId) {
          return res.status(412).json({ error: 'Usuário não informado!' });
        }
        if (!amount) {
          return res.status(412).json({ error: 'Quantidade não informada!' });
        }
        
        const date = Date.now();
        const user = await UserModel.findById(userId);
        const totalCoinOfTrade = (feedstock.coin * (amount/1000)).toFixed();
        const newUserCoin = user.coin + totalCoinOfTrade;
        const trade  = {
          userId,
          feedstockId,
          amount,
          coin: totalCoinOfTrade,
          date
        }

        await TradeModel.create(trade);
        await UserModel.findByIdAndUpdate(userId, { coin: newUserCoin});

        return res.status(200).json({ msg: 'Troca cadastrada com sucesso!' });
      } catch (e) {
        console.log(e);
        return res.status(400).json({ error: 'Não foi possível atualizar os dados da matéria prima: ' + e });
      }
    }
  );

export default policyCors(validateTokenJWT(connectMongoDB(handler)));