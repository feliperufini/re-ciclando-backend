import type { NextApiResponse } from "next";
import type { ResponseDefaultMsg } from "../../../types/ResponseDefaultMsg";
import { connectMongoDB } from "../../../middlewares/connectMongoDB";
import { validateTokenJWT } from "../../../middlewares/validateTokenJWT";
import { FeedstockModel } from "../../../models/FeedstockModel";

import nc from "next-connect";
import { policyCors } from "../../../middlewares/policyCors";

const handler = nc()
  .post(
    async (req: any, res: NextApiResponse<ResponseDefaultMsg>) => {
      try {
        if (!req || !req.body) {
          return res.status(400).json({ error: 'Parametros de entrada inválidos!' });
        }

        const {name, coin, inventory} = req?.body;

        // verificar os dados (regex)
        if (!name || name.length < 3) {
          return res.status(400).json({ error: 'Nome do matéria prima inválido!' });
        }
        if (!coin || coin <= 0) {
          return res.status(400).json({ error: 'Preço da matéria prima inválido!' });
        }
        if (!inventory || inventory < 0) {
          return res.status(400).json({ error: 'Quantidade do matéria prima inválida!' });
        }

        const feedstock  = {
          name,
          coin,
          inventory
        }

        await FeedstockModel.create(feedstock);
        return res.status(200).json({ msg: 'Matéria prima cadastrada com sucesso!' });
        
      } catch (e) {
        console.log(e);
        return res.status(400).json({ error: 'Erro ao cadastrar matéria prima!' });
      }
    }
  );

export default policyCors(validateTokenJWT(connectMongoDB(handler)));