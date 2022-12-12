import type { NextApiRequest, NextApiResponse } from "next";
import type { ResponseDefaultMsg } from "../../../types/ResponseDefaultMsg";
import { connectMongoDB } from "../../../middlewares/connectMongoDB";
import { validateTokenJWT } from "../../../middlewares/validateTokenJWT"
import { UserModel } from "../../../models/UserModel";
import { upload } from "../../../services/UploadImageCosmic";
import nc from "next-connect";
import { policyCors } from "../../../middlewares/policyCors";

const handler = nc()
  .use(upload.single('file'))
  .get(async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg> | any) => {
    try {
      const { id } = req?.query;
      const user = await UserModel.findById(id);
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

export default policyCors(validateTokenJWT(connectMongoDB(handler)));