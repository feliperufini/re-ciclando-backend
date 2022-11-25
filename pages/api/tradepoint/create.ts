import type { NextApiResponse } from "next";
import type { ResponseDefaultMsg } from "../../../types/ResponseDefaultMsg";
import { connectMongoDB } from "../../../middlewares/connectMongoDB";
import { validateTokenJWT } from "../../../middlewares/validateTokenJWT";
import { TradepointModel } from "../../../models/TradepointModel";

import nc from "next-connect";
import { policyCors } from "../../../middlewares/policyCors";

const handler = nc()
  .post(
    async (req: any, res: NextApiResponse<ResponseDefaultMsg>) => {
      try {
        if (!req || !req.body) {
          return res.status(400).json({ error: 'Parâmetros de entrada inválidos!' });
        }

        const {title, address} = req?.body;

        // verificar os dados (regex)
        if (!title || title.length < 3) {
          return res.status(400).json({ error: 'Título do ponto de troca inválido!' });
        }
        if (!address || address.length < 3) {
          return res.status(400).json({ error: 'Endereço do ponto de troca inválido!' });
        }

        const tradepoint  = {
          title,
          address
        }

        await TradepointModel.create(tradepoint);
        return res.status(200).json({ msg: 'Ponto de troca cadastrado com sucesso!' });
        
      } catch (e) {
        console.log(e);
        return res.status(400).json({ error: 'Erro ao cadastrar ponto de troca!' });
      }
    }
  );

export default policyCors(validateTokenJWT(connectMongoDB(handler)));