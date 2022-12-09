import type { NextApiRequest, NextApiResponse } from "next";
import type { ResponseDefaultMsg } from "../../../types/ResponseDefaultMsg";
import { connectMongoDB } from "../../../middlewares/connectMongoDB";
import { validateTokenJWT } from "../../../middlewares/validateTokenJWT"
import { ProductModel } from "../../../models/ProductModel";
import { upload, uploadImageCosmic } from "../../../services/UploadImageCosmic";
import nc from "next-connect";
import { policyCors } from "../../../middlewares/policyCors";

const handler = nc()
  .use(upload.single('file'))
  .get(async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg> | any) => {
    try {
      const { productId } = req?.query;
      const product = await ProductModel.findById(productId);

      return res.status(200).json(product);
    } catch (e) {
      console.log(e);
    }
    return res.status(400).json({ error: 'Não foi possível obter os dados do produto!' });
  })
  .put(async (req: any, res: NextApiResponse<ResponseDefaultMsg>) => {
    try {
      const { id } = req?.body;
      
      const product = await ProductModel.findById(id);

      if (!product) {
        return res.status(400).json({ error: 'Produto não encontrado!' });
      }

      const { name } = req?.body;
      if (name && name.length > 2) {
        product.name = name;
      }

      const { description } = req?.body;
      if (description && description.length > 2) {
        product.description = description;
      }

      const { coast } = req?.body;
      if (coast && coast >= 0) {
        product.coast = coast;
      }

      const { inventory } = req?.body;
      if (inventory && inventory >= 0) {
        product.inventory = inventory;
      }

      const { file } = req;
      if (file && file.originalname) {
        const image = await uploadImageCosmic(req);
        if (image && image.media && image.media.url) {
          product.photo = image.media.url;
        }
      }

      await ProductModel.findByIdAndUpdate({ _id: product._id }, product);
      return res.status(200).json({ msg: 'Produto alterado com sucesso!' });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: 'Não foi possível atualizar os dados do produto: ' + e });
    }
  });

export const config = {
  api: {
    bodyParser: false
  }
}

export default policyCors(validateTokenJWT(connectMongoDB(handler)));