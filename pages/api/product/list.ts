import type { NextApiRequest, NextApiResponse } from 'next';
import type { ResponseDefaultMsg } from '../../../types/ResponseDefaultMsg';
import { validateTokenJWT } from '../../../middlewares/validateTokenJWT';
import { connectMongoDB } from '../../../middlewares/connectMongoDB';
import { ProductModel } from '../../../models/ProductModel';

const productListEndpoint = async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg | any>) => {
  try {
    if (req.method === 'GET') {
      if (req?.query?.id) {
        // retorna apenas o produto informado pelo id
        const product = await ProductModel.findById(req?.query?.id);
        if (!product) {
          return res.status(400).json({ error: 'Produto não encontrado!' });
        }
        return res.status(200).json(product);
      } else {
        // retorna todos os produtos
        const products = await ProductModel.find();
        // const products = await ProductModel.find({ inventory: { $gt: 0 } }); // apenas os com estoque positivo
        if (!products) {
          return res.status(400).json({ error: 'Nenhum produto foi encontrado!' });
        }
        return res.status(200).json(products);
      }
    }
    return res.status(405).json({ error: 'Método informado não é válido!' });
  } catch (e) {
    console.log(e);
  }
  return res.status(400).json({ error: 'Não foi possível obter os produtos!' });
}

export default validateTokenJWT(connectMongoDB(productListEndpoint));