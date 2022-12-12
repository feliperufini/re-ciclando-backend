import type { NextApiRequest, NextApiResponse } from "next";
import type { ResponseDefaultMsg } from "../../../types/ResponseDefaultMsg";
import { connectMongoDB } from "../../../middlewares/connectMongoDB";
import { policyCors } from "../../../middlewares/policyCors";
import { ProductModel } from "../../../models/ProductModel";
import { validateTokenJWT } from "../../../middlewares/validateTokenJWT"
import nc from "next-connect";

const handler = nc()
  .delete(async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg> | any) => {
    try {
      const { productId } = req?.query;
      await ProductModel.deleteOne({ "_id" : productId });

      return res.status(200).json('Produto excluído com sucesso!');
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: 'Não foi possível obter os dados do ponto de troca!' });
    }
  });

export default policyCors(validateTokenJWT(connectMongoDB(handler)));