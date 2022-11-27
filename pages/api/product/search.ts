import type { NextApiResponse, NextApiRequest } from "next";
import type { ResponseDefaultMsg } from "../../../types/ResponseDefaultMsg";
import { connectMongoDB } from "../../../middlewares/connectMongoDB";
import { validateTokenJWT } from "../../../middlewares/validateTokenJWT";
import { ProductModel } from "../../../models/ProductModel";
import { policyCors } from "../../../middlewares/policyCors";

const searchProductEndpoint = async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg | any[]>) => {
  try {
    if (req.method !== 'GET') {
      return res.status(400).json({ error: 'Método informado é inválido!' });
    }

    const { filter } = req.query;

    if (!filter || filter.length < 2) {
      return res.status(400).json({ error: 'Informe pelo menos dois caracteres na busca!' });
    }

      const productsSearch = await ProductModel.find({
      inventory: { $gt: 0 },
      $or: [
        {name: {$regex : filter, $options: 'i'}},
        {description: {$regex : filter, $options: 'i'}}
      ]
    });

    return res.status(200).json(productsSearch);

  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: 'Não foi possível buscar o produto!' });
  }
}

export default policyCors(validateTokenJWT(connectMongoDB(searchProductEndpoint)));