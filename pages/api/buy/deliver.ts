import type { NextApiRequest, NextApiResponse } from "next";
import type { ResponseDefaultMsg } from "../../../types/ResponseDefaultMsg";
import { connectMongoDB } from "../../../middlewares/connectMongoDB";
import { validateTokenJWT } from "../../../middlewares/validateTokenJWT"
import { BuyModel } from "../../../models/BuyModel";

import nc from "next-connect";
import { policyCors } from "../../../middlewares/policyCors";

const handler = nc()
  .put(async (req: any, res: NextApiResponse<ResponseDefaultMsg>) => {
    try {
      const { id } = req?.query;
      const buy = await BuyModel.findById(id);

      if (!buy) {
        return res.status(400).json({ error: 'Compra não encontrada!' });
      }

      await BuyModel.findByIdAndUpdate({ _id: buy._id }, { deliver: true });

      return res.status(200).json({ msg: 'Compra confirmada com sucesso!' });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: 'Não foi possível confirmar a compra: ' + e });
    }
  });

export default policyCors(validateTokenJWT(connectMongoDB(handler)));