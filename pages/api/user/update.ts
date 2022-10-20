import type { NextApiRequest, NextApiResponse } from "next";
import type { ResponseDefaultMsg } from "../../../types/ResponseDefaultMsg";
import { connectMongoDB } from "../../../middlewares/connectMongoDB";
import { validateTokenJWT } from "../../../middlewares/validateTokenJWT"
import { UserModel } from "../../../models/UserModel";
import { upload, uploadImageCosmic } from "../../../services/UploadImageCosmic";
import nc from "next-connect";

const handler = nc()
  .use(upload.single('file'))
  .put(async (req: any, res: NextApiResponse<ResponseDefaultMsg>) => {
    try {
      const { userId } = req?.query;
      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(400).json({ error: 'Usuário não encontrado!' });
      }

      const { name } = req?.body;
      if (name && name.length > 2) {
        user.name = name;
      }

      // enviar imagem do multer para o cosmic
      // const user = req.body as UserRequest;
      // const image = await uploadImageCosmic(req);
      // user.avatar = image?.media?.url;

      const { file } = req;
      if (file && file.originalname) {
        const image = await uploadImageCosmic(req);
        user.avatar = image?.media?.url;
      }

      await UserModel.findByIdAndUpdate({ _id: user._id }, user);
      return res.status(200).json({ msg: 'Usuário alterado com sucesso!' });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: 'Não foi possível atualizar os dados do usuário: ' + e });
    }
  })
  .get(async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg> | any) => {
    try {
      const { userId } = req?.query;
      const user = await UserModel.findById(userId);
      user.password = null;

      return res.status(200).json(user);
    } catch (e) {
      console.log(e);
    }
    return res.status(400).json({ error: 'Não foi possível obter os dados do usuário!' });
  });

export const config = {
  api: {
    bodyParser: false
  }
}

export default validateTokenJWT(connectMongoDB(handler));