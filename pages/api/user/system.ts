import type { NextApiResponse, NextApiRequest } from "next";
import type { ResponseDefaultMsg } from "../../../types/ResponseDefaultMsg";
import { connectMongoDB } from "../../../middlewares/connectMongoDB";
import { validateTokenJWT } from "../../../middlewares/validateTokenJWT";
import { UserModel } from "../../../models/UserModel";
import { policyCors } from "../../../middlewares/policyCors";

const getSystemUserEndpoint = async (req: NextApiRequest, res: NextApiResponse<ResponseDefaultMsg | any[]>) => {
  try {
    if (req.method !== 'GET') {
      return res.status(400).json({ error: 'Método informado é inválido!' });
    }

    const systemUsers = await UserModel.find({level: {$gt: 1}});

    return res.status(200).json(systemUsers);

  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: 'Não foi possível buscar o produto!' });
  }
}

export default policyCors(validateTokenJWT(connectMongoDB(getSystemUserEndpoint)));