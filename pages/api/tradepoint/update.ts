import type { NextApiRequest, NextApiResponse } from "next";
import type { ResponseDefaultMsg } from "../../../types/ResponseDefaultMsg";
import { connectMongoDB } from "../../../middlewares/connectMongoDB";
import { policyCors } from "../../../middlewares/policyCors";
import { TradepointModel } from "../../../models/TradepointModel";
import { validateTokenJWT } from "../../../middlewares/validateTokenJWT"
import nc from "next-connect";

const handler = nc()
  .get(async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg> | any) => {
    try {
      const { tradepointId } = req?.query;
      const tradepoint = await TradepointModel.findById(tradepointId);

      return res.status(200).json(tradepoint);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: 'Não foi possível obter os dados do ponto de troca!' });
    }
  })
  .put(async (req: any, res: NextApiResponse<ResponseDefaultMsg>) => {
    try {
      const { tradepointId } = req?.query;
      const tradepoint = await TradepointModel.findById(tradepointId);

      if (!tradepoint) {
        return res.status(400).json({ error: 'Ponto de troca não encontrado!' });
      }

      const { title, address } = req?.body;
      if (title && title.length >= 3) {
        tradepoint.title = title;
      }
      if (address && address.length >= 3) {
        tradepoint.address = address;
      }

      await TradepointModel.findByIdAndUpdate({ _id: tradepointId }, tradepoint);
      return res.status(200).json({ msg: 'Ponto de troca alterado com sucesso!' });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: 'Não foi possível atualizar os dados do ponto de troca: ' + e });
    }
  });

export default policyCors(validateTokenJWT(connectMongoDB(handler)));