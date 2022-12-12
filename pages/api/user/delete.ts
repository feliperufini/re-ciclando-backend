import type { NextApiRequest, NextApiResponse } from "next";
import type { ResponseDefaultMsg } from "../../../types/ResponseDefaultMsg";
import { connectMongoDB } from "../../../middlewares/connectMongoDB";
import { policyCors } from "../../../middlewares/policyCors";
import { UserModel } from "../../../models/UserModel";
import { validateTokenJWT } from "../../../middlewares/validateTokenJWT"
import nc from "next-connect";

const handler = nc()
  .put(async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg> | any) => {
    try {
      const { id } = req?.query;
      await UserModel.findByIdAndUpdate({ "_id" : id }, { "level" : 1 });

      return res.status(200).json('Usuário excluído com sucesso!');
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: 'Não foi possível obter os dados do usuário!' });
    }
  });

export default policyCors(validateTokenJWT(connectMongoDB(handler)));