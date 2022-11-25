import type { NextApiResponse } from "next";
import type { ResponseDefaultMsg } from "../../../types/ResponseDefaultMsg";
import { upload, uploadImageCosmic } from "../../../services/UploadImageCosmic";
import { connectMongoDB } from "../../../middlewares/connectMongoDB";
import { validateTokenJWT } from "../../../middlewares/validateTokenJWT";
import { ProductModel } from "../../../models/ProductModel";

import nc from "next-connect";
import { policyCors } from "../../../middlewares/policyCors";

const handler = nc()
  .use(upload.single('file'))
  .post(
    async (req: any, res: NextApiResponse<ResponseDefaultMsg>) => {
      try {
        if (!req || !req.body) {
          return res.status(400).json({ error: 'Parametros de entrada inválidos!' });
        }

        const {name, description, coast, inventory} = req?.body;

        // verificar os dados (regex)
        if (!name || name.length < 3) {
          return res.status(400).json({ error: 'Nome do produto inválido!' });
        }
        if (!description || description.length < 3) {
          return res.status(400).json({ error: 'Descrição do produto inválida!' });
        }
        if (!coast || coast <= 0) {
          return res.status(400).json({ error: 'Custo do produto inválido!' });
        }
        if (!inventory) {
          return res.status(400).json({ error: 'Quantidade do produto inválida!' });
        }
        if (!req.file || !req.file.originalname) {
          return res.status(400).json({ error: 'Foto do produto é obrigatória!' });
        }

        const photo = await uploadImageCosmic(req);
        const product  = {
          name,
          description,
          coast,
          inventory,
          photo : photo.media.url
        }

        await ProductModel.create(product);
        return res.status(200).json({ msg: 'Produto cadastrado com sucesso!' });
        
      } catch (e) {
        console.log(e);
        return res.status(400).json({ error: 'Erro ao cadastrar produto!' });
      }
    }
  );

export const config = {
  api: {
    bodyParser : false
  }
}

export default policyCors(validateTokenJWT(connectMongoDB(handler)));