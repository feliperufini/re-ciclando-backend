import type { NextApiResponse } from "next";
import type { ResponseDefaultMsg } from "../../../types/ResponseDefaultMsg";
import { connectMongoDB } from "../../../middlewares/connectMongoDB";
import { validateTokenJWT } from "../../../middlewares/validateTokenJWT";
import { BuyModel } from "../../../models/BuyModel";
import { ProductModel } from "../../../models/ProductModel";
import { UserModel } from "../../../models/UserModel";

import nc from "next-connect";
import { policyCors } from "../../../middlewares/policyCors";

const handler = nc()
  .post(
    async (req: any, res: NextApiResponse<ResponseDefaultMsg>) => {
      try {
        if (!req || !req.body) {
          return res.status(400).json({ error: 'Parâmetros de entrada inválidos!' });
        }

        const {userId, productId} = req?.body;

        // verificar os dados (regex)
        if (!userId) {
          return res.status(400).json({ error: 'Usuário não encontrado!' });
        }
        if (!productId) {
          return res.status(400).json({ error: 'Produto não encontrado!' });
        }

        // recupera os dados do produto e a data
        const product = await ProductModel.findById(productId);
        const user = await UserModel.findById(userId);
        const coin = product.coast;
        const date = Date.now();

        if (user.coin < product.coast) {
          return res.status(400).json({ error: 'Você não possui saldo para comprar este produto!' });
        }

        const buy  = {
          userId,
          productId,
          coin,
          deliver: false,
          date
        }

        await BuyModel.create(buy);

        // da baixa no estoque do produto
        await ProductModel.findByIdAndUpdate(productId, { inventory: product.inventory - 1});

        // da baixa no saldo do usuario
        await UserModel.findByIdAndUpdate(userId, { coin: user.coin - product.coast});

        return res.status(200).json({ msg: 'Venda cadastrada com sucesso!' });
      } catch (e) {
        console.log(e);
        return res.status(400).json({ error: 'Erro ao cadastrar venda!' });
      }
    }
  );

export default policyCors(validateTokenJWT(connectMongoDB(handler)));